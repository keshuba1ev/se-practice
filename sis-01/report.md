# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.1

## 1. Scenario

**Question:** What must a teacher receive beyond working code to use a small marks analyzer reliably?

**Users:** A university teacher who needs a summary of student marks.

**Problem:** The teacher needs average, highest, lowest and pass rate, but a program alone may be difficult to run or its calculation rules may be unclear.

**Constraints:** Development takes one day; the scope contains only these four indicators.

**Risk:** An incorrect pass rate could misrepresent results. Tests with answers calculated manually will help detect this.

**Assumptions:** This teacher, project and deadline are fictional. Marks range from 0 to 100. The passing threshold and rounding rules must be agreed before implementation. The program is a small Python tool rather than a complete university grading system.

## 2. Analysis

For this project, delivery should let the teacher run the analyzer, understand its rules and check its results. I propose a small package containing the Python file, a README, examples, documented rules, test cases and a test report. These are planned deliverables; this assignment does not implement the analyzer or provide executed calculation tests.

My first engineering decision is to prioritize a simple script over extra features. The one-day constraint makes testing and documentation compete with interface development. A graphical interface might be possible, but it is not automatically the best use of limited time. The disadvantage is that a teacher unfamiliar with the command line may struggle. Before delivery, the developer should check the teacher's environment and demonstrate the agreed launch procedure. Python documentation describes execution of a script by supplying its filename [1]; it does not prove this teacher has Python installed.

My second decision is to reject invalid input rather than silently remove it. Dropping an invalid mark could change the denominator and produce a misleading pass rate. Accept numeric marks from 0 to 100, inclusive; reject an empty list, text and out-of-range values. The error should identify the problematic value and explain that a numeric mark between 0 and 100 is required. This is my improvement to the AI's general phrase about clear errors: teachers may need practical guidance on correcting their input.

The passing threshold and rounding must be agreed and recorded. Propose passing when a mark is at least the threshold. Use 50 only as an example, and round displayed results after calculating them. For marks 40, 50, 70 and 90, a threshold of 50 gives three passes out of four, or 75%. This is a manually calculated example, not an executed test result.

Test normal cases, endpoints, the passing boundary and rejected inputs. Python's unittest example provides equality and exception assertions [2]. A report should record inputs, expected outputs, actual outputs and status. Passing these tests increases confidence only for checked cases. Finally, provide a defect-reporting procedure that requests a reproducible example and the program version. Agree support responsibilities separately instead of promising unlimited maintenance within a one-day project.

## 3. Review

I accepted the critique's request for concrete deliverables, reasons for documentation and visible test evidence. An instruction is useful only if the teacher can follow it. Expected and actual results should therefore be recorded separately. I also accepted normal, boundary and invalid-input categories rather than the vague phrase basic testing.

The strongest issue for me was predictable handling of errors and rounding. My own revision is that an error must explain what the teacher should enter, because the teacher may not understand the program. Change-log row 1 turns this into actionable input guidance. Row 2 adds a separate launch demonstration: a written README alone does not establish usability.

I accepted the concern about confirmed requirements and replaced that wording with scenario requirements. I accepted clearer labelling of 50 as an example, although A already introduced it with if. I accepted the deadline correction, the uncertainty about customer priorities, Python installation and interface acceptance, and the warning against treating manual checks as complete coverage. Empty input, invalid marks, rounding, inclusive boundaries and threshold equality all need explicit decisions. The critique's summary recommendations repeat these concerns and are accepted for those same reasons.

Verification row 1 supports a launch procedure but does not establish a universal documentation obligation. Row 2 supports equality and exception checks but cannot prove that this analyzer has been tested. I opened both sources; the assistant helped locate and explain the relevant passages. No fictional customer approval or actual calculation test output is claimed.

The initial outline was adapted from AI examples, which is disclosed. W6 remains if my own reflection is short. E7 remains until the exact Prompt B message is confirmed; I will not invent a pasted draft.

## 4. Conclusion

I recommend delivering a small, documented and testable analyzer rather than treating a Python file as a complete handover. The package should explain launch steps, accepted inputs, agreed formulas and rounding, then provide examples and actual test evidence when implementation exists. Error messages should help a teacher correct input instead of simply reporting failure.

