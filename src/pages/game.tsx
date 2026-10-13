import { Game_Stage } from "../components/game_stage";
import type { MatchHistoryEntry } from "../types/match_history";

type GameProps = {
  onReturnToMenu: () => void;
  sessionTimeSeconds: number;
  enemySpawnIntervalSeconds: number;
  onMatchComplete: (match: MatchHistoryEntry) => void;
};

const Game = ({
  onReturnToMenu,
  sessionTimeSeconds,
  enemySpawnIntervalSeconds,
  onMatchComplete,
}: GameProps) => {
  return (
    <Game_Stage
      onReturnToMenu={onReturnToMenu}
      sessionTimeSeconds={sessionTimeSeconds}
      enemySpawnIntervalSeconds={enemySpawnIntervalSeconds}
      onMatchComplete={onMatchComplete}
    />
  );
};

export default Game;
