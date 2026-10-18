# Week 06 — Lab report

**Name:** Abylai Keshubaev
**Group:** not provided
**Date:** 2026-10-18

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed (Standard agent mode) |
| Bolt project link (or `not shared`, and why) | not shared — the Bolt project is private; exports and screenshots are included instead. |
| Browser and version | Cloud Chrome; version not displayed. |
| If you could not use Bolt.new: the tool you used instead, and why | none; using Bolt.new |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Prepared with Codex assistance before generation; Bolt sign-in had already been opened. Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | Touching 11:00-12:00 after an existing 10:00-11:00 booking may be wrongly treated as overlapping. | AC4 | No: diagnostic touching case returned Available. |
| 2 | v1 may use the computer clock without a supplied-current-time control, making the fixed 09:00 test difficult to reproduce. | AC1, AC6 | No: supplied current time can be edited to 09:00. |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.jpg` **before** any cleanup
prompt: yes

**Bolt's list of the files/components it created, pasted unedited:**

````text
626f6c742d63632d6167656e74I'll build a single-page Smart Campus Room Availability Checker with in-memory fictional sample data (no persistence needed since it's a read-only checker that must not modify booking data).

Let me first check the project structure briefly, then build.I'll build a clean, single-page room availability checker. Creating the types, sample data, core logic, and UI components.Now the main App page tying it all together.Now let me run a quick build to verify everything compiles.Build passes. Here's what I built:

A one-page **Smart Campus Room Availability Checker** that enforces all six acceptance criteria. Selecting a room and entering a start/end time runs a pure availability check (no booking data is ever modified), showing a clear Available / Unavailable banner with a plain-language reason. Rooms show their existing bookings and blocked status; the form is responsive with a single column on mobile and a two-column layout on desktop, plus inline validation for malformed times.

Main files/components created:
- **src/lib/types.ts** — shared types (Room, Booking, Decision, CheckInput)
- **src/lib/sampleData.ts** — fictional rooms and bookings
- **src/lib/availability.ts** — pure `checkAvailability` logic implementing AC1–AC5, plus time formatting/parsing
- **src/components/RoomCard.tsx** — selectable room card with capacity, blocked badge, and existing bookings
- **src/components/TimeField.tsx** — labeled time input with inline error/hint
- **src/components/ResultBanner.tsx** — Available / Unavailable result banner
- **src/App.tsx** — page layout, form state, and result wiring

Note: I used in-memory fictional data rather than Supabase because the checker is read-only by design (AC5 requires it must not change booking data), so there's nothing to persist. If you'd later like real bookings stored server-side, I can wire it up to Supabase.
````

**What v1 does — one line per thing that works, or visibly does not:**

- Shows five fictional rooms, their booking intervals and blocked status.
- Exposes supplied current time, start and end inputs and a check action.
- A blocked room card is disabled, so its rejection cannot be exercised from the page.
- Curie 204 has a 10:00-11:00 booking plus another booking; no exact fixed base fixture is present.
- The first export was taken before the generated files had synchronized and contained the starter template. It was discarded and downloaded again after the usable preview appeared, before any cleanup prompt; the retained export is that generated v1.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base: supplied current time 09:00; selected room not blocked; its only booking is 10:00–11:00. Final T3 uses blocked Turing 310 with the same sole booking. Other cases use Curie 204.

The strict fixed-case v1 results are Not testable because no exact single-booking fixture existed. Diagnostic runs on the closest fixture, Curie 204 with an additional 15:00–16:00 booking, returned the expected decisions for T1, T2 and T4–T9. T3 could not be exercised because its card was natively disabled. These diagnostic results are distinguished from the exact required setup; no v1 logic failure is invented.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Not testable | Available | final-T1.jpg |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Not testable | Unavailable | final-T2.jpg |
| T3 | Blocked | 11:00–12:00, blocked Turing 310 | Unavailable | AC3 | Not testable | Unavailable | final-T3.jpg |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Not testable | Available | final-T4.jpg |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Not testable | Unavailable | final-T5.jpg |
| T6 | Starts now | 09:00–09:30, now 09:00 | Unavailable | AC1 | Not testable | Unavailable | final-T6.jpg |
| T7 | Reversed times | 12:00–11:00; explanatory feedback | Unavailable | AC1, AC6 | Not testable | Unavailable | final-T7.jpg |
| T8 | Same check twice | 11:00–12:00 twice, without reloading | Available | AC5 | Not testable | Available | final-T8.jpg |
| T9 | Narrow screen | 11:00–12:00 at 375 px width | Available | AC6 | Not testable | Available | final-T9.jpg |

T7 final feedback: "End time must be after the start time." T8 was submitted twice; both returned Available and the room still displayed only its original booking. T9 was run using Bolt’s iPhone SE preview, verified at 375 × 667 CSS pixels. Screenshots are direct captures of the preview viewport, not edited or composited.

## 5. Issue log — cleanup targets

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Exact fixed test fixture unavailable in sample data. | Inspect Curie 204 for the required sole 10:00-11:00 booking: it also shows 15:00-16:00; blocked Turing 310 has no bookings. Exact-case setup is unavailable. See issue-1.jpg. | Medium | Fix |
| 2 | Blocked-room decision cannot be exercised. | T3: try selecting Turing 310 for 11:00-12:00 at 09:00. Expected an Unavailable decision with a blocked-room reason; its card is disabled and cannot be selected. See issue-2.jpg. | High | Fix |
| 3 | Reversed interval feedback uses mathematical minutes rather than the entered clock times. | T7 diagnostic run on Curie 204 at 09:00 with 12:00-11:00: Unavailable is correct, but feedback says 0 ≤ start < end ≤ 1440 minutes. Prefer a direct explanation that end must follow start (AC6). See issue-3.jpg. | Medium | Fix |
| 4 | Unused backend dependency in the starter manifest. | package.json contains @supabase/supabase-js, although the page uses only in-memory sample data. The supplied scope checker flags this dependency; remove it without adding backend behavior. Captured in issue-4.jpg after the fixture changes; the manifest is unchanged from v1. | Low | Fix |

## 6. Task 4 — cleanup with focused prompts

Four focused prompts were sent after v1. The second fix prompt includes an additional fixture clarification after the fixed template wording; its exact text is preserved below. Outputs are copied unedited from Bolt.

### Prompt 1 and response

**Prompt as sent:**

````text
In the current prototype, preparing the fixed test base (current time 09:00 and a room whose only booking is 10:00–11:00) produces no exact fixture: Curie 204 also has 15:00–16:00, and blocked Turing 310 has no booking, but AC4 requires evaluating the candidate against the supplied existing booking data. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
````

**Bolt response:**

````text
626f6c742d63632d6167656e74The issue is in the sample data: no room has exactly one booking at 10:00–11:00, so there's no clean fixture for testing AC4 overlap against a single known booking. I'll add one dedicated room with exactly that booking, leaving all other data and logic untouched.The smallest fix is to remove Curie 204's second booking (15:00–16:00) so it becomes the exact fixture: current time 09:00, room's only booking 10:00–11:00. This is a one-line deletion that doesn't touch any logic or other criteria.Build passes.

**Changed file:** `src/lib/sampleData.ts` — removed the `b4` booking (Curie 204, 15:00–16:00).

**Why:** With current time set to 09:00, Curie 204 now has exactly one booking (10:00–11:00, the `b3` row), giving you a clean fixture to exercise AC4: an overlapping candidate like 10:30–11:30 is rejected, a touching one like 11:00–11:30 is allowed, and a slot like 09:00–09:30 stays available. This is the smallest possible change — only data, no logic — so AC1, AC2, AC3, AC5, and AC6 are all preserved exactly. The other rooms (blocked Turing 310, the multi-booking rooms) remain intact for testing the other criteria.
````

### Prompt 2 and response

**Prompt as sent:**

````text
In the current prototype, selecting blocked Turing 310 and requesting 11:00–12:00 at current time 09:00 produces an unselectable disabled card and no decision, but AC3 requires an Unavailable result for a selected blocked room. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why. Keep the blocked label and let the existing availability logic reject the request; give this fictional blocked fixture the same sole 10:00–11:00 booking used by fixed case T3.
````

**Bolt response:**

````text
626f6c742d63632d6167656e74Two smallest changes: make blocked cards selectable (so the existing AC3 logic rejects them), and give Turing 310 the sole 10:00–11:00 booking.Build passes.

**Changed files:**

1. **`src/components/RoomCard.tsx`** — Removed `disabled={room.blocked}` so a blocked room can still be selected. The existing `checkAvailability` logic already returns an Unavailable decision for blocked rooms (AC3), so it now runs as intended. I kept the "Blocked" badge and used `aria-disabled` (instead of the native disabled attribute) to keep the card readable as a fixture without disabling interaction. The blocked card gets a subtle rose-tinted style instead of the greyed-out, non-interactive look.

2. **`src/lib/sampleData.ts`** — Added booking `b7` for Turing 310 (10:00–11:00, "Maintenance Hold"), giving the blocked fixture the same sole booking as fixed case T3.

**Why:** The original `disabled` attribute on the button short-circuited selection entirely, so the AC3 path in `checkAvailability` was never reached for blocked rooms. Letting the card be selected lets the existing logic do its job and produce the required Unavailable result, while preserving AC1, AC2, AC4, AC5, and AC6 untouched. The overlap logic (AC4) is evaluated after the blocked check, so even though Turing 310 now has a booking, AC3 fires first and the blocked message is what the user sees.
````

### Prompt 3 and response

**Prompt as sent:**

````text
Review only the reversed-interval feedback in src/lib/availability.ts (T7 currently says '0 ≤ start < end ≤ 1440 minutes'; prefer a plain explanation that end time must be after start time) for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.
````

**Bolt response:**

````text
626f6c742d63632d6167656e74The combined check on line 21 conflates two distinct problems: out-of-range times (a malformed input) vs. a reversed interval (end ≤ start, a user-meaningful error). The single message exposes the internal `0 ≤ start < end ≤ 1440` notation, which is technical and confusing for a non-developer. Splitting the reversed-interval case out with a plain message is the small cleanup — it preserves AC1 (still rejects `start >= end` and out-of-range) and doesn't touch AC2–AC6.Build passes.

**Changed file:** `src/lib/availability.ts`

**What I changed:** Split the single combined interval check into two: one for out-of-range times, one for a reversed interval (end ≤ start). The reversed case now returns a distinct `reversed-interval` reason with the plain message "End time must be after the start time." instead of the technical `0 ≤ start < end ≤ 1440 minutes` notation.

**Why:** The original message exposed internal minute-notation and bundled two unrelated failure modes into one branch. A non-developer seeing it can't tell whether they entered a bad time or just swapped start/end. The split gives clearer UI feedback and a more specific reason code without adding any new behavior.

**AC preservation:** AC1 still rejects `start < 0`, `end > 1440`, and `start >= end` (same boolean coverage, just expressed as two predicates). The subsequent checks (start-after-current-time, duration cap, blocked, overlap) and the read-only nature of the decision (AC5) are all untouched. AC2–AC6 are preserved exactly.
````

### Prompt 4 and response

**Prompt as sent:**

````text
Review only package.json's unused @supabase/supabase-js dependency (the page uses only fictional in-memory data and no backend) for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.
````

**Bolt response:**

````text
626f6c742d63632d6167656e74Confirmed: no source file imports `@supabase/supabase-js`. The app uses only fictional in-memory data (AC5 requires no booking mutation), so the dependency is genuinely unused. This is a read-only availability checker with no persistence need, so removing the package is the small cleanup — it removes a confusing signal that there's a backend when there isn't, and trims the dependency tree.

Let me verify nothing else references it, then remove it.No references anywhere in source. I'll uninstall the package.Build still passes, and the bundle is unchanged (confirming nothing was actually importing it).

**Changed file:** `package.json` (via `npm uninstall @supabase/supabase-js`), which also updated `package-lock.json`.

**What I changed:** Removed the `@supabase/supabase-js` dependency.

**Why:** It was unused — no source file imports it. The app is a read-only availability checker using fictional in-memory data, and AC5 explicitly requires that checking must not change booking data, so there's no persistence role for Supabase here. Keeping an unused backend dependency was misleading: it implied a backend exists when the app is purely client-side.

**AC preservation:** Removing an unused dependency doesn't touch any logic, so AC1–AC6 are all preserved exactly. The build still passes with the same output.
````

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Remove Curie 204's unrelated second booking. | accept | Provides the exact fixed fixture without changing AC1–AC5 decision logic. | T1–T9 rerun: eight expected decisions; T3 still Not testable before its separate fix. |
| 2 | Claim that 09:00–09:30 remains available at current time 09:00. | reject | AC1 requires a strictly future start; the observed T6 response was Unavailable. The explanatory claim is wrong; no code change is needed for it. | T6 rerun after every accepted change: Unavailable. |
| 3 | Enable selecting the blocked card and add its sole 10:00–11:00 fixture. | accept | AC3 now reaches the existing blocked-room rejection; AC5 booking data remains unchanged by checks. | T3 first, then T1–T9: all nine expected decisions. |
| 4 | Split reversed-interval feedback from out-of-range feedback. | accept | AC1 decision is unchanged and AC6 gives a clear end-after-start explanation. | T7 first, then T1–T9: all nine expected decisions. |
| 5 | Remove the unused Supabase SDK and update the dependency lockfile. | accept | The one-page scope excludes backend/database services; no source imported this dependency. | T1–T9 rerun: all nine expected decisions. |
| 6 | Offer to wire up server-side booking storage. | reject | The scope excludes backend/database services; AC5 says checking must not change bookings. | Source inspection and T8 confirm no check adds an enrollment or booking. |

Intermediate runs are retained as JSON in evidence/. The blocked card remains mouse-clickable but uses aria-disabled=true; the browser's ordinary enabled-state check therefore treats it as disabled. T3 was tested by an actual pointer click on the card, not by changing application state. This remaining accessibility-label inconsistency is noted for future improvement. It did not prevent the demonstrated visible blocked-room decision.

## 7. Change log — v1 to final

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Missing exact fixture | Accept focused data change. | src/lib/sampleData.ts: remove Curie 204's 15:00–16:00 booking. | T1–T9: eight expected results; T3 not selectable yet. |
| 2 | Blocked card cannot be selected | Accept focused selection/fixture change. | src/components/RoomCard.tsx removes native disabled; src/lib/sampleData.ts adds Turing's 10:00–11:00 booking. | T3 and all nine cases give expected decisions. |
| 3 | Technical reversed-time message | Accept focused feedback cleanup. | src/lib/availability.ts separates reversed intervals and returns a plain-language reason. | T7 message is clear; all nine decisions preserved. |
| 4 | Unused backend dependency | Accept scope cleanup. | package.json and package-lock.json remove unused @supabase/supabase-js. | All nine cases rerun without regression; final source scope scan recorded below. |

## 8. One generated component, in my own words

**File:** `src/lib/availability.ts`

This explanation was prepared with Codex assistance. The file contains the function that decides whether the selected room is available. It first checks the interval and whether its start is later than the supplied current time. It then checks the two-hour limit, the selected room's blocked status and its existing bookings. An overlap requires the candidate to start before an existing booking ends and end after it starts. Equal endpoints are therefore allowed. The function returns a decision and a reason; it does not append a booking or save anything. App.tsx converts the form's clock times into minutes and displays the returned result.

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

none — the local final run reports 27 PASS, 0 FAIL, 0 ERROR. This checks file/report shape; the browser runs and screenshots supply behavioral evidence.

| Check | Why it stays |
| --- | --- |

**Actual checker output:**

```text
Week 06 - prototype cleanup: the exports, the screenshots, the evidence

