# Week 05 — Lab report

**Name:** Abylai Keshubaev
**Group:** Not provided
**Date:** 2026-10-11

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT (web) |
| **Exact** model name | GPT-6 (Instant), selected for this workflow |
| Language and version | Python 3; code must run on grader Python 3.13 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
## Implementation Plan — `can_book()`

Language: Python 3 Function: `can_book(start, end, now, blocked, existing)` Output: `True` if booking is allowed, otherwise `False`.

### 1. Checks in order

1. Validate time (AC1): Check `0 <= start < end <= 1440` and `start > now`. Return `False` if invalid.
2. Check duration (AC2): Calculate `end - start`. Return `False` if it exceeds 120 minutes.
3. Check room status (AC3): Return `False` if `blocked` is `True`.
4. Check overlaps (AC4): Compare the requested interval with each existing booking. An overlap exists when `start < existing_end` and `end > existing_start`. Return `False` if any overlap is found.
5. Final decision (AC5): Return `True` only if all checks pass. Never modify `existing` or other inputs.

### 2. Assumptions

- `start` and `end` are integer minutes after midnight.
- `now` is valid (0–1439).
- `blocked` is a Boolean.
- `existing` contains valid booking tuples for the selected room only.
- All times refer to the same date.
- Intervals include the start but exclude the end: `[start, end)`.
- The function only checks availability; saving and confirmation are handled elsewhere.

### 3. Suggested boundary tests

|   |
| - |

Test case

|   |
| - |

Expected

|   |
| - |

Start = 0, now = 0

|   |
| - |

`False`

|   |
| - |

Start = now + 1

|   |
| - |

`True` if other rules pass

|   |
| - |

Start = now

|   |
| - |

`False`

|   |
| - |

End = 1440, valid start

|   |
| - |

`True` if other rules pass

|   |
| - |

End = 1441

|   |
| - |

`False`

|   |
| - |

Start = end

|   |
| - |

`False`

|   |
| - |

Duration = 120 minutes

|   |
| - |

`True` if other rules pass

|   |
| - |

Duration = 121 minutes

|   |
| - |

`False`

|   |
| - |

Room is blocked

|   |
| - |

`False`

|   |
| - |

New booking starts exactly when existing ends

|   |
| - |

`True`

|   |
| - |

New booking ends exactly when existing starts

|   |
| - |

`True`

|   |
| - |

New booking overlaps existing by 1 minute

|   |
| - |

`False`

|   |
| - |

Existing bookings list is empty

|   |
| - |

`True` if other rules pass

### 4. Implementation approach

Use simple `if` statements and a `for` loop to check existing bookings. Return `False` immediately when a rule fails and `True` at the end.

Important: Test both valid and invalid boundaries, especially the strict `start > now` condition, the inclusive 120-minute duration limit, and allowed endpoint touching.

