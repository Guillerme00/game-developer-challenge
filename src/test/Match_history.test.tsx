import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Match_History_Menu } from "../components/match_history_menu";
import type { MatchHistoryEntry } from "../types/match_history";

describe("Match_History_Menu", () => {
  it("exibe os dados de uma partida", () => {
    const match: MatchHistoryEntry = {
      id: "match-1",
      dateTime: "2026-10-11T12:00:00.000Z",
      score: 42,
      durationSeconds: 65,
      endReason: "time-expired",
    };

    render(<Match_History_Menu isOpen onClose={() => {}} matches={[match]} />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("01:05")).toBeInTheDocument();
    expect(screen.getByText("Time ended")).toBeInTheDocument();
    expect(
      screen.getByRole("time").getAttribute("datetime"),
    ).toBe(match.dateTime);
  });

  it("mostra uma mensagem quando ainda não há partidas", () => {
    render(<Match_History_Menu isOpen onClose={() => {}} matches={[]} />);

    expect(screen.getByText("No matches recorded yet.")).toBeInTheDocument();
  });

  it("mostra os motivos de encerramento e permite fechar o histórico", () => {
    const onClose = vi.fn();
    const matches: MatchHistoryEntry[] = [
      {
        id: "time-expired",
        dateTime: "2026-10-11T12:00:00.000Z",
        score: 1,
        durationSeconds: 60,
        endReason: "time-expired",
      },
      {
        id: "ship-destroyed",
        dateTime: "2026-10-11T12:01:00.000Z",
        score: 2,
        durationSeconds: 30,
        endReason: "ship-destroyed",
      },
      {
        id: "returned-to-menu",
        dateTime: "2026-10-11T12:02:00.000Z",
        score: 3,
        durationSeconds: 15,
        endReason: "returned-to-menu",
      },
    ];

    render(
      <Match_History_Menu isOpen onClose={onClose} matches={matches} />,
    );

    expect(screen.getByText("Time ended")).toBeInTheDocument();
    expect(screen.getByText("Ship destroyed")).toBeInTheDocument();
    expect(screen.getByText("Left match")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Main Menu" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
