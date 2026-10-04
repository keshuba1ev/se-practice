# Approved stories — Smart Campus study room booking

**Source of this set:** My Week 03 stories, revised for Week 04; original IDs retained.

## Scenario

Students view room availability, book a room, and cancel their own bookings. Administrators block or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Approved stories

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a Student, I want to view room availability by time, so that I can choose a free room. | R2, R3 |
| US-02 | As a Student, I want to book an available room for a time slot, so that I can study there. | R1, R2, R3 |
| US-03 | As a Student, I want to cancel my own booking, so that the room becomes available again. | R2 |
| US-04 | As an Administrator, I want to block or unblock a room, so that unusable rooms cannot be reserved. | R3 |
| US-05 | As an Administrator, I want to review room usage over a period, so that I can understand demand. | — |
| US-06 | As a Student, I want to receive confirmation of a successful booking, so that I know my reservation was recorded. | R4 |

The extra Week 03 story concerned a separate cancellation confirmation. It is excluded from this Week 04 model because this week's scope permits only the booking confirmation. Cancellation still releases the reservation; surviving story IDs are unchanged.

**Out of scope:** payments, equipment in rooms, recurring bookings, waiting lists, notifications other than the booking confirmation, user registration.