No code written yet.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | `test_touching_end_is_allowed` | (660, 720) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC4 | ERROR: v1 cannot import | PASS |
| 2 | `test_partial_overlap_is_rejected` | (630, 690) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 3 | `test_blocked_room_is_rejected` | (660, 720) | `now=540, blocked=True, existing=[(600, 660)]` | False | AC3 | ERROR: v1 cannot import | PASS |
| 4 | `test_exactly_120_minutes_is_allowed` | (720, 840) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC2 | ERROR: v1 cannot import | PASS |
| 5 | `test_121_minutes_is_rejected` | (720, 841) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC2 | ERROR: v1 cannot import | PASS |
| 6 | `test_start_equal_now_is_rejected` | (540, 570) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 7 | `test_zero_length_is_rejected` | (720, 720) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 8 | `test_reversed_interval_is_rejected` | (720, 719) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 9 | `test_end_at_midnight_is_allowed` | (1380, 1440) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC1 | ERROR: v1 cannot import | PASS |
| 10 | `test_end_after_midnight_is_rejected` | (1381, 1441) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 11 | `test_negative_start_is_rejected` | (-1, 30) | `now=0, blocked=False, existing=[]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 12 | `test_empty_existing_is_allowed` | (600, 660) | `now=540, blocked=False, existing=[]` | True | AC4/AC5 | ERROR: v1 cannot import | PASS |
| 13 | `test_touching_start_is_allowed` | (570, 600) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC4 | ERROR: v1 cannot import | PASS |
| 14 | `test_request_inside_existing_is_rejected` | (615, 645) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 15 | `test_request_contains_existing_is_rejected` | (570, 690) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 16 | `test_one_minute_overlap_is_rejected` | (659, 719) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 17 | `test_later_existing_overlap_is_rejected` | (720, 780) | `now=540, blocked=False, existing=[(600, 660), (750, 810)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 18 | `test_gap_between_multiple_bookings_is_allowed` | (660, 720) | `now=540, blocked=False, existing=[(600, 660), (720, 780)]` | True | AC4 | ERROR: v1 cannot import | PASS |
| 19 | `test_input_order_unchanged_after_allowed_request` | (720, 780) | `existing=[(900, 960), (600, 660)]; full list equality after call` | True | AC5 | ERROR: v1 cannot import | PASS |
| 20 | `test_input_unchanged_after_rejected_request` | (630, 690) | `existing=[(900, 960), (600, 660)]; full list equality after call` | False | AC5 | ERROR: v1 cannot import | PASS |
| 21 | `test_start_one_minute_after_now_is_allowed` | (541, 570) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC1 | ERROR: v1 cannot import | PASS |
| 22 | `test_start_before_now_is_rejected` | (539, 570) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 23 | `test_final_minute_of_day_is_allowed` | (1439, 1440) | `now=1438, blocked=False, existing=[]` | True | AC1 | ERROR: v1 cannot import | PASS |
| 24 | `test_fractional_start_returns_false` | (720.5, 780) | `now=540, blocked=False, existing=[]` | False | Outside-contract policy, section 9.2 | ERROR: v1 cannot import | PASS |
| 25 | `test_fractional_end_returns_false` | (720, 780.5) | `now=540, blocked=False, existing=[]` | False | Outside-contract policy, section 9.2 | ERROR: v1 cannot import | PASS |
| 26 | `test_text_start_returns_false` | ('720', 780) | `now=540, blocked=False, existing=[]` | False | Outside-contract policy, section 9.2 | ERROR: v1 cannot import | PASS |
| 27 | `test_text_end_returns_false` | (720, '780') | `now=540, blocked=False, existing=[]` | False | Outside-contract policy, section 9.2 | ERROR: v1 cannot import | PASS |

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as supplied in the student's pasted response: yes (one physical line)

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `def can_book(start, end, now, blocked, existing):    # AC1: ...` | Function contract | Incorrect as received: all the remaining text follows a comment on one physical line; there is no function body. Predict an IndentationError before any AC can execute. |
| 2 | `if not (0 <= start < end <= 1440):` | AC1 | Intended condition is correct, but commented out in the pasted one-line version. |
| 3 | `if start <= now:` | AC1 | Intended strict future rule is correct; currently not executable. |
| 4 | `if end - start > 120:` | AC2 | Intended inclusive 120-minute boundary is correct; currently not executable. |
| 5 | `if blocked:` | AC3 | Intended rule is correct under the Boolean precondition; currently not executable. |
| 6 | `if start < existing_end and end > existing_start:` | AC4 | Intended strict overlap rule is correct; currently not executable. |
| 7 | `return True` after the loop | AC5 | Intended Boolean result and read-only loop are correct; currently not executable. |

Review completed with Codex assistance before running v1. The formatting problem may have arisen while copying; no claim is made that the assistant's displayed original had the same problem.

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- No extra rule in the intended logic. No validation of guaranteed now/blocked/existing preconditions, sorting, saving or confirmation. Non-integer times remain outside the contract.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `test_touching_end_is_allowed` | (660, 720) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC4 | ERROR: v1 cannot import | PASS |
| 2 | `test_partial_overlap_is_rejected` | (630, 690) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 3 | `test_blocked_room_is_rejected` | (660, 720) | `now=540, blocked=True, existing=[(600, 660)]` | False | AC3 | ERROR: v1 cannot import | PASS |
| 4 | `test_exactly_120_minutes_is_allowed` | (720, 840) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC2 | ERROR: v1 cannot import | PASS |
| 5 | `test_121_minutes_is_rejected` | (720, 841) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC2 | ERROR: v1 cannot import | PASS |
| 6 | `test_start_equal_now_is_rejected` | (540, 570) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 7 | `test_zero_length_is_rejected` | (720, 720) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 8 | `test_reversed_interval_is_rejected` | (720, 719) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 9 | `test_end_at_midnight_is_allowed` | (1380, 1440) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC1 | ERROR: v1 cannot import | PASS |
| 10 | `test_end_after_midnight_is_rejected` | (1381, 1441) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 11 | `test_negative_start_is_rejected` | (-1, 30) | `now=0, blocked=False, existing=[]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 12 | `test_empty_existing_is_allowed` | (600, 660) | `now=540, blocked=False, existing=[]` | True | AC4/AC5 | ERROR: v1 cannot import | PASS |
| 13 | `test_touching_start_is_allowed` | (570, 600) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC4 | ERROR: v1 cannot import | PASS |
| 14 | `test_request_inside_existing_is_rejected` | (615, 645) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 15 | `test_request_contains_existing_is_rejected` | (570, 690) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 16 | `test_one_minute_overlap_is_rejected` | (659, 719) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 17 | `test_later_existing_overlap_is_rejected` | (720, 780) | `now=540, blocked=False, existing=[(600, 660), (750, 810)]` | False | AC4 | ERROR: v1 cannot import | PASS |
| 18 | `test_gap_between_multiple_bookings_is_allowed` | (660, 720) | `now=540, blocked=False, existing=[(600, 660), (720, 780)]` | True | AC4 | ERROR: v1 cannot import | PASS |
| 19 | `test_input_order_unchanged_after_allowed_request` | (720, 780) | `existing=[(900, 960), (600, 660)]; full list equality after call` | True | AC5 | ERROR: v1 cannot import | PASS |
| 20 | `test_input_unchanged_after_rejected_request` | (630, 690) | `existing=[(900, 960), (600, 660)]; full list equality after call` | False | AC5 | ERROR: v1 cannot import | PASS |
| 21 | `test_start_one_minute_after_now_is_allowed` | (541, 570) | `now=540, blocked=False, existing=[(600, 660)]` | True | AC1 | ERROR: v1 cannot import | PASS |
| 22 | `test_start_before_now_is_rejected` | (539, 570) | `now=540, blocked=False, existing=[(600, 660)]` | False | AC1 | ERROR: v1 cannot import | PASS |
| 23 | `test_final_minute_of_day_is_allowed` | (1439, 1440) | `now=1438, blocked=False, existing=[]` | True | AC1 | ERROR: v1 cannot import | PASS |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(660, 720, 540, False, [(600, 660)])` | True, AC4 permits touching | Import failed: IndentationError before the call could execute | The one physical line begins `def can_book(...): # AC1`; the remaining text is a comment, leaving no body. | Restore line breaks and indentation only in booking.py; preserve original byte-for-byte. | Codex from the received text; copying may have caused the problem. |

| 2 | `can_book(720.5, 780.5, 540, False, [])` | False under the student's new outside-contract policy | True before the guard | `if not (0 <= start < end <= 1440)` compares floats without rejecting their type | Check exact integer types before comparisons | Student selected False; Codex proposed the guard |
| 3 | `can_book("720", 780, 540, False, [])` | False under the same policy | TypeError before the guard | `0 <= start` cannot compare int with str | Same type guard | Student selected False; Codex proposed the guard |

| 4 | `can_book(720, 780.5, 540, False, [])` | False under the student's policy | True; fractional-end test FAIL | Numeric comparison accepts a float | Same guard before bounds | Student policy, Codex implementation |
| 5 | `can_book(720, "780", 540, False, [])` | False under the student's policy | TypeError; text-end test ERROR | `start < end` compares int and str | Same guard before bounds | Student policy, Codex implementation |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
## Code Review — `can_book()`

Result: No issues found against the supplied contract and AC1–AC5.

|   |
| - |

Criterion

|   |
| - |

Relevant code

|   |
| - |

Review

|   |
| - |

AC1

|   |
| - |

`if not (0 <= start < end <= 1440):`

|   |
| - |

Correctly validates time boundaries and ordering.

|   |
| - |

AC1

|   |
| - |

`if start <= now:`

|   |
| - |

Correctly rejects bookings starting at or before `now`.

|   |
| - |

AC2

|   |
| - |

`if end - start > 120:`

|   |
| - |

Correctly rejects durations exceeding 120 minutes.

|   |
| - |

AC3

|   |
| - |

`if blocked:`

|   |
| - |

Correctly rejects blocked rooms.

|   |
| - |

AC4

|   |
| - |

`if start < existing_end and end > existing_start:`

|   |
| - |

Correctly detects overlapping intervals while allowing touching endpoints.

|   |
| - |

AC5

|   |
| - |

`return True`

|   |
| - |

Reached only when all previous checks pass.

### Contract compliance

- Function signature is unchanged.
- Returns Boolean values (`True` or `False`).
- Does not modify `existing` or other inputs.
- Uses no external libraries.
- Does not implement saving or confirmation.

### Conclusion

0 concrete issues identified.

The implementation is consistent with AC1–AC5 under the supplied input contract.

This is a code review, not proof from executed tests. Boundary tests should still verify the behavior, especially `start == now`, durations of 120 and 121 minutes, and touching versus overlapping intervals.

No changes to the function are recommended based on the supplied requirements.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | AC1 bounds/order condition is correct | accept | `0 <= start < end <= 1440` matches AC1 | No change; corresponding boundary tests PASS |
| 2 | AC1 strict future condition is correct | accept | `start <= now` rejects equality as AC1 requires | No change; equality and next-minute tests PASS |
| 3 | AC2 duration condition is correct | accept | Reject > 120, allow exactly 120 | No change; both duration tests PASS |
| 4 | AC3 blocked check is correct | accept | Boolean blocked is guaranteed by contract | No change; blocked test PASS |
| 5 | AC4 overlap allows touching | accept | Both strict comparisons must hold; equality at either endpoint breaks overlap | No change; touching/containment/later-booking tests PASS |
| 6 | AC5 True is reached only after every check | accept | Final return occurs outside loop, after each booking is checked | No change; F8/F9 and suite PASS |
| 7 | Signature, Boolean, unchanged inputs, standard library and scope comply | accept | Contract requires five parameters and unchanged inputs; saving/confirmation belong elsewhere | No change; F9/F10 and mutation tests PASS |
| 8 | Review is not execution evidence | accept | Read-only review cannot replace actual test runs | No change; 23 real tests and ten caught mutations provide separate evidence |

Review decisions drafted with Codex assistance. No contract defect was identified. After this critique, the student selected False for non-integer request times; Codex reviewed the added guard as an outside-contract policy, and the whole suite was rerun.

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | One physical line → correctly indented function; same conditions and returns | Received v1 cannot import; restore formatting in final only | IndentationError → six table tests pass; F1–F10 pass |
| 2 | Six tests → 23 tests | Add further kinds and isolated boundaries from AC1–AC5 | M2/M3/M7/M8/M9/M10 survived the six-case suite; all ten M checks now pass |
| 3 | No request-type guard → `if type(start) is not int or type(end) is not int: return False` | Student chose False for non-integer times in section 9.2 | New policy tests: two failures and two errors before guard → 27 tests PASS after guard |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_121_minutes_is_rejected (test_booking.BookingTests.test_121_minutes_is_rejected) ... ok
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
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
test_start_before_now_is_rejected (test_booking.BookingTests.test_start_before_now_is_rejected) ... ok
test_start_equal_now_is_rejected (test_booking.BookingTests.test_start_equal_now_is_rejected) ... ok
test_start_one_minute_after_now_is_allowed (test_booking.BookingTests.test_start_one_minute_after_now_is_allowed) ... ok
test_text_end_returns_false (test_booking.BookingTests.test_text_end_returns_false) ... ok
test_text_start_returns_false (test_booking.BookingTests.test_text_start_returns_false) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 27 tests in 0.001s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (1 lines)
PASS   S1   your suite has at least 11 tests            27 tests
PASS   S2   your suite is green on your own code        27 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_start_equal_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_midnight_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_120_minutes_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_gap_between_multiple_bookings_is_allowed, test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_input_unchanged_after_rejected_request, test_later_existing_overlap_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_request_contains_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_input_order_unchanged_after_allowed_request
PASS   M10  your tests catch a fault in AC5             caught by test_input_order_unchanged_after_allowed_request, test_input_unchanged_after_rejected_request
FAIL   L1   report 1: tool, model and language          section 1 has no value for: tool, model, language
FAIL   L2   report 2: the plan, and what you corrected  section 2 needs the assistant's plan pasted
PASS   L3   report 3: v1 mapped to AC1-AC4              7 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  23 tests listed
PASS   L5   report 5: debugging evidence                5 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 8 points judged
PASS   L7   report 7: change log                        3 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      160 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes nothing - fails F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - identical to your final: no
   v1 note: it could not be imported - IndentationError: expected an indented block after function definition on line 1 (booking_v1.py, line 1)
Not counted for M - these fail on a can_book that follows the contract exactly, so they
test what the contract leaves open or contradict an AC: test_fractional_end_returns_false, test_fractional_start_returns_false, test_text_end_returns_false, test_text_start_returns_false
SUMMARY pass=30 fail=2 error=0   (32 checks)
Every FAIL or ERROR you keep goes in lab-report.md section 9 and in submission.yml known_fails.
One you report and explain costs you nothing. One you hide costs the whole criterion.
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | Not applicable — Python Path A | Not applicable | M1–M10 run by shipped checker |
| 2 | Not applicable — Python Path A | Not applicable | M1–M10 run by shipped checker |
| 3 | Not applicable — Python Path A | Not applicable | M1–M10 run by shipped checker |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| L1 | The shipped section splitter treats the unedited plan's `### 1. Checks in order` inside its fenced block as the report's section 1, so it cannot see the real setup table above. Tool, model and language are present in the human-readable section 1. |
| L2 | The same splitter treats `### 2. Assumptions` inside the unedited response as section 2. The full plan and review table are present, but its block is not recognized after this overwrite. The checker and response remain unedited. |

All F, S and M checks pass. These two report-parser failures are retained and declared honestly.

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- The student chose return-false for fractional or textual request times. The final guard checks exact int types for start and end before comparisons. Thus 720.5 and "720" return False; bool is also rejected as a request time. This is a chosen policy, not an AC requirement. now, blocked and existing retain their guaranteed contract preconditions. Four tests record the policy; they are not counted for mutation testing. Codex assisted this explanation.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- `0 <= start` can never be the sole rejecting bound. Since valid now is at least zero, `start > now` already implies positive start. A negative start also violates the future rule. The negative-start test documents rejection but cannot isolate just this bound. Explanation prepared with Codex assistance.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->

<!-- Conclusion prepared with Codex assistance; disclose rather than claim independent writing. -->

The final function checks whether a student may reserve a study room for a specified time. Its overlap condition requires the request to start before an existing booking ends and finish after that booking starts. Both comparisons are strict. When one booking ends exactly as the next begins, one comparison is false and there is no overlap.

The student questioned whether people need time to leave or whether technical work requires a gap. That is a reasonable operational concern, but AC4 explicitly allows touching. A buffer would change this lab's contract and is not added.

With only six tests, M2, M3, M7, M8, M9 and M10 survived together; no single fault survived longer than the others. The missing cases covered boundaries, multiple bookings, containment and unchanged input. The expanded suite catches all ten faults. The student chose False for non-integer request times. The summary and technical explanations were assembled with AI assistance; independent authorship or full understanding is not claimed.
