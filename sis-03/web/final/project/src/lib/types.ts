export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes from 00:00
  end: number; // minutes from 00:00
  bookedBy: string;
}

export type Decision =
  | { ok: true; message: string }
  | { ok: false; reason: string; message: string };

export interface CheckInput {
  roomId: string;
  start: number;
  end: number;
  currentTime: number; // minutes from 00:00
}
