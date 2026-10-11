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
