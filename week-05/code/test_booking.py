import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        self.assertIs(can_book(660, 720, 540, False, [(600, 660)]), True)

    def test_partial_overlap_is_rejected(self):
        self.assertIs(can_book(630, 690, 540, False, [(600, 660)]), False)

    def test_blocked_room_is_rejected(self):
        self.assertIs(can_book(660, 720, 540, True, [(600, 660)]), False)

    def test_exactly_120_minutes_is_allowed(self):
        self.assertIs(can_book(720, 840, 540, False, [(600, 660)]), True)

    def test_121_minutes_is_rejected(self):
        self.assertIs(can_book(720, 841, 540, False, [(600, 660)]), False)

    def test_start_equal_now_is_rejected(self):
        self.assertIs(can_book(540, 570, 540, False, [(600, 660)]), False)

    def test_zero_length_is_rejected(self):
        self.assertIs(can_book(720, 720, 540, False, [(600, 660)]), False)

    def test_reversed_interval_is_rejected(self):
        self.assertIs(can_book(720, 719, 540, False, [(600, 660)]), False)

    def test_end_at_midnight_is_allowed(self):
        self.assertIs(can_book(1380, 1440, 540, False, [(600, 660)]), True)

    def test_end_after_midnight_is_rejected(self):
        self.assertIs(can_book(1381, 1441, 540, False, [(600, 660)]), False)

    def test_negative_start_is_rejected(self):
        self.assertIs(can_book(-1, 30, 0, False, []), False)

    def test_empty_existing_is_allowed(self):
        self.assertIs(can_book(600, 660, 540, False, []), True)

    def test_touching_start_is_allowed(self):
        self.assertIs(can_book(570, 600, 540, False, [(600, 660)]), True)

    def test_request_inside_existing_is_rejected(self):
        self.assertIs(can_book(615, 645, 540, False, [(600, 660)]), False)

    def test_request_contains_existing_is_rejected(self):
        self.assertIs(can_book(570, 690, 540, False, [(600, 660)]), False)

    def test_one_minute_overlap_is_rejected(self):
        self.assertIs(can_book(659, 719, 540, False, [(600, 660)]), False)

    def test_later_existing_overlap_is_rejected(self):
        self.assertIs(can_book(720, 780, 540, False, [(600, 660), (750, 810)]), False)

    def test_gap_between_multiple_bookings_is_allowed(self):
        self.assertIs(can_book(660, 720, 540, False, [(600, 660), (720, 780)]), True)

    def test_input_order_unchanged_after_allowed_request(self):
        existing = [(900, 960), (600, 660)]
        before = existing.copy()
        self.assertIs(can_book(720, 780, 540, False, existing), True)
        self.assertEqual(existing, before)

    def test_input_unchanged_after_rejected_request(self):
        existing = [(900, 960), (600, 660)]
        before = existing.copy()
        self.assertIs(can_book(630, 690, 540, False, existing), False)
        self.assertEqual(existing, before)

    def test_start_one_minute_after_now_is_allowed(self):
        self.assertIs(can_book(541, 570, 540, False, [(600, 660)]), True)

    def test_start_before_now_is_rejected(self):
        self.assertIs(can_book(539, 570, 540, False, [(600, 660)]), False)

    def test_final_minute_of_day_is_allowed(self):
        self.assertIs(can_book(1439, 1440, 1438, False, []), True)

    def test_fractional_start_returns_false(self):
        self.assertIs(can_book(720.5, 780, 540, False, []), False)

    def test_fractional_end_returns_false(self):
        self.assertIs(can_book(720, 780.5, 540, False, []), False)

    def test_text_start_returns_false(self):
        self.assertIs(can_book("720", 780, 540, False, []), False)

    def test_text_end_returns_false(self):
        self.assertIs(can_book(720, "780", 540, False, []), False)
