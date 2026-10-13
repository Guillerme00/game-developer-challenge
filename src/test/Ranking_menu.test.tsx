import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Ranking_Menu } from "../components/Ranking_menu";
import type { MatchHistoryEntry } from "../types/match_history";

describe("Ranking_Menu", () => {
  it("shows an empty state when there are no matches", () => {
    render(<Ranking_Menu isOpen onClose={() => {}} matches={[]} />);

    expect(screen.getByText("No matches recorded yet.")).toBeInTheDocument();
  });

  it("lists all matches by descending score, with newest matches first on ties", () => {
    const matches: MatchHistoryEntry[] = [
      {
        id: "older-tie",
        dateTime: "2026-10-10T12:00:00.000Z",
        score: 10,
        durationSeconds: 60,
        endReason: "time-expired",
      },
      {
        id: "top-score",
        dateTime: "2026-10-09T12:00:00.000Z",
        score: 20,
        durationSeconds: 60,
        endReason: "ship-destroyed",
      },
      {
        id: "newer-tie",
        dateTime: "2026-10-11T12:00:00.000Z",
        score: 10,
        durationSeconds: 60,
        endReason: "returned-to-menu",
      },
    ];

    render(<Ranking_Menu isOpen onClose={() => {}} matches={matches} />);

    const rows = within(
      screen.getByRole("list", { name: "Partidas ordenadas por pontuação" }),
    ).getAllByRole("listitem");

    expect(
      rows.map((row) => row.querySelector("time")?.getAttribute("datetime")),
    ).toEqual([
      "2026-10-09T12:00:00.000Z",
      "2026-10-11T12:00:00.000Z",
      "2026-10-10T12:00:00.000Z",
    ]);
    expect(rows.map((row) => row.children[2].textContent)).toEqual([
      "20",
      "10",
      "10",
    ]);
  });

  it("closes when the Main Menu button is clicked", () => {
    const onClose = vi.fn();
    render(<Ranking_Menu isOpen onClose={onClose} matches={[]} />);

    fireEvent.click(screen.getByRole("button", { name: "Main Menu" }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
