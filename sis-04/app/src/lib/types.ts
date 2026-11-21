export type Decision =
  | { ok: true; message: string }
  | { ok: false; reason: string; message: string };
