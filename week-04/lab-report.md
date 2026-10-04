# Week 04 — Lab report: Modeling the System with UML

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Abylai Keshubaev |
| Group | Not provided |
| AI assistant | ChatGPT |
| Exact model | Awaiting exact model confirmation |
| Renderer | Local PlantUML 1.2026.6 JAR, Smetana layout |
| Behaviour diagram | sequence |
| Stories used | My Week 03 stories, revised for Week 04; US-01 to US-06 retain their IDs |

The separate cancellation-confirmation story from Week 03 is excluded because Week 04 permits only booking confirmation. Setup was committed during this working session; I cannot claim a classroom commit from this session.

## 2. Prompts as sent

Tasks 1–3 were sent in the same chat after uploading approved-stories.md. The critique was sent in a new chat with the approved stories and the three revised diagrams.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.

```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.

```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.

```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

Corrections were made in this Codex workspace rather than through follow-up prompts in the drafting chat. This assistance is disclosed in AI_USAGE.md.

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.

```

## 3. Task 1 — use-case review

**Assumptions the AI listed:** only owners cancel; confirmation follows success; mandatory confirmation justifies include; no optional extension; cancellation confirmation and unrelated features are out of scope.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Send Booking Confirmation | This presents sending confirmation as an action the student initiates. | R4, US-06, README confirmation guidance | Remove this actor association; retain confirmation as included system behaviour. |
| 2 | Book Room includes Send Booking Confirmation | The reason was in the legend, without the required comment directly above the relationship. | R4, PlantUML convention §4 | Add a directly preceding ' why: comment citing R4 and US-06. |

Both actors are outside the named boundary. US-01 to US-05 supply the main goals; US-06 supplies the included outcome. Administrator has no booking or cancellation associations.

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One Student makes zero or many Bookings. | Each Booking belongs to exactly one Student. | 1 / 0..* |
| Room — Booking | One Room can have zero or many Bookings over time. | Each Booking reserves exactly one Room. | 1 / 0..* |

Administrator operations take Room as a parameter; no permanent Administrator–Room association is asserted. BookingStatus is an enumeration used by an attribute, not a separate entity association. There is no inheritance, aggregation or composition.

### 4.2 Constraints the multiplicities cannot show

- R2: the note on Booking prohibits overlap between ACTIVE bookings of the same Room.
- R1: the Booking note requires a future start and duration greater than zero and at most two hours; endTime is startTime + duration.
- R3: the Room note prohibits new bookings while blocked.
- R4: the Booking note states that success produces confirmation.
- US-03: cancellation is restricted to the owning Student and changes status to CANCELLED. Cancelled records remain available for usage review; cancellation releases the time slot.

### 4.3 Assumptions

- A1: Touching bookings are allowed. Intervals are half-open [start, end), so 10:00–12:00 and 12:00–13:00 do not overlap.
- A2: Blocking a booked room keeps existing bookings. It prevents new reservations; it does not cancel previous ones.
- A3: Cancelled records are retained; usage review is based on booking records, not attendance. The sequence's atomic attempt rechecks time, blocking and overlap at the reservation point. The storage mechanism is unspecified.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Administrator—Room manages association | The many-to-many link adds stored management relationships that US-04 does not require. | US-04 | Remove the association; keep blockRoom and unblockRoom operations. |
| 2 | Booking overlap note | The draft did not decide whether touching bookings overlap. | R2; worksheet §4.3 | Declare half-open intervals and allowed touching as A1. |
| 3 | Room blocked note | The draft did not say what happens to existing bookings. | R3; worksheet §4.3 | Declare that blocking keeps existing bookings as A2. |
| 4 | R4 note on Student | The constraint is about the booking result; attaching it to Student makes its scope less clear. | R4 | Move the note to Booking after the critique. |

Student and Room identifiers distinguish entities. Booking startTime, duration and status support R1/R2; Room.blocked supports R3. Administrator is justified by US-04/US-05; ACTIVE and CANCELLED by R2 and US-03. No services or repositories are domain classes.

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence, because it shows which component validates, reserves, and returns each outcome.

**Design components added beyond the domain model:** BookingService coordinates the request, checks R1 and returns confirmation or rejection. BookingRepository reads room state and ACTIVE bookings, then attempts reservation atomically; only a successful attempt stores a Booking. They are design components, not domain entities. Persistence technology and authentication are out of scope.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | createBooking after availability checks | Safe handling of competing requests was assumed in prose; the diagram did not show a conflict outcome after the check. | R2, R3 | Replace direct creation with an atomic attemptReservation and explicit created/unavailable branches. |
| 2 | combined invalid-or-unavailable branch | It hides where a rejected request stops. | R1, R2, R3 | Separate invalid-time, blocked-room and overlapping-booking alternatives; none writes data. |
| 3 | bookRoom request | studentId appeared only during creation, relying on a session assumption. | US-02 and Student–Booking ownership | Include studentId in the initial request; this does not model authentication. |

Every message has a sender, receiver and label. Guards have no typed square brackets. R4 confirmation is sent only after the reservation result reports success. An atomic failure leaves storage unchanged.

