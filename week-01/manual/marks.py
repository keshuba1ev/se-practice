def process_marks(marks):
    valid = []
    for mark in marks:
        try:
            mark = float(mark)
            if 0 <= mark <= 100:
                valid.append(mark)
        except (ValueError, TypeError):
            continue
    if len(valid) == 0:
        return {
            "valid": 0,
            "average": "_",
            "highest": "_",
            "lowest": "_",
        "pass_rate": "message, no crush"
    }
    average = sum(valid) / len(valid)
    highest = max(valid)
    lowest = min(valid)

    passing = sum(mark >= 50 for mark in valid)
    pass_rate = passing / len(valid) * 100

    return {
        "valid": len(valid),
        "average": f"{average: .2f}",
        "highest": f"{highest: g}",
        "lowest": f"{lowest: g}",
        "pass_rate": f"{pass_rate: .1f}%"
    }

tests = {
    "a": [85, 23, 45, 90, 92],
    "b": [88, 47, -5, 101, "abc", 73, 50, 100],
    "c": [10, 20, 30],
    "d":  ["abc", "", "xyz"]
}

print(f"{'#': <4}{'Input':<38}{'Valid':<8}{'Average':<10}"
      f"{'Highest':<10}{'Lowest':<10}{'Pass rate'}")

print("-" *100)

for test, marks in tests.items():
    result = process_marks(marks)
    input_text = ", ".join(str(mark) for mark in marks)

    print(f"{test:<4}{input_text:<38}"
          f"{result['valid']:<8}"
          f"{result['average']:<10}"
          f"{result['highest']:<10}"
          f"{result['lowest']:<10}"
          f"{result['pass_rate']}")