import type { Container, Graphics, Sprite } from "pixi.js";
import type { MatchHistoryEntry } from "../types/match_history";

export type MousePosition = {
  x: number;
  y: number;
};

export type Cannonball = {
  sprite: Sprite;
  velocityX: number;
  velocityY: number;
  lifetime: number;
  owner: "player" | "enemy";
};

export type ExplosionEffect = {
  sprite: Sprite;
  lifetime: number;
};

export type EnemyShip = {
  container: Container;
  sprite: Sprite;
  healthBar: Graphics;
  lives: number;
  collisionRadius: number;
  shotCooldown: number;
  kind: "shooter" | "seakker";
};

export type GameStageProps = {
  onReturnToMenu: () => void;
  sessionTimeSeconds: number;
  enemySpawnIntervalSeconds: number;
  onMatchComplete: (match: MatchHistoryEntry) => void;
};
