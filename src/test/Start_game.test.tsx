import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("Play Button Exist", () => {
  it("Play Button Exist", () => {
    render(<App />);
    expect(screen.getByText("Play")).toBeInTheDocument();
  });
});

describe("Start Game", () => {
  it("Start Game", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Play" }));

    expect(screen.getByText("Carregando jogo...")).toBeInTheDocument();
  });
});
