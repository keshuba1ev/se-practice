from statistics import mean


def get_grade(average):
    """Example grading scale; adjust to your school's rules."""
    if average >= 90:
        return "A"
    if average >= 80:
        return "B"
    if average >= 70:
        return "C"
    if average >= 60:
        return "D"
    return "F"


def analyze_marks(students):
    if not students:
        print("No student data available.")
        return

    averages = {}

    for name, marks in students.items():
        if not marks:
            raise ValueError(f"{name} has no marks.")

        if any(
            isinstance(mark, bool)
            or not isinstance(mark, (int, float))
            or not 0 <= mark <= 100
            for mark in marks
        ):
            raise ValueError(f"{name}: marks must be numbers from 0 to 100.")

        averages[name] = mean(marks)

    print(f"{'Student':<20} {'Average':>8} {'Grade':>6}")
    print("-" * 36)

    for name, average in sorted(
        averages.items(), key=lambda item: item[1], reverse=True
    ):
        print(f"{name:<20} {average:>8.2f} {get_grade(average):>6}")

    highest_average = max(averages.values())
    top_students = [
        name for name, average in averages.items()
        if average == highest_average
    ]

    # Each student contributes equally to the class average.
    print(f"\nClass average: {mean(averages.values()):.2f}")
    print(f"Top student(s): {', '.join(top_students)}")
    print(f"Highest average: {highest_average:.2f}")


students = {
    "Alice": [85, 90, 78],
    "Bob": [72, 68, 80],
    "Charlie": [95, 92, 98],
    "Diana": [60, 75, 70],
}

analyze_marks(students)
