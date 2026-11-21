# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

## 1. Setup and starting point

Prepared for **Keshubayev Abylay**, Student ID **24B031847**, GitHub **keshuba1ev**. Checks and implementation were performed by the assistant; independent student review is not asserted. No dates were backdated. All five screenshot files have now been captured and checked. Student review of the AI-edited reflection remains unconfirmed; unaided authorship is not asserted.

| Item | Value |
| --- | --- |
| Assistant (tool) | Codex in ChatGPT Work; ChatGPT Default for recorded exchanges |
| Assistant model | not displayed |
| Starting point | week-07 |
| Baseline commit | 88f7c7b5328b9130221660c5f145f231ac0c48e3 |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | Task workspace, Node 24.22.3, using app/package-lock.json |

The 24 imported Week 07 application files at ab4478304ba926451b10ec08976faf269b54635c were compared byte for byte; their hashes are in evidence/baseline-files.sha256. A final full-tree comparison found one import exception: the original app/.gitignore had been moved/replaced by the root ignore file before the baseline commit. All application code, configuration and tests were preserved, but the entire app tree was not identical. The original app/.gitignore is restored in the final tree; baseline_unchanged is honestly declared no. The original baseline history is retained rather than rewritten. No week-08 branch existed when the repository was checked. Main was 4e8a0cde5e86c7fe09b0372e5ebc43d72ec5d43f. The equivalent local baseline is 2a45c8d; the published baseline above has the same tree and was created through the connected GitHub account with server-generated dates. Later stages were published as they were completed.

The first attempt used an incomplete dependency cache and stopped with ERR_MODULE_NOT_FOUND for @vitest/utils. It is preserved in evidence/baseline-attempt-missing-dependency.txt. npm ci --ignore-scripts restored the lockfile dependencies without source changes, then the actual baseline suite passed. Early report placeholders were accidentally replaced inside template comments; final report placement was corrected without changing the preserved run logs or the baseline source.

### 1.1 Baseline run

Command from app/: `npx --no-install vitest run`.

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/sis-04-work/sis-04/app

 ✓ src/booking.test.ts (20 tests) 7ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  02:31:12
   Duration  572ms (transform 63ms, setup 0ms, collect 47ms, tests 7ms, environment 0ms, prepare 293ms)

