import math


def analyze_marks(marks, pass_mark=50):
    def validate(value, name):
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise TypeError(f"{name} must be a number")
        if not 0 <= value <= 100 or not math.isfinite(value):
            raise ValueError(f"{name} must be between 0 and 100")

    validate(pass_mark, "pass_mark")

    if not marks:
        raise ValueError("marks must not be empty")

    for mark in marks:
        validate(mark, "Each mark")

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(
            100 * sum(mark >= pass_mark for mark in marks) / len(marks), 2
        ),
    }


import unittest


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(analyze_marks([40, 60, 80], 50), {
            "average": 60,
            "highest": 80,
            "lowest": 40,
            "pass_rate": 66.67,
        })

    def test_one_mark(self):
        self.assertEqual(analyze_marks([50]), {
            "average": 50,
            "highest": 50,
            "lowest": 50,
            "pass_rate": 100,
        })

    def test_decimals(self):
        self.assertEqual(analyze_marks([49.5, 50.5]), {
            "average": 50,
            "highest": 50.5,
            "lowest": 49.5,
            "pass_rate": 50,
        })

    def test_custom_pass_mark(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 60)["pass_rate"], 66.67
        )

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(TypeError):
            analyze_marks([40, "60", 80])

    def test_out_of_range_marks(self):
        for mark in [-1, 101]:
            with self.subTest(mark=mark):
                with self.assertRaises(ValueError):
                    analyze_marks([mark])

    def test_valid_boundaries(self):
        self.assertEqual(analyze_marks([0, 100])["pass_rate"], 50)

    def test_invalid_pass_mark(self):
        for threshold in [-1, 101, float("nan"), float("inf")]:
            with self.subTest(threshold=threshold):
                with self.assertRaises(ValueError):
                    analyze_marks([60], threshold)


if __name__ == "__main__":
    unittest.main()
