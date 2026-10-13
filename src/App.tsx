import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { MenuPage } from "./pages/menu";
import type { MatchHistoryEntry } from "./types/match_history";

const DEFAULT_SESSION_TIME_SECONDS = 120;
const DEFAULT_ENEMY_SPAWN_INTERVAL_SECONDS = 4;
const MIN_SESSION_TIME_SECONDS = 60;
const MAX_SESSION_TIME_SECONDS = 180;
const SESSION_TIME_STEP_SECONDS = 30;
const MIN_ENEMY_SPAWN_INTERVAL_SECONDS = 3;
const MAX_ENEMY_SPAWN_INTERVAL_SECONDS = 10;
const ENEMY_SPAWN_INTERVAL_STEP_SECONDS = 0.5;
const SESSION_TIME_STORAGE_KEY = "pirate-battle-session-time-seconds";
const ENEMY_SPAWN_INTERVAL_STORAGE_KEY =
  "pirate-battle-enemy-spawn-interval-seconds";
const MATCH_HISTORY_STORAGE_KEY = "pirate-battle-match-history";

const isMatchHistoryEntry = (value: unknown): value is MatchHistoryEntry => {
  if (typeof value !== "object" || value === null) return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.dateTime === "string" &&
    !Number.isNaN(Date.parse(entry.dateTime)) &&
    Number.isInteger(entry.score) &&
    Number(entry.score) >= 0 &&
    Number.isFinite(entry.durationSeconds) &&
    Number(entry.durationSeconds) >= 0 &&
    (entry.endReason === "time-expired" ||
      entry.endReason === "ship-destroyed" ||
      entry.endReason === "returned-to-menu")
  );
};

const Game = lazy(() =>
  import("./pages/game").then((module) => ({
    default: module.default,
  })),
);

const isValidSessionTime = (value: number) =>
  Number.isInteger(value) &&
  value >= MIN_SESSION_TIME_SECONDS &&
  value <= MAX_SESSION_TIME_SECONDS &&
  (value - MIN_SESSION_TIME_SECONDS) % SESSION_TIME_STEP_SECONDS === 0;

const isValidEnemySpawnInterval = (value: number) =>
  Number.isFinite(value) &&
  value >= MIN_ENEMY_SPAWN_INTERVAL_SECONDS &&
  value <= MAX_ENEMY_SPAWN_INTERVAL_SECONDS &&
  Number.isInteger(value / ENEMY_SPAWN_INTERVAL_STEP_SECONDS);

const loadSessionTime = () => {
  try {
    const storedValue = window.localStorage.getItem(SESSION_TIME_STORAGE_KEY);
    if (storedValue === null) return DEFAULT_SESSION_TIME_SECONDS;

    const sessionTimeSeconds = Number(storedValue);
    if (isValidSessionTime(sessionTimeSeconds)) return sessionTimeSeconds;

    console.error(
      `Invalid saved session time "${storedValue}". Using the default value.`,
    );
  } catch (error: unknown) {
    console.error("Unable to load the saved session time:", error);
  }

  return DEFAULT_SESSION_TIME_SECONDS;
};

const loadEnemySpawnInterval = () => {
  try {
    const storedValue = window.localStorage.getItem(
      ENEMY_SPAWN_INTERVAL_STORAGE_KEY,
    );
    if (storedValue === null) return DEFAULT_ENEMY_SPAWN_INTERVAL_SECONDS;

    const enemySpawnIntervalSeconds = Number(storedValue);
    if (isValidEnemySpawnInterval(enemySpawnIntervalSeconds)) {
      return enemySpawnIntervalSeconds;
    }

    console.error(
      `Invalid saved enemy spawn interval "${storedValue}". Using the default value.`,
    );
  } catch (error: unknown) {
    console.error("Unable to load the saved enemy spawn interval:", error);
  }

  return DEFAULT_ENEMY_SPAWN_INTERVAL_SECONDS;
};

const loadMatchHistory = (): MatchHistoryEntry[] => {
  try {
    const storedValue = window.localStorage.getItem(MATCH_HISTORY_STORAGE_KEY);
    if (storedValue === null) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      throw new Error("Saved match history is not a list.");
    }

    const entries = parsedValue.filter(isMatchHistoryEntry);
    if (entries.length !== parsedValue.length) {
      console.error("Some invalid saved match history records were ignored.");
    }
    return entries;
  } catch (error: unknown) {
    console.error("Unable to load saved match history:", error);
    return [];
  }
};

function App() {
  const [isInGame, setIsInGame] = useState(false);
  const [sessionTimeSeconds, setSessionTimeSeconds] = useState(loadSessionTime);
  const [enemySpawnIntervalSeconds, setEnemySpawnIntervalSeconds] = useState(
    loadEnemySpawnInterval,
  );
  const [matchHistory, setMatchHistory] = useState(loadMatchHistory);
  const matchHistoryRef = useRef(matchHistory);

  const handleMatchComplete = (match: MatchHistoryEntry) => {
    const nextMatchHistory = [match, ...matchHistoryRef.current];
    matchHistoryRef.current = nextMatchHistory;
    setMatchHistory(nextMatchHistory);

    try {
      window.localStorage.setItem(
        MATCH_HISTORY_STORAGE_KEY,
        JSON.stringify(nextMatchHistory),
      );
    } catch (error: unknown) {
      console.error("Unable to save match history:", error);
    }
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SESSION_TIME_STORAGE_KEY,
        String(sessionTimeSeconds),
      );
    } catch (error: unknown) {
      console.error("Unable to save the session time:", error);
    }
  }, [sessionTimeSeconds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        ENEMY_SPAWN_INTERVAL_STORAGE_KEY,
        String(enemySpawnIntervalSeconds),
      );
    } catch (error: unknown) {
      console.error("Unable to save the enemy spawn interval:", error);
    }
  }, [enemySpawnIntervalSeconds]);

  return (
    <main className="min-h-dvh w-full overflow-x-hidden">
      {isInGame ? (
        <Suspense
          fallback={
            <div
              role="status"
              className="flex min-h-dvh w-full flex-col items-center justify-center gap-5 bg-[#167f99] text-center text-white"
            >
              <span
                aria-hidden="true"
                className="size-12 animate-spin rounded-full border-4 border-white/30 border-t-amber-200"
              />
              <p className="text-xl font-semibold tracking-wide drop-shadow sm:text-2xl">
                Carregando jogo...
              </p>
            </div>
          }
        >
          <Game
            sessionTimeSeconds={sessionTimeSeconds}
            enemySpawnIntervalSeconds={enemySpawnIntervalSeconds}
            onMatchComplete={handleMatchComplete}
            onReturnToMenu={() => setIsInGame(false)}
          />
        </Suspense>
      ) : (
        <MenuPage
          sessionTimeSeconds={sessionTimeSeconds}
          onSessionTimeChange={setSessionTimeSeconds}
          enemySpawnIntervalSeconds={enemySpawnIntervalSeconds}
          onEnemySpawnIntervalChange={setEnemySpawnIntervalSeconds}
          matchHistory={matchHistory}
          onPlay={() => setIsInGame(true)}
        />
      )}
    </main>
  );
}

export default App;
