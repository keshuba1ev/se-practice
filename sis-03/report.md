# SIS #03 — Report: Smart Campus Room Availability Checker

## 1. Setup and reuse

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Codex in ChatGPT Work; reused ChatGPT (web) Python first version |
| Coding assistant model | not displayed |
| Bolt.new model | not displayed |
| Bolt project link | not-shared |
| Language | Python 3 |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

Python v1 is copied byte-for-byte from week-05 at 033d24b; its received response was one physical line and is not executable. Final Python and its initial 27 tests start from that practice's final versions. Web v1 and its first screenshot are copied unchanged from week-06 at ad29923. The web final starts from Week 06's final project and receives new SIS repairs. Reuse is declared, not presented as fresh generation. Dates for reused exchanges stay in the appendix. The project stays private; source exports provide the reviewable implementation.

The first SIS commit, 93d7f6e, preserves the student's answers and explicitly records the assisted discussion. It precedes implementation changes but is not represented as an unaided baseline. The user approved the proposed reuse and checking plan before work continued.

## 2. Baseline — before any new AI exchange

Provenance: the student supplied the Russian statements below in this conversation. Some initial wording repeated the assistant's explanation. The student also proposed creating bookings, rejecting exactly 120 minutes, adding a preparation buffer, and supporting several dates. These were corrected through AI-assisted discussion against the fixed assignment. This baseline is therefore assisted, not an unaided baseline; it is recorded before implementation changes and is not claimed to predate that discussion. The English mapping and contract details below were organised by the assistant.

### 2.1 Scope in my own words

**Scope:** Student's initial wording: «Пользователь выбирает комнату и время, нажимает проверку и видит, свободна ли она.» Agreed scope after clarification: one responsive page checks one selected room within one day using fictional data. It does not create bookings, authenticate users, use a backend, database or external API.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Student: «Начало позже текущего времени; конец позже начала». Contract clarification: integer minutes, 0 <= start < end <= 1440, start > now; one day because no date parameter exists. |
| AC2 | Student initially said «длительность максимум 120 минут», then proposed rejecting 120. The assistant clarified the fixed rule: exactly 120 is permitted; 121 is rejected. |
| AC3 | Student: «комната не заблокирована». Requests for blocked rooms must return Unavailable. |
| AC4 | Student: «пересечений с существующими бронями нет». The proposed preparation buffer was excluded after discussion: touching endpoints are allowed. |
| AC5 | Student said existing bookings should «остаться наверное». Checking returns Available or Unavailable and leaves existing bookings unchanged; no booking is created. |
| AC6 | Student suggested «неверное время брони» and agreed to check that fields, button and result fit on a phone. The assistant proposed the more specific message “End time must be after start time”, which the student accepted. |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Rejecting exactly 120 minutes; the student initially proposed this | AC2 | For start=720,end=840,now=540 and no conflict, expect True / Available; calculate 840-720=120 manually. |
| 2 | Treating touching endpoints as overlap because a preparation buffer seems useful | AC4 | Existing 600-660, request 660-720, now=540: expect True / Available; compare endpoints on a timeline. |

### 2.4 The contract

The student supplied the meanings; types and limits are mapped from the fixed contract by the assistant.

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | «Начало желаемого интервала» | Integer minutes from midnight; valid candidate has 0 <= start < end and start > now. |
| `end` | «Конец интервала» | Integer minutes; start < end <= 1440. |
| `now` | «Текущее время» | Assumed valid integer 0-1439. |
| `blocked` | «Заблокирована ли комната» | Boolean; True means reject. |
| `existing` | «Уже существующие брони» | Collection of valid (start,end) integer pairs for the selected room and same day; not modified. |
| returns | «True — можно, False — нельзя» | Boolean; True only if AC1-AC4 all hold. |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. Student explicitly agreed that existing bookings belong only to the selected room; bookings of another room do not interfere.
2. The student proposed multiple days. The assistant explained that the contract has no date; the student accepted the one-day limitation. now and existing are valid as stipulated by the assignment, and all intervals belong to that day.

**Checked manually:**

- Planned checks, not yet claimed as executed: calculate 120 and 121 minute durations; draw adjacent intervals 600-660 and 660-720. The student agreed to check whether fields, button and result fit on a phone. The assistant will record actual execution separately in section 5.

## 3. Python v1 review

