import unittest


def analyze_marks(marks, pass_mark=50):
    def validate(value, name):
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(f"{name} must be an int or float")
        # This also rejects NaN and positive/negative infinity.
        if not 0 <= value <= 100:
            raise ValueError(f"{name} must be finite and between 0 and 100")

    validate(pass_mark, "pass_mark")

    if not marks:
        raise ValueError("marks must not be empty")

    for mark in marks:
        validate(mark, "mark")

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(
            sum(mark >= pass_mark for mark in marks) / len(marks) * 100,
            2,
        ),
    }


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {
                "average": 60.0,
                "highest": 80,
                "lowest": 40,
                "pass_rate": 66.67,
            },
        )

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([50]),
            {
                "average": 50.0,
                "highest": 50,
                "lowest": 50,
                "pass_rate": 100.0,
            },
        )

    def test_decimals(self):
        self.assertEqual(
            analyze_marks([49.5, 50.5, 75.25]),
            {
                "average": 58.416666666666664,
                "highest": 75.25,
                "lowest": 49.5,
                "pass_rate": 66.67,
            },
        )

    def test_custom_pass_mark(self):
        self.assertEqual(analyze_marks([60, 70, 80], 70)["pass_rate"], 66.67)

    def test_empty_input(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_mark(self):
        with self.assertRaises(ValueError):
            analyze_marks([40, "60", 80])

    def test_out_of_range_marks(self):
        for mark in (-1, 101):
            with self.subTest(mark=mark):
                with self.assertRaises(ValueError):
                    analyze_marks([mark])

    def test_boolean_and_nonfinite_marks(self):
        for mark in (True, False, float("nan"), float("inf"), float("-inf")):
            with self.subTest(mark=mark):
                with self.assertRaises(ValueError):
                    analyze_marks([mark])

    def test_invalid_pass_mark(self):
        for threshold in (
            "50", True, False, -1, 101,
            float("nan"), float("inf"), float("-inf"),
        ):
            with self.subTest(pass_mark=threshold):
                with self.assertRaises(ValueError):
                    analyze_marks([50], threshold)

    def test_boundary_marks_and_thresholds(self):
        self.assertEqual(analyze_marks([0, 100], 0)["pass_rate"], 100.0)
        self.assertEqual(analyze_marks([0, 100], 100)["pass_rate"], 50.0)


if __name__ == "__main__":
    unittest.main()
