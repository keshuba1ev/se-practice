def analyze_marks(marks, pass_mark=50):
    """Summarize marks, with pass_rate expressed as a percentage."""
    def valid_mark(value):
        return (
            isinstance(value, (int, float))
            and not isinstance(value, bool)
            and 0 <= value <= 100
        )

    if not marks:
        raise ValueError("marks must not be empty")

    if not valid_mark(pass_mark):
        raise ValueError("pass_mark must be a number from 0 to 100")

    if any(not valid_mark(mark) for mark in marks):
        raise ValueError("All marks must be numbers from 0 to 100")

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": sum(mark >= pass_mark for mark in marks) / len(marks) * 100,
    }