## 6. AI critique

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Rename Send Booking Confirmation to Receive Booking Confirmation. | UC06 | reject | README explicitly permits Send confirmation as an included system action. US-06 describes the received outcome; no actor association implies a student sending it. Names across diagram types need consistent meaning, not identical spelling. |
| 2 | A permanent Administrator—Room association is missing. | Administrator.blockRoom / unblockRoom | reject | US-04 requires actions on a Room, already represented by operation parameters. It does not require stored room assignments or multiplicities. |
| 3 | Attach R4 to Booking instead of Student. | R4 note | accept | It describes successful reservation behaviour; moving the note clarifies the affected concept. |
| 4 | A1/A2 must be explicitly marked as design assumptions. | Booking and Room notes | accept | These are decisions left open by the scenario. Add the word Assumption in class notes and declare them in §4.3. |
| 5 | The repository must not recheck R1. | Atomic reservation note | reject | A future start can become past while the request waits. Rechecking at reservation protects R1; the repository abstracts a transactional boundary, without prescribing SQL or storage internals. |
| 6 | BookingStatus is partially invented. | ACTIVE/CANCELLED | reject | R2 explicitly refers to active bookings and US-03 requires cancellation. Both values are justified; no additional statuses are introduced. |

The critique confirmed that R1–R4 are present. I checked each proposed correction against the scenario and the lab's permitted modeling choices.

## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Room | Booking.startTime, duration | validateTime; invalid time guard; atomic recheck |
| R2 | Book Room | Booking.status and overlap note; Room association | hasOverlappingActiveBooking; overlap guard; atomic attempt |
| R3 | Book Room | Room.blocked | isRoomBlocked; blocked guard; atomic recheck |
| R4 | Send Booking\nConfirmation | Booking success note | bookingConfirmation after created |
| US-01 | View Room\nAvailability | Room.isAvailable, Booking.overlaps/status | Availability reads are used by Book Room; the browsing interaction is outside this sequence. |
| US-02 | Book Room | Student, Room, Booking | bookRoom and attemptReservation |
| US-03 | Cancel Own\nBooking | Student–Booking ownership, Booking.cancel/status | Outside Book Room sequence; cancelled records are ignored by the active-overlap check. |
| US-04 | Block or Unblock\nRoom | Administrator.blockRoom/unblockRoom, Room.blocked | Blocked-state check enforces the result; administrator workflow is outside this sequence. |
| US-05 | Review Room\nUsage | Administrator.reviewUsage, retained Booking records | Outside Book Room sequence; successful reservation provides booking data for usage review. |
| US-06 | Send Booking\nConfirmation | Booking success note | bookingConfirmation(bookingId) |

Only Book Room is modeled as a sequence; the other goals remain traced without inventing extra behaviour diagrams.

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Student linked directly to Send Booking Confirmation. | Remove direct link; retain include. | R4 is an included system outcome. |
| 2 | use case | Include justification only in legend. | Add ' why: above the include line. | Required PlantUML convention. |
| 3 | class | Administrator linked to Room with 0..* / 0..*. | Remove persistent manages association. | US-04 defines operations, not stored assignments. |
| 4 | class | Touching intervals and effects of blocking unspecified. | Add A1 half-open intervals and A2 existing bookings retained. | Declare the two scenario ambiguities. |
| 5 | class | R4 note attached to Student. | Attach it to Booking; label assumptions explicitly. | Accepted critique clarifies constraint scope. |
| 6 | sequence | Direct createBooking after availability reads. | Atomic attemptReservation, separate rejection paths, result guards. | R2/R3 require safe reservation even when state changes. |
| 7 | sequence | studentId implicit in request/session. | Include studentId in initial message. | Trace ownership consistently. |

## 9. Checker output

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (8 branches)
SQ3  FAIL  no message creates or saves the booking
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  6 critique issues with a verdict
LR7  PASS  7 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=36 fail=1 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** SQ3 — the checker searches message labels for create/save/reserve. The atomic attemptReservation message performs creation as described in its adjacent note, but its name does not match those keywords. Validation precedes it, only a successful attempt creates an ACTIVE Booking, and failure changes nothing. I keep this abstraction and report the structural FAIL openly.

## 10. Conclusion (120–180 words)

The use-case draft had the clearest mistake: it linked Student directly to Send Booking Confirmation. R4 describes a system response after a successful reservation, so I removed that association and kept the justified include. The class draft had correct Student–Booking and Room–Booking multiplicities, but its Administrator–Room association implied a persistent relationship that the stories never require. I removed it. The sequence draft checked availability before saving, but relied on an assumption that competing requests were handled safely. Without an atomic reservation attempt, two requests could both pass the overlap check and create conflicting bookings, violating R2. The revision makes that safeguard explicit. The critique identified that the R4 note was attached to Student; moving it to Booking made the constraint clearer. I rejected its demand to restore Administrator–Room and its claim that checking R1 again was unnecessary: a previously future start can pass while a request is being processed. I still need to review the atomic reservation responsibility before defending it in class.

Word count: 163. I need to review the atomic reservation responsibility before claiming that I can defend every element. Codex helped with revisions and this write-up; see AI_USAGE.md.