```

## 2. Context for the assistant

### 2.1 Repository map

```text
app/src/App.tsx: form, selection, live nowMinutes(), calls canBook then checkAvailability for its message.
app/src/booking.ts: pure canBook({start,end,now,blocked,bookings}), 20 passing tests in booking.test.ts.
app/src/lib/availability.ts: checkAvailability repeats interval, 120, blocked and strict overlap checks; also fmt and parseTime.
app/src/lib/sampleData.ts: five SAMPLE_ROOMS with id/name/building/capacity/blocked, and separate flat SAMPLE_BOOKINGS with roomId.
app/src/lib/types.ts: Room lacks equipment and nested bookings; Decision is a Boolean/message union.
app/src/components/RoomCard.tsx: filters the flat bookings by roomId, renders a button with onClick and aria-disabled={room.blocked}.
app/src/components/TimeField.tsx and ResultBanner.tsx: presentation.
app/src/main.tsx and index.css: bootstrap and Tailwind styles.
```

### 2.2 The context message as sent

Sent in a fresh ChatGPT Default chat on 2026-11-22. Conversation identifier: 6b020dcc-5bb4-83ea-9112-15c3fa8038ba. The follow-up timed out at the automation layer, but inspection confirmed exactly one submitted plan request and a completed answer; it was not resent.

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

1. Preserve the imported baseline source and all 20 regression tests; record the verified starting file hashes and run.
2. Write independent filter/checkRoom tests first; observe the missing-module failure. Add complete rooms.ts and pure filterRooms; run all tests.
3. Add checkRoom as an unknown-ID-safe adapter to unchanged canBook, using only the selected room's blocked/bookings; run all tests and typecheck.
4. Replace the duplicate availability evaluator with one rule source in booking.ts; retain parse/format helpers and meaningful messages. Run regression tests before UI wiring.
5. Incrementally update RoomCard and App to consume the catalog/filter/wrapper, fixed now=540, filter empty state, derived feedback and selection invalidation. Preserve TimeField/ResultBanner.
6. Verify B1–B6 and INT, full build/typecheck/lint, desktop filtering, same-time room switching, blocked room, stale-result handling and a portrait phone viewport. Capture real screenshots and diagrams.
7. Compare measured baseline/final results, record AI exchanges, collect and disclose the student's reflection without inventing personal verification, run checkers, publish an open PR without merging.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| The first response assigned B1 to a past-start check and B5 to adjacent bookings. | Rejected | README §9 fixes B1 at exactly 120 minutes and B5 at equal capacity; wrong IDs would misrepresent boundary coverage even if tests were green. |
| Display blocked rooms but disable selection (Option A). | Modified | Keep cards selectable with a visible Blocked label, remove aria-disabled, and let checkRoom reject them; this demonstrates F3 while matching actual keyboard and mouse behavior. |
| The Decision type needs distinguishable outcomes. | Rejected | The false branch already has reason:string in src/lib/types.ts; the actual issue is duplicated rule evaluation, not an absent discriminator. |

## 4. Feature extension (Task 2)

### 4.1 What I added

Five fictional rooms keep their existing names, capacities and schedules, now with equipment and nested bookings in rooms.ts. The attendees field and equipment checkboxes call filterRooms: capacity is inclusive and every selected item is required. Blocked rooms remain visible and selectable, with a Blocked label; checkRoom still rejects them. An unknown room id returns false.

The page displays “No rooms match your requirements” and a correction hint when the filter returns nothing. The fixed demo now is 09:00. Once Check availability is pressed, feedback is derived from the current room/time; switching rooms recalculates without another submit. If a filter removes the selection, both selection and old result clear. Text inputs support the valid endpoint 24:00. Pure domain functions and five actual React/DOM tests verify these behaviors; the actual Chromium mobile viewport was also checked for horizontal overflow and inspected through the captured portrait image. This is browser emulation, not a claim of testing physical phone hardware.

### 4.2 Demonstration

The five files are actual Chromium screenshots from the HTTP-served production build in GitHub Actions. Their dimensions, hashes, selected inputs and asserted results are recorded in evidence/capture-manifest.json; evidence/visual-qa-ci.txt is the real capture output.

| Screenshot | What it shows |
| --- | --- |
| evidence/filter-match.png | 25 attendees with projector+whiteboard: exactly Athena 101 and Newton 220 remain. |
| evidence/filter-empty.png | 61 attendees with the same equipment: zero rooms and the explicit no-match message. |
| evidence/switch-a.png | Athena 101, 10:00–11:00, fixed now09:00: Available; existing reservation only touches the start. |
| evidence/switch-b.png | Same unchanged times, Curie 204 selected: Unavailable from its own overlapping booking, without a second submit. |
| evidence/narrow.png | Actual 390×844 mobile browser viewport, full-page portrait capture, Athena selected and Available after filtering; no horizontal overflow. |

The cloud browser could not reach workspace loopback and rejected local-file navigation. The first local automated Chromium launch also failed because the workspace disallows socket(); its attempted permission escalation was rejected. No local protection was disabled. The successful test ran instead in GitHub's isolated hosted runner, with repository contents read-only and only localhost application requests during page interaction. The first CI attempt used ubuntu-latest (26.04), unsupported by pinned Playwright 1.56.1; the runner was pinned to supported Ubuntu 24.04. Both failed attempts remain in evidence. The script owns and closes its preview server/browser and checks exit status. A mobile viewport and touch emulation are not physical-device testing.

Successful visual run: https://github.com/keshuba1ev/se-practice/actions/runs/44954799219. CI provenance: source commit 4ed870cfebdf92c59a0b6a70c766e8f2d3763552; captured 2026-11-21T22:05:06.591Z; Chromium 141.0.7390.37. The source files under app/src were unchanged by the screenshot setup. The isolated run, not the blocked local attempt, produced the images.

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| src/rooms.ts | Room type, five fictional records with their own equipment/bookings, equipment option labels. |
| src/booking.ts | Unchanged canBook predicate and checkRoom lookup/delegation adapter; no UI or persistence. |
| src/filter.ts | Pure capacity and ALL-equipment filter, including an invalid-attendee guard. |
| src/App.tsx | Form and selection state; calls rules and derives feedback; defaults to ROOMS, accepts a catalog prop for independent rendered tests. |
| src/components/RoomFilters.tsx | Attendees/equipment controls; emits criteria without booking/filter decisions. |
| src/components/RoomCard.tsx | Presentational room status, equipment and its nested schedule; sorts a copied array. |
| src/components/TimeField.tsx | Named text field, separately described hint/error, aria-invalid and 24:00-capable input. |
| src/components/ResultBanner.tsx | Reused Available/Unavailable status presentation. |
| src/lib/time.ts and types.ts | Parse/format helpers and the presentation Decision union; no booking rules. |

Both PlantUML component diagrams were rendered locally using the official PlantUML JAR and visually inspected. Arrows show imports between application modules (dashed for type-only imports); external React/lucide dependencies and test-only imports are omitted. Rendered diagrams are in evidence/diagrams/, version and render logs alongside them. This local render replaces the requested plantuml.com rendering step; no claim of using that website is made.

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Preserve canBook byte for byte, add a thin checkRoom adapter. | Add capacity, equipment and room lookup to the Boolean function. | Keeps AC1–AC5 behavior and all 20 original tests stable; F1/F2 belong to filterRooms, while F5 needs one explicit room lookup. |
| Keep blocked cards selectable and correctly labeled. | Disable or hide every blocked card as suggested in the first reply. | Shows F3 to the user and avoids the old clickable-but-aria-disabled mismatch; the domain still rejects blocked rooms, as rendered and pure tests confirm. |
| Derive feedback from current state after the first check. | Store an independent Decision and manually clear it on every edit. | Reduces stale-state paths; the F5 UI test switches rooms without submitting again, and the F4 test clears filtered-out selection and feedback. |
| Preserve the Boolean contract and use an unavailable checklist. | Reintroduce a separate detailed rule evaluator for messages. | Prevents the original duplicated decision logic from returning; this accepts less precise failure messages as a real remaining limitation. |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| src/lib/availability.ts checkAvailability repeated canBook's finite/range/order/past/duration/blocked/overlap decision; App called both. This is one removed duplicate evaluator location. | src/booking.ts canBook is the only booking predicate; checkRoom delegates. The old availability file and its App invocation are gone. |

RoomCard also no longer joins a separate global booking list, but this is not counted as an additional removed rule evaluator. TimeField/ResultBanner are retained rather than replaced by parallel rendering branches.

## 6. Automated tests (Task 4)

### 6.1 Test plan

Every expected value follows the requirements, with fixed independent fixture catalogs and now values; tests do not import the demo ROOMS. The unchanged original suite has 20 cases, catalog.test.ts adds 16, lib/time.test.ts adds four, and ui.test.tsx adds five rendered cases (45 total). No mocks, skips, focused tests or generated parameterized cases.

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | T03 AC1 zero duration | 720–720 → false; other original tests cover past/reversed/end-of-day. |
| AC2 | T06 AC2 exactly 120 minutes | 720–840, now540 → true. |
| AC3 | T13 AC3 blocked | blocked=true → false. |
| AC4 | T01 AC4 touching after | Existing600–660, request660–720 → true. |
| AC5 | AC5 filtering and repeated checks preserve the full catalog | Two accepted checks and filtering → catalog equals deep copy. |
| F1 | F1 B5 capacity exactly equal is included | Capacity8 at attendees8 → IDs a,c,d. |
| F2 | F2 all equipment required, not any item | projector+whiteboard → only c,d, not projector-only a. |
| F3 | F3 AC3 blocked room never becomes available | Open interval in blocked d → false. |
| F4 | F4 no capacity match produces an empty list | attendees21 with max20 → []; rendered UI F4 also checks empty text and cleared old result. |
| F5 | F5 switching rooms uses own bookings at identical times | a600–660 conflict → false, c same times → true, a again → false. |
| B1 | B1 AC2 wrapper permits exactly 120 minutes | checkRoom c720–840 → true. |
| B2 | B2 AC2 wrapper rejects 121 minutes | canBook720–841 → false. |
| B3 | B3 AC4 wrapper permits touching endpoints | a660–720 after600–660 → true. |
| B4 | B4 AC4 wrapper rejects overlapping endpoints | a630–690 against600–660 → false. |
| B5 | F1 B5 capacity exactly equal is included | Capacity8 with attendees8 included. |
| B6 | F1 B6 capacity one below is excluded | Capacity7 with attendees8 excluded. |
| INT | INT F1 F2 F3 filter results feed selected-room checks | Filter attendees12+both items → c,d; check c true and blocked d false. Rendered UI F5 INT checks switching without re-submit. |

### 6.2 Commands

From app/, commands actually used:

```text
npm ci --ignore-scripts
npx --no-install vitest run
npm run typecheck
npm run build
npm run lint
npm install -D @testing-library/react@16.3.0 jsdom@26.1.0 --ignore-scripts
npx --no-install vitest run
npm run typecheck
npm run build
npm run lint
```

Evidence: catalog-tests-red.txt preserves the missing-filter failure, catalog-tests-green.txt the 36-test run, refactor-vitest.txt the 40-test run, and ui-vitest-first.txt the first rendered run (41 passed, 4 failed). The UI tests initially could not find a field named exactly Start because hint text joined the accessible name; TimeField now separates label and description. The missing building property in independent fixtures was caught by TypeScript and fixed; original run logs remain unedited. The first Python checker flagged RoomFilters checkbox-state membership as a filter rule (A5). It was criteria selection, not room eligibility; a named selectedEquipment Set now makes that presentation responsibility explicit. The actual ALL rule remains only in filter.ts, and all rendered tests still pass. A7 scans physical node_modules, so dependencies are kept outside the source snapshot when running the Python checker. Moving them into a directory not named node_modules broke Node package resolution; that failed attempt is preserved in post-move-environment-failure.txt. Dependencies were then placed in a proper external node_modules directory, the full checks were rerun successfully, and the temporary app link removed before the checker.

### 6.3 Final run

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/sis-04-final/sis-04/app

 ✓ src/lib/time.test.ts (4 tests) 5ms
 ✓ src/booking.test.ts (20 tests) 12ms
 ✓ src/catalog.test.ts (16 tests) 10ms
 ✓ src/ui.test.tsx (5 tests) 996ms
   ✓ UI F1 F2 B5 rendered filters require capacity and ALL equipment  348ms

 Test Files  4 passed (4)
      Tests  45 passed (45)
   Start at  03:02:30
   Duration  2.90s (transform 341ms, setup 0ms, collect 700ms, tests 1.02s, environment 666ms, prepare 1.64s)

```

The matching final-typecheck.txt, final-build.txt and final-lint.txt are real successful outputs. Real browser layout evidence is recorded separately in §4.2; a build alone is not layout verification.

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 20/20 | 45/45 | Exact Vitest Tests lines in §1.1 and §6.3; original 20-test file remains byte-identical. |
| Duplicated logic locations removed | 0 removed; two rule evaluators present | 1 redundant evaluator removed; one remains | The one removed location is the single row in §5.3; compare deletion of lib/availability.ts and App's duplicate call against the baseline. |
| Code structure: modules and their responsibilities | 12 src files; 9 production TS/TSX modules; data split and two booking evaluators | 17 src files; 11 production TS/TSX modules; rooms/booking/filter/UI separated | git ls-tree baseline and git ls-files app/src, recorded in structure-before.txt/after.txt; counts include main, exclude tests, .d.ts and CSS for production modules. More files is not claimed as an automatic quality gain. |
| Remaining limitation | Stale feedback after time edits; live-clock-dependent demo; no equipment filter | Generic rejection checklist; physical-device testing not performed | Inspect baseline App setters, final message branch and the five real rendered UI tests. Five real captures, their manifest and visual-qa-ci.txt now establish desktop and mobile-viewport evidence; this does not establish behavior on every physical device. |

