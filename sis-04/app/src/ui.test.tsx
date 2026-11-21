// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import type { Room } from './rooms';

function fixtures(): Room[] {
  return [
    { id: 'a', name: 'Fixture Alpha', building: 'Test Wing', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
    { id: 'b', name: 'Fixture Beta', building: 'Test Wing', capacity: 7, equipment: ['projector'], blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: 'c', name: 'Fixture Gamma', building: 'Test Wing', capacity: 20, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
    { id: 'd', name: 'Fixture Delta', building: 'Test Wing', capacity: 12, equipment: ['whiteboard'], blocked: true, bookings: [] },
  ];
}
function fillTimes(start = '10:00', end = '11:00') {
  fireEvent.change(screen.getByLabelText('Start'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('End'), { target: { value: end } });
}
afterEach(cleanup);

test('UI F1 F2 B5 rendered filters require capacity and ALL equipment', () => {
  render(<App rooms={fixtures()} />);
  fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '8' } });
  fireEvent.click(screen.getByLabelText('projector'));
  fireEvent.click(screen.getByLabelText('whiteboard'));
  expect(screen.getByRole('button', { name: /Fixture Alpha/ })).toBeDefined();
  expect(screen.getByRole('button', { name: /Fixture Gamma/ })).toBeDefined();
  expect(screen.queryByRole('button', { name: /Fixture Beta/ })).toBeNull();
  expect(screen.queryByRole('button', { name: /Fixture Delta/ })).toBeNull();
});

test('UI F4 filtering out selection clears old feedback and shows empty state', () => {
  render(<App rooms={fixtures()} />);
  fireEvent.click(screen.getByRole('button', { name: /Fixture Alpha/ }));
  fillTimes();
  fireEvent.click(screen.getByRole('button', { name: 'Check availability' }));
  expect(screen.getByRole('status').textContent).toContain('Available');
  fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '999' } });
  expect(screen.getByRole('status').textContent).toContain('No rooms match your requirements');
  expect(screen.queryByText('Available')).toBeNull();
  expect(screen.getByText('None')).toBeDefined();
});

test('UI F5 INT room switching refreshes the result without a second submit', () => {
  render(<App rooms={fixtures()} />);
  fireEvent.click(screen.getByRole('button', { name: /Fixture Alpha/ }));
  fillTimes();
  fireEvent.click(screen.getByRole('button', { name: 'Check availability' }));
  expect(screen.getByRole('status').textContent).toContain('Fixture Alpha is free from 10:00 to 11:00');
  fireEvent.click(screen.getByRole('button', { name: /Fixture Beta/ }));
  expect(screen.getByRole('alert').textContent).toContain('Unavailable');
  expect(screen.getByLabelText('Start')).toHaveProperty('value', '10:00');
  expect(screen.getByLabelText('End')).toHaveProperty('value', '11:00');
});

test('UI F3 AC3 blocked card is selectable and always unavailable', () => {
  render(<App rooms={fixtures()} />);
  const card = screen.getByRole('button', { name: /Fixture Delta/ });
  expect(card.getAttribute('aria-disabled')).toBeNull();
  fireEvent.click(card);
  fillTimes();
  fireEvent.click(screen.getByRole('button', { name: 'Check availability' }));
  expect(screen.getByRole('alert').textContent).toContain('Unavailable');
});

test('UI AC1 AC6 time edits refresh decision and show malformed input feedback', () => {
  render(<App rooms={fixtures()} />);
  fireEvent.click(screen.getByRole('button', { name: /Fixture Alpha/ }));
  fillTimes();
  fireEvent.click(screen.getByRole('button', { name: 'Check availability' }));
  fireEvent.change(screen.getByLabelText('Start'), { target: { value: '11:00' } });
  expect(screen.getByRole('alert').textContent).toContain('Unavailable');
  fireEvent.change(screen.getByLabelText('Start'), { target: { value: 'oops' } });
  expect(screen.getByText('Enter HH:MM, from 00:00 to 24:00.')).toBeDefined();
  expect(screen.queryByText('Available')).toBeNull();
});