The main limitation is that this fictional customer's environment and priorities have not been confirmed. The one-day limit is a planning constraint, not evidence that every deliverable can be finished. Before accepting the software, the teacher should try the documented procedure and review the agreed calculation rules. Defect reporting and support boundaries should also be explicit. This report proposes that delivery process; it does not claim a completed or tested application.

## 5. Reflection

программа должна выводить ошибку потому что не все проподаватели польностью могут разбираться в программе в соответствии с этим нужна дополнительная помощь оповещение чтобы было понятно что именно стоит не стоит вводить в поле оценок

документация питон, промты мы уже тренируем на протяжении всех практик оно не заняло вопрос или трудностей

поиск разделов и в целом когда работаешь с незнакомым текстом трудно ориентироваться

особо ничего все равно нужно самому сидеть и все разбирать своими силами

## 6. References

- [1] Python Software Foundation. Using the Python Interpreter, section 2.1, Invoking the Interpreter. https://docs.python.org/3/tutorial/interpreter.html#invoking-the-interpreter. Accessed 2026-10-11.
- [2] Python Software Foundation. unittest — Unit testing framework, Basic example. https://docs.python.org/3/library/unittest.html#basic-example. Accessed 2026-10-11.

## 7. Appendix A — Initial outline

1. Вместе с программой преподаватель должен получить инструкцию по запуску
2. Заранее нужно согласовать диапазон оценок 0–100, проходной балл, округление результатов
3. Тестами нужно проверить правильность расчётов, оценку ровно на проходном пороге, пустой список
4. Для нашего вымышленного проекта я бы задал два ограничения: один день на разработку и только четыре показателя
5. Главный риск — неправильный процент сдавших; я бы уменьшил его тестами с заранее рассчитанными вручную ответами.

## 8. Appendix B — AI exchanges

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT (web)
- **Model:** GPT-6 (Instant)
- **Date:** 2026-10-11
- **Purpose:** contextual draft

**Prompt:**

~~~~text
Act as a software engineering tutor. Help me analyze topic 1.1 Professional software delivery: what must a customer receive beyond program code? for a first-year-level university assignment.

My scenario is a fictional university teacher who needs a Python marks analyzer returning average, highest, lowest and pass rate. The problem is that code alone may be difficult to run and its calculation rules may be unclear. The two constraints are one day for development and only four indicators. The main risk is an incorrect pass rate; tests with manually calculated expected answers should help detect it. Marks range from 0 to 100; the passing threshold and rounding rules must be agreed. My initial ideas are 1. Вместе с программой преподаватель должен получить инструкцию по запуску. 2. Заранее нужно согласовать диапазон оценок 0–100, проходной балл, округление результатов. 3. Тестами нужно проверить правильность расчётов, оценку ровно на проходном пороге, пустой список. 4. Для нашего вымышленного проекта я бы задал два ограничения: один день на разработку и только четыре показателя. 5. Главный риск — неправильный процент сдавших; я бы уменьшил его тестами с заранее рассчитанными вручную ответами. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
~~~~

**Response:**

~~~~text
Here is a first-year university-level draft (approximately 460 words), written in simple academic English and based on your five original answers.

# Topic 1.1 — Professional Software Delivery: What Must a Customer Receive Beyond Program Code?

## Introduction

Professional software delivery means giving the customer not only working code but also everything needed to use and understand the program. Even if a program works correctly, it may be difficult for a customer to run it without instructions. In our fictional project, the customer is a university teacher who needs a Python program to analyze students' marks. The program calculates four indicators: average mark, highest mark, lowest mark, and pass rate.

## What Should Be Delivered?

First, the teacher should receive the Python program together with a short instruction explaining how to run it. The instruction should mention the required Python version, how to provide marks, and how to understand the results. A few examples of input and output would also be useful.

Second, the teacher should receive an explanation of the calculation rules. We already know that marks must be between 0 and 100. However, the passing threshold and rounding rules must be agreed upon before development. For example, if the passing mark is 50, a student with exactly 50 points should be counted as passing. This rule must be clearly documented.

## Testing and Quality

Testing is another important part of professional software delivery. The program should be tested to check whether all four indicators are calculated correctly.

For example, if the marks are 40, 50, 70, and 90, and the passing threshold is 50, the expected pass rate is 75%. This result can be calculated manually and compared with the program's output.