## 8. AI evidence appendix

Three actual exchanges were recorded in the same analysis conversation, which started fresh. The first prompt requested analysis before any source edit. Codex implemented the reviewed small steps and ran checks while the external model's third reply was pending; that reply served as a further adapter/test review, not evidence that it generated every final file.

### 8.1 Exchange 1

**Tool and model:** ChatGPT Default; exact model not displayed. Codex in ChatGPT Work collected and reviewed the result.
**Date:** 2026-11-22
**Purpose:** Identify risks in the unchanged baseline before changing app/src.

**Prompt:**

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

**Output used:**

```text
The main concern is duplicated business logic and a lack of a single source of truth for booking decisions.
[…]
In App.tsx, handleCheck saves the result in state, but editing a time does not clear it.
This can cause misleading feedback: the displayed decision might relate to an earlier selection rather than the current form values.
[…]
Option A – Display blocked rooms but disable selection
[…]
Recommendation: Option A for SIS 04.
[…]
B1
Start before or equal to supplied current time
[…]

```

**Problems found:** The reply mislabeled B1–B6, suggested capacity/equipment as a canBook concern and overlooked the existing Decision.reason. Its valid duplication/stale-state findings were checked in actual files.
**Changes made:** Rejected the incorrect boundary mapping; kept filtering outside canBook and recorded the verified five risks before code edits.
**Verified by:** Baseline files, 20-test run, actual App and availability source, and the published analysis commit preceding feature source edits.

