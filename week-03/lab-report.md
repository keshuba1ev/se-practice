# Lab report — Practice #03, Requirements Engineering with AI

Name: Abylai Keshubaev (confirm spelling in KBTU records)
Student ID: 24B031847
GitHub username: keshuba1ev

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | ChatGPT Work / Codex |
| Exact model name and version | Generation: GPT-5.6 Sol (Instant); Codex review: GPT-6 |
| Date of the session | 2026-09-27 to 2026-09-28 |
| Diagram renderer used | No renderer available in this workspace; PlantUML source checked structurally |

The three fixed prompts were run in three fresh chats and their responses were supplied by the student. The supplied model-selector screenshot displays GPT-5.6 Sol in Instant mode; confirm it was selected in each of the three chats. Earlier Codex drafting and review are also disclosed in AI_USAGE.md.

## 2. Original AI output — user stories (Part 1)

Prompt 1 (verbatim from README §3) was supplied with the scenario in a fresh chat:
> You are a requirements analyst. For the Smart Campus study room booking system, identify
> Student and Administrator goals. Write 6 to 8 user stories using: As a [role], I want [goal],
> so that [reason]. Add a priority and one assumption to each story. Stay within the supplied
> scenario.

Original response, unedited:

```text
## Actor goals

**Student goals:** view room availability, book an available room, cancel their own booking, and receive confirmation after booking or cancellation.

**Administrator goals:** block rooms that are unavailable, unblock rooms when they return to service, and review room usage over a period.

## User Stories

| ID    | User Story                                                                                                                                     | Priority | Assumption                                                                                                             |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| US-01 | As a **Student**, I want to **view room availability**, so that I can find a free room and suitable time slot.                                 | High     | Availability reflects existing bookings and blocked rooms.                                                             |
| US-02 | As a **Student**, I want to **book a free room for a future time slot**, so that I can reserve a place for individual or group study.          | High     | A booking is limited to a maximum of two hours and cannot overlap another booking for the same room.                   |
| US-03 | As a **Student**, I want to **cancel a booking I made**, so that the room becomes available when I no longer need it.                          | High     | Students can cancel only their own bookings.                                                                           |
| US-04 | As a **Student**, I want to **receive confirmation after booking or cancelling a room**, so that I know the action was completed successfully. | Medium   | Confirmation is provided through the campus web application and does not include SMS, push, or reminder notifications. |
| US-05 | As an **Administrator**, I want to **block a room**, so that students cannot book it while it is unavailable.                                  | High     | A blocked room cannot accept new bookings.                                                                             |
| US-06 | As an **Administrator**, I want to **unblock a room**, so that students can book it again when it is available for use.                        | High     | Unblocking makes the room available for future bookings, subject to existing reservations.                             |
| US-07 | As an **Administrator**, I want to **review room usage over a selected period**, so that I can understand how the study rooms are being used.  | Medium   | Usage information is based on booking records, not check-in or attendance data.
```

## 3. Story review (Part 2)

| Generated story | Change | Reason | Final ID |
| --- | --- | --- | --- |
| US-01 | Reworded while keeping availability | A single testable Student goal | US-01 |
| US-02 | Reworded, moved R1–R4 details into criteria | Keep the goal small and test constraints separately | US-02 |
| US-03 | Reworded; retained ownership assumption | Cancellation belongs to the booking owner | US-03 |
| US-04 | Split into booking and cancellation confirmations; removed delivery-channel exclusion text | Two triggers have separate outcomes; mentioning SMS and push makes the story depend on excluded channels | US-06, US-07 |
| US-05 | Combined with US-06 (unblock) | UC-04 names one administrative block/unblock function | US-04 |
| US-06 | Combined with US-05 (block) | Both states belong to UC-04 | US-04 |
| US-07 | Reworded and removed check-in/attendance reference | Usage is based on bookings; attendance tracking is explicitly outside scope | US-05 |

The revised set has seven stories because UC-06 has two distinct confirmation outcomes. The original output mentioned excluded SMS/push in US-04 and check-in/attendance in US-07, even though it said they were excluded. These references were removed from the final stories.

## 4. Original AI output — acceptance criteria (Part 3)

Prompt 2 (verbatim from README §5) was supplied with US-02, US-03 and original US-05 in a fresh chat:
> For each selected story, write 3 to 5 acceptance criteria in Given, When, Then form. Include
> successful behavior, validation, and an error or alternative case. Apply these rules: bookings
> must be in the future, maximum duration is two hours, rooms cannot overlap, and blocked rooms
> cannot be booked. List assumptions before the criteria.

Original response, unedited:

````text
Below is a ready-to-submit version.

### Assumptions

- A room is either **available** or **blocked** for a given time.
- Students can cancel only bookings they created themselves.
- Booking start and end times are specified when creating a booking.
- A booking duration must be greater than zero and no more than **2 hours**.
- The system checks existing bookings and room status before confirming a new booking.
- Blocking a room prevents new bookings while the room remains blocked.
- UC-06 sends a system confirmation after a successful booking or cancellation.

### US-02 — Book Room