Other important tests include an empty list, marks outside the allowed range, and a mark exactly equal to the passing threshold. These tests help identify errors before the teacher starts using the program.

## Constraints and Trade-offs

Our fictional project has two constraints: one day for development and only four indicators.

These constraints make the project simpler and easier to finish. However, they also create trade-offs. For example, we may not have enough time to develop a graphical interface or additional statistics. Instead, we can focus on correct calculations, simple instructions, and basic testing.

I think this is a reasonable decision because the teacher mainly needs reliable results rather than a complicated application.

## Main Risk

The main risk is an incorrect pass rate. This could happen if the program uses the wrong passing threshold or calculates the percentage incorrectly.

To reduce this risk, I would create tests with expected answers calculated manually. I would also test cases where students have marks exactly equal to the passing threshold.

## Facts, Assumptions, and Conclusion

The confirmed project requirements are the four indicators and the allowed marks range of 0–100. The one-day deadline and limited functionality are constraints chosen for this fictional project.

We assume that the teacher can run Python and that a simple program without a graphical interface is acceptable. These assumptions should be checked with the customer.

In conclusion, professional software delivery includes code, instructions, documented rules, and test results. These materials help the customer use the software correctly and trust its calculations.

## Claims to verify before submission

|   |
| - |

Claim or decision

|   |
| - |

What to check

|   |
| - |

Passing threshold is 50

|   |
| - |

Confirm whether 50 is the actual agreed threshold or only an example.

|   |
| - |

Rounding rules

|   |
| - |

Confirm how many decimal places to use for the average and pass rate.

|   |
| - |

Empty list

|   |
| - |

Decide whether the program should raise an error or return a special result.

|   |
| - |

Python environment

|   |
| - |

Confirm whether the teacher has Python installed and which version is required.

|   |
| - |

Delivery requirements

|   |
| - |

Check whether the assignment also requires a README, test files, or repository link.

Main trade-off: With only one day available, spending time on clear instructions and calculation tests is more valuable than adding extra features. This is a project decision, not a universal rule for every software project.

The draft distinguishes the scenario's requirements from proposed decisions and assumptions. It also uses a manually verifiable example rather than unsupported external claims.
~~~~

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT (web)
- **Model:** GPT-6 (Instant)
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

~~~~text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: Topic 1.1 — Professional software delivery: what must a customer receive beyond program code?
Scenario: A fictional university teacher needs a Python marks analyzer returning average, highest, lowest and pass rate. Code alone may be difficult to run and its calculation rules may be unclear. The constraints are one day for development and only four indicators. The main risk is an incorrect pass rate; tests with manually calculated expected answers should help detect it. Marks range from 0 to 100; the passing threshold and rounding rules must be agreed.
Draft:
~~~~

**Response:**

~~~~text
# Critical Review — Topic 1.1: Professional Software Delivery

I reviewed the draft from our previous message against your chosen question and fictional university teacher scenario.

Overall assessment: The draft answers the question and is appropriate for a first-year university assignment. However, it needs stronger reasoning about what the customer actually receives, clearer separation of requirements and assumptions, and more specific explanations of testing and trade-offs.

## 1. Inaccuracies and unclear statements

|   |
| - |

Concern

|   |
| - |

Why it matters

|   |
| - |

How to check it

|   |
| - |

Passing mark of 50 is used in an example without being agreed upon.

|   |
| - |

A reader might think 50 is an official requirement.

|   |
| - |

Confirm the threshold with the fictional customer or explicitly identify it as an example.

|   |
| - |

"Confirmed project requirements" suggests the requirements were approved by the teacher.

|   |
| - |

The scenario specifies requirements, but does not describe formal customer approval.

|   |
| - |

Distinguish scenario facts from requirements still needing customer agreement.

|   |
| - |

"The program should be tested" does not explain what test evidence is delivered.

|   |
| - |

Testing the program and giving the customer test results are different activities.

|   |
| - |

Decide whether to include a small test report with inputs, expected outputs, and actual outputs.

Counterexample: A program may correctly calculate a 75% pass rate when the threshold is 50, but produce an incorrect result if the teacher actually requires 60. The calculation is mathematically correct under one rule but wrong for the customer's needs.

## 2. Missing reasoning

### A. Why does the customer need documentation?

The draft says instructions should be provided but does not fully explain their value.

- Why it matters: Professional delivery should allow the customer to use the software without depending on the developer.
- How to check: Imagine giving the teacher only a `.py` file. Could they run it, enter marks, and interpret the results without asking questions?
- Alternative interpretation: If the program is integrated into an existing university system, separate installation instructions might not be necessary, but integration instructions could be.

### B. How will the customer know the program is correct?

The draft mentions testing but does not explain how the customer can evaluate the results.

- Why it matters: A successful test should compare an actual result with an independently calculated expected result.
- How to check: Create a small table containing test inputs, expected outputs, actual outputs, and pass/fail status.
- Counterexample: Testing only marks of 70, 80, and 90 would not reveal an error involving marks exactly equal to the passing threshold.

### C. What does the one-day deadline change?

The draft says there is not enough time for a graphical interface, but this is not necessarily true.

- Why it matters: A deadline creates priorities, not automatic technical limitations.
- How to check: Estimate how long implementation, testing, documentation, and optional features would take.
- Alternative interpretation: A developer could build a simple interface in one day but spend too little time checking the calculations.

## 3. Vague claims and unsupported assumptions

|   |
| - |

Draft statement

|   |
| - |

Problem

|   |
| - |

Better reasoning to investigate

|   |
| - |

"Everything needed to use and understand the program"

|   |
| - |

Too broad.

|   |
| - |

Identify specific deliverables: code, README, calculation rules, examples, and test results.

|   |
| - |

"Basic testing"

|   |
| - |

Does not identify test coverage.

|   |
| - |

Define normal, boundary, and invalid-input tests.

|   |
| - |

"Reliable results rather than a complicated application"

|   |
| - |

Assumes the teacher's priorities.

|   |
| - |

Ask whether accuracy, ease of use, or integration matters most.

|   |
| - |

"The teacher can run Python"

|   |
| - |

Unsupported assumption.

|   |
| - |

Check whether Python is installed and whether the teacher can use a command line.

|   |
| - |

"A simple program without a graphical interface is acceptable"

|   |
| - |

Not confirmed by the scenario.

|   |
| - |

Treat this as a proposed design choice requiring customer approval.

## 4. Important missing edge cases

The draft includes useful tests, but several decisions remain unclear.

1. Empty list: Should the program raise an error or return a special result? An average cannot be calculated normally from zero marks.
2. Invalid marks: What happens if a mark is -5, 105, or a string such as `"absent"`?
3. Rounding: Should a pass rate of 66.666...% become 66.67%, 66.7%, or 67%?
4. Boundary conditions: Are both 0 and 100 valid? Does a mark exactly equal to the threshold count as passing?

These cases matter because the customer needs predictable behavior, not just correct results for ordinary inputs.

## 5. Facts versus assumptions

|   |
| - |

Established by the scenario

|   |
| - |

Assumptions or decisions to verify

|   |
| - |

The customer is a fictional university teacher.

|   |
| - |

The teacher has Python installed.

|   |
| - |

The program calculates four indicators.

|   |
| - |

A command-line interface is acceptable.

|   |
| - |

Marks range from 0 to 100.

|   |
| - |

The passing threshold is 50.

|   |
| - |

Development is limited to one day.

|   |
| - |

The developer can complete all work in one day.

|   |
| - |

Incorrect pass rate is the main identified risk.

|   |
| - |

Manually calculated tests provide sufficient coverage.

|   |
| - |

Threshold and rounding rules need agreement.

|   |
| - |

The customer wants a separate test report.

## 6. Most important improvements for the next draft

I would prioritize these four changes:

1. Make the deliverables explicit. Explain what the teacher receives beyond the Python file and why each item is useful.
2. Strengthen the risk analysis. Explain how incorrect pass-rate calculations can occur and how specific tests detect them.
3. Justify the trade-off. Explain why documentation and correctness receive priority over additional functionality under the one-day constraint.
4. Separate facts, assumptions, and proposed decisions. Do not present an example passing threshold or interface choice as an approved requirement.

## Final evaluation

Relevance to the question

Strong

Clarity and organization

Strong

Critical reasoning

Needs improvement

Facts vs. assumptions

