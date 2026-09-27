# Acceptance criteria

## Assumptions
- Overlap: touching bookings are allowed; intervals are half-open under R3.
- Duration: exactly two hours is allowed under R2; duration must be positive.
- A blocked room cannot accept a new booking.

## US-02 — Book room

### AC-01
- **Given** a free unblocked room and a future slot of exactly two hours
- **When** the Student requests a booking for the slot
- **Then** the booking is accepted.

### AC-02
- **Given** a free unblocked room
- **When** the Student requests a booking starting now or in the past
- **Then** the booking is rejected under R1.

### AC-03
- **Given** a free unblocked room
- **When** the Student requests a booking lasting more than two hours
- **Then** the booking is rejected under R2.

### AC-04
- **Given** an existing booking from 13:00 to 14:00 on a future date
- **When** the Student requests the same room from 13:30 to 14:30
- **Then** the booking is rejected under R3.

### AC-05
- **Given** a blocked room with no reservations in a future slot
- **When** the Student requests a booking for that slot
- **Then** the booking is rejected under R4.

## US-03 — Cancel booking

### AC-06
- **Given** a booking made by the Student
- **When** that Student cancels it
- **Then** the reservation is released.

### AC-07
- **Given** a booking made by a different Student
- **When** this Student requests its cancellation
- **Then** the request is rejected and the booking remains.

### AC-08
- **Given** a booking already cancelled
- **When** the Student requests cancellation again
- **Then** the request is rejected and no booking is changed.

## US-04 — Block or unblock room

### AC-09
- **Given** an unblocked room
- **When** the Administrator blocks it
- **Then** new bookings for that room are rejected under R4.

### AC-10
- **Given** a blocked room
- **When** the Administrator unblocks it
- **Then** future bookings may be accepted if R1, R2 and R3 hold.

### AC-11
- **Given** a blocked room
- **When** the Administrator blocks it again
- **Then** the room remains blocked and new bookings remain unavailable.

