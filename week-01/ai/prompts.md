# Rocket — Prompt Log

## Initial prompt (exact, as given in README)

Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.

## Rocket's reaction

Agent detected prompt score: 80%
No clarifying questions were asked — Rocket proceeded directly to building.

Rocket's own description of what it would build:
"Building a student marks dashboard with Next.js and TypeScript — it'll let you
input a list of marks and instantly display average, highest, lowest, and pass
rate in a clean, readable view."

## What Rocket built ("What I did")

- Built a Student Marks Processor with real-time stats: average, highest, lowest,
  pass rate, median, and standard deviation with configurable pass threshold
- Added grade distribution bar chart, score range histogram, and a sortable
  results table with student rankings
- Included batch import modal for adding multiple student marks at once, with
  color-coded KPI cards for quick insights

## What Rocket added that was NOT requested

- Tech stack: Next.js + TypeScript (never specified)
- Full web dashboard/UI instead of a simple console program
- Extra statistics: median, standard deviation
- Configurable pass threshold (spec requires a fixed threshold of 50)
- Charts: grade distribution bar chart, score histogram
- Sortable results table with student rankings
- Batch import modal, KPI cards

## Screenshots

- screenshots/01_prompt_and_result.png
- screenshots/02_test_a_result.png
- screenshots/03_invalid_input.png
- screenshots/04_test_c_result.png
- screenshots/05_empty_list_handled.png
- screenshots/06_test_c_after_fix_prompt.png

## Test results (same 4 cases as Part 1)

### Test A: 85, 23, 45, 90, 92
Expected: Valid 5, Average 67.00, Highest 92, Lowest 23, Pass rate 60.0%
Got: Valid 5, Average 67.0, Highest 92, Lowest 23, Pass rate 60.0%
Mismatch: average shown with 1 decimal instead of 2

### Test B: 88, 47, -5, 101, abc, 73, 50, , 100
Could not fully test — the Mark input field has type="number" with
min=0/max=100, so -5, 101, and abc cannot be entered into the UI at all.
The app blocks invalid input at entry instead of filtering it during
processing, which does not match the specification.

### Test C: 10, 20, 30
Expected: Valid 3, Average 20.00, Highest 30, Lowest 10, Pass rate 0.0%
Got: Valid 3, Average 20.0, Highest 30, Lowest 10, Pass rate 0.0%
Mismatch: same formatting bug as Test A

### Test D: abc, , xyz (empty valid list)
Expected: clear message, no crash
Got: "No results to display" with helpful guidance — correct, no crash

## Second Prompt

Prompt: "The average score should be displayed with exactly 2 decimal places
(e.g. 67.00, not 67.0). Please fix the formatting."

Result: PARTIALLY fixed.
- Statistical Summary panel → MEAN: now shows 20.00 (correct, 2 decimals)
- Top KPI card → AVERAGE SCORE: still shows 20.0 (unfixed, 1 decimal)

The same value is rendered by two different UI components, and the AI only
patched the formatting logic in one of them. This shows that a natural-language
fix prompt does not guarantee the AI understands (or searches) the full
codebase — it likely edited the component it inferred was "the" average display,
missing a duplicate render path elsewhere.