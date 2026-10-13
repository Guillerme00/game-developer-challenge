import { useEffect } from "react";
import { Application, Assets, Container, Graphics, Sprite } from "pixi.js";
import shipImage from "../../assets/png/default/ships/ship_1.png";
import enemyShipImage from "../../assets/png/default/ships/ship_2.png";
import seakkerShipImage from "../../assets/png/default/ships/ship_4.png";
import explosionImage from "../../assets/png/default/effects/explosion_1.png";
import tropicalIslandImage from "../../assets/png/retina/ui/game/Mapa Tropical da Ilha com Palmeiras.png";
import vectorIslandImage from "../../assets/png/retina/ui/game/Ilha Tropical em Estilo Vetorial (1).png";
import waterfallIslandImage from "../../assets/png/retina/ui/game/Ilha Tropical com Cachoeira em Camadas.png";
import enchantedIslandImage from "../../assets/png/retina/ui/game/Ilha Tropical Encantada com Cachoeiras.png";
import isometricIslandImage from "../../assets/png/retina/ui/game/Ilha tropical isométrica em estilo de jogo.png";
import cannonballImage from "../../assets/png/default/ship_parts/cannon_ball.png";
import {
  BROADSIDE_SHOT_COOLDOWN_MS,
  CANNONBALL_LIFETIME,
  CANNONBALL_SPEED,
  ENEMY_BULLET_DAMAGE_COOLDOWN_SECONDS,
  ENEMY_CANNONBALL_SPEED,
  ENEMY_DESPAWN_DISTANCE,
  ENEMY_KILL_POINTS,
  ENEMY_MAX_ACTIVE,
  ENEMY_SHIP_LIVES,
  ENEMY_SHIP_SPEED,
  ENEMY_SHOT_INTERVAL_SECONDS,
  ENEMY_SHOT_INTERVAL_VARIATION_SECONDS,
  ENEMY_SPAWN_ATTEMPTS,
  ENEMY_SPAWN_MIN_DISTANCE,
  EXPLOSION_DURATION_SECONDS,
  ISLAND_BASE_WIDTH,
  ISLAND_CELL_SIZE,
  ISLAND_COLLISION_DAMAGE,
  ISLAND_COLLISION_RADIUS_FACTOR,
  ISLAND_DAMAGE_COOLDOWN_SECONDS,
  ISLAND_SCALE_MIN,
  ISLAND_SCALE_VARIATION,
  ISLAND_SPAWN_DISTANCE,
  SEAKKER_COLLISION_DAMAGE,
  SEAKKER_SHIP_SPEED,
  SEAKKER_SPAWN_CHANCE,
  SHIP_SPEED,
} from "./game_config";
import type {
  Cannonball,
  EnemyShip,
  ExplosionEffect,
  MousePosition,
} from "./game_types";
import {
  fireWithCooldown,
  getRandomGenerator,
  rotateShipTowardsMouse,
} from "./game_utils";

type MutableRef<T> = { current: T };
type ValueSetter<T> = (value: T) => void;

type UsePixiGameOptions = {
  hostRef: MutableRef<HTMLDivElement | null>;
  appRef: MutableRef<Application | null>;
  spriteRef: MutableRef<Sprite | null>;
  canvasRef: MutableRef<HTMLCanvasElement | null>;
  pressedKeys: MutableRef<Set<string>>;
  isPausedRef: MutableRef<boolean>;
  fireLeftBroadsideRef: MutableRef<(() => void) | null>;
  fireRightBroadsideRef: MutableRef<(() => void) | null>;
  lastShotAt: MutableRef<number | null>;
  shipLivesRef: MutableRef<number>;
  timeRemainingRef: MutableRef<number>;
  mousePosition: MutableRef<MousePosition>;
  scoreRef: MutableRef<number>;
  restartCount: number;
  sessionTimeSeconds: number;
  enemySpawnIntervalSeconds: number;
  setIsPaused: ValueSetter<boolean>;
  setShipLives: ValueSetter<number>;
  setScore: ValueSetter<number>;
  setTimeRemaining: ValueSetter<number>;
  setInitializationError: ValueSetter<string | null>;
};

