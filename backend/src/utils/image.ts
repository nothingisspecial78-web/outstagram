/**
 * Image processing utilities for Hereabouts.
 * Validates JPEG signatures and safely strips EXIF metadata (embedded GPS, camera info).
 */

export const MAX_IMAGE_SIZE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB

/**
 * Validates whether a buffer begins with a valid JPEG SOI (Start of Image) marker (0xFF, 0xD8).
 */
export function isValidJpeg(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  return buffer[0] === 0xff && buffer[1] === 0xd8;
}

/**
 * Strips EXIF metadata (APP1 marker 0xFFE1) from JPEG buffer to protect user privacy.
 */
export function stripExifFromJpeg(buffer: Buffer): Buffer {
  if (!isValidJpeg(buffer)) {
    return buffer;
  }

  const chunks: Buffer[] = [Buffer.from([0xff, 0xd8])];
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      chunks.push(buffer.subarray(offset));
      break;
    }

    const marker = buffer[offset + 1];

    // SOS (Start of Scan) - rest of file is pure compressed image stream
    if (marker === 0xda) {
      chunks.push(buffer.subarray(offset));
      break;
    }

    // Skip EOI or null marker
    if (marker === 0xd9 || marker === 0x00) {
      chunks.push(buffer.subarray(offset, offset + 2));
      offset += 2;
      continue;
    }

    // Segment length is big-endian 16-bit int following marker
    const length = buffer.readUInt16BE(offset + 2);
    const segmentEnd = offset + 2 + length;

    // APP1 (0xE1) marker contains EXIF metadata - Omit this chunk!
    if (marker === 0xe1) {
      offset = segmentEnd;
      continue;
    }

    chunks.push(buffer.subarray(offset, segmentEnd));
    offset = segmentEnd;
  }

  return Buffer.concat(chunks);
}

/**
 * Decodes base64 string and validates file size.
 */
export function decodeAndValidateBase64Image(base64Str: string): {
  valid: boolean;
  buffer?: Buffer;
  error?: string;
} {
  try {
    const cleanBase64 = base64Str.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length === 0) {
      return { valid: false, error: 'image_empty' };
    }

    if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
      return { valid: false, error: 'image_too_large' };
    }

    if (!isValidJpeg(buffer)) {
      return { valid: false, error: 'image_not_jpeg' };
    }

    const sanitized = stripExifFromJpeg(buffer);
    return { valid: true, buffer: sanitized };
  } catch (err: any) {
    return { valid: false, error: 'image_decode_failed' };
  }
}
