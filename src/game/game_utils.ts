import type { Application, Sprite } from "pixi.js";
import { SHOT_COOLDOWN_MS } from "./game_config";
import type { MousePosition } from "./game_types";

export const getRandomGenerator = (x: number, y: number) => {
  let seed = (Math.imul(x, 123123123) + Math.imul(y, 34512335)) | 0;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const fireWithCooldown = (
  lastShotAt: { current: number | null },
  fire: (() => void) | null,
  cooldownMs = SHOT_COOLDOWN_MS,
) => {
  if (!fire) return;

  const now = performance.now();
  if (lastShotAt.current !== null && now - lastShotAt.current < cooldownMs) {
    return;
  }

  lastShotAt.current = now;
  fire();
};

export const rotateShipTowardsMouse = (
  mousePosition: MousePosition,
  app: Application,
  ship: Sprite,
  canvas: HTMLCanvasElement,
) => {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const mouseX =
    ((mousePosition.x - rect.left) / rect.width) * app.screen.width;
  const mouseY =
    ((mousePosition.y - rect.top) / rect.height) * app.screen.height;
  const dx = mouseX - app.screen.width / 2;
  const dy = mouseY - app.screen.height / 2;

  ship.rotation = Math.atan2(dy, dx) - Math.PI / 2;
};