export const usePixiGame = ({
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
}: UsePixiGameOptions) => {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const position = { x: event.clientX, y: event.clientY };
      mousePosition.current = position;

      const app = appRef.current;
      const ship = spriteRef.current;
      const canvas = canvasRef.current;
      if (!isPausedRef.current && app && ship && canvas) {
        rotateShipTowardsMouse(position, app, ship, canvas);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [appRef, canvasRef, isPausedRef, mousePosition, spriteRef]);

  useEffect(() => {
    const movementKeys = new Set(["w", "s"]);
    const keysPressed = pressedKeys.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "escape") {
        event.preventDefault();
        if (
          event.repeat ||
          shipLivesRef.current <= 0 ||
          timeRemainingRef.current <= 0
        ) {
          return;
        }

        const nextIsPaused = !isPausedRef.current;
        isPausedRef.current = nextIsPaused;
        keysPressed.clear();
        setIsPaused(nextIsPaused);
        return;
      }
      if (isPausedRef.current) return;

      if (key === "q") {
        event.preventDefault();
        if (!event.repeat && shipLivesRef.current > 0) {
          fireWithCooldown(
            lastShotAt,
            fireLeftBroadsideRef.current,
            BROADSIDE_SHOT_COOLDOWN_MS,
          );
        }
        return;
      }
      if (key === "e") {
        event.preventDefault();
        if (!event.repeat && shipLivesRef.current > 0) {
          fireWithCooldown(
            lastShotAt,
            fireRightBroadsideRef.current,
            BROADSIDE_SHOT_COOLDOWN_MS,
          );
        }
        return;
      }
      if (!movementKeys.has(key)) return;

      event.preventDefault();
      keysPressed.add(key);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.delete(event.key.toLowerCase());
    };
    const pauseGame = () => {
      keysPressed.clear();
      if (
        isPausedRef.current ||
        shipLivesRef.current <= 0 ||
        timeRemainingRef.current <= 0
      ) {
        return;
      }

      isPausedRef.current = true;
      setIsPaused(true);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") pauseGame();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", pauseGame);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", pauseGame);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      keysPressed.clear();
      fireLeftBroadsideRef.current = null;
      fireRightBroadsideRef.current = null;
    };
  }, [
    fireLeftBroadsideRef,
    fireRightBroadsideRef,
    isPausedRef,
    lastShotAt,
    pressedKeys,
    setIsPaused,
    shipLivesRef,
    timeRemainingRef,
  ]);

  useEffect(() => {
    const host = hostRef.current;
    let app: Application | undefined;
    let disposed = false;
    let updateWorld: (() => void) | undefined;
    let handlePointerDown: ((event: PointerEvent) => void) | undefined;

    if (!host) return;

    const inicializate = async (host: HTMLDivElement) => {
      const [
        shipTexture,
        enemyShipTexture,
        seakkerShipTexture,
        explosionTexture,
        tropicalIslandTexture,
        vectorIslandTexture,
        waterfallIslandTexture,
        enchantedIslandTexture,
        isometricIslandTexture,
        cannonballTexture,
      ] = await Promise.all([
        Assets.load(shipImage),
        Assets.load(enemyShipImage),
        Assets.load(seakkerShipImage),
        Assets.load(explosionImage),
        Assets.load(tropicalIslandImage),
        Assets.load(vectorIslandImage),
        Assets.load(waterfallIslandImage),
        Assets.load(enchantedIslandImage),
        Assets.load(isometricIslandImage),
        Assets.load(cannonballImage),
      ]);

      if (disposed) return;

      const nextApp = new Application();
      await nextApp.init({
        background: "#167f99",
        resizeTo: host,
      });

      if (disposed) {
        nextApp.destroy({ removeView: true });
        return;
      }

      const world = new Container();
      const ship = new Sprite(shipTexture);
      const enemyShips: EnemyShip[] = [];
      const islandTextures = [
        tropicalIslandTexture,
        vectorIslandTexture,
        waterfallIslandTexture,
        enchantedIslandTexture,
        isometricIslandTexture,
      ];

      ship.anchor.set(0.5);
      ship.position.set(0, 0);
      world.addChild(ship);
      nextApp.stage.addChild(world);

      const islands = new Map<string, Sprite>();
      const cannonballs: Cannonball[] = [];
      const explosions: ExplosionEffect[] = [];

      const createExplosion = (x: number, y: number, size: number) => {
        const sprite = new Sprite(explosionTexture);
        sprite.anchor.set(0.5);
        sprite.position.set(x, y);
        sprite.scale.set(size / explosionTexture.width);
        explosions.push({ sprite, lifetime: EXPLOSION_DURATION_SECONDS });
        world.addChild(sprite);
      };

      const fireCannonball = (
        x: number,
        y: number,
        angle: number,
        owner: Cannonball["owner"] = "player",
      ) => {
        if (owner === "player" && shipLivesRef.current <= 0) return;

        const cannonball = new Sprite(cannonballTexture);
        cannonball.anchor.set(0.5);
        cannonball.scale.set(1);
        cannonball.position.set(x, y);
        cannonballs.push({
          sprite: cannonball,
          velocityX:
            Math.cos(angle) *
            (owner === "enemy" ? ENEMY_CANNONBALL_SPEED : CANNONBALL_SPEED),
          velocityY:
            Math.sin(angle) *
            (owner === "enemy" ? ENEMY_CANNONBALL_SPEED : CANNONBALL_SPEED),
          lifetime: CANNONBALL_LIFETIME,
          owner,
        });
        world.addChild(cannonball);
      };
      const updateEnemyHealthBar = (enemy: EnemyShip) => {
        enemy.healthBar.clear();
        const segmentWidth = 8;
        const segmentGap = 3;
        const barStartX =
          -(
            ENEMY_SHIP_LIVES * segmentWidth +
            (ENEMY_SHIP_LIVES - 1) * segmentGap
          ) / 2;
        const barY =
          -Math.max(enemy.sprite.width, enemy.sprite.height) / 2 - 12;

        for (let index = 0; index < ENEMY_SHIP_LIVES; index++) {
          enemy.healthBar
            .rect(
              barStartX + index * (segmentWidth + segmentGap),
              barY,
              segmentWidth,
              5,
            )
            .fill({
              color: index < enemy.lives ? 0x4ade80 : 0x475569,
            });
        }
      };
      const spawnEnemyShip = (kind: "shooter" | "seakker" = "shooter") => {
        const texture =
          kind === "seakker" ? seakkerShipTexture : enemyShipTexture;
        const collisionRadius = Math.hypot(texture.width, texture.height) / 2;
        const spawnMargin = collisionRadius + 16;
        const spawnHalfWidth = nextApp.screen.width / 2 - spawnMargin;
        const spawnHalfHeight = nextApp.screen.height / 2 - spawnMargin;
        if (spawnHalfWidth <= 0 || spawnHalfHeight <= 0) return false;

        for (let attempt = 0; attempt < ENEMY_SPAWN_ATTEMPTS; attempt++) {
          const offsetX = (Math.random() * 2 - 1) * spawnHalfWidth;
          const offsetY = (Math.random() * 2 - 1) * spawnHalfHeight;
          if (Math.hypot(offsetX, offsetY) < ENEMY_SPAWN_MIN_DISTANCE) {
            continue;
          }

          const x = ship.x + offsetX;
          const y = ship.y + offsetY;
          let overlapsIsland = false;
          for (const island of islands.values()) {
            const islandRadius =
              Math.max(island.width, island.height) *
              ISLAND_COLLISION_RADIUS_FACTOR;
            if (
              Math.hypot(x - island.x, y - island.y) <
              collisionRadius + islandRadius
            ) {
              overlapsIsland = true;
              break;
            }
          }
          const overlapsEnemy = enemyShips.some(
            (enemy) =>
              Math.hypot(x - enemy.container.x, y - enemy.container.y) <
              collisionRadius + enemy.collisionRadius,
          );
          if (overlapsIsland || overlapsEnemy) continue;

          const sprite = new Sprite(texture);
          sprite.anchor.set(0.5);
          sprite.rotation = Math.random() * Math.PI * 2;
          const container = new Container();
          const healthBar = new Graphics();
          const enemy = {
            container,
            sprite,
            healthBar,
            lives: ENEMY_SHIP_LIVES,
            collisionRadius,
            shotCooldown: ENEMY_SHOT_INTERVAL_SECONDS * 0.5 + Math.random(),
            kind,
          };
          container.position.set(x, y);
          container.addChild(sprite, healthBar);
          updateEnemyHealthBar(enemy);
          enemyShips.push(enemy);
          world.addChild(container);
          return true;
        }

        return false;
      };
      let lastIslandArea = "";
      const updateIslands = () => {
        const shipCellX = Math.floor(ship.x / ISLAND_CELL_SIZE);
        const shipCellY = Math.floor(ship.y / ISLAND_CELL_SIZE);
        const cellsX =
          Math.ceil(nextApp.screen.width / ISLAND_CELL_SIZE / 2) + 1;
        const cellsY =
          Math.ceil(nextApp.screen.height / ISLAND_CELL_SIZE / 2) + 1;
        const areaKey = `${shipCellX}:${shipCellY}:${cellsX}:${cellsY}`;
        if (areaKey === lastIslandArea) return;
        lastIslandArea = areaKey;

        const neededIslands = new Set<string>();
        for (
          let cellY = shipCellY - cellsY;
          cellY <= shipCellY + cellsY;
          cellY++
        ) {
          for (
            let cellX = shipCellX - cellsX;
            cellX <= shipCellX + cellsX;
            cellX++
          ) {
            const random = getRandomGenerator(cellX, cellY);
            if (random() < 0.75) continue;

            const islandX = (cellX + 0.15 + random() * 0.7) * ISLAND_CELL_SIZE;
            const islandY = (cellY + 0.15 + random() * 0.7) * ISLAND_CELL_SIZE;
            const key = `${cellX}:${cellY}`;
            const islandTexture =
              islandTextures[Math.floor(random() * islandTextures.length)];
            const scale = ISLAND_SCALE_MIN + random() * ISLAND_SCALE_VARIATION;
            const islandScale =
              (ISLAND_BASE_WIDTH / islandTexture.width) * scale;
            const islandRadius =
              (Math.max(islandTexture.width, islandTexture.height) *
                islandScale) /
              2;
            if (
              Math.hypot(islandX, islandY) <
              ISLAND_SPAWN_DISTANCE + islandRadius
            ) {
              continue;
            }

            neededIslands.add(key);
            if (islands.has(key)) continue;

            const island = new Sprite(islandTexture);
            island.anchor.set(0.5);
            island.position.set(islandX, islandY);
            island.scale.set(islandScale);
            const hitboxOutline = new Graphics()
              .circle(
                0,
                0,
                Math.max(islandTexture.width, islandTexture.height) *
                  ISLAND_COLLISION_RADIUS_FACTOR *
                  1.2,
              )
              .stroke({
                color: 0x123b59,
                alpha: 0.55,
                width: 2 / islandScale,
              });
            island.addChild(hitboxOutline);
            islands.set(key, island);
            world.addChildAt(island, 0);
          }
        }

        for (const [key, island] of islands) {
          if (neededIslands.has(key)) continue;
          world.removeChild(island);
          islands.delete(key);
        }
      };

      updateIslands();
      spawnEnemyShip();
      spriteRef.current = ship;
      app = nextApp;
      appRef.current = nextApp;
      canvasRef.current = nextApp.canvas;
      rotateShipTowardsMouse(
        mousePosition.current,
        nextApp,
        ship,
        nextApp.canvas,
      );

      handlePointerDown = (event: PointerEvent) => {
        if (
          event.button !== 0 ||
          isPausedRef.current ||
          shipLivesRef.current <= 0
        ) {
          return;
        }

        fireWithCooldown(lastShotAt, () => {
          const forwardAngle = ship.rotation + Math.PI / 2;
          const muzzleDistance = Math.hypot(ship.width, ship.height) / 2;
          fireCannonball(
            ship.x + Math.cos(forwardAngle) * muzzleDistance,
            ship.y + Math.sin(forwardAngle) * muzzleDistance,
            forwardAngle,
          );
        });
      };
      fireLeftBroadsideRef.current = () => {
        const forwardAngle = ship.rotation + Math.PI / 2;
        const leftAngle = forwardAngle - Math.PI / 2;
        const leftX = Math.cos(leftAngle);
        const leftY = Math.sin(leftAngle);
        const forwardX = Math.cos(forwardAngle);
        const forwardY = Math.sin(forwardAngle);
        const sideOffset = ship.width / 2 + cannonballTexture.width / 2;
        const longitudinalOffsets = [-ship.height * 0.3, 0, ship.height * 0.3];

        for (const forwardOffset of longitudinalOffsets) {
          fireCannonball(
            ship.x + leftX * sideOffset + forwardX * forwardOffset,
            ship.y + leftY * sideOffset + forwardY * forwardOffset,
            leftAngle,
          );
        }
      };
      fireRightBroadsideRef.current = () => {
        const forwardAngle = ship.rotation + Math.PI / 2;
        const rightAngle = forwardAngle + Math.PI / 2;
        const rightX = Math.cos(rightAngle);
        const rightY = Math.sin(rightAngle);
        const forwardX = Math.cos(forwardAngle);
        const forwardY = Math.sin(forwardAngle);
        const sideOffset = ship.width / 2 + cannonballTexture.width / 2;
        const longitudinalOffsets = [-ship.height * 0.3, 0, ship.height * 0.3];

        for (const forwardOffset of longitudinalOffsets) {
          fireCannonball(
            ship.x + rightX * sideOffset + forwardX * forwardOffset,
            ship.y + rightY * sideOffset + forwardY * forwardOffset,
            rightAngle,
          );
        }
      };
      nextApp.canvas.addEventListener("pointerdown", handlePointerDown);

      let islandDamageCooldown = 0;
      let enemyBulletDamageCooldown = 0;
      let enemySpawnTimer = enemySpawnIntervalSeconds;
      let displayedTimeRemaining = sessionTimeSeconds;
      updateWorld = () => {
        if (isPausedRef.current) return;

        const deltaSeconds = nextApp.ticker.deltaMS / 1000;
        for (let index = explosions.length - 1; index >= 0; index--) {
          const explosion = explosions[index];
          explosion.lifetime -= deltaSeconds;
          if (explosion.lifetime > 0) continue;

          world.removeChild(explosion.sprite);
          explosions.splice(index, 1);
        }
        if (shipLivesRef.current <= 0 || timeRemainingRef.current <= 0) return;

        timeRemainingRef.current = Math.max(
          0,
          timeRemainingRef.current - deltaSeconds,
        );
        const nextDisplayedTime = Math.ceil(timeRemainingRef.current);
        if (nextDisplayedTime !== displayedTimeRemaining) {
          displayedTimeRemaining = nextDisplayedTime;
          setTimeRemaining(nextDisplayedTime);
        }
        if (timeRemainingRef.current === 0) {
          for (const cannonball of cannonballs) {
            world.removeChild(cannonball.sprite);
          }
          cannonballs.length = 0;
          return;
        }

        islandDamageCooldown = Math.max(0, islandDamageCooldown - deltaSeconds);
        enemyBulletDamageCooldown = Math.max(
          0,
          enemyBulletDamageCooldown - deltaSeconds,
        );
        const movingForward = pressedKeys.current.has("w");
        const movingBackward = pressedKeys.current.has("s");
        const direction = Number(movingForward) - Number(movingBackward);

        if (direction !== 0) {
          const forwardAngle = ship.rotation + Math.PI / 2;
          const distance = direction * SHIP_SPEED * deltaSeconds;
          let nextShipX = ship.x + Math.cos(forwardAngle) * distance;
          let nextShipY = ship.y + Math.sin(forwardAngle) * distance;
          const shipRadius = Math.hypot(ship.width, ship.height) / 2;
          let collidedWithIsland = false;

          for (let pass = 0; pass < 2; pass++) {
            for (const island of islands.values()) {
              const islandRadius =
                Math.max(island.width, island.height) *
                ISLAND_COLLISION_RADIUS_FACTOR;
              const minimumDistance = shipRadius + islandRadius;
              const dx = nextShipX - island.x;
              const dy = nextShipY - island.y;
              const distanceFromIsland = Math.hypot(dx, dy);

              if (distanceFromIsland >= minimumDistance) continue;

              collidedWithIsland = true;
              const previousDx = ship.x - island.x;
              const previousDy = ship.y - island.y;
              const previousDistance = Math.hypot(previousDx, previousDy);
              const normalX =
                distanceFromIsland > 0
                  ? dx / distanceFromIsland
                  : previousDistance > 0
                    ? previousDx / previousDistance
                    : -Math.cos(forwardAngle);
              const normalY =
                distanceFromIsland > 0
                  ? dy / distanceFromIsland
                  : previousDistance > 0
                    ? previousDy / previousDistance
                    : -Math.sin(forwardAngle);
              nextShipX = island.x + normalX * minimumDistance;
              nextShipY = island.y + normalY * minimumDistance;
            }
          }

          if (collidedWithIsland && islandDamageCooldown === 0) {
            const nextLives = Math.max(
              0,
              shipLivesRef.current - ISLAND_COLLISION_DAMAGE,
            );
            shipLivesRef.current = nextLives;
            setShipLives(nextLives);
            islandDamageCooldown = ISLAND_DAMAGE_COOLDOWN_SECONDS;

            if (nextLives === 0) {
              for (const cannonball of cannonballs) {
                world.removeChild(cannonball.sprite);
              }
              cannonballs.length = 0;
            }
          }

          ship.position.set(nextShipX, nextShipY);
        }

        if (shipLivesRef.current <= 0) return;

        const shipCollisionRadius = Math.hypot(ship.width, ship.height) / 2;
        for (
          let enemyIndex = enemyShips.length - 1;
          enemyIndex >= 0;
          enemyIndex--
        ) {
          const enemy = enemyShips[enemyIndex];
          let dx = ship.x - enemy.container.x;
          let dy = ship.y - enemy.container.y;
          let distanceToPlayer = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx);
          const movementDistance = Math.min(
            (enemy.kind === "seakker" ? SEAKKER_SHIP_SPEED : ENEMY_SHIP_SPEED) *
              deltaSeconds,
            distanceToPlayer,
          );
          const nextX = enemy.container.x + Math.cos(angle) * movementDistance;
          const nextY = enemy.container.y + Math.sin(angle) * movementDistance;
          const collidesWithIsland = Array.from(islands.values()).some(
            (island) => {
              const islandRadius =
                Math.max(island.width, island.height) *
                ISLAND_COLLISION_RADIUS_FACTOR;
              return (
                Math.hypot(nextX - island.x, nextY - island.y) <
                enemy.collisionRadius + islandRadius
              );
            },
          );

          if (!collidesWithIsland) {
            enemy.container.position.set(nextX, nextY);
          }

          dx = ship.x - enemy.container.x;
          dy = ship.y - enemy.container.y;
          distanceToPlayer = Math.hypot(dx, dy);
          enemy.sprite.rotation = Math.atan2(dy, dx) - Math.PI / 2;

          if (
            enemy.kind === "seakker" &&
            distanceToPlayer < enemy.collisionRadius + shipCollisionRadius
          ) {
            const nextLives = Math.max(
              0,
              shipLivesRef.current - SEAKKER_COLLISION_DAMAGE,
            );
            shipLivesRef.current = nextLives;
            setShipLives(nextLives);
            createExplosion(
              enemy.container.x,
              enemy.container.y,
              enemy.collisionRadius * 2.5,
            );
            world.removeChild(enemy.container);
            enemyShips.splice(enemyIndex, 1);

            if (nextLives === 0) {
              for (const cannonball of cannonballs) {
                world.removeChild(cannonball.sprite);
              }
              cannonballs.length = 0;
              return;
            }
            continue;
          }

          if (enemy.kind === "seakker") continue;

          enemy.shotCooldown -= deltaSeconds;

          if (
            enemy.shotCooldown <= 0 &&
            distanceToPlayer <= ENEMY_DESPAWN_DISTANCE
          ) {
            const muzzleOffset = enemy.collisionRadius * 0.8;
            fireCannonball(
              enemy.container.x + Math.cos(angle) * muzzleOffset,
              enemy.container.y + Math.sin(angle) * muzzleOffset,
              angle,
              "enemy",
            );
            enemy.shotCooldown =
              ENEMY_SHOT_INTERVAL_SECONDS +
              Math.random() * ENEMY_SHOT_INTERVAL_VARIATION_SECONDS;
          }
        }

        for (let index = cannonballs.length - 1; index >= 0; index--) {
          const cannonball = cannonballs[index];
          cannonball.sprite.x += cannonball.velocityX * deltaSeconds;
          cannonball.sprite.y += cannonball.velocityY * deltaSeconds;
          cannonball.lifetime -= deltaSeconds;

          let hitEnemy = false;
          let hitPlayer = false;
          if (cannonball.owner === "player") {
            for (
              let enemyIndex = enemyShips.length - 1;
              enemyIndex >= 0;
              enemyIndex--
            ) {
              const enemy = enemyShips[enemyIndex];
              const dx = cannonball.sprite.x - enemy.container.x;
              const dy = cannonball.sprite.y - enemy.container.y;
              if (
                Math.hypot(dx, dy) >=
                enemy.collisionRadius + cannonball.sprite.width / 2
              ) {
                continue;
              }

              enemy.lives -= 1;
              hitEnemy = true;
              if (enemy.lives === 0) {
                world.removeChild(enemy.container);
                enemyShips.splice(enemyIndex, 1);
                scoreRef.current += ENEMY_KILL_POINTS;
                setScore(scoreRef.current);
                createExplosion(
                  enemy.container.x,
                  enemy.container.y,
                  enemy.collisionRadius * 2,
                );
              } else {
                updateEnemyHealthBar(enemy);
              }
              break;
            }
          } else {
            const dx = cannonball.sprite.x - ship.x;
            const dy = cannonball.sprite.y - ship.y;
            const shipRadius = Math.hypot(ship.width, ship.height) / 2;
            if (Math.hypot(dx, dy) < shipRadius + cannonball.sprite.width / 2) {
              hitPlayer = true;
              if (enemyBulletDamageCooldown === 0) {
                const nextLives = Math.max(0, shipLivesRef.current - 1);
                shipLivesRef.current = nextLives;
                setShipLives(nextLives);
                enemyBulletDamageCooldown =
                  ENEMY_BULLET_DAMAGE_COOLDOWN_SECONDS;
              }
            }
          }

          let hitIsland = false;
          if (!hitEnemy && !hitPlayer) {
            for (const island of islands.values()) {
              const dx = cannonball.sprite.x - island.x;
              const dy = cannonball.sprite.y - island.y;
              const islandRadius =
                Math.max(island.width, island.height) *
                ISLAND_COLLISION_RADIUS_FACTOR;
              if (Math.hypot(dx, dy) < islandRadius) {
                hitIsland = true;
                break;
              }
            }
          }

          if (cannonball.lifetime <= 0 || hitIsland || hitEnemy || hitPlayer) {
            world.removeChild(cannonball.sprite);
            cannonballs.splice(index, 1);
          }
        }

        if (shipLivesRef.current <= 0) {
          for (const cannonball of cannonballs) {
            world.removeChild(cannonball.sprite);
          }
          cannonballs.length = 0;
          return;
        }

        world.position.set(
          nextApp.screen.width / 2 - ship.x,
          nextApp.screen.height / 2 - ship.y,
        );
        updateIslands();

        for (let index = enemyShips.length - 1; index >= 0; index--) {
          const enemy = enemyShips[index];
          if (
            Math.hypot(
              enemy.container.x - ship.x,
              enemy.container.y - ship.y,
            ) <= ENEMY_DESPAWN_DISTANCE
          ) {
            continue;
          }

          world.removeChild(enemy.container);
          enemyShips.splice(index, 1);
        }

        enemySpawnTimer -= deltaSeconds;
        if (enemySpawnTimer <= 0) {
          if (enemyShips.length >= ENEMY_MAX_ACTIVE) {
            enemySpawnTimer = enemySpawnIntervalSeconds;
          } else if (
            spawnEnemyShip(
              Math.random() < SEAKKER_SPAWN_CHANCE ? "seakker" : "shooter",
            )
          ) {
            enemySpawnTimer = enemySpawnIntervalSeconds;
          } else {
            enemySpawnTimer = 1;
          }
        }
      };
      nextApp.ticker.add(updateWorld);
      host.appendChild(nextApp.canvas);
    };
    void inicializate(host).catch((error: unknown) => {
      if (disposed) return;

      console.error("Failed to initialize the game stage:", error);
      setInitializationError(
        "Não foi possível carregar o jogo. Recarregue a página para tentar novamente.",
      );
    });
    return () => {
      disposed = true;
      if (app && handlePointerDown) {
        app.canvas.removeEventListener("pointerdown", handlePointerDown);
      }
      if (app && updateWorld) {
        app.ticker.remove(updateWorld);
      }
      spriteRef.current = null;
      appRef.current = null;
      canvasRef.current = null;
      fireLeftBroadsideRef.current = null;
      fireRightBroadsideRef.current = null;
      app?.destroy({ removeView: true });
    };
  }, [
    appRef,
    canvasRef,
    enemySpawnIntervalSeconds,
    fireLeftBroadsideRef,
    fireRightBroadsideRef,
    hostRef,
    isPausedRef,
    lastShotAt,
    mousePosition,
    pressedKeys,
    restartCount,
    scoreRef,
    sessionTimeSeconds,
    setInitializationError,
    setScore,
    setShipLives,
    setTimeRemaining,
    shipLivesRef,
    spriteRef,
    timeRemainingRef,
  ]);
};