PASS   P1   final prototype exported to prototype/                     prototype/project: 14 source files
PASS   P2   exports are clean: no node_modules, no .env, under 5 MB    clean
PASS   P3   final stays in scope: no network, storage, backend, login  nothing out of scope found in the source
PASS   O1   v1 export kept in original/                                original/project
PASS   O2   final differs from v1                                      4 file(s) changed, e.g. package.json, src/components/RoomCard.tsx, src/lib/availability.ts
PASS   E1   v1 screenshot: evidence/v1.png                             evidence/v1.jpg
PASS   E2   one screenshot per logged issue: evidence/issue-N.png      4 issue screenshot(s)
PASS   E3   nine final screenshots, all different                      final-T1 ... final-T9
PASS   E4   T9 taken at narrow width (portrait)                        375x667
PASS   T1   T1 Touching: final result is Available                     final: Available
PASS   T2   T2 Overlap: final result is Unavailable                    final: Unavailable
PASS   T3   T3 Blocked: final result is Unavailable                    final: Unavailable
PASS   T4   T4 Exactly 2 hours: final result is Available              final: Available
PASS   T5   T5 Over 2 hours: final result is Unavailable               final: Unavailable
PASS   T6   T6 Starts now: final result is Unavailable                 final: Unavailable
PASS   T7   T7 Reversed times: final result is Unavailable             final: Unavailable
PASS   T8   T8 Same check twice: final result is Available             final: Available
PASS   T9   T9 Narrow screen: final result is Available                final: Available
PASS   L1   report 1: tool, model and project link                     tool, model and project link recorded
PASS   L2   report 2: two predictions and the initial prompt as sent   2 predictions; initial prompt pasted as sent
PASS   L3   report 3: what v1 consists of and what works               v1 listing pasted; 12 line(s) on what works
PASS   L4   report 4: the v1 result of all nine cases                  v1 result recorded for all nine cases
PASS   L5   report 5: issue log, two issues or more                    4 issue(s) logged
PASS   L6   report 6: the cleanup prompts, each suggestion judged      both prompts pasted; 6 decisions with a reason
PASS   L7   report 7: change log of 2-4 changes                        4 change(s) logged
PASS   L8   report 8: one component explained, in 60 words or more     src/lib/availability.ts explained in 104 words
PASS   L9   report 10: conclusion of 120-180 words                     160 words
------------------------------------------------------------------------------
v1 (original/) has out-of-scope code: backend or database - a candidate for your issue log (section 5).
Cases matching the expected result: v1 0 of 9 - final 9 of 9.
SUMMARY pass=27 fail=0 error=0   (27 checks)
Files and shape are clean. The grader still opens your screenshots - this says nothing about whether they show what you reported.
```

### 9.2 The end of the day

Decision: **not-expressible**. The final page uses native HH:MM inputs, which stop at 23:59, and parseTime accepts hours 0–23. A user cannot enter 23:00–24:00. This is an explicitly declared UI limitation, not a claim that AC1 forbids an end of 1440. The minute-level check accepts 1440, but the page does not expose it and fmt would display it as 00:00. The lab permits declaring this choice. A future end-of-day option would be clearer than silently treating midnight as the same-day zero-minute value. The nine fixed cases do not require 24:00.

### 9.3 Which "now"?

v1 initializes Current time from the browser's clock through nowMinutes(), but the user can edit that field. For every recorded fixed-case run it was explicitly set to 09:00. T6 therefore tests start=now=540 and correctly returns Unavailable. The second prediction was wrong: a supplied-current-time control already existed. The first prediction was also wrong in the diagnostic run: touching endpoints were accepted. The real cleanup findings concerned test fixtures, blocked-room selection, feedback clarity and an unused dependency.

## 10. Conclusion (120–180 words)

This AI-assisted account describes the observed work rather than an independent personal reflection. Neither initial prediction became a demonstrated logic defect: the touching case was accepted, and the current-time field could be set to 09:00. However, the first export had no exact fixed single-booking fixture, and the blocked room could not be selected. Those setup limitations were recorded instead of inventing failed calculations.

Focused changes made the fixtures reproducible, exposed the blocked-room rejection and clarified the reversed-time message. Removing the unused backend dependency kept the source aligned with the one-page scope. The offer to add server-side storage was rejected because this prototype must only check availability.

A polished screen alone cannot demonstrate correctness. T8 requires checking the same interval twice and verifying that no booking was added; the final page returned Available both times. Repeating all nine cases after changes provided stronger evidence than trusting Bolt's build-success message or its mistaken claim about a start time equal to now.

