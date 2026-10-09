import { useEffect, useRef, useState } from "react";
import { Application, Assets, Sprite } from "pixi.js";
import shipImage from "../../assets/png/default/ships/ship_1.png";

type Mouse = {
  x: number;
  y: number;
};

export const Game_Stage = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<Sprite | null>(null);
  const [mousePosition, setMousePosition] = useState<Mouse>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;
    const dx = mousePosition.x - sprite.position.x;
    const dy = mousePosition.y - sprite.position.y;

    sprite.rotation = Math.atan2(dy, dx) - Math.PI / 2;
  }, [mousePosition]);

  useEffect(() => {
    const host = hostRef.current;
    let app: Application | undefined;
    let disposed = false;

    if (!host) return;

    const inicializate = async (host: HTMLDivElement) => {
      const texture = await Assets.load(shipImage);
      const sprite = new Sprite(texture);

      sprite.anchor.set(0.5);
      sprite.position.set(window.innerWidth / 2, window.innerHeight / 2);

      const nextApp = new Application();
      await nextApp.init({
        background: "#002c69",
        resizeTo: host,
      });

      if (disposed) {
        nextApp.destroy({ removeView: true });
        return;
      }

      nextApp.stage.addChild(sprite);
      spriteRef.current = sprite;
      app = nextApp;
      host.appendChild(nextApp.canvas);
    };
    void inicializate(host);
    return () => {
      disposed = true;
      app?.destroy({ removeView: true });
    };
  }, []);

  return <div ref={hostRef} className="h-dvh w-full"></div>;
};