Every intended conditional is quoted below, but none executes in the preserved file. A comment after the one-line function header consumes the remaining physical line, leaving no body. Python import raised IndentationError, recorded in evidence/python-cases.json. This may be a copying problem; the received text is the preserved evidence.

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440):` | AC1 | Intended yes, executable no | Correct bounds and ordering, but inside the one-line comment. |
| `if start <= now:` | AC1 | Intended yes, executable no | Rejects equality and past starts; never runs in v1. |
| `if end - start > 120:` | AC2 | Intended yes, executable no | Exactly 120 is permitted; 121 rejected. |
| `if blocked:` | AC3 | Intended yes, executable no | Rejects every blocked-room request under the Boolean precondition. |
| `if start < existing_end and end > existing_start:` | AC4 | Intended yes, executable no | Both strict inequalities implement half-open overlap; touching is allowed. |
| `return True` after the loop | AC5 | Intended yes, executable no | Only reached after all checks; iterating does not modify input. |

Final code restores layout and includes the Week 05 exact-integer guard for start/end. It rejects bool, text and fractions rather than accepting a non-integer candidate. Guaranteed now/blocked/existing inputs are not independently redesigned. AC6 belongs to the page; the function's contract remains Boolean. Three new tests cover the exact T10 fixture, repeated T11 without mutation and Boolean input, bringing the final suite to 30 tests.

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

| Generated file or component | Path | Its role |
| --- | --- | --- |
| App | src/App.tsx | Form state, selected room, supplied current time and decision wiring. |
| Availability predicate | src/lib/availability.ts | Integer/time checks, duration, blocked and overlap decisions, parsing and feedback. |
| RoomCard | src/components/RoomCard.tsx | Displays fictional room and its existing bookings. |
| Sample data | src/lib/sampleData.ts | Fictional rooms and bookings, including blocked status. |

Paths above are relative to the exported project root web/original/project/.

**What v1 does:**

- Displays five fictional rooms and a read-only availability form with native time inputs.
- No exact base fixture exists: Curie also has a 15:00-16:00 booking; Turing has no booking and its card is disabled. No exact two-booking T10 fixture exists.
- New SIS version-history preview confirmed the same v1 data. Closest-fixture diagnostics are saved separately and not claimed as exact fixed-case passes.
- Native time inputs and parseTime do not represent 24:00 or 24:01; T8/T9 are Not testable on the page. Entry attempts were unsuccessful, not reported as application decisions.

## 5. Test cases — executed on both artifacts

Base: now=540, blocked=False, existing=[(600,660)] unless the row changes it. Python v1 fails import for every call; final results were executed. For page v1 the exact fixtures cannot be prepared without changing the artifact, so its strict cells are Not testable. Closest Curie runs for T1/T2/T4/T5/T6/T7/T10/T11 are in evidence/v1-diagnostics.json. T3 is blocked by the disabled selector; T12 cannot satisfy the exact fixture even at narrow width. A setup limitation is not a fabricated logic failure.

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | Error | True | Not testable | Available |
| T2 | Overlap | 630–690 | Unavailable | Error | False | Not testable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | Error | False | Not testable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | Error | True | Not testable | Available |
| T5 | 121 min | 720–841 | Unavailable | Error | False | Not testable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | Error | False | Not testable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | Error | False | Not testable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | Error | True | Not testable | Not testable |
| T9 | Past midnight | 1380–1441 | Unavailable | Error | False | Not testable | Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | Error | False | Not testable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | Error | True | Not testable | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Not testable | Available |

The displayed current time is explicitly set to 09:00 for each runnable case. Curie is the exact one-booking fixture; Turing the blocked fixture; Lovelace the exact T10 two-booking fixture. T11 checks the second decision and compares visible booking data before/after. No browser state or application internals are injected to produce a pass.

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | code/booking.py bounds and future branches; web/final/project/src/lib/availability.ts | T6,T7,T8,T9 | Reject now/reversed/out-of-day; permit end=1440 | Python Error; page exact fixture unavailable and midnight unrepresentable | Python False,False,True,False; page T6/T7 Unavailable; T8/T9 Not testable |
| AC2 | duration branch in Python and checkAvailability | T4,T5 | Permit120, reject121 | Python Error; closest page diagnostic Available/Unavailable | Python True/False; page Available/Unavailable |
| AC3 | blocked branch and RoomCard selection | T3 | Reject blocked room | Python Error; original page selector disabled | Python False; page Unavailable |
| AC4 | strict overlap loop; Lovelace fixture | T1,T2,T10 | Touch allowed; any overlap rejected | Python Error; no exact v1 fixtures | Python True,False,False; page Available,Unavailable,Unavailable |
| AC5 | Boolean return, no input writes; App result banner | T11 plus unchanged-list tests | Second check still Available and data unchanged | Python Error; closest v1 repeat Available | Python True; page Available twice, booking display unchanged |
| AC6 | TimeField, ResultBanner and responsive App classes | T7,T12 | Clear reversed-time message, usable375px | Original technical inequality; exact narrow test unavailable | Final T7 Unavailable with plain reason; T12 Available at375px without horizontal overflow |

## 7. Issue log

New SIS changes follow the Week 06 cleanup; no old repair exchange is relabelled as new.

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | T10 fixture coverage missing, a testability gap rather than wrong overlap logic | T10 needs two exact bookings600-660 and700-760; none of the five rooms has them | Medium | Focused repair1 asks for one dedicated fictional open room with exactly the two bookings; changes sampleData only | after-fixture-tests.json: T10 Unavailable; nine runnable desktop cases match; T8/T9 still not representable |
| 2 | Blocked card marked aria-disabled while intentionally selectable; bookings type omits roomId used by filter | AC3/AC6; accessibility reports disabled although native pointer selection can invoke rejection; inspect RoomCard typing | Medium | Focused repair2 removes contradictory aria-disabled, preserves blocked badge and rejection, fixes RoomCard's prop annotation without runtime expansion | Final nine desktop cases match; blocked card enabled with no aria-disabled; Enter selects it and check returns Unavailable; mobile T12 Available |

**Before / after:** evidence/before-1.jpg and evidence/after-1.jpg show issue 1: no dedicated two-booking room before, Lovelace and its exact bookings after. The before Curie result is not a T10 pass, because the required fixture was absent.

The original Python formatting failure is independently recorded in section3 and corrected in the reused final; no new SIS failure is invented. Potential scope expansions discussed with the student (booking creation, buffer, rejecting120, multiple dates) are excluded because they contradict the fixed contract.

## 8. Critique decisions

The critique is a new Bolt exchange in this SIS, in the existing project conversation rather than a new chat. Verification below was performed by Codex using source inspection and actual runs; it is not claimed as an independent student review.

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | T10 has no matching fixture, a testability limitation not a defect | Read sampleData and tried closest Curie12-13; no700-760 booking existed. After adding Lovelace, T10 gives Unavailable | accept | AC4 is correct; the fixture needed coverage |
| 2 | Strict overlap permits both touching directions | T1 and two Python touching tests; inspect strict inequalities | accept | AC4; equality makes an overlap conjunct false |
| 3 | Future start is strict and120 is inclusive | Execute T4,T5,T6 on Python and page | accept | AC1/AC2 require exactly those boundaries |
| 4 | Blocked selector has no defect because aria-disabled does not stop a native click | Browser reports disabled; forced pointer click can select it, then AC3 rejects | modify | Logic works, but accessibility falsely says selection unavailable; remove aria-disabled, keep rejection |
| 5 | Boolean Python result cannot provide standalone UI reasons | Confirm fixed contract returns Boolean; inspect separate page ResultBanner | modify | Do not change Python return type for AC6; page owns validation feedback |
| 6 | Python original cannot execute; final satisfies AC1-AC5 | Import raises IndentationError; final30tests and fixed calls pass | accept | Preserve evidence, assess intended conditions separately from actual execution |

The later verification plan labels start=end as “reversed”; that is an equal/zero-duration case, so the suite retains a separate genuinely reversed test. Its sample list is guidance, not a record of execution. The actual 30-test output is in section12.

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | Reuse the room checker and verify both artifacts under the same fixed criteria. |
| Model / plan | Approved plan uses unchanged originals, ordered predicate checks and T1-T12 comparisons. |
| Tool call | Bolt reads sampleData.ts and writes the dedicated T10 fictional fixture, then runs a build. |
| Observation | Bolt reports build success but explicitly says it did not visually execute the page; Codex then observes actual T10 Unavailable. |
| Next step | Rerun desktop cases, save screenshots and address the separate accessibility inconsistency. |
| Human review | Student approved scope corrections and the overall plan. Detailed source and test review was assisted by Codex; student defense is still to be completed. |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Codex | Uploaded README, existing practice branches, student answers and fixed cases | Read files, run Python, use GitHub connector to create sis-03 commits | Observed |
| Bolt.new | Existing project, supplied AC1-AC6 and focused repair prompts | UI reports file reads/writes and build commands; no publication was requested | Observed |
| Browser | Publicly rendered app controls, native time fields and visible decisions | Click/fill controls; capture screenshots; download export | Observed |
| Bolt model internals | Probably combines conversation and selected project files in a model request | Exact hidden prompt selection and internal permission sandbox were not visible | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting each repair, compare the proposed file change with the named issue, confirm that the predicate and read-only scope are preserved, and rerun the same cases. Do not approve a new database, login, publication, storage or booking operation merely because the builder offers it. Keep the original export separate so the change remains reviewable.

**Reliability, security, responsibility:** Reliability depends on independently derived expected results, especially starts-now,120/121, touching and the second overlapping booking. Security scope excludes credentials, backend services, storage and network calls; unused dependencies and generated code still require inspection. Tool success proves that an action ran, not that its result is correct. The student remains responsible for understanding the submission, while the report distinguishes observed tool activity from assumptions and assistant-performed checks from personal student work.

## 10. Reflection

Student reflection pending. This section must contain the student's100-200words about this completed work. No first-person experience has been invented by the assistant.

## 11. Appendix A — AI exchanges

These are complete response texts, not reconstructed chats. B1 is the exact generation prompt and received response pasted in the conversation on11October; the original ChatGPT chat was not reopened. The current model used for Codex is not displayed. B2-B5 are new Bolt exchanges saved with its Copy response button; the clipboard's leading hexadecimal author marker is retained unedited. B5 is a verification plan requested after repairs, not falsely dated before them. The earlier approved SIS plan is in the user conversation and baseline commit; this appendix does not invent a missing historical plan prompt. The builder's generic offer to add tests was not accepted.

### B1

- **Tool:** ChatGPT (web)
- **Model:** GPT-6 (Instant)
- **Date:** 2026-10-11
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
Implement can_book in booking.py using the supplied contract and AC1-AC5. Keep the signature. Use only the standard library. Do not modify existing. Return the function and explain each condition. Keep the feature within the stated scope.
~~~~

**Response:**

~~~~text
### `booking.py`
```
def can_book(start, end, now, blocked, existing):    # AC1: Check valid time range and future start    if not (0 <= start < end <= 1440):        return False    if start <= now:        return False    # AC2: Maximum booking duration is 120 minutes    if end - start > 120:        return False    # AC3: Room must not be blocked    if blocked:        return False    # AC4: Check for overlap with existing bookings    for existing_start, existing_end in existing:        if start < existing_end and end > existing_start:            return False    # AC5: All conditions passed    return True
```

### Explanation of conditions

1. AC1 — Valid time: `start` must be at least 0, `end` cannot exceed 1440, `start` must be less than `end`, and `start` must be strictly greater than `now`.
2. AC2 — Duration: A booking can last up to 120 minutes. Exactly 120 minutes is allowed.
3. AC3 — Room status: If `blocked` is `True`, the booking is rejected.
4. AC4 — Overlap: The function checks every existing booking. If the requested interval overlaps any booking, it returns `False`. Touching endpoints are allowed because the intervals are `[start, end)`.
5. AC5 — Final decision: The function returns `True` only when every condition passes.

### Example usage
```
print(can_book(600, 720, 540, False, []))# Trueprint(can_book(600, 721, 540, False, []))# False (duration exceeds 120 minutes)print(can_book(600, 660, 540, False, [(650, 700)]))# False (overlapping booking)print(can_book(600, 660, 540, False, [(660, 720)]))# True (touching endpoints)
```

Scope: The function only checks whether a booking is allowed. It does not save bookings, send confirmations, or modify `existing`. No external libraries are required.
~~~~

### B2

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-26
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
SIS 03 critique only; do not edit any files. Review this page and the Python function below against the fixed AC1-AC6: integer minutes 0 <= start < end <= 1440 and start > now; duration <=120 including 120; reject blocked; reject overlap but allow touching endpoints; clear Available/Unavailable without mutating existing; understandable validation and usable narrow layout. No login, backend, database, network, storage, booking creation or preparation buffer. Inspect RoomCard.tsx, sampleData.ts and availability.ts. Consider the fixed T10 fixture existing=[(600,660),(700,760)] and candidate 720-780, now=540, and whether it can be selected without editing code. Identify at most five concrete claims, cite files/conditions and distinguish defects from testability limitations. Also assess Python final:

def can_book(start,end,now,blocked,existing):
    if type(start) is not int or type(end) is not int: return False
    if not (0 <= start < end <= 1440): return False
    if start <= now: return False
    if end-start > 120: return False
    if blocked: return False
    for a,b in existing:
        if start < b and end > a: return False
    return True

Python original from Week 05 was received as one physical line with inline comments and raises IndentationError; it is preserved unedited. Do not assume it executes. Return review findings only.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74## Review findings (SIS 03, no edits made)

### TypeScript page — concrete claims

**1. T10 fixture cannot be exercised without editing code — testability limitation, not a defect.**
The T10 fixture requires a room with `existing=[(600,660),(700,760)]` and candidate `720–780` at `now=540`. No room in `src/lib/sampleData.ts` has that booking set: `r1` has `(540,600)+(720,780)`, `r2` has only `(600,660)`, `r3` has `(600,660)` and is blocked. The candidate `720–780` would correctly be rejected by AC4 against `(700,760)` (`720 < 760 && 780 > 700`), but since no room carries that second booking, the scenario is unreachable through the UI without modifying `sampleData.ts`. This is a fixture-coverage gap, not a logic error.

**2. AC4 overlap logic is correct, touching endpoints allowed — not a defect.**
`src/lib/availability.ts:64` uses `start < b.end && b.start < end`. If `start === b.end` the first conjunct is false; if `end === b.start` the second is false. Both touching cases pass through as available, matching AC4 exactly.

**3. AC1 interval and "start after now" enforced correctly — not a defect.**
`availability.ts:21–38`: out-of-range and reversed intervals are split into two distinct reasons (`invalid-interval`, `reversed-interval`), and `start <= currentTime` returns `past-start`. So `start > now` is required strictly, and `0 <= start < end <= 1440` is fully covered. Matches AC1.

**4. AC2 duration cap is inclusive at 120 — not a defect.**
`availability.ts:41`: `end - start > MAX_DURATION` (120) fails only when strictly greater. A 120-minute slot passes. Matches "duration <= 120 including 120".

**5. Blocked room is selectable and routed to AC3 — not a defect (intentional from the prior fix).**
`src/components/RoomCard.tsx:22` uses `aria-disabled` rather than the native `disabled` attribute, so clicking a blocked card still calls `onSelect`. `availability.ts:54` then returns `room-blocked` Unavailable. AC3 is satisfied and the "Blocked" label is preserved (`RoomCard.tsx:40–43`). The blocked card's rose tint does not prevent interaction.

### Python final assessment

```python
def can_book(start,end,now,blocked,existing):
    if type(start) is not int or type(end) is not int: return False
    if not (0 <= start < end <= 1440): return False
    if start <= now: return False
    if end-start > 120: return False
    if blocked: return False
    for a,b in existing:
        if start < b and end > a: return False
    return True
