export type MatchEndReason =
  | "time-expired"
  | "ship-destroyed"
  | "returned-to-menu";

export type MatchHistoryEntry = {
  id: string;
  dateTime: string;
  score: number;
  durationSeconds: number;
  endReason: MatchEndReason;
};
