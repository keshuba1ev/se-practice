# Week 07 — Lab report

**Name:** Abylai Keshubaev
**Group:** not supplied; CSCI-2208 is the course code
**Date:** 2026-11-06

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| Item | Value |
| --- | --- |
| Project I continue | week-06, original Bolt final export from commit ad2992309d0de6d9e3686b34024721b8757ba552 |
| Bolt project link | not shared; original project is private |
| Assistant that generated the tests | Codex in ChatGPT Work |
| Exact model | gpt-6.1-sol |
| Where I ran the tests | Codex workspace terminal, Node.js v24.22.1 / npm 11.9.0 |
| Vitest version | 3.2.4 |
| Test command | npx vitest run (inside week-07/app) |

Baseline commit 160b27c preserves the Week 06 source before extraction. Commit f248249 records the assisted plan before suite generation. Branch: week-07. The stages were committed locally before publication and recreated through the GitHub connector; publication timestamps are not the original local working timestamps. No on-time submission is claimed.

---

## 2. Task 1 — baseline and the booking function

| Before extraction | Description |
| --- | --- |
| File and function | app/src/lib/availability.ts, checkAvailability |
| Inputs | CheckInput (roomId, start, end, currentTime), rooms and bookings |
| Return | Decision object: ok plus a message, and a reason on rejection |
| Page use | App.tsx parsed the form and displayed the returned decision |

The Boolean booking decision now lives in app/src/booking.ts as canBook. It preserves the finite-time checks, same-day interval ordering, strictly future start, inclusive 120-minute maximum, blocked-room rejection and strict overlap formula. App.tsx imports and calls this real function after selecting the room and filtering its bookings. It still calls checkAvailability for explanatory messages; this duplication is a remaining drift risk. Neither checking function writes a booking. The extraction was assisted, not an unaided student implementation.

An additional build check found an inherited RoomCardProps TypeScript error: the implementation filters b.roomId, but its declared booking type omitted roomId. Adding that existing field to the annotation fixed typecheck without changing runtime code. The failed and successful outputs are preserved in evidence/typecheck.txt and evidence/typecheck-final.txt. Production build also passed (evidence/build-final.txt).

---

## 3. Task 2 — the test plan

Prepared with Codex assistance before generating the first suite. The reasons were derived from the fixed acceptance criteria, not observed output. They are not claimed as an unaided student plan.

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 |  The existing interval ends at660, which it excludes; a request starting at660 only touches it. |
| T02 | 540–570 (starts now) | false | AC1 |  Start540 equals now540; starting strictly after now excludes equality. |
| T03 | 720–720 (zero duration) | false | AC1 |  The end equals the start, so the interval has no positive length. |
| T04 | 750–720 (reversed) | false | AC1 |  The requested end720 occurs before its start750. |
| T05 | 1380–1441 (past day end) | false | AC1 |  End1441 is one minute outside the allowed day ending1440. |
| T06 | 720–840 (120 minutes) | true | AC2 |  840 minus720 is120; the maximum is inclusive, so this limit is allowed. |
| T07 | 720–841 (121 minutes) | false | AC2 |  841 minus720 is121, one minute beyond the maximum duration. |
| T08 | 570–600 (touching before) | true | AC4 |  End600 is excluded from the candidate, so it does not share occupied time with a booking starting600. |
| T09 | 630–690 (partial overlap) | false | AC4 |  The intervals share time from630 until660. |
| T10 | 570–690 (contains booking) | false | AC4 |  The request spans the whole occupied600-660 interval. |
| T11 | 615–645 (inside booking) | false | AC4 |  Every minute of615-645 lies inside the occupied600-660 interval. |
| T12 | 600–660 (identical interval) | false | AC4 |  The request uses exactly the same occupied interval as the existing booking. |
| T13 | 660–720, blocked = true | false | AC3 |  Blocked status rejects the request even though its times would otherwise be valid. |
| T14 | 630–690, bookings = [] | true | AC4 |  With an empty bookings array there is nothing to overlap; start630 is future and duration60 is valid. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 |  Use an accepted660-720 request and compare the complete original booking data with its pre-call snapshot. |
| X1 | 1380–1440, default fixture | true | AC1 | Ending at1440 is the inclusive day boundary and this request lasts60minutes. |
| X2 | 720–780, bookings=[{start:600,end:660},{start:700,end:760}] | false | AC4 | The first interval does not overlap, but the second overlaps720-760; every booking must be checked. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