**User Story:** As a Student, I want to book a free room for a future time slot, so that I can reserve a place for individual or group study.

**AC-01 — Successful booking**\
**Given** the room is available and not blocked, and the selected time is in the future with a duration of no more than two hours,\
**When** the Student books the room,\
**Then** the booking is created and the system sends a confirmation.

**AC-02 — Past or current start time**\
**Given** the Student selects a booking start time that is not in the future,\
**When** the Student attempts to book the room,\
**Then** the booking is rejected with an appropriate error.

**AC-03 — Duration exceeds two hours**\
**Given** the Student selects a time slot longer than two hours,\
**When** the Student attempts to book the room,\
**Then** the booking is rejected.

**AC-04 — Overlapping booking**\
**Given** the room already has a booking that overlaps the selected time slot,\
**When** the Student attempts to book the room,\
**Then** the booking is rejected because the room is unavailable.

**AC-05 — Blocked room**\
**Given** the selected room is blocked,\
**When** the Student attempts to book it,\
**Then** the booking is rejected because blocked rooms cannot be booked.

### US-03 — Cancel Booking

**User Story:** As a Student, I want to cancel a booking I made, so that the room becomes available when I no longer need it.

**AC-01 — Successful cancellation**\
**Given** the Student has an existing booking that they created,\
**When** the Student cancels the booking,\
**Then** the booking is cancelled, the reserved time becomes available, and the system sends a confirmation.

**AC-02 — Cancel another student's booking**\
**Given** a booking belongs to another Student,\
**When** the Student attempts to cancel it,\
**Then** the cancellation is rejected and the booking remains unchanged.

**AC-03 — Booking does not exist**\
**Given** the selected booking does not exist or has already been cancelled,\
**When** the Student attempts to cancel it,\
**Then** the system reports that the booking cannot be cancelled and makes no changes.

### US-05 — Block Room

**User Story:** As an Administrator, I want to block a room, so that students cannot book it while it is unavailable.

**AC-01 — Successful blocking**\
**Given** a room is currently unblocked,\
**When** the Administrator blocks the room,\
**Then** the room is marked as blocked and cannot be used for new bookings.

**AC-02 — Student attempts to book blocked room**\
**Given** a room has been blocked by the Administrator,\
**When** a Student attempts to book the room,\
**Then** the booking is rejected because blocked rooms cannot be booked.

**AC-03 — Block already blocked room**\
**Given** the room is already blocked,\
**When** the Administrator attempts to block it again,\
**Then** the room remains blocked and no duplicate block is created.

**AC-04 — Unblock room**\
**Given** a room is currently blocked,\
**When** the Administrator unblocks the room,\
**Then** the room becomes available for future bookings, subject to existing bookings and the normal booking rules.
````

## 5. Criteria review (Part 3)

| Original criterion | Problem | Final change | Final ID |
| --- | --- | --- | --- |
| US-02 AC-01 | Success lacks exact two-hour boundary | Set duration to exactly two hours, explicitly allowed | AC-01 |
| US-02 AC-02–AC-05 | Valid invalid cases; room overlap and blocking need stable IDs | Kept behavior, reworded observable results and unique IDs | AC-02–AC-05 |
| US-03 AC-01 | Bundles cancellation and confirmation in one Then | Kept release result; confirmation is traced to UC-06 separately | AC-06 |
| US-03 AC-02–AC-03 | Clear alternatives | Kept and renumbered | AC-07–AC-08 |
| US-05 AC-01–AC-04 | Original US-05 was merged into final US-04; the draft repeats AC-01…AC-04 | Selected three concise cases and renumbered globally | AC-09–AC-11 |

The generated response omitted explicit decisions about touching booking boundaries and whether exactly two hours is allowed. I decided touching bookings are allowed (half-open intervals), and exactly two hours is allowed (“at most” includes equality). Both are in the final assumptions and submission.yml. The original also did not test a nonpositive duration; that remains a candidate for implementation-level criteria.

## 6. Original AI output — use-case diagram (Part 4)

Prompt 3 (verbatim from README §6) was supplied with the scenario in a fresh chat:
> Create PlantUML code for a UML use-case diagram of the Smart Campus study room booking system.
> Place Student and Administrator outside the system boundary. Include View availability, Book
> room, Cancel booking, Block or unblock room, Review usage, and Send confirmation. Show only
> justified actor associations. Use include or extend only when the relationship is clear. Do not
> model screens, databases, or internal classes.

Original response, unedited:

````text
Вот готовый PlantUML-код. Здесь ровно **2 actors**, **6 use cases**, а `Send confirmation` связан через `<<include>>` только с бронированием и отменой.
```
@startuml
left to right direction

actor Student
actor Administrator

rectangle "Smart Campus — Study Room Booking System" {

  usecase "View availability" as UC01
  usecase "Book room" as UC02
  usecase "Cancel booking" as UC03
  usecase "Block or unblock room" as UC04
  usecase "Review usage" as UC05
  usecase "Send confirmation" as UC06
}

Student --> UC01
Student --> UC02
Student --> UC03

Administrator --> UC01
Administrator --> UC04
Administrator --> UC05

UC02 ..> UC06 : <<include>>
UC03 ..> UC06 : <<include>>

@enduml
```