### 8.2 Exchange 2

**Tool and model:** ChatGPT Default; exact model not displayed. Codex in ChatGPT Work collected and reviewed the result.
**Date:** 2026-11-22
**Purpose:** Correct and prioritize the plan while preserving fixed contracts.

**Prompt:**

```text
Review your analysis before we edit. Your B1-B6 table is incorrect for this assignment: B1 exactly120 true; B2 121 false; B3 touching true; B4 overlap false; B5 capacity equal included; B6 one below excluded. Also Decision already contains a reason in its false branch, and capacity/equipment belong in filterRooms, not canBook. Revise the numbered plan to preserve canBook unchanged. We modify your disabled-blocked-room suggestion: keep the blocked card selectable with a clear Blocked label, and return Unavailable through checkRoom; remove aria-disabled if selection is allowed. Derive feedback from current selection/time after a check, so switching automatically recomputes and filtered-out selection is cleared. Give only a concise corrected plan and the checks for each step, no code.
```

**Output used:**

```text
The corrections are accepted. The existing canBook() remains completely unchanged, including its signature, implementation and 20 passing tests.
Capacity and equipment filtering belong exclusively in filterRooms(). They must not be added to canBook().
[…]
Switching rooms automatically recomputes the result.
Editing time refreshes the result.
Switching rooms uses only their own bookings.
If filtering removes the selected room, clear that selection and its result.
[…]
Blocked rooms remain selectable and display a clear Blocked label.
[…]
Final design decision: Filtering determines which rooms meet the requirements; checkRoom() determines whether the selected room is available; the UI communicates the current decision. canBook() remains unchanged.

```

**Problems found:** Disabled selection was an optional design suggestion, not a requirement; the reply accepted the revised selectable-blocked policy.
**Changes made:** Correct B1–B6, keep canBook unchanged, derive results, and clear filtered-out selection.
**Verified by:** Original booking.ts body and 20-test file remain byte-identical; B1–B6 and UI F3/F4/F5 all pass.

### 8.3 Exchange 3

**Tool and model:** ChatGPT Default; exact model not displayed. Codex in ChatGPT Work collected and reviewed the result.
**Date:** 2026-11-22
**Purpose:** Review a small filter/wrapper implementation and independent tests.

**Prompt:**

