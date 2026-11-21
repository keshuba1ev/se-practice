import { expect, test } from 'vitest';
import { fmt, parseTime } from './time';

test('AC1 midnight endpoint parses and displays without wrapping', () => {
  expect(parseTime('24:00')).toBe(1440);
  expect(fmt(1440)).toBe('24:00');
});
test('AC1 malformed and out-of-day text is refused', () => {
  expect(parseTime('24:01')).toBeNaN();
  expect(parseTime('10:60')).toBeNaN();
  expect(parseTime('1:00')).toBeNaN();
  expect(parseTime('')).toBeNaN();
});
test('AC1 valid same-day input maps to whole minutes', () => {
  expect(parseTime('10:00')).toBe(600);
  expect(parseTime('00:00')).toBe(0);
});
test('AC6 minute formatting keeps leading zeros', () => {
  expect(fmt(541)).toBe('09:01');
});