```

- **AC1:** `0 <= start < end <= 1440` and `start <= now → False` enforce `start > now` strictly. Correct.
- **AC2:** `end-start > 120 → False`; exactly 120 passes. Correct, inclusive.
- **AC3:** `if blocked: return False`. Correct.
- **AC4:** `start < b and end > a`. Touching endpoints: `start == b` → first conjunct false; `end == a` → second conjunct false. Both pass. Correct.
- **AC5:** Pure predicate, no mutation of `existing`. Correct.
- **AC6 — limitation, not a logic defect:** Returns `bool` only, no reason string. If wired directly to UI feedback it cannot by itself provide an "understandable" explanation for *why* the slot is unavailable (which room rule fired). The page's `ResultBanner` supplies that context, but the Python function alone does not. As a pure decision predicate it is correct; as a UI-feedback source it is insufficient.

The Week 05 original (single physical line, inline comments, `IndentationError`, preserved unedited) is not executable, so its logic cannot be assessed — only the reformatted final above is reviewable, and it satisfies AC1–AC5 with the AC6 feedback limitation noted.

**Summary:** No defects found in the TypeScript logic or the Python final predicate. The only concrete gap is a testability limitation — the T10 fixture has no matching room in `sampleData.ts`, so it can't be driven through the UI without editing data. The Python function is logically correct for AC1–AC5 and returns only a boolean, which limits UI-grade feedback (AC6) if used standalone.
~~~~

### B3

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-26
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
SIS 03 focused repair 1, testability only: T10 cannot be run because no fictional room has exactly the two bookings (600,660) and (700,760). Add one dedicated fictional open room with exactly these two bookings, keeping Curie 204 and Turing 310 fixtures unchanged. Candidate 720-780 at now=540 must display Unavailable due to overlap with the second booking. Change sampleData.ts only, do not change availability logic or introduce data editing, booking creation, login, backend, database, network, storage or other features. Explain the changed data and run the build.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74I'll add one dedicated fictional open room with exactly the T10 bookings, leaving existing rooms unchanged.Build passes.

**Changed file:** `src/lib/sampleData.ts`

**What I changed:** Added one new fictional open room, `Lovelace 105` (Math Wing, capacity 20, not blocked, id `r6`), with exactly two bookings: `b8` at `600–660` ("Calculus Recitation") and `b9` at `700–760` ("Linear Algebra Review"). The existing Curie 204 (`r2`) and Turing 310 (`r3`) rooms and their bookings are untouched.

**Why:** The T10 fixture specifies a room whose existing bookings are exactly `[(600,660),(700,760)]`. No room previously had that pair, so the candidate `720–780` at `now=540` couldn't be exercised through the UI without editing data. With `r6` in place, selecting it and entering `12:00–13:00` produces an overlap with the `700–760` booking (`720 < 760 && 780 > 700`), so AC4 returns Unavailable — exactly the T10 expected result.

**AC preservation:** This is data only — no logic, no booking creation, no mutation of existing bookings, no login, backend, database, network, or storage. AC1–AC6 are all preserved since the validation function is unchanged; the new room simply makes the T10 scenario reachable.

**Note on verification:** I confirmed the build passes and traced the overlap condition against the new fixture by hand, but I can't run the UI here to visually confirm the banner, so that part is reasoned rather than observed.
~~~~

### B4

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-26
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
SIS 03 focused repair 2, AC3/AC6: RoomCard currently exposes aria-disabled=true for a blocked room although it is intentionally selectable so the checker can display Unavailable. Remove only this contradictory aria-disabled attribute from the room-selection button. Preserve aria-pressed, native keyboard selection, the Blocked badge, fictional fixtures and the existing room-blocked rejection. Do not disable the card, do not alter checkAvailability or add features. Also correct the existing bookings prop TypeScript annotation to include roomId if needed to match its actual usage; keep this as an interface typing cleanup with no runtime behaviour change. Explain exact edits and run build and TypeScript checks.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74I'll read the relevant files first to confirm current state and the bookings prop usage.Confirmed: `RoomCard.tsx:14` filters on `b.roomId`, but the inline `bookings` prop type at line 7 omits `roomId`. The card receives `SAMPLE_BOOKINGS` (full `Booking[]` from `App.tsx:96`), so the actual usage requires `roomId`. I'll add it to the inline type and remove the contradictory `aria-disabled`.Both checks pass — TypeScript reports no errors and the build succeeds.

**Changed file:** `src/components/RoomCard.tsx`

**Exact edits:**
1. Removed `aria-disabled={room.blocked}` from the button (line 22 previously). The card is intentionally selectable so the checker can report Unavailable for a blocked room, so `aria-disabled` was contradictory — it announced the control as disabled to assistive tech while it remained fully clickable. `aria-pressed`, native keyboard selection, the Blocked badge, and the `room-blocked` rejection in `checkAvailability` are all preserved.
2. Added `roomId: string` to the inline `bookings` prop type annotation. The component already filtered on `b.roomId` (line 14) and received full `SAMPLE_BOOKINGS` from `App.tsx`, so the prior type omitted a field actually in use. This is a typing-only cleanup with no runtime behavior change.

**AC preservation:** AC3 (blocked rejection) is unchanged — `checkAvailability` still returns `room-blocked`, and the card still routes through `onSelect`. AC6 (clear Available/Unavailable) is improved: screen readers no longer hear a false "disabled" signal that contradicts the selectable behavior. No logic, fixtures, or features were added or altered.

**Note on verification:** I confirmed the TypeScript check and production build both pass, but I can't run the UI in this environment to visually confirm the screen-reader behavior change, so that aspect is reasoned rather than observed.
~~~~

### B5

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-26
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
SIS 03 Python plan only, no file edits: propose a short verification and implementation plan for can_book(start,end,now,blocked,existing), reusing the Week 05 final. Fixed rules: integer candidate minutes with 0<=start<end<=1440 and start>now; duration<=120 including120; blocked rejects; overlap with any existing interval rejects but touching passes; return bool and never mutate existing. now is valid0-1439 and existing contains valid same-room same-day pairs. List ordered checks, assumptions and boundary tests, and say which feedback/mobile concerns belong to the separate page under AC6. No new features, no booking creation, no buffer, no database or backend.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74## Plan for `can_book(start, end, now, blocked, existing)` — reusing Week 05 final

No file edits; this is a plan only.

### Reused final (reference)

```python
def can_book(start, end, now, blocked, existing):
    if type(start) is not int or type(end) is not int: return False
    if not (0 <= start < end <= 1440): return False
    if start <= now: return False
    if end - start > 120: return False
    if blocked: return False
    for a, b in existing:
        if start < b and end > a: return False
    return True
```

### Ordered checks (match the fixed rules; short-circuit on first failure)

1. **Type guard** — `type(start) is not int or type(end) is not int → False`. Rejects bools (since `bool` is a subclass of `int`, `type(...) is int` correctly excludes `True`/`False`) and floats. Matches "integer candidate minutes."
2. **Range + ordering** — `not (0 <= start < end <= 1440) → False`. Single chained check covers `start < 0`, `end > 1440`, and `start >= end` (reversed/equal). Matches AC1's `0 <= start < end <= 1440`.
3. **Start after now** — `start <= now → False`. Strictly `start > now`. Matches AC1.
4. **Duration cap inclusive** — `end - start > 120 → False`. Exactly 120 passes. Matches AC2 ("including 120").
5. **Blocked** — `if blocked: return False`. Matches AC3.
6. **Overlap, touching allowed** — `for a, b in existing: if start < b and end > a: return False`. Touching endpoints (`start == b` or `end == a`) make a conjunct false → passes. Matches AC4.
7. **Return `True`** — only if all checks pass. Pure predicate, never mutates `existing` (iterates read-only). Matches AC5.

### Assumptions (stated in the prompt; not re-validated)

- `now` is a valid integer in `0..1439` — no guard needed.
- `existing` contains valid same-room, same-day pairs `(a, b)` with `0 <= a < b <= 1440` — no per-pair validation; treated as trusted input.
- `blocked` is a bool; `existing` is iterable of 2-tuples. These are caller invariants, not re-checked.

### Boundary tests (ordered to mirror the checks)

| # | Case | Inputs | Expected | Why |
|---|------|--------|----------|-----|
| 1 | Non-int start | `start=1.0, end=60, now=0, blocked=False, existing=[]` | `False` | Type guard |
| 2 | Bool start | `start=True, end=60, ...` | `False` | `type(...) is int` excludes `bool` |
| 3 | start < 0 | `start=-1, end=60, now=0` | `False` | Range |
| 4 | end > 1440 | `start=1430, end=1441, now=0` | `False` | Range |
| 5 | reversed | `start=120, end=120, now=0` | `False` | `start < end` |
| 6 | start == now | `start=540, end=600, now=540` | `False` | `start > now` strict |
| 7 | start == now+1, 120 min | `start=541, end=661, now=540` | `True` | Boundary of "after now" + inclusive 120 |
| 8 | 121 min | `start=541, end=662, now=540` | `False` | Duration cap |
| 9 | exactly 120 | `start=600, end=720, now=540` | `True` | Inclusive cap |
| 10 | blocked True | `blocked=True`, otherwise valid | `False` | AC3 |
| 11 | full overlap | `existing=[(600,720)]`, candidate `630-690` | `False` | AC4 |
| 12 | touches at end | `existing=[(600,660)]`, candidate `660-720` | `True` | `start == b` |
| 13 | touches at start | `existing=[(700,760)]`, candidate `660-700` | `True` | `end == a` |
| 14 | T10 fixture | `existing=[(600,660),(700,760)]`, candidate `720-780, now=540` | `False` | Overlaps second: `720<760 and 780>700` |
| 15 | existing not mutated | run case 14, assert `existing == [(600,660),(700,760)]` after | unchanged | AC5 |
| 16 | empty existing | `existing=[]`, otherwise valid | `True` | No overlap possible |

### What does NOT belong here (deferred to the page under AC6)

- **Understandable feedback strings** — `can_book` returns `bool` only. The human-readable "Unavailable: overlaps Linear Algebra Review (11:40–12:40)" message, reason codes, and banner styling belong to the page's `ResultBanner`/`checkAvailability` layer, not the predicate.
- **Mobile/narrow layout** — column count, card sizing, touch targets, and form stacking are page concerns, independent of the predicate's correctness.
- **Field-level validation messages** — "Enter a start time as HH:MM" and "End time must be after the start time" are UI input validation, handled before the predicate is ever called.
- **Selection state, room badges, current-time picker** — all page-side; the predicate takes already-parsed integers and a boolean.

The predicate is pure logic; everything a user *sees* is the page's responsibility under AC6.

### Verification approach (no implementation)

1. Run the boundary table above as a plain Python script with `assert` statements (no pytest dependency required).
2. Specifically assert `existing` is referentially unchanged after each call (AC5).
3. Confirm the Week 05 original (single physical line with inline comments) still raises `IndentationError` and is **not** used — only the reformatted final is exercised.
4. No build step is involved; this is Python, separate from the TypeScript page.

**Summary:** The Week 05 final is logically complete for AC1–AC5 as a pure `bool` predicate. The plan is to reuse it verbatim, verify it against the 16-case boundary table (including T10 and the AC5 no-mutation assertion), and keep all human-readable feedback, reason strings, and mobile layout in the page layer under AC6. No new features, no booking creation, no buffer, no database, no backend.
~~~~

## 12. Appendix B — execution evidence

### 12.1 Final suite output

~~~~text
test_121_minutes_is_rejected (test_booking.BookingTests.test_121_minutes_is_rejected) ... ok
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_boolean_candidate_is_not_integer_time (test_booking.BookingTests.test_boolean_candidate_is_not_integer_time) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests.test_empty_existing_is_allowed) ... ok
test_end_after_midnight_is_rejected (test_booking.BookingTests.test_end_after_midnight_is_rejected) ... ok
test_end_at_midnight_is_allowed (test_booking.BookingTests.test_end_at_midnight_is_allowed) ... ok
test_exactly_120_minutes_is_allowed (test_booking.BookingTests.test_exactly_120_minutes_is_allowed) ... ok
test_final_minute_of_day_is_allowed (test_booking.BookingTests.test_final_minute_of_day_is_allowed) ... ok
test_fractional_end_returns_false (test_booking.BookingTests.test_fractional_end_returns_false) ... ok
test_fractional_start_returns_false (test_booking.BookingTests.test_fractional_start_returns_false) ... ok
test_gap_between_multiple_bookings_is_allowed (test_booking.BookingTests.test_gap_between_multiple_bookings_is_allowed) ... ok
test_input_order_unchanged_after_allowed_request (test_booking.BookingTests.test_input_order_unchanged_after_allowed_request) ... ok
test_input_unchanged_after_rejected_request (test_booking.BookingTests.test_input_unchanged_after_rejected_request) ... ok
test_later_existing_overlap_is_rejected (test_booking.BookingTests.test_later_existing_overlap_is_rejected) ... ok
test_negative_start_is_rejected (test_booking.BookingTests.test_negative_start_is_rejected) ... ok
test_one_minute_overlap_is_rejected (test_booking.BookingTests.test_one_minute_overlap_is_rejected) ... ok
test_partial_overlap_is_rejected (test_booking.BookingTests.test_partial_overlap_is_rejected) ... ok
test_request_contains_existing_is_rejected (test_booking.BookingTests.test_request_contains_existing_is_rejected) ... ok
test_request_inside_existing_is_rejected (test_booking.BookingTests.test_request_inside_existing_is_rejected) ... ok
test_reversed_interval_is_rejected (test_booking.BookingTests.test_reversed_interval_is_rejected) ... ok
test_sis_t10_exact_second_booking (test_booking.BookingTests.test_sis_t10_exact_second_booking) ... ok
test_sis_t11_repeated_call_keeps_data (test_booking.BookingTests.test_sis_t11_repeated_call_keeps_data) ... ok
test_start_before_now_is_rejected (test_booking.BookingTests.test_start_before_now_is_rejected) ... ok
test_start_equal_now_is_rejected (test_booking.BookingTests.test_start_equal_now_is_rejected) ... ok
test_start_one_minute_after_now_is_allowed (test_booking.BookingTests.test_start_one_minute_after_now_is_allowed) ... ok
test_text_end_returns_false (test_booking.BookingTests.test_text_end_returns_false) ... ok
test_text_start_returns_false (test_booking.BookingTests.test_text_start_returns_false) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 30 tests in 0.001s

OK
~~~~

### 12.2 Path B only — planted faults

Not applicable: Python Path A. Mutation checks are executed by the supplied checker rather than planted manually.

## 13. Final checks and limitations

| Check ID | Status and reason | What remains |
| --- | --- | --- |
| Q1 | FAIL: the student reflection is still22words of status text, not a100-200word reflection | Student supplies their own reflection before submission. |

Latest run:54PASS,1FAIL,0ERROR out of55checks. This is a draft, not ready for submission. The sole automated failure is explicitly declared. Baseline assistance is also disclosed even though the shape checker cannot assess authorship. The original Python import failure is reported as Error, not repaired or claimed as a working v1. Web T8/T9 cannot be represented by native HH:MM inputs; adding an explicit end-of-day input would be needed, but the assignment permits Not testable for those cases. Reflection awaits the student's own account. The assisted baseline is transparently distinguished from the required unaided baseline.
