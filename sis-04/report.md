# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "Codex in ChatGPT Work; ChatGPT Default for recorded exchanges" and "npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/sis-04-work/sis-04/app

 ✓ src/booking.test.ts (20 tests) 7ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  02:31:12
   Duration  572ms (transform 63ms, setup 0ms, collect 47ms, tests 7ms, environment 0ms, prepare 293ms)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

Prepared for Abylai Keshubaev (24B031847), GitHub keshuba1ev. Analysis and checks were performed by the assistant, not independently by the student. No timestamps are backdated. The student-only reflection in §10 will not be invented.


<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | not displayed |
| Assistant model | week-07 |
| Starting point | 88f7c7b5328b9130221660c5f145f231ac0c48e3 |
| Baseline commit | ts |
| Language (ts or js) | 3.2.4 |
| Vitest version | Node 24.22.3 in the task workspace, using the app package-lock.json |
| Where I ran the tests | (write here) |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
app/src/App.tsx: form, selection, live nowMinutes(), calls canBook then checkAvailability for its message.
app/src/booking.ts: pure canBook({start,end,now,blocked,bookings}), 20 passing tests in booking.test.ts.
app/src/lib/availability.ts: checkAvailability repeats interval, 120, blocked and strict overlap checks; also fmt and parseTime.
app/src/lib/sampleData.ts: five SAMPLE_ROOMS with id/name/building/capacity/blocked, and separate flat SAMPLE_BOOKINGS with roomId.
app/src/lib/types.ts: Room lacks equipment and nested bookings; Decision is a Boolean/message union.
app/src/components/RoomCard.tsx: filters the flat bookings by roomId, renders a button with onClick and aria-disabled={room.blocked}.
app/src/components/TimeField.tsx and ResultBanner.tsx: presentation.
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
Analyse this unchanged Week 07 TypeScript app for SIS 04. Give maintainability risks with file/function references and a numbered SMALL plan. No code or full rewrite yet.
Repository map:
app/src/App.tsx: form, selection, live nowMinutes(), calls canBook then checkAvailability for its message.
app/src/booking.ts: pure canBook({start,end,now,blocked,bookings}), 20 passing tests in booking.test.ts.
app/src/lib/availability.ts: checkAvailability repeats interval, 120, blocked and strict overlap checks; also fmt and parseTime.
app/src/lib/sampleData.ts: five SAMPLE_ROOMS with id/name/building/capacity/blocked, and separate flat SAMPLE_BOOKINGS with roomId.
app/src/lib/types.ts: Room lacks equipment and nested bookings; Decision is a Boolean/message union.
app/src/components/RoomCard.tsx: filters the flat bookings by roomId, renders a button with onClick and aria-disabled={room.blocked}.
app/src/components/TimeField.tsx and ResultBanner.tsx: presentation.
Observed snippets: App calls canBook with SAMPLE_BOOKINGS.filter(b => b.roomId === roomId), then calls checkAvailability with the same inputs; handleCheck saves decision in state; selection clears it, editing time does not. nowMinutes uses new Date. canBook uses start < booking.end && booking.start < end.
Preserve AC1: 0 <= start < end <= 1440 and start > supplied now; AC2 duration <=120; AC3 blocked rejected; AC4 no overlap, touching allowed; AC5 no data mutation or saved booking; AC6 clear responsive feedback.
Add F1 capacity >= attendees; F2 ALL selected equipment; F3 blocked never available; F4 clear no-match state; F5 switching rooms refreshes result using only that room's bookings.
Required modules: rooms.ts exports Room and ROOMS (4+ complete fictional rooms), filter.ts exports filterRooms, booking.ts keeps canBook and adds checkRoom(rooms,roomId,request), UI imports rules. Keep original tests; add F1-F5, B1-B6 and INT with independent fixed fixtures. Constraints: no login, payments, backend, live APIs, database or storage; fictional data and fixed time only. Suggest an alternative for handling blocked rooms and explain its tradeoff.
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
(paste here)
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Duplicated availability decisions can diverge | src/booking.ts canBook() and src/lib/availability.ts checkAvailability() | Both test finite times, start/end, past start, 120-minute cap, blocked and strict overlap; App invokes both. | High |
| 2 | Results can describe old time inputs | src/App.tsx handleCheck() | setDecision persists, while TimeField onChange only changes startStr/endStr; no invalidation on edit. | High |
| 3 | Incomplete and split room model makes F2/F5 fragile | src/lib/types.ts and src/lib/sampleData.ts | Room has no equipment; bookings are a separate flat array requiring roomId filtering in App and RoomCard. | High |
| 4 | Clock-dependent demo makes checks hard to reproduce | src/App.tsx nowMinutes() | Initial currentTime reads new Date rather than the fixed supplied now required by SIS 04. | Medium |
| 5 | Blocked control says disabled but is clickable | src/components/RoomCard.tsx | onClick is always wired but aria-disabled follows room.blocked; assistive status disagrees with behavior. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Keep the unchanged baseline and all 20 regression tests; record the verified starting file hashes and run.
2. Write independent filter/checkRoom tests first; observe the missing-module failure. Add complete rooms.ts and pure filterRooms; run all tests.
3. Add checkRoom as an unknown-ID-safe adapter to unchanged canBook, using only the selected room's blocked/bookings; run all tests and typecheck.
4. Replace the duplicate availability evaluator with one rule source in booking.ts; retain parse/format helpers and meaningful messages. Run regression tests before UI wiring.
5. Incrementally update RoomCard and App to consume the catalog/filter/wrapper, fixed now=540, filter empty state, derived feedback and selection invalidation. Preserve TimeField/ResultBanner.
6. Verify B1–B6 and INT, full build/typecheck/lint, desktop filtering, same-time room switching, blocked room, stale-result handling and a portrait phone viewport. Capture real screenshots and diagrams.
7. Compare measured baseline/final results, record AI exchanges, leave the student's unaided reflection pending, run checkers, publish an open PR without merging.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| The first response assigned B1 to a past-start check and B5 to adjacent bookings. | Rejected | README §9 fixes B1 at exactly 120 minutes and B5 at equal capacity; wrong IDs would misrepresent boundary coverage even if tests were green. |
| Display blocked rooms but disable selection (Option A). | Modified | Keep cards selectable with a visible Blocked label, remove aria-disabled, and let checkRoom reject them; this demonstrates F3 while matching actual keyboard and mouse behavior. |
| The Decision type needs distinguishable outcomes. | Rejected | The false branch already has reason:string in src/lib/types.ts; the actual issue is duplicated rule evaluation, not an absent discriminator. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