Почему именно так: **Student** смотрит доступность, бронирует и отменяет своё бронирование. **Administrator** смотрит доступность, блокирует/разблокирует комнаты и просматривает использование. `Book room` и `Cancel booking` включают `Send confirmation`, потому что по условию UC-06 подтверждает успешное бронирование или отмену. Бизнес-правила R1–R4 не нужно превращать в отдельные use cases — это ограничения поведения `Book room`.
````

Rendered diagram: pending a PlantUML renderer.

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| Administrator → UC-01 | The fixed Administrator goals concern room status and usage; no separate availability-view goal was established | Removed this association |
| UC-02/UC-03 → UC-06 | Booking and cancellation trigger confirmation | Kept both include relations |
| Student and Administrator | Both sit outside the boundary | Kept |

The original drew one unjustified actor association: Administrator → View availability (UC-01). It did not introduce screens, databases or internal components. The final diagram leaves UC-06 without a direct actor link because confirmation follows successful booking or cancellation.

## 8. Traceability (Part 5)

- Use cases with **no story** behind them: none.
- Stories with **no use case** they belong to: none.
- Criteria that test **no rule** from section 1: AC-06–AC-11 cover cancellation or administrative behavior rather than R1–R4 directly.

The largest gap is that UC-01, UC-05 and UC-06 have stories but no detailed criteria, as the exercise selects exactly three stories. UC-06 should be specified next because confirmation timing and failure behavior need precision.

## 9. Checker runs

Real terminal output from `week-03/`. The requirements were committed at `9208b2d` and are unchanged:

```text
$ python tests/check_requirements.py
PASS   US-1  user-stories.md         no placeholders left
PASS   US-2  user-stories.md         7 stories, IDs US-01…US-07
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
PASS   US-7  user-stories.md         nothing from the out-of-scope list appears
PASS   AC-1  acceptance-criteria.md  no placeholders left
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-02, US-03, US-04
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 11 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  3 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
PASS   TR-1  traceability.md         all six use cases have a row
PASS   TR-2  traceability.md         every ID in the table resolves
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
23 PASS · 0 FAIL · 0 ERROR   (23 checks)
Shape is clean. This says nothing about whether the requirements are good.
```

```text
$ python tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
PASS   student.name                              Abylai Keshubaev
PASS   student.student_id                        24B031847
PASS   student.github                            keshuba1ev
PASS   assistant.tool                            ChatGPT Work / Codex
PASS   assistant.model                           GPT-6 (Codex review; original-chat model unverified)
PASS   counts.user_stories                       7
PASS   counts.acceptance_criteria_sets           3
PASS   checker                                   23 PASS · 0 FAIL · 0 ERROR
NOTE   checker                                   you are claiming a clean run — it will be re-run at your commit, so make sure it is true
PASS   checker.commit                            9208b2d
PASS   assumptions.overlap_touching_bookings     allowed
PASS   assumptions.exactly_two_hours             allowed
PASS   traceability.use_cases_not_covered        []
PASS   traceability.stories_not_traced           []
NOTE   traceability                              you are claiming full coverage in both directions — that is rare on a first pass, and it is checked
PASS   review_findings                           3 findings
PASS   review_findings[1]                        US-02 generated criteria omitted a decision on the two-hour …
PASS   review_findings[2]                        UC-01 original diagram linked Administrator without a stated…
PASS   review_findings[3]                        US-05 generated criteria repeated AC-01 through AC-04; final…
PASS   honesty.can_explain_everything_submitted  no
NOTE   honesty.can_explain_everything_submitted  an honest no costs you nothing here — name the part in lab-report.md
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
21 PASS · 0 FAIL · 0 ERROR · 3 note
Shape is fine. This says nothing about whether the work is good.
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | 23 | 0 | 0 |

Commit these numbers were produced at: `9208b2d`. The declaration/report commit follows this requirements commit. No structural FAIL remains. Checks were run with Python. The disclosure says “no” to being able to defend everything until the student reviews these generated artifacts.

## 10. Conclusion (150–200 words)

The most consequential generated error was the extra Administrator → View availability association in the PlantUML diagram. The fixed scenario gives the Administrator responsibility for blocking rooms and reviewing usage, but it does not establish an availability-view goal for that actor. I caught the link by comparing each actor association with the two actor descriptions and the revised stories, rather than relying on the structural checker. The acceptance-criteria response also reused AC-01 through AC-04 in multiple story groups, omitted a decision about bookings touching at a boundary, and did not state whether exactly two hours is allowed. I assigned unique IDs and recorded both decisions in the final assumptions. The assistant did well at identifying the six fixed functions and producing useful success and invalid cases for booking. Those gave me a fast starting point for traceability. Before implementation, I would rewrite US-06, the booking confirmation story. It needs an observable definition of what counts as confirmation and what happens when a booking fails. Otherwise two developers could implement different behavior while both claiming to satisfy the story.