The supplied generation instruction was applied by Codex in this existing conversation, not sent to a new external chat. This workflow difference is disclosed; no separate chat or tool response is invented. The test file and accompanying answer were generated before review and execution.

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

````text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

Reviewed case table:
| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 |  The existing interval ends at660, which it excludes; a request starting at660 only touches it. |
| T02 | 540–570 (starts now) | false | AC1 |  Start540 equals now540; starting strictly after now excludes equality. |
| T03 | 720–720 (zero duration) | false | AC1 |  The end equals the start, so the interval has no positive length. |
| T04 | 750–720 (reversed) | false | AC1 |  The requested end720 occurs before its start750. |
| T05 | 1380–1441 (past day end) | false | AC1 |  End1441 is one minute outside the allowed day ending1440. |
| T06 | 720–840 (120 minutes) | true | AC2 |  840 minus720 is120; the maximum is inclusive, so this limit is allowed. |
| T07 | 720–841 (121 minutes) | false | AC2 |  841 minus720 is121, one minute beyond the maximum duration. |
| T08 | 570–600 (touching before) | true | AC4 |  End600 is excluded from the candidate, so it does not share occupied time with a booking starting600. |
| T09 | 630–690 (partial overlap) | false | AC4 |  The intervals share time from630 until660. |
| T10 | 570–690 (contains booking) | false | AC4 |  The request spans the whole occupied600-660 interval. |
| T11 | 615–645 (inside booking) | false | AC4 |  Every minute of615-645 lies inside the occupied600-660 interval. |
| T12 | 600–660 (identical interval) | false | AC4 |  The request uses exactly the same occupied interval as the existing booking. |
| T13 | 660–720, blocked = true | false | AC3 |  Blocked status rejects the request even though its times would otherwise be valid. |
| T14 | 630–690, bookings = [] | true | AC4 |  With an empty bookings array there is nothing to overlap; start630 is future and duration60 is valid. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 |  Use an accepted660-720 request and compare the complete original booking data with its pre-call snapshot. |
| X1 | 1380–1440, default fixture | true | AC1 | Ending at1440 is the inclusive day boundary and this request lasts60minutes. |
| X2 | 720–780, bookings=[{start:600,end:660},{start:700,end:760}] | false | AC4 | The first interval does not overlap, but the second overlaps720-760; every booking must be checked. |


Existing booking.ts:
```ts
export interface BookingInterval {
  start: number;
  end: number;
}

export interface BookingRequest {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: readonly BookingInterval[];
}

/** Extracted Week 06 decision. The caller supplies the room and same-day data. */
export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  if (start < 0 || end > 1440) return false;
  if (start >= end) return false;
  if (start <= now) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const booking of bookings) {
    if (start < booking.end && booking.start < end) return false;
  }
  return true;
}
```

AC1–AC6 are the fixed criteria in the supplied README section3.
````

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Run command: cd week-07/app && npx vitest run

AC mapping: T02–T05 and X1 check AC1; T06–T07 check AC2; T13 checks AC3; T01,T08–T12,T14 and X2 check AC4; the dedicated AC5 test checks an Available result and complete booking-data equality against a pre-call clone. Each test creates fresh fixture data and passes now=540 rather than reading the clock. Import ./booking exercises the same canBook called by App.

