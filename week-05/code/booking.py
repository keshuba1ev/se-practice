def can_book(start, end, now, blocked, existing):
    # AC1: Check valid time range and future start
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    # AC2: Maximum booking duration is 120 minutes
    if end - start > 120:
        return False
    # AC3: Room must not be blocked
    if blocked:
        return False
    # AC4: Check for overlap with existing bookings
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False
    # AC5: All conditions passed
    return True
