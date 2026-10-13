import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Options_Menu } from "../components/options_menu";

const renderOptions = ({
  sessionTimeSeconds = 120,
  enemySpawnIntervalSeconds = 4,
  onSessionTimeChange = vi.fn(),
  onEnemySpawnIntervalChange = vi.fn(),
} = {}) => {
  render(
    <Options_Menu
      isOpen
      onClose={vi.fn()}
      sessionTimeSeconds={sessionTimeSeconds}
      onSessionTimeChange={onSessionTimeChange}
      enemySpawnIntervalSeconds={enemySpawnIntervalSeconds}
      onEnemySpawnIntervalChange={onEnemySpawnIntervalChange}
    />,
  );

  return { onSessionTimeChange, onEnemySpawnIntervalChange };
};

describe("Options_Menu", () => {
  it("shows the current game settings", () => {
    renderOptions();

    expect(screen.getByText("2 min")).toBeInTheDocument();
    expect(screen.getByText("4.0 s")).toBeInTheDocument();
  });

  it("changes game session time in 30-second steps", () => {
    const { onSessionTimeChange } = renderOptions();

    fireEvent.click(
      screen.getByRole("button", { name: "Increase game session time" }),
    );

    expect(onSessionTimeChange).toHaveBeenCalledWith(150);
  });

  it("changes enemy spawn interval in half-second steps", () => {
    const { onEnemySpawnIntervalChange } = renderOptions();

    fireEvent.click(
      screen.getByRole("button", { name: "Decrease enemy spawn interval" }),
    );

    expect(onEnemySpawnIntervalChange).toHaveBeenCalledWith(3.5);
  });

  it("disables setting controls at their minimum and maximum values", () => {
    renderOptions({
      sessionTimeSeconds: 60,
      enemySpawnIntervalSeconds: 10,
    });

    expect(
      screen.getByRole("button", { name: "Decrease game session time" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Increase enemy spawn interval" }),
    ).toBeDisabled();
  });
});
