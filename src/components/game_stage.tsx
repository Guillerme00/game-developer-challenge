import { useCallback, useEffect, useRef, useState } from "react";
import { Application, Sprite } from "pixi.js";
import type { MatchEndReason } from "../types/match_history";
import { INITIAL_SHIP_LIVES } from "../game/game_config";
import type { GameStageProps, MousePosition } from "../game/game_types";
import { Game_Hud } from "./game_hud";
import { usePixiGame } from "../game/use_pixi_game";

export const Game_Stage = ({
  onReturnToMenu,
  sessionTimeSeconds,
  enemySpawnIntervalSeconds,
  onMatchComplete,
}: GameStageProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const spriteRef = useRef<Sprite | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pressedKeys = useRef(new Set<string>());
  const isPausedRef = useRef(false);
  const matchSavedRef = useRef(false);
  const scoreRef = useRef(0);
  const fireLeftBroadsideRef = useRef<(() => void) | null>(null);
  const fireRightBroadsideRef = useRef<(() => void) | null>(null);
  const lastShotAt = useRef<number | null>(null);
  const shipLivesRef = useRef(INITIAL_SHIP_LIVES);
  const timeRemainingRef = useRef(sessionTimeSeconds);
  const mousePosition = useRef<MousePosition>({ x: 0, y: 0 });
  const [shipLives, setShipLives] = useState(INITIAL_SHIP_LIVES);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(sessionTimeSeconds);
  const [restartCount, setRestartCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );

  const saveMatch = useCallback(
    (endReason: MatchEndReason) => {
      if (matchSavedRef.current) return;

      matchSavedRef.current = true;
      onMatchComplete({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        dateTime: new Date().toISOString(),
        score: scoreRef.current,
        durationSeconds: Math.round(
          sessionTimeSeconds - timeRemainingRef.current,
        ),
        endReason,
      });
    },
    [onMatchComplete, sessionTimeSeconds],
  );

  const returnToMenu = () => {
    const endReason =
      shipLivesRef.current <= 0
        ? "ship-destroyed"
        : timeRemainingRef.current <= 0
          ? "time-expired"
          : "returned-to-menu";
    saveMatch(endReason);
    onReturnToMenu();
  };

  useEffect(() => {
    if (shipLives === 0) {
      saveMatch("ship-destroyed");
    } else if (timeRemaining === 0) {
      saveMatch("time-expired");
    }
  }, [saveMatch, shipLives, timeRemaining]);

  const resumeGame = () => {
    pressedKeys.current.clear();
    isPausedRef.current = false;
    setIsPaused(false);
  };

  const restartGame = () => {
    shipLivesRef.current = INITIAL_SHIP_LIVES;
    timeRemainingRef.current = sessionTimeSeconds;
    isPausedRef.current = false;
    pressedKeys.current.clear();
    lastShotAt.current = null;
    fireLeftBroadsideRef.current = null;
    fireRightBroadsideRef.current = null;
    setShipLives(INITIAL_SHIP_LIVES);
    scoreRef.current = 0;
    setScore(0);
    setTimeRemaining(sessionTimeSeconds);
    setIsPaused(false);
    matchSavedRef.current = false;
    setRestartCount((count) => count + 1);
  };

  usePixiGame({
    hostRef,
    appRef,
    spriteRef,
    canvasRef,
    pressedKeys,
    isPausedRef,
    fireLeftBroadsideRef,
    fireRightBroadsideRef,
    lastShotAt,
    shipLivesRef,
    timeRemainingRef,
    mousePosition,
    scoreRef,
    restartCount,
    sessionTimeSeconds,
    enemySpawnIntervalSeconds,
    setIsPaused,
    setShipLives,
    setScore,
    setTimeRemaining,
    setInitializationError,
  });

  return (
    <div ref={hostRef} className="relative h-dvh w-full">
      <Game_Hud
        shipLives={shipLives}
        maxShipLives={INITIAL_SHIP_LIVES}
        score={score}
        timeRemaining={timeRemaining}
        isPaused={isPaused}
        initializationError={initializationError}
        onResume={resumeGame}
        onRestart={restartGame}
        onReturnToMenu={returnToMenu}
      />
    </div>
  );
};