```text
Implementation step only, no App rewrite. Propose concise TypeScript filterRooms and checkRoom adapters plus 3 Vitest tests with a fixed independent catalog. Room has id,name,capacity,equipment,blocked,bookings. filterRooms uses capacity >= attendees and ALL selected equipment; empty equipment matches. checkRoom finds id, returns false for unknown id, and calls unchanged canBook with only that room data. Include B5 exact capacity, F2 missing one of two items, F5 switching between two rooms at the same times with opposite decisions. No mocks, no ROOMS import, no storage. Keep the answer under 80 lines.
```

**Output used:**

```text
1. filter.ts
Filters by capacity and requires every selected equipment item. Empty equipment requirements match all rooms.
[…]
export function filterRooms(
  rooms: Room[],
  attendees: number,
  requiredEquipment: string[]
): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= attendees &&
      requiredEquipment.every((item) =>
        room.equipment.includes(item)
      )
  );
}
[…]
  const room = rooms.find((item) => item.id === roomId);

  if (!room) return false;

  return canBook({
    ...request,
    blocked: room.blocked,
    bookings: room.bookings,
  });
[…]
This ensures that:
Unknown room IDs return false.
Blocked rooms are rejected by canBook.
Only the selected room's bookings are checked.
No room or booking data is modified.

```

**Problems found:** The model changed filterRooms to three positional arguments instead of the required criteria object. Its two-room sample omitted building, which is required in the retained Room type. The local fixture typecheck independently caught that omission.
**Changes made:** Used the ALL-equipment predicate and selected-room delegation pattern, retained the fixed criteria-object API, and supplied complete independent fixtures. Expanded coverage beyond the suggested three cases.
**Verified by:** 16 catalog tests, five rendered UI tests, original 20 regressions, four time helper tests, typecheck/build/lint; final actual run is 45/45.

## 9. Checker results and known fails

| Check | Why it still fails |
| --- | --- |
| None | All 33 checks pass after adding the five actual screenshots. |

The baseline import has the disclosed .gitignore relocation exception in §1, declared baseline_unchanged:no; the history was retained rather than rewritten. The reflection meets the word-count check but was factually edited and expanded with AI at the student's request; this does not establish compliance with the unaided-authoring requirement. The original student draft is preserved. The group code remains not provided rather than invented. Keep the PR open and do not merge it.

## 10. AI reflection (Task 6)

Student-provided draft, factually edited and expanded with AI assistance at the student's request. Student review is pending; this is not claimed as unaided writing under README §11.

В этой работе использовалось приложение из Week 07, в котором уже проходили 20 базовых тестов. Ветки Week 08 в репозитории не было. Задачей стало добавление полноценного каталога комнат, фильтров по вместимости и оборудованию, а также устранение дублирования между canBook и checkAvailability. При этом требовалось сохранить AC1–AC6 и выполнить новые требования F1–F5. Обозначения B1–B6 относятся к граничным тестам, а не заменяют эти требования.

Контекст для ИИ включал карту файлов, существующие функции, ограничения проекта и ожидаемое поведение. Полезным оказался поэтапный подход: сначала сохранить исходную версию, затем зафиксировать анализ и только после этого менять код. Однако первый ответ модели содержал неверное соответствие B1–B6. Это обнаружил агент при сверке с заданием; план был исправлен до изменения исходников. Позже пришлось отклонить и предложенную моделью сигнатуру filterRooms, поскольку задание требует объект criteria.

Я самостоятельно не запускал 45 тестов, проверку TypeScript, сборку и линтер: их выполнял агент. Также я пока не подтверждаю личное ревью всех изменений и проверку мобильной версии. Скриншоты нельзя считать готовыми только на основании успешных тестов: позже агент получил их отдельным запуском настоящего браузера в GitHub Actions.

Проверки повлияли на реализацию конкретно: новые тесты сначала показали отсутствие модуля фильтрации, TypeScript обнаружил неполные тестовые данные, а проверки интерфейса выявили проблему доступного имени поля времени. После исправлений проходят 45 тестов, включая пять проверок React-интерфейса. Это подтверждает проверенные сценарии, но не внешний вид страницы.

Следующим шагом для меня остаются самостоятельный запуск приложения, просмотр изменений и проверка пяти снимков, полученных агентом, включая портретный мобильный экран. После этого можно предметно оценить удобство формы и понятность сообщений об отказе.