AC6 requires browser checks: the Boolean function cannot establish readable feedback, layout or mobile usability. No rule specifies the policy for malformed existing bookings, such as a reversed pair; observe and declare it separately instead of inventing a required result. The first suite intentionally records the agreed case plan rather than silently expanding the interface or changing implementation. The test file is provided separately and preserved unchanged in suites/first/.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | Exact decisions T01–T14 | No weak truthiness or no-exception assertion found | accept | Expected values come from AC1–AC4, including120allowed and endpoint touching. |
| 2 | Real ./booking import and freshRequest | No mocked function or shared fixture found | accept | Each call uses the page predicate and a new booking array; no clock is read. |
| 3 | AC5 accepted request with structuredClone | Proper pre-call snapshot and exact accepted result | accept | An available request reaches any potential append path; full equality detects mutation. |
| 4 | Missing positive lower future boundary | First suite does not check now+1 | revise | Add an accepted541–570 case to catch a predicate that rejects the first valid minute. |
| 5 | X2 rejection alone does not show a valid gap between two bookings | Missing combined touching boundary | revise | Add660–720 between600–660 and720–780; AC4 must allow both touches. |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

```text

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/week-07-work/week-07/app

 ✓ src/booking.test.ts (17 tests) 2ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  19:11:40
   Duration  228ms (transform 27ms, setup 0ms, collect 23ms, tests 2ms, environment 0ms, prepare 90ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
```

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | 17 passed, zero failures | Confirm real import and count | Neither | Retain correct expectations; improve coverage only |

### 6.2 The improvement prompt

Applied in this conversation; no new external chat is claimed. Exact prompt including its input output and suite is in evidence/improvement-prompt.txt and reproduced below.

````text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

