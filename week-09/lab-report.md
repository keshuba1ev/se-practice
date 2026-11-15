# Week 09 — Lab Report: canBook as a Tool

**Name:** Abylai Keshubaev  
**Student ID:** 24B031847  
**GitHub:** keshuba1ev

Prepared with disclosed AI assistance. Permission choices and conclusion are assisted proposals pending student review, not a claim of unaided student writing.

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for Part 2) | ChatGPT, unauthenticated Default chat |
| Exact model | not displayed |
| Three fresh chats for R1, R2, R3? | yes |
| Python version | Python 3.12.14 |

Branch week-09 was created from main at 4e8a0cde5e86c7fe09b0372e5ebc43d72ec5d43f, verified against GitHub. No previous-week application was copied or modified. The local preparation assistant is Codex; the three calling experiments used the same ChatGPT Default selection. Its internal version cannot be verified. No packages were installed.

## 2. Your tool definition — a reason for every constraint

```json
{
  "name": "check_room",
  "description": "Check whether a single room is Available or Unavailable for a requested interval. All times are whole minutes since midnight in one day, range 0–1440 inclusive. This tool does not save, create or modify bookings. Supply current time, blocked status and all existing bookings for that room; never guess missing information. The function checks start before end, start after now, duration at most 120 minutes, blocked status and overlaps; touching intervals are allowed. Dates and multi-day requests are not supported.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Whole minutes since midnight in the same day, inclusive 0 to 1440."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Whole minutes since midnight in the same day, inclusive 0 to 1440."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Whole minutes since midnight in the same day, inclusive 0 to 1440."
      },
      "blocked": {
        "type": "boolean",
        "description": "True if the selected room is blocked."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings for the selected room and day; an empty list is allowed.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Whole minutes since midnight in the same day, inclusive 0 to 1440."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Whole minutes since midnight in the same day, inclusive 0 to 1440."
            }
          },
          "required": [
            "start",
            "end"
          ],
          "additionalProperties": false
        }
      }
    },
    "required": [
      "start",
      "end",
      "now",
      "blocked",
      "bookings"
    ],
    "additionalProperties": false
  }
}
```

| Field | Constraint | What goes wrong without it |
| --- | --- | --- |
| root | type: object | Reject arrays and primitive values instead of named arguments. |
| root | exact five properties; all five required | A missing now or blocked value must not be guessed; names stay identical to the function. |
| root | additionalProperties: false | Reject invented room/date fields, including S05; the current contract cannot use them. |
| start, end, now | type: integer | Reject strings like 11:00 (S03), fractions (S10) and booleans as times. |
| start, end, now | minimum: 0; maximum: 1440 | Reject negative and next-day numeric values (S06/S07), while allowing 1440 (S11). |
| blocked | type: boolean | The string false is not the Boolean false (S09). |
| bookings | type: array, with no minItems restriction | Represent a collection; an empty collection must be accepted (S02). |
| bookings.items | type: object; properties start/end | Reject positional pairs such as [660,720] (S12). |
| bookings.items | required: start and end | Reject incomplete existing intervals, including S08. |
| bookings.items | start/end integer, minimum 0, maximum 1440 | Apply the same minute units and day boundaries to each existing interval. |
| bookings.items | additionalProperties: false | Reject unknown nested fields instead of silently ignoring misspellings. |
| description | same-day units, missing-input policy, check-only behavior | Tell the model what values mean; description text alone cannot enforce behavior. |

No schema arithmetic or conditional keywords were added. A blocked room and an interval longer than 120 minutes are still well-shaped calls and must reach the function.

## 3. The twelve calls — first run and final run

First actual checker run used the unchanged starter. Before any schema edits its output was saved in `evidence/first-checker.txt` and its S verdicts committed in the report. It gave 6 PASS, 17 FAIL, 7 ERROR overall, with 9 S failures. An earlier command from the repository root printed a working-directory usage message; it did not execute the checks.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change to verdict; valid object still accepted. |
| S02 | PASS | PASS | No change to verdict; empty bookings remain allowed. |
| S03 | FAIL | PASS | Added integer type for end. |
| S04 | FAIL | PASS | Required all five arguments, including now. |
| S05 | FAIL | PASS | Set root additionalProperties to false. |
| S06 | FAIL | PASS | Added inclusive minimum 0 for times. |
| S07 | FAIL | PASS | Added inclusive maximum 1440 for times. |
| S08 | FAIL | PASS | Required start and end in every booking. |
| S09 | FAIL | PASS | Required Boolean blocked. |
| S10 | FAIL | PASS | Required integer start rather than unrestricted number. |
| S11 | PASS | PASS | Kept inclusive maximum 1440; no exclusive upper bound. |
| S12 | FAIL | PASS | Required object items with named start/end. |

## 4. Function calling — what the model wrote

The unchanged README prompt plus the complete definition and exact request was submitted once in each fresh conversation. See `evidence/prompt-r*.txt` and `evidence/chat-observations.md`.

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

Matches the request: 9:00=540, 10:00=600, 11:00=660 and 12:00=720. The model did not invent room identifiers. Expected canBook decision is Available because the requested end only touches the next booking. This is reasoning against the contract, not a live function execution.

### R2

```text
```

No reply text was recoverable. `calls/r2.json` intentionally contains zero bytes. The interface created a completed assistant message but displayed an empty content region; diagnostics reported pending rendering with no content. One reload did not recover it. This is a rendering/collection limitation: it does not establish a model refusal or a wrong conversion. No replacement call was fabricated.

The expected arguments, for analysis only, are start=840, end=990, now=810, blocked=true, bookings=[]. This is a valid schema call even though canBook should return Unavailable both for its 150-minute duration and blocked status. These numbers are NOT saved as the model response. F4 fails; F5 and F6 cannot evaluate an unreadable call.

### R3

```text
What exact start and end times would you like tomorrow afternoon? Also, is the room blocked, and what existing bookings does it have for that day?
```

The model asked rather than guessed: no invented afternoon start, blocked status or bookings. It requested exact endpoints and room state. However, now is also required and was not requested; the response contains two questions rather than the requested single short question. Tomorrow also lies outside the same-day contract and cannot be encoded by inventing a date property. The client must clarify scope and the comparison time before any call. F7 checks file presence, not the quality of that clarification.

## 5. What the schema cannot check

- AC1: integer type and inclusive 0–1440 bounds are enforceable. Comparing start with end and now is not possible with the allowed per-value keywords. An equal start/end is schema-valid but semantically invalid.
- AC2: end minus start at most 120 requires arithmetic across fields; the function must enforce it.
- AC3: Boolean typing prevents a string false, but blocked=true is valid input. The function rejects availability, rather than the schema rejecting the call.
- AC4: overlap involves comparing a candidate with every existing interval; touching endpoints must remain allowed. The allowed schema keywords cannot express this.
- AC5: a schema cannot guarantee that executed code leaves data unchanged or does not save a booking. Implementation tests and restricted write access enforce this.
- AC6: validation wording and narrow-screen usability concern the page, not JSON argument shape; they require separate UI checks.

## 6. Permissions — allow, ask or block

These are proposed boundaries for the imagined agent, not actions performed in this lab.

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call check_room with the times the user just typed | allow | Read-only check is within the request, provided every required argument is supplied and schema-valid; missing state must be clarified first. |
| A2 | read week-08/app/src/booking.ts | allow | Reading relevant source helps understand behavior without changing repository data; do not claim the path exists without checking. |
| A3 | raise the 120-minute limit to 180 | block | This silently changes fixed AC2; a three-hour user request does not authorize rewriting the course contract. A separate approved requirements change would be needed. |
| A4 | run npm test in week-08/app | allow | Allow the known reviewed local test script; first inspect package.json because scripts can execute arbitrary commands. Do not install packages or contact services implicitly. |
| A5 | git reset --hard to undo three edits | ask | This can discard unrelated staged and tracked work; inspect status and diff, preserve it, and obtain approval for the exact target and losses first. |
| A6 | git commit its change on week-09 | allow | A scoped local checkpoint is recoverable; review staged paths and exclude secrets and unrelated files before recording it. |
| A7 | git push to main | block | This bypasses the required week-09 branch and open-PR review route and can affect shared work. Push only the task branch when authorized. |
| A8 | send .env to an unknown online MCP server | block | Environment files can contain secrets; an unknown server is an untrusted recipient and configuration is not permission to disclose credentials. |

## 7. Checkpoint

The published baseline checkpoint preserves the unchanged starter definition and first-run findings:

`7d5212fd47f0ce579b37711dd06db9b2392bb27b` — `Week 09: preserve starter and first checker findings before changes`.

It is visible in `git log --oneline` after fetching the published branch. The equivalent local preparation checkpoint is 94c1c85e4617f39077d88654f598b58045c40133. GitHub publication used the connected account because the terminal had no GitHub credentials; commits therefore have different SHAs. The initial schema and first-run evidence are recoverable at both checkpoints. The exact rollback command, from the repository root, would be:

```bash
git reset --hard 7d5212fd47f0ce579b37711dd06db9b2392bb27b
```

This is documented, not executed. It moves the local branch back and replaces the index and tracked working files. It discards uncommitted tracked changes and removes later commits from the branch tip (they may temporarily remain in reflog). It does not generally delete unrelated untracked files, although untracked paths obstructing checkout can be removed. It does not undo an already-pushed remote branch. Before approval, save unrelated work and prefer a focused restore for a single file. No booking source or real data was changed.

## 8. Checker output

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
FAIL  F4    calls/r2.json: a call to check_room
             -> Expecting value: line 1 column 1 (char 0)
ERROR F5    calls/r2.json: arguments valid against your schema
             -> no readable call
ERROR F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
             -> no readable call
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 27 PASS · 1 FAIL · 2 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

- F4 FAIL: the R2 evidence file is empty and cannot be parsed as a tool call.
- F5 ERROR: without a readable R2 call, its arguments cannot be checked against the schema.
- F6 ERROR: without arguments, comparison against the expected R2 values cannot run.

All three are deliberately disclosed rather than hidden by inserting an expected answer. The evidence supports an incomplete rendered response, not a conclusion about model arithmetic. The exact model version was not displayed. The conclusion and permissions are AI-assisted drafts requiring student review; the unaided-writing requirement is not claimed as fulfilled. No real MCP server or canBook execution was performed.

## 10. Conclusion (80–150 words)

AI-assisted technical conclusion for student review, not an unaided personal reflection:

The schema and the function protect different boundaries. S03 shows why a time string must be refused before execution, while S11 shows why the inclusive upper bound must still accept 1440. R1 produced the correct minute values and preserved the touching endpoint. R2 demonstrates an evidence limit: a completed chat operation did not provide recoverable reply text, so expected arguments cannot replace the missing observation. R3 avoided invented values, but its clarification omitted now and did not resolve tomorrow against a same-day contract. Permissions also belong outside the schema. A8 must be blocked because a tool description cannot authorize sending secrets. A reviewed branch checkpoint supports recovery, while changing AC2 for one request would change the requirements.
