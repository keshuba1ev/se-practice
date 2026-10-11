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

~~~~text
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
~~~~

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | No invented rule found: checks 1–5 | AC1 bounds/future; AC2 duration; AC3 blocked; AC4 strict overlap; AC5 Boolean and unchanged inputs | Keep the plan; contract preconditions are assumptions, not extra validation. |

**Boundary cases the assistant suggested that I kept as tests:**

- Planned cases: start equals now and now + 1; durations 120 and 121; end 1440 and 1441; zero length; touching at both ends; one-minute overlap; blocked room; empty existing.
- Start = 0, now = 0 is rejected by the future rule too, so it cannot isolate the lower day bound.
- Review performed with Codex assistance before implementation; student independent review is not claimed.

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
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(660, 720, 540, False, [(600, 660)])` | True, AC4 permits touching | Import failed: IndentationError before the call could execute | The one physical line begins `def can_book(...): # AC1`; the remaining text is a comment, leaving no body. | Restore line breaks and indentation only in booking.py; preserve original byte-for-byte. | Codex from the received text; copying may have caused the problem. |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

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
