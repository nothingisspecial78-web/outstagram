# Hereabouts Postcard Trails

Build the complete, highly-polished, responsive UI and UX design for "Hereabouts", the Anti-Instagram web app (Theme: "The Anti-App"). Tagline: "Post less. Go somewhere. Meet someone."

⚠️ CRITICAL SCOPE REQUIREMENT:
- DESIGN THE UI AND UX DESIGN ONLY.
- DO NOT create or configure backend databases, server functions, or backend APIs. Use frontend mock state and interactive React hooks so that every UI flow is testable and clickable in the preview sandbox.
- MUST BE FULLY RESPONSIVE: Mobile-first layout (390px) with a bottom navigation bar, Tablet (640px+), and Desktop (1024px+) with a sticky left navigation rail and max-width 960px centered container.

🎨 DESIGN SYSTEM: "Slow Post" (Warm, tactile, paper, ink, and postmarks)
- Color Palette:
  * paper: #F6F1E7 (Page background)
  * paper-raised: #FBF8F1 (Cards, sheets, postcard backgrounds)
  * sand: #D9CDB4 (Borders, dividers, subtle frames)
  * line: #E4DAC4 (Rules, separators)
  * ink: #1F2A37 (Primary text, dark ink buttons)
  * ink-muted: #5B6676 (Secondary text, dates, subheadings)
  * stamp: #C8452D (Postmark red, wax seal, primary action buttons)
  * stamp-ink: #A93822 (Accessible red text on paper)
  * moss: #4F6F52 (Success states, completed quest stamps)
- Typography:
  * Headings: Editorial serif font (Fraunces / Playfair style)
  * Body/UI: Clean legible sans-serif (Inter)
  * Captions & Notes: Handwritten cursive font (Caveat style)
- Postcard Card UI:
  * 3:2 photo aspect ratio with paper border and tactile drop shadow
  * Top-right circular Postmark stamp (dashed circular border, location name around arc, date in center, rotated -8deg) in #C8452D
  * Handwritten caption below
  * "Send a thank-you" button (STRICTLY NO like counts, NO follower counts, NO rankings)

📱 REQUIRED SCREENS & INTERACTIVE UI FLOWS:
1. Navigation Shell:
   - Mobile: Top bar with "Hereabouts" wordmark and "Hours Reclaimed" chip. Bottom tab bar: Today, Rack, Capture (raised center circular button), Chats, Passport.
   - Desktop: Left rail with navigation items + Coach + Settings.
2. Login / Signup (`/login`):
   - Calm minimalist paper-style auth card with wordmark and promise. Toggle between Sign in and Create Account.
3. Today Screen (`/`):
   - Welcome greeting.
   - Daily Quest Card: e.g., "Walk 100 steps and notice three things", minutes input, reflection input (8-140 char counter), and "Mark Done" button that stamps with a moss green quest badge.
   - "Open Today's Rack" card showing available postcards count.
   - "AI Life Coach" entry card.
4. Sideways Postcard Rack (`/rack`):
   - Horizontal snap carousel (`scroll-snap-type: x mandatory`), exactly one postcard per viewport.
   - Navigation: Previous / Next buttons, keyboard arrow cues, dot indicator ("3 of 10").
   - Max 10 cards, ending with a tactile End Card: "You've seen everything. Go outside." with a button back to Today.
   - Postcard detail modal: "Send a thank-you" note with handwritten card style templates.
5. Capture View (`/capture`):
   - Simulated live camera viewfinder with place detection chip (e.g. "Riverside Cafe - 45m away").
   - Shutter button, photo preview with handwritten caption input (8-140 chars).
   - STRICTLY NO gallery upload or file picker.
6. Chats & 20-Message Wall (`/chats`, `/chats/:id`):
   - Chat list with friend names and message progress indicator ("14/20 messages").
   - Chat conversation view with paper-styled bubbles.
   - EnvelopeLock Component: when 20 messages are reached, input is locked with a sealed envelope visual featuring a red wax seal: "You've said a lot. Say the rest in person."
   - "We're together" button opens CodeSheet bottom sheet with large 6-digit code, QR code mockup, and a 5-minute timer countdown.
7. Meet-to-Unlock (`/meet`):
   - 6-digit code entry boxes with smooth focus + QR scanner mockup.
   - Code verification triggers a realistic wax seal break / envelope opening animation, unlocking +20 messages and awarding a Meetup stamp.
8. Passport (`/passport`):
   - Tactile passport book layout.
   - "Hours Reclaimed" summary badge.
   - Grid of collectible vintage stamps (Place stamps, Meetup stamps, Quest stamps) with dates and postmarks.
9. AI Life Coach (`/coach`):
   - Calm conversation interface with "3 messages left today" counter.
   - AI response proposes one small offline experiment (e.g., "Read 5 pages every evening for 7 days") displayed in an experiment card.
   - "Generate Weekly Letter" modal showing a printable, calming offline habit letter.
10. Settings (`/settings`):
   - Personal friend code with Copy button, "Add Friend" code input, and Demo Mode toggle switch (shows yellow "DEMO MODE: Location simulated" banner when on).
11. P1 Maker Shelf (`/make`):
   - Shelf of creative craft logs with title, medium tags, notes, and Craft stamp awards.

Make all interactions fluid, beautifully styled with Tailwind and shadcn/ui components, responsive, and true to the calm "Slow Post" anti-app philosophy.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://hereabouts-postcard-trails.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/34ade68d-3e50-469c-9eb5-252dd78b32a5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
