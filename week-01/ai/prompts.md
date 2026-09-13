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

- screenshots/01_prompt_and_result.png — initial prompt + Rocket's build summary

## Second Prompt

The average score should be displayed with exactly 2 decimal places
(e.g. 67.00, not 67.0). Please fix the formatting.

## Follow-up fix attempt

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