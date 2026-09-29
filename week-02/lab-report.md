# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Abylai Keshubaev  
**Group:** Not supplied  
**Date:** 2026-09-30

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | ChatGPT |
| Exact model name | GPT-6 Astra (Лёгкое) |
| Implementation language | Python |
| Date of the runs | 2026-09-30 (Almaty, Kazakhstan) |

**Non-Python substitutions:** n/a — used Python.

**Confirmations:** Each prompt was sent in a fresh chat: yes. No follow-up questions during A–D: yes. The code blocks were copied into `code/` without editing, including the tests in C and D. I noted the models' explanations and assumptions in the sections below.

## 2. Prompt A — minimal

**Prompt sent:**

```text
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it:**

1. Input is a dictionary mapping student names to lists of marks; subjects have equal weight.
2. A letter grade scale is needed, with A beginning at 90 and F below 60.
3. A printed class report and sample student records are wanted; marks range from 0 to 100.

**Questions it should have asked and did not:** What input shape and output keys are required? What threshold and error behavior should be used?

**Is the function named `analyze_marks` with the required signature?** Name: yes; signature: no — it is `analyze_marks(students)` with no `pass_mark`.

**First impression before testing:** The printed student report does not match the requested four-value dictionary.

**Response context:** The reply described averages, letter grades, a class average, and top students; it said to replace sample names and marks. Its code block is saved unchanged in `code/prompt_a.py`.

## 3. Prompt B — structured context

**Prompt sent:**

```text
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:** The name and two-argument signature now match; it returns the required four dictionary keys. Empty, nonnumeric, and out-of-range marks explicitly raise ValueError.

**What B still leaves open:** The prompt does not specify whether `pass_rate` is a 0–100 percentage rounded to two decimals; B produced `66.66666666666666` in case 1. It does not say whether booleans and nonfinite values count as numbers, nor how `pass_mark` is validated. B's response explained that it excludes booleans and validates the threshold.

## 4. Prompt C — examples and tests

**What I appended to Prompt B** (the full sent prompt was B followed by this text):

```text
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes, but expects TypeError |
| below 0 / above 100 | yes, both |

**Do the AI's own tests pass against the AI's own code?** Yes — 9 tests, `OK` (`python code/prompt_c.py`).

**Do they agree with the harness in section 6?** No. C's text test expects TypeError; the independent case 5 requires ValueError and reports ERROR. Its stated assumptions explicitly claim text and booleans raise TypeError, while the original task requires ValueError for nonnumeric values.

**Assumptions C stated explicitly before the code:** Python and dictionary output; finite marks and threshold in 0–100; equality passes; threshold 50; only `pass_rate` rounded to two decimals. It separated TypeError for nonnumeric input and ValueError for empty/out-of-range input. The source code and its nine tests remain unedited in `code/prompt_c.py`.

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message sent to a fresh chat):

```text
You are a Python developer. Implement analyze_marks(marks, pass_mark=50) for a list of student marks. Return a dictionary with exactly these keys: average (arithmetic mean), highest, lowest, and pass_rate (percentage of marks >= pass_mark, rounded to two decimal places). Accept finite int or float marks from 0 to 100; booleans are invalid. Raise ValueError for an empty list, any non-numeric mark (including text and bool), or any mark outside 0 to 100. Apply the same numeric and range validation to pass_mark. Use only the Python standard library. Do not print results or run example code on import.

Example: analyze_marks([40, 60, 80], 50) returns {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}.

State assumptions before the code. Include runnable tests for the example, one mark, decimals, a custom pass_mark, empty input, a text mark, and marks below 0 or above 100. The text-mark test must expect ValueError. Return the implementation, tests, and a short explanation.
```

**What I deliberately added that A, B and C did not have:**

1. One deliberate exception type, ValueError, including for text and boolean marks (fixes C's case 5).
2. A percentage rounded to exactly two decimal places, despite the harness's 0.01 tolerance.
3. An exact four-key dictionary, finite numeric inputs, validated threshold, and no output at import time.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:** Case 1 expects 66.67, but the harness accepts 66.66666666666666 within tolerance. D explicitly asks for `pass_rate` rounded to two decimal places; `average` is left unrounded.

## 6. Test results — the evidence

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | ValueError | ERROR | PASS | ERROR | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | **0/6** | **6/6** | **5/6** | **6/6** |

**For every FAIL and ERROR:** A cases 1–6 raised `TypeError: analyze_marks() takes 1 positional argument but 2 were given`. C case 5 raised `TypeError: Each mark must be a number` instead of ValueError. There were no FAIL verdicts.

### Pasted terminal output — all four runs

**Prompt A**

```text
Student               Average  Grade
------------------------------------
Charlie                 95.00      A
Alice                   84.33      B
Bob                     73.33      C
Diana                   68.33      D

Class average: 80.25
Top student(s): Charlie
Highest average: 95.00
========================================================================
analyze_marks harness — code/prompt_a.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  ERROR  analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 2  ERROR  analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 3  ERROR  analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 4  ERROR  analyze_marks([], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 5  ERROR  analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 6  ERROR  analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
RESULT  0 PASS · 0 FAIL · 6 ERROR   (code/prompt_a.py)
========================================================================
```

**Prompt B**

```text
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numbers from 0 to 100
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numbers from 0 to 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================
```

**Prompt C**

```text
========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  ERROR  analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: Each mark must be a number
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Each mark must be between 0 and 100
------------------------------------------------------------------------
RESULT  5 PASS · 0 FAIL · 1 ERROR   (code/prompt_c.py)
========================================================================
```

**Prompt D**

```text
========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: mark must be an int or float
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark must be finite and between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================
```

## 7. Scoring

| Criterion | A | B | C | D |
| --- | ---: | ---: | ---: | ---: |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 1 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 2 | 1 | 2 | 2 |
| Noise (2 = none) | 0 | 2 | 2 | 2 |
| **Total / 10** | **2** | **7** | **9** | **10** |

**Prompt length, in words:** A 7 · B 44 · C 84 · D 153. C counts the full B text plus the appended example.

**Words added per point gained:** B over A: 37 words / 5 points = 7.4; C over B: 40 / 2 = 20.0; D over C: 69 / 1 = 69. B bought the biggest gain per added word; D resolved the regression and the rounding ambiguity.

## 8. Conclusion — 150–200 words

Prompt D scored highest, 10/10, and I would use it at work: it defines the implementation contract and checks the error type. Prompt B already passed all six harness cases and was shorter, so if I needed only the smallest passing request, B would be enough. The single addition with the clearest correctness benefit was explicitly requiring ValueError for a text mark in D. C used TypeError, making case 5 an ERROR; D changed that case to PASS while retaining the other five passes. Moving from A to B also mattered: the exact signature fixed A's six TypeError results, including case 1, where A accepted only one argument and printed a student report. C added tests for boundaries and invalid thresholds, which were useful checks, but the extra grading-scale and sample-student output in A were pure noise for this task. The specification's ambiguity was whether pass_rate had to equal 66.67 exactly or merely be within the harness tolerance of 0.01. B returned 66.66666666666666 for case 1 and still passed. D explicitly requires rounding pass_rate to two decimal places; it returned 66.67. C's own nine tests passed despite its case 5 ERROR, showing why the independent harness was necessary.

**Word count:** 198

## 9. Two questions for the debrief

1. Should a grading harness with tolerance 0.01 accept an unrounded percentage when the example shows two decimals?
2. How can test authors ensure that their expected exception type comes from the task contract rather than from their own implementation?