Needs improvement

Testing explanation

Needs improvement

The draft has a solid foundation, but it currently explains what should be delivered more clearly than why each deliverable is necessary and how its quality can be verified.

For a stronger first-year university submission, the next version should focus on those explanations without adding unnecessary technical complexity.

No rewrite has been made at this stage.
~~~~

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT (web)
- **Model:** GPT-6 (Instant)
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

~~~~text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: I accept the feedback about making deliverables explicit, explaining documentation and test evidence, defining normal, boundary and invalid-input tests, and separating scenario requirements from assumptions. Clarifying errors and rounding is my highest priority because these affect the whole program. Treat 50 as an example threshold, not an approved requirement. Replace "confirmed project requirements" with "requirements stated in the fictional scenario". Explain the one-day deadline as a reason to prioritize calculations, testing and instructions, not proof that a graphical interface is impossible. Python availability, command-line usability and customer priorities remain unconfirmed. Do not claim that manual tests guarantee correctness or that the project will definitely be completed in one day. Propose rejecting empty lists, non-numeric marks and marks outside 0–100 with a clear error. Propose inclusive boundaries and passing when mark >= threshold. Rounding and the threshold still require agreement. Include a concise delivery checklist and a way to report defects; do not promise unlimited support or invent actual test results.

Verified evidence: Python Software Foundation, "Using the Python Interpreter", section 2.1, https://docs.python.org/3/tutorial/interpreter.html#invoking-the-interpreter, accessed 2026-10-11. The interpreter executes a script when supplied with its file name. This supports documenting the launch procedure, but does not prove that the fictional teacher has Python installed. Python Software Foundation, "unittest — Unit testing framework", "Basic example", https://docs.python.org/3/library/unittest.html#basic-example, accessed 2026-10-11. assertEqual checks an expected result and assertRaises checks that a specified exception occurs. This supports concrete tests for calculations and invalid input, but does not establish complete coverage or guarantee correctness.

Draft: Here is a first-year university-level draft (approximately 460 words), written in simple academic English and based on your five original answers.

# Topic 1.1 — Professional Software Delivery: What Must a Customer Receive Beyond Program Code?

## Introduction

Professional software delivery means giving the customer not only working code but also everything needed to use and understand the program. Even if a program works correctly, it may be difficult for a customer to run it without instructions. In our fictional project, the customer is a university teacher who needs a Python program to analyze students' marks. The program calculates four indicators: average mark, highest mark, lowest mark, and pass rate.

## What Should Be Delivered?

First, the teacher should receive the Python program together with a short instruction explaining how to run it. The instruction should mention the required Python version, how to provide marks, and how to understand the results. A few examples of input and output would also be useful.

Second, the teacher should receive an explanation of the calculation rules. We already know that marks must be between 0 and 100. However, the passing threshold and rounding rules must be agreed upon before development. For example, if the passing mark is 50, a student with exactly 50 points should be counted as passing. This rule must be clearly documented.

## Testing and Quality

Testing is another important part of professional software delivery. The program should be tested to check whether all four indicators are calculated correctly.

For example, if the marks are 40, 50, 70, and 90, and the passing threshold is 50, the expected pass rate is 75%. This result can be calculated manually and compared with the program's output.

Other important tests include an empty list, marks outside the allowed range, and a mark exactly equal to the passing threshold. These tests help identify errors before the teacher starts using the program.

## Constraints and Trade-offs

Our fictional project has two constraints: one day for development and only four indicators.

These constraints make the project simpler and easier to finish. However, they also create trade-offs. For example, we may not have enough time to develop a graphical interface or additional statistics. Instead, we can focus on correct calculations, simple instructions, and basic testing.

I think this is a reasonable decision because the teacher mainly needs reliable results rather than a complicated application.

## Main Risk

The main risk is an incorrect pass rate. This could happen if the program uses the wrong passing threshold or calculates the percentage incorrectly.

To reduce this risk, I would create tests with expected answers calculated manually. I would also test cases where students have marks exactly equal to the passing threshold.

## Facts, Assumptions, and Conclusion

The confirmed project requirements are the four indicators and the allowed marks range of 0–100. The one-day deadline and limited functionality are constraints chosen for this fictional project.