Actual first-run output:

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/week-07-work/week-07/app

 ✓ src/booking.test.ts (17 tests) 2ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  19:11:40
   Duration  228ms (transform 27ms, setup 0ms, collect 23ms, tests 2ms, environment 0ms, prepare 90ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.


First suite:
import { describe, expect, test } from 'vitest';
import { canBook, type BookingRequest } from './booking';

function freshRequest(start: number, end: number, overrides: Partial<BookingRequest> = {}): BookingRequest {
  return {
    start,
    end,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  };
}

describe('canBook: fixed acceptance criteria', () => {
  test('T01 AC4 touching after', () => {
    expect(canBook(freshRequest(660, 720))).toBe(true);
  });

  test('T02 AC1 starts now', () => {
    expect(canBook(freshRequest(540, 570))).toBe(false);
  });

  test('T03 AC1 zero duration', () => {
    expect(canBook(freshRequest(720, 720))).toBe(false);
  });

  test('T04 AC1 reversed', () => {
    expect(canBook(freshRequest(750, 720))).toBe(false);
  });

  test('T05 AC1 past day end', () => {
    expect(canBook(freshRequest(1380, 1441))).toBe(false);
  });

  test('T06 AC2 exactly 120 minutes', () => {
    expect(canBook(freshRequest(720, 840))).toBe(true);
  });

  test('T07 AC2 121 minutes', () => {
    expect(canBook(freshRequest(720, 841))).toBe(false);
  });

  test('T08 AC4 touching before', () => {
    expect(canBook(freshRequest(570, 600))).toBe(true);
  });

  test('T09 AC4 partial overlap', () => {
    expect(canBook(freshRequest(630, 690))).toBe(false);
  });

  test('T10 AC4 contains existing booking', () => {
    expect(canBook(freshRequest(570, 690))).toBe(false);
  });

  test('T11 AC4 inside existing booking', () => {
    expect(canBook(freshRequest(615, 645))).toBe(false);
  });

  test('T12 AC4 identical interval', () => {
    expect(canBook(freshRequest(600, 660))).toBe(false);
  });

  test('T13 AC3 blocked', () => {
    expect(canBook(freshRequest(660, 720, { blocked: true }))).toBe(false);
  });

  test('T14 AC4 empty bookings', () => {
    expect(canBook(freshRequest(630, 690, { bookings: [] }))).toBe(true);
  });

  test('AC5 accepted check preserves existing booking data', () => {
    const request = freshRequest(660, 720);
    const before = structuredClone(request.bookings);
    expect(canBook(request)).toBe(true);
    expect(request.bookings).toEqual(before);
  });

  test('X1 AC1 ending exactly at midnight', () => {
    expect(canBook(freshRequest(1380, 1440))).toBe(true);
  });

  test('X2 AC4 overlap with the second existing booking', () => {
    expect(canBook(freshRequest(720, 780, {
      bookings: [{ start: 600, end: 660 }, { start: 700, end: 760 }],
    }))).toBe(false);
  });
});
````

Assistant answer, unedited:

```text
The real first run reports17passed tests and no failures, so there is no assertion mismatch or runner failure to diagnose. The fixed T01–T14 expectations agree with AC1–AC4. Exact .toBe assertions are stronger than no-exception or truthiness assertions, and ./booking imports the real page predicate rather than a mock. The helper creates a fresh fixture for each invocation; AC5 snapshots the booking data before an accepted call. No incorrect expectation should be changed.

Accept the existing17tests. Add three cases without changing implementation: E1 starts exactly one minute after now (AC1), catching an accidental rejection of the first legal minute; E2 fits in a gap while touching two bookings (AC4), catching inclusive overlap logic against either neighbour; E3 repeats an accepted check and compares complete data before and after (AC5), catching reservation-like side effects and non-repeatable decisions. These are coverage improvements, not repairs to the first suite's correct expectations. The tests remain separate, use fixed numeric time and fresh data, and assert exact decisions.

Keep feedback and mobile-layout verification in the manual UI checks. Existing reversed bookings have no specified policy; call the function separately and declare the observation. Do not add a defensive rule merely to make an unspecified case look correct. Run the improved suite, plant M1–M3 one at a time with the tests unchanged, and restore the original module before the final run.
```

The improved run passed 20/20 (evidence/improved-run.txt). E1, E2 and E3 add coverage; no implementation fix was made to satisfy these tests. The later RoomCard type annotation repair is separate.

### 6.3 The final run

All mutants were restored. This final run followed the type-only RoomCard repair and successful build/typecheck.

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/week-07-work/week-07/app

 ✓ src/booking.test.ts (20 tests) 3ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  19:20:04
   Duration  221ms (transform 26ms, setup 0ms, collect 24ms, tests 3ms, environment 0ms, prepare 76ms)

```

---

## 7. Task 6 — deliberate defects

Each mutation was applied separately to booking.ts. The test file was byte-for-byte unchanged, and the module was restored after each trial. Each failure below is an assertion mismatch, not a syntax or import error.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | Did not survive; no additions needed |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5, E2, E3 | Did not survive; no additions needed |
| M3 | Remove the blocked-room rejection | Detected | T13 | Did not survive; no additions needed |

Real mutant outputs, unedited:

```text

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/week-07-work/week-07/app

 ❯ src/booking.test.ts (20 tests | 1 failed) 8ms
   ✓ canBook: fixed acceptance criteria > T01 AC4 touching after 1ms
   ✓ canBook: fixed acceptance criteria > T02 AC1 starts now 0ms
   ✓ canBook: fixed acceptance criteria > T03 AC1 zero duration 0ms
   ✓ canBook: fixed acceptance criteria > T04 AC1 reversed 0ms
   ✓ canBook: fixed acceptance criteria > T05 AC1 past day end 0ms
   × canBook: fixed acceptance criteria > T06 AC2 exactly 120 minutes 5ms
     → expected false to be true // Object.is equality
   ✓ canBook: fixed acceptance criteria > T07 AC2 121 minutes 0ms
   ✓ canBook: fixed acceptance criteria > T08 AC4 touching before 0ms
   ✓ canBook: fixed acceptance criteria > T09 AC4 partial overlap 0ms
   ✓ canBook: fixed acceptance criteria > T10 AC4 contains existing booking 0ms
   ✓ canBook: fixed acceptance criteria > T11 AC4 inside existing booking 0ms
   ✓ canBook: fixed acceptance criteria > T12 AC4 identical interval 0ms
   ✓ canBook: fixed acceptance criteria > T13 AC3 blocked 0ms
   ✓ canBook: fixed acceptance criteria > T14 AC4 empty bookings 0ms
   ✓ canBook: fixed acceptance criteria > AC5 accepted check preserves existing booking data 0ms
   ✓ canBook: fixed acceptance criteria > X1 AC1 ending exactly at midnight 0ms
   ✓ canBook: fixed acceptance criteria > X2 AC4 overlap with the second existing booking 0ms
   ✓ canBook: fixed acceptance criteria > E1 AC1 first future minute is permitted 0ms
   ✓ canBook: fixed acceptance criteria > E2 AC4 gap touches both existing bookings 0ms
   ✓ canBook: fixed acceptance criteria > E3 AC5 repeated accepted checks keep all data unchanged 0ms

 Test Files  1 failed (1)
      Tests  1 failed | 19 passed (20)
   Start at  19:14:16
   Duration  248ms (transform 30ms, setup 0ms, collect 29ms, tests 8ms, environment 0ms, prepare 81ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook: fixed acceptance criteria > T06 AC2 exactly 120 minutes
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:37:45
     35| 
     36|   test('T06 AC2 exactly 120 minutes', () => {
     37|     expect(canBook(freshRequest(720, 840))).toBe(true);
       |                                             ^
     38|   });
     39| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

```

```text

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/week-07-work/week-07/app

 ❯ src/booking.test.ts (20 tests | 5 failed) 9ms
   × canBook: fixed acceptance criteria > T01 AC4 touching after 5ms
     → expected false to be true // Object.is equality
   ✓ canBook: fixed acceptance criteria > T02 AC1 starts now 0ms
   ✓ canBook: fixed acceptance criteria > T03 AC1 zero duration 0ms
   ✓ canBook: fixed acceptance criteria > T04 AC1 reversed 0ms
   ✓ canBook: fixed acceptance criteria > T05 AC1 past day end 0ms
   ✓ canBook: fixed acceptance criteria > T06 AC2 exactly 120 minutes 0ms
   ✓ canBook: fixed acceptance criteria > T07 AC2 121 minutes 0ms
   × canBook: fixed acceptance criteria > T08 AC4 touching before 0ms
     → expected false to be true // Object.is equality
   ✓ canBook: fixed acceptance criteria > T09 AC4 partial overlap 0ms
   ✓ canBook: fixed acceptance criteria > T10 AC4 contains existing booking 0ms
   ✓ canBook: fixed acceptance criteria > T11 AC4 inside existing booking 0ms
   ✓ canBook: fixed acceptance criteria > T12 AC4 identical interval 0ms
   ✓ canBook: fixed acceptance criteria > T13 AC3 blocked 0ms
   ✓ canBook: fixed acceptance criteria > T14 AC4 empty bookings 0ms
   × canBook: fixed acceptance criteria > AC5 accepted check preserves existing booking data 0ms
     → expected false to be true // Object.is equality
   ✓ canBook: fixed acceptance criteria > X1 AC1 ending exactly at midnight 0ms
   ✓ canBook: fixed acceptance criteria > X2 AC4 overlap with the second existing booking 0ms
   ✓ canBook: fixed acceptance criteria > E1 AC1 first future minute is permitted 0ms
   × canBook: fixed acceptance criteria > E2 AC4 gap touches both existing bookings 0ms
     → expected false to be true // Object.is equality
   × canBook: fixed acceptance criteria > E3 AC5 repeated accepted checks keep all data unchanged 0ms
     → expected false to be true // Object.is equality

 Test Files  1 failed (1)
      Tests  5 failed | 15 passed (20)
   Start at  19:14:17
   Duration  225ms (transform 28ms, setup 0ms, collect 27ms, tests 9ms, environment 0ms, prepare 51ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook: fixed acceptance criteria > T01 AC4 touching after
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:17:45
     15| describe('canBook: fixed acceptance criteria', () => {
     16|   test('T01 AC4 touching after', () => {
     17|     expect(canBook(freshRequest(660, 720))).toBe(true);
       |                                             ^
     18|   });
     19| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯

 FAIL  src/booking.test.ts > canBook: fixed acceptance criteria > T08 AC4 touching before
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:45:45
     43| 
     44|   test('T08 AC4 touching before', () => {
     45|     expect(canBook(freshRequest(570, 600))).toBe(true);
       |                                             ^
     46|   });
     47| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯

 FAIL  src/booking.test.ts > canBook: fixed acceptance criteria > AC5 accepted check preserves existing booking data
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:75:30
     73|     const request = freshRequest(660, 720);
     74|     const before = structuredClone(request.bookings);
     75|     expect(canBook(request)).toBe(true);
       |                              ^
     76|     expect(request.bookings).toEqual(before);
     77|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯

 FAIL  src/booking.test.ts > canBook: fixed acceptance criteria > E2 AC4 gap touches both existing bookings
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:95:10
     93|     expect(canBook(freshRequest(660, 720, {
     94|       bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }],
     95|     }))).toBe(true);
       |          ^
     96|   });
     97| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯

 FAIL  src/booking.test.ts > canBook: fixed acceptance criteria > E3 AC5 repeated accepted checks keep all data unchanged
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:101:30
     99|     const request = freshRequest(660, 720);
    100|     const before = structuredClone(request.bookings);
    101|     expect(canBook(request)).toBe(true);
       |                              ^
    102|     expect(canBook(request)).toBe(true);
    103|     expect(request.bookings).toEqual(before);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯

```

```text

 RUN  v3.2.4 /workspace/scratch/ab26a17e9871/week-07-work/week-07/app

 ❯ src/booking.test.ts (20 tests | 1 failed) 7ms
   ✓ canBook: fixed acceptance criteria > T01 AC4 touching after 1ms
   ✓ canBook: fixed acceptance criteria > T02 AC1 starts now 0ms
   ✓ canBook: fixed acceptance criteria > T03 AC1 zero duration 0ms
   ✓ canBook: fixed acceptance criteria > T04 AC1 reversed 0ms
   ✓ canBook: fixed acceptance criteria > T05 AC1 past day end 0ms
   ✓ canBook: fixed acceptance criteria > T06 AC2 exactly 120 minutes 0ms
   ✓ canBook: fixed acceptance criteria > T07 AC2 121 minutes 0ms
   ✓ canBook: fixed acceptance criteria > T08 AC4 touching before 0ms
   ✓ canBook: fixed acceptance criteria > T09 AC4 partial overlap 0ms
   ✓ canBook: fixed acceptance criteria > T10 AC4 contains existing booking 0ms
   ✓ canBook: fixed acceptance criteria > T11 AC4 inside existing booking 0ms
   ✓ canBook: fixed acceptance criteria > T12 AC4 identical interval 0ms
   × canBook: fixed acceptance criteria > T13 AC3 blocked 4ms
     → expected true to be false // Object.is equality
   ✓ canBook: fixed acceptance criteria > T14 AC4 empty bookings 0ms
   ✓ canBook: fixed acceptance criteria > AC5 accepted check preserves existing booking data 0ms
   ✓ canBook: fixed acceptance criteria > X1 AC1 ending exactly at midnight 0ms
   ✓ canBook: fixed acceptance criteria > X2 AC4 overlap with the second existing booking 0ms
   ✓ canBook: fixed acceptance criteria > E1 AC1 first future minute is permitted 0ms
   ✓ canBook: fixed acceptance criteria > E2 AC4 gap touches both existing bookings 0ms
   ✓ canBook: fixed acceptance criteria > E3 AC5 repeated accepted checks keep all data unchanged 0ms

 Test Files  1 failed (1)
      Tests  1 failed | 19 passed (20)
   Start at  19:14:17
   Duration  241ms (transform 27ms, setup 0ms, collect 25ms, tests 7ms, environment 0ms, prepare 75ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook: fixed acceptance criteria > T13 AC3 blocked
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:65:64
     63| 
     64|   test('T13 AC3 blocked', () => {
     65|     expect(canBook(freshRequest(660, 720, { blocked: true }))).toBe(fa…
       |                                                                ^
     66|   });
     67| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

```


All three changes reverted, and the full suite run again (section 6.3): yes. evidence/mutants.json records restoration and unchanged tests.

---

## 8. Task 7 — manual UI checks

Browser checks were performed by Codex through actual UI interactions, not by the student independently. Now was set to 09:00. Curie and Turing both contain a 10:00–11:00 fixture. Screenshots are unedited JPEG captures (ui-1.jpg through ui-5.jpg). Observed DOM text and methods are in evidence/ui-observations.json.

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, fixed sample booking | AC5 | Curie 204: Available from 11:00 to 12:00; existing Orgo booking still displayed | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces earlier result | AC3, AC5 | No toggle exists. Selected already-blocked Turing using a pointer click despite aria-disabled; Unavailable replaced Available. Same-room state transition cannot be performed | Not testable |
| U3 | Clear required input and submit | Understandable feedback | AC6 | Reset cleared Start; populated End only and submitted. Browser focused required empty Start and prevented result generation; no custom error appeared in DOM | Pass |
| U4 | Narrow phone width | Controls and result usable | AC6 | Real app rendered in 375x800 iframe; form and Available result usable after vertical scroll. Document clientWidth=scrollWidth=360 (15px scrollbar). Capture retains desktop outer canvas, not phone-sized image | Pass |
| U5 | Repeat checks on same data | Existing bookings unchanged | AC5 | Three checks of Curie 12:00–13:00 retained identical visible text and booking list; automated AC5 additionally compares full objects | Pass |

U2 is only partial AC3 browser evidence: the exact toggle procedure is unavailable in this baseline. The inherited aria-disabled attribute conflicts with an interactive button; keyboard/assistive-technology behavior is not established by a forced pointer click. U3 uses browser-native required validation; no custom-message claim is made.

U4 used a temporary QA iframe wrapper, removed after the check; it was not phone hardware or touch-device emulation. The checker measures the outer screenshot and therefore reports its U2 screenshot-width check as FAIL. The real 375px inner viewport is visible, but this does not meet that file-shape rule.

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| U2 | Checker screenshot-width check: ui-4.jpg captures the desktop canvas surrounding a real 375px iframe. Its outer image is landscape. I keep the original capture rather than relabel or resize it to imply a native phone viewport. |

This checker U2 is distinct from manual U2, whose exact room-toggle action was Not testable. No other checker FAIL is intended; actual output is recorded after the evidence commit. The checker reads shape and never executes Vitest.

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 20 / 20 / 0 |
| Requirements with meaningful tests | AC1–AC5; lacks now+1 and combined valid gap | AC1–AC5 plus E1 first future minute, E2 two-neighbour gap, E3 repeated accepted call |
| Selected mutants detected | Not run against the first suite; no measured count | 3 of 3, separate assertion failures |
| Accepted / revised / rejected tests | 17 accepted, 0 expectations repaired, 0 rejected | 17 retained plus 3 additions; no correct expectation weakened |
| Remaining limitations | AC6 not covered by unit tests; incomplete boundaries | AC6 relies on browser evidence; not exhaustive, malformed existing booking policy unspecified |

### 9.3 What no AC decides

Actual command and output:

```text
node --input-type=module -e "import {canBook} from './src/booking.ts'; console.log('invalid existing booking:',canBook({start:660,end:720,now:540,blocked:false,bookings:[{start:700,end:650}]}));"
invalid existing booking: true
```

It returns true. No AC defines validation of a reversed EXISTING booking. The function assumes existing intervals have already been validated for the selected room and same day. This observation is not proof that malformed stored data is safe; validate it at the data boundary if that policy is later required. The declaration is returns-true.

---

## 10. Conclusion (120–180 words)

The first suite did not contain an incorrect expected decision: all seventeen tests passed against the extracted function. Its weakness was incomplete coverage. Reviewing the cases before execution identified a missing first valid minute after now and a valid gap touching two existing bookings. Those cases were added without changing the correct expectations. A repeated accepted request also strengthened the check that availability testing does not create bookings.

The final twenty passing tests show that the selected inputs satisfy their stated expectations. The deliberate duration defect failed T06, inclusive overlap failed the touching tests, and removing the blocked check failed T13. This provides evidence that the suite detects those three faults, rather than only running without exceptions.

It does not prove that every implementation or user interface behavior is correct. The page still needs browser checks, the same-room blocking toggle was unavailable, and malformed existing intervals have no defined policy. More coverage and clearer contracts would improve confidence.

> AI-assisted conclusion based on recorded results; it is not presented as the unaided student conclusion required by the worksheet. The student should review and replace it with their own account before submission.

---
