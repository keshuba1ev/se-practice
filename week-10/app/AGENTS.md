# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use one fictional room and fictional bookings only; no real timetable or personal data.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps; allow bookings that only touch at endpoints.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI feedback on desktop and mobile.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit only task-approved source and tests; review the diff before acceptance.
- Do not add packages for this audit or refactor.
- Do not add a database or login; do not use secrets, credentials or real personal data.

## Before you finish

- Run `npm test`, `npm run typecheck`, `npm run lint` and `npm run build` before proposing acceptance; inspect the UI at desktop and mobile widths.
- Never deploy to external services; require human review before merging.
