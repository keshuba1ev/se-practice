# Smart Campus room catalog

Local fictional catalog with capacity and ALL-equipment filters. Select a room, enter same-day HH:MM times, then check availability. Demo current time is fixed at 09:00; end 24:00 is supported. After the first check, changing room or time refreshes the decision. Filtering out the selection clears it.

## Setup and commands

Use Node.js 18+ (validated here with Node 24.22.3) and npm.

```bash
npm install
npm run dev
npx vitest run
npm run typecheck
npm run build
npm run lint
```

For an exact lockfile install use `npm ci`. Vite prints the local address. `npm run preview` serves the built app.

## Modules

- `src/rooms.ts`: five fictional rooms, per-room bookings and available equipment labels.
- `src/filter.ts`: pure capacity/ALL-equipment filtering.
- `src/booking.ts`: original unchanged canBook plus checkRoom lookup adapter.
- `src/lib/time.ts`: HH:MM parsing/formatting, including 24:00.
- `src/App.tsx`: selected room, filter/form state and derived availability result.
- `src/components/`: room card, filters, time field and result presentation.

Tests use fixed fixtures rather than demo ROOMS. Five rendered UI tests use React Testing Library 16.3.0 with jsdom 26.1.0; Vitest selects jsdom from the ui.test.tsx environment directive. App accepts a catalog prop for independent tests while defaulting to the real demo catalog. These tests verify DOM behavior, not responsive pixel layout. No login, backend, live API, database, browser storage or saved booking. Blocked rooms remain visible and selectable but are always unavailable. Invalid attendee input returns no matches. Unavailable feedback provides a checklist rather than one precise domain failure reason; the original Boolean booking contract is preserved.