We assume that the teacher can run Python and that a simple program without a graphical interface is acceptable. These assumptions should be checked with the customer.

In conclusion, professional software delivery includes code, instructions, documented rules, and test results. These materials help the customer use the software correctly and trust its calculations.

## Claims to verify before submission

|   |
| - |

Claim or decision

|   |
| - |

What to check

|   |
| - |

Passing threshold is 50

|   |
| - |

Confirm whether 50 is the actual agreed threshold or only an example.

|   |
| - |

Rounding rules

|   |
| - |

Confirm how many decimal places to use for the average and pass rate.

|   |
| - |

Empty list

|   |
| - |

Decide whether the program should raise an error or return a special result.

|   |
| - |

Python environment

|   |
| - |

Confirm whether the teacher has Python installed and which version is required.

|   |
| - |

Delivery requirements

|   |
| - |

Check whether the assignment also requires a README, test files, or repository link.

Main trade-off: With only one day available, spending time on clear instructions and calculation tests is more valuable than adding extra features. This is a project decision, not a universal rule for every software project.

The draft distinguishes the scenario's requirements from proposed decisions and assumptions. It also uses a manually verifiable example rather than unsupported external claims.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
~~~~

**Response:**

~~~~text
Below is the revised draft in simple academic English, suitable for a first-year university assignment. It incorporates your review decisions, keeps the focus on professional software delivery, and uses only your two supplied Python documentation sources.

## 1. Revised draft (approximately 490 words)

# Topic 1.1 — Professional Software Delivery: What Must a Customer Receive Beyond Program Code?

## Introduction

Professional software delivery means providing more than working code. The customer also needs instructions, clear calculation rules, and evidence that the program has been tested. In our fictional project, a university teacher needs a Python program that calculates four indicators: average mark, highest mark, lowest mark, and pass rate.

## What Should Be Delivered?

First, the teacher should receive the Python file and a short README explaining how to run it, enter marks, and understand the results. Python's official documentation explains that the interpreter can execute a script using its file name [1]. However, this does not prove that the teacher has Python installed.

Second, the calculation rules must be documented. The requirements stated in the fictional scenario specify marks from 0 to 100. I propose accepting both boundaries and rejecting empty lists, non-numeric marks, and marks outside this range with clear error messages.

I also propose counting a mark as passing when it is greater than or equal to the passing threshold. For example, if the threshold is 50, a mark of exactly 50 counts as passing. However, 50 is only an example. The actual threshold and rounding rules must be agreed upon with the customer before implementation.

## Testing and Quality

The teacher should receive test cases and a short test report comparing expected and actual results.

Testing should include normal inputs, boundary values, and invalid inputs. For example, with marks 40, 50, 70, and 90 and an example threshold of 50, the expected pass rate is 75%.

Boundary tests should include marks of 0 and 100 and marks exactly equal to the threshold. Invalid-input tests should check empty lists, non-numeric values, and out-of-range marks.

Python's `unittest` documentation describes `assertEqual` for checking expected results and `assertRaises` for checking exceptions [2]. These methods can help detect mistakes, but tests cannot guarantee complete correctness.

## Constraints and Trade-offs

Our fictional project allows one day of development and only four indicators. Therefore, I would prioritize correct calculations, testing, and clear instructions instead of additional features.

A graphical interface is not necessarily impossible within one day, but it may take time away from testing. The teacher's preferred interface remains unconfirmed, and finishing within one day is not guaranteed.

## Main Risk

The main risk is an incorrect pass rate caused by a wrong threshold, incorrect comparison, or percentage formula. I would reduce this risk by comparing program outputs with manually calculated expected answers, especially at the passing boundary.

## Delivery Checklist and Conclusion

My proposed delivery checklist includes the Python file, README, calculation rules, input validation rules, example inputs and outputs, test cases, and a test report. The teacher should also have a simple way to report defects, such as sending the input, expected result, actual result, and error message to the developer.

In conclusion, professional delivery means making software understandable, usable, and testable. The main requirements come from the fictional scenario, while Python availability, command-line usability, rounding rules, and customer priorities still require confirmation.

## References

[1] Python Software Foundation. *Using the Python Interpreter*, Section 2.1. [https://docs.python.org/3/tutorial/interpreter.html#invoking-the-interpreter](https://docs.python.org/3/tutorial/interpreter.html#invoking-the-interpreter) (accessed 11 October 2026).

[2] Python Software Foundation. *unittest — Unit testing framework*, Basic example. [https://docs.python.org/3/library/unittest.html#basic-example](https://docs.python.org/3/library/unittest.html#basic-example) (accessed 11 October 2026).

## 2. What I changed and why

|   |
| - |

Change

|   |
| - |

Reason

|   |
| - |

Added an explicit delivery checklist

|   |
| - |

Directly answers what the customer receives beyond code.

|   |
| - |

Clarified invalid-input handling

|   |
| - |

Prevents undefined behavior for empty or invalid data.

|   |
| - |

Proposed inclusive boundaries and `mark >= threshold`

|   |
| - |

Makes boundary behavior testable and understandable.

|   |
| - |

Identified 50 as an example

|   |
| - |

Avoids presenting an unapproved threshold as a requirement.

|   |
| - |

Added normal, boundary, and invalid-input tests

|   |
| - |

Provides a clearer testing strategy.

|   |
| - |

Added expected versus actual results

|   |
| - |

Explains what useful test evidence looks like.

|   |
| - |

Included two official Python references

|   |
| - |

Supports specific technical claims without inventing sources.

|   |
| - |

Revised the one-day trade-off

|   |
| - |

Explains prioritization without claiming a GUI is impossible.

|   |
| - |

Added a defect-reporting procedure

|   |
| - |

Gives the customer a practical way to communicate problems.

|   |
| - |

Distinguished scenario requirements from proposals

|   |
| - |

Avoids treating design decisions as confirmed facts.

## 3. Remaining gaps to verify

These questions should remain open rather than being answered without evidence.

Verification checklist

0 of 6 checked

What is the actual passing threshold?

50 is only an illustrative value.

How should results be rounded?

The number of decimal places for average and pass rate is not agreed.

Can the teacher run Python scripts?

Python installation, version, and command-line familiarity are unknown.

Is a command-line interface acceptable?

The customer has not confirmed their preferred interface.

What evidence of testing will be available?

No tests have been executed or actual results supplied.

What are the defect-reporting arrangements?

A reporting method is proposed, but the contact, response time, and support scope are not agreed.

## 4. Source and evidence check

The two references support only specific claims:

- Python interpreter documentation: Supports explaining how a Python script can be launched. It does not establish the teacher's technical environment.
- Python unittest documentation: Supports the use of equality assertions and exception assertions. It does not prove that the proposed program has been tested or that all errors will be detected.

Final assessment: The revision is more specific about customer deliverables, explains testing decisions and limitations, and preserves uncertainty about the fictional customer's environment. It remains suitable for a first-year assignment without making unsupported claims about implementation or testing results.
~~~~

## 9. Appendix C — Evidence tables

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| The instruction should mention the required Python version, how to provide marks, and how to understand the results. | Python Software Foundation, Using the Python Interpreter, section 2.1; https://docs.python.org/3/tutorial/interpreter.html#invoking-the-interpreter; accessed 2026-10-11 | The interpreter runs a script supplied as a filename. This supports explaining launch steps; it does not prescribe a delivery checklist or prove the teacher's installation. | qualify |
| These tests help identify errors before the teacher starts using the program. | Python Software Foundation, unittest — Unit testing framework, Basic example; https://docs.python.org/3/library/unittest.html#basic-example; accessed 2026-10-11 | Equality assertions check an expected result; exception assertions check an expected failure. These mechanisms can reveal checked mistakes, but no analyzer tests have been run here. | qualify |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| rejecting empty lists, non-numeric marks, and marks outside this range with clear error messages | The error should identify the problematic value and explain that a numeric mark between 0 and 100 is required. | The student's own explanation says teachers may need guidance about which values to enter. |
| a short README explaining how to run it, enter marks, and understand the results | Before delivery, the developer should check the teacher's environment and demonstrate the agreed launch procedure. | Verification row 1 establishes script execution, not customer competence; the usability assumption must be checked. |
| The teacher should receive test cases and a short test report comparing expected and actual results. | These are planned deliverables; this assignment does not implement the analyzer or provide executed calculation tests. | The assignment permits analysis without code, and no actual analyzer execution evidence exists for this SIS scenario. |
