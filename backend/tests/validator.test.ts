import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CreatePostcardSchema, RedeemMeetupTokenSchema, QuestLogSchema } from '../src/utils/validator.js';
import { isValidJpeg, stripExifFromJpeg } from '../src/utils/image.js';

describe('Validation & Security Logic', () => {
  test('Postcard caption must be between 8 and 140 characters', () => {
    // Too short (7 chars)
    const shortRes = CreatePostcardSchema.safeParse({
      place_id: crypto.randomUUID(),
      caption: 'Too few',
      lat: 12.97,
      lng: 77.59,
      image_base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
    });
    assert.strictEqual(shortRes.success, false);

    // Valid (8 chars)
    const validRes = CreatePostcardSchema.safeParse({
      place_id: crypto.randomUUID(),
      caption: '12345678',
      lat: 12.97,
      lng: 77.59,
      image_base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
    });
    assert.strictEqual(validRes.success, true);

    // Too long (141 chars)
    const longRes = CreatePostcardSchema.safeParse({
      place_id: crypto.randomUUID(),
      caption: 'a'.repeat(141),
      lat: 12.97,
      lng: 77.59,
      image_base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
    });
    assert.strictEqual(longRes.success, false);
  });

  test('Meetup redeem code must be exactly 6 numeric digits', () => {
    assert.strictEqual(RedeemMeetupTokenSchema.safeParse({ code: '482913' }).success, true);
    assert.strictEqual(RedeemMeetupTokenSchema.safeParse({ code: '48291' }).success, false);
    assert.strictEqual(RedeemMeetupTokenSchema.safeParse({ code: '4829134' }).success, false);
    assert.strictEqual(RedeemMeetupTokenSchema.safeParse({ code: 'ABCDEF' }).success, false);
  });

  test('Quest log requires valid reflection (8-140 chars) and positive minutes', () => {
    assert.strictEqual(
      QuestLogSchema.safeParse({
        quest_id: crypto.randomUUID(),
        reflection: 'Noticed three red brick doors today.',
        minutes: 15,
      }).success,
      true
    );

    assert.strictEqual(
      QuestLogSchema.safeParse({
        quest_id: crypto.randomUUID(),
        reflection: 'Short',
        minutes: 15,
      }).success,
      false
    );

    assert.strictEqual(
      QuestLogSchema.safeParse({
        quest_id: crypto.randomUUID(),
        reflection: 'Valid reflection length',
        minutes: 0,
      }).success,
      false
    );
  });

  test('JPEG SOI marker validation and EXIF metadata stripping', () => {
    // Construct dummy JPEG with APP1 (EXIF) segment:
    // SOI: 0xFF, 0xD8
    // APP1 marker: 0xFF, 0xE1, length (2 bytes), dummy payload
    // SOS marker: 0xFF, 0xDA (compressed image data)
    const exifData = Buffer.from([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // "Exif\0\0"
    const app1Length = 2 + exifData.length; // 8
    const fakeJpeg = Buffer.concat([
      Buffer.from([0xff, 0xd8]), // SOI
      Buffer.from([0xff, 0xe1, 0x00, app1Length]), // APP1 marker + length
      exifData, // EXIF payload
      Buffer.from([0xff, 0xda, 0x12, 0x34]), // SOS + compressed data
    ]);

    assert.strictEqual(isValidJpeg(fakeJpeg), true);

    const stripped = stripExifFromJpeg(fakeJpeg);
    assert.strictEqual(isValidJpeg(stripped), true);

    // Stripped buffer should NOT contain 0xFF 0xE1
    let foundApp1 = false;
    for (let i = 0; i < stripped.length - 1; i++) {
      if (stripped[i] === 0xff && stripped[i + 1] === 0xe1) {
        foundApp1 = true;
        break;
      }
    }
    assert.strictEqual(foundApp1, false, 'EXIF APP1 segment must be stripped out');
  });
});
