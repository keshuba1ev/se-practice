# Week 01 — Manual vs AI: Comparison

**Name:**
**Group:**
**Date:**

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | Next.js + TypeScript (chosen by AI)
| Time to first version that ran | ~ 30-40min | ~5-10min
| Time to all 4 test cases passing |  ~ 10min
| Number of attempts / prompts needed | 2 prompts (initial prompt + 1 follow-up fix)
| Lines of code you actually wrote | 47 lines
| Did it handle invalid marks (case B)? | Yes | No — UI blocks invalid input before it reaches processing logic
| Did it handle an empty list (case D)? | Yes |	Yes
| Did it use the ≥ 50 pass threshold? | Yes, fixed | Yes, but configurable (not fixed as spec requires)
| Output format matches the spec? | Yes | No — average shown as 1 decimal in top KPI card
| Can you explain every line of it? | Yes | No — never saw the underlying code

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | avg 67.00 · high 92 · low 23 · pass 60.0% | avg 67.00, high 92, low 23, pass 60.0%	| avg 67.0, high 92, low 23, pass 60.0%	| Partial — formatting off
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | | | avg 71.60 · high 100 · low 47 · pass 80.0% | avg 71.60, high 100, low 47, pass 80.0% | could not enter -5/101/abc	| No
| C | `10, 20, 30` | | | avg 20.00 · high 30 · low 10 · pass 0.0% | avg 20.00, high 30, low 10, pass 0.0% | avg 20.0, high 30, low 10, pass 0.0% | Partial — formatting off
| D | `abc, , xyz` | | | clear message, no crash | clear message, no crash | "No results to display" | Yes

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->

-Tech stack (Next.js + TypeScript)
-Full dashboard UI instead of console program
-Median, standard deviation, configurable pass threshold
-Charts, sortable table, batch import, KPI cards

## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

-Average displayed with 1 decimal instead of 2 (spec requires 2)
-Input field blocks -5/101/abc entirely — validation happens at UI level, not during processing, contradicting the spec's requirement to "ignore invalid values silently, don't crash"

## 5. The defect I asked Rocket to fix

**Prompt I used:** "The average score should be displayed with exactly 2 decimal places (e.g. 67.00, not 67.0). Please fix the formatting."

**Result:** (fixed / partly fixed / broke something else) partly fixed — Statistical Summary panel corrected, top KPI card still wrong

**What this tells me:** What this tells you: a natural-language fix prompt doesn't guarantee the AI finds every place the same value is rendered; it patched one component, not the underlying logic globally

---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?

<!-- Write your reflection below this line -->

Overall, the AI sped things up and produced more polished, professional-looking work — building the UI, dashboard, and charts in seconds; doing this manually would have taken much longer.
The AI still doesn't always work exactly the way you need — for example, it spent no time asking clarifying questions ("no clarifying questions asked"), and it later turned out that the validation was wrong and couldn't even be tested through the UI. Similarly, the rounding bug looked minor, but the fix was still incomplete and didn't fully meet the requirements.
I understand my Python script line by line and can explain the logic behind it, while I never even saw Rocket's code — I only used the dashboard it generated.
The engineer remains responsible for testing edge cases, verifying compliance with the specification, and understanding what is actually being generated and how it works.