import panelMenu from "../../assets/png/retina/ui/menu/panel_menu.png";
import primaryButton from "../../assets/png/retina/ui/menu/button_primary_normal.png";
import primaryButtonHover from "../../assets/png/retina/ui/menu/button_primary_hover.png";
import heartIcon from "../../assets/png/retina/ui/hud/icon_heart.png";
import scoreIcon from "../../assets/png/retina/ui/hud/icon_score.png";
import timeIcon from "../../assets/png/retina/ui/hud/icon_time.png";
import counterPanel from "../../assets/png/retina/ui/hud/counter_panel.png";

type GameHudProps = {
  shipLives: number;
  maxShipLives: number;
  score: number;
  timeRemaining: number;
  isPaused: boolean;
  initializationError: string | null;
  onResume: () => void;
  onRestart: () => void;
  onReturnToMenu: () => void;
};

export const Game_Hud = ({
  shipLives,
  maxShipLives,
  score,
  timeRemaining,
  isPaused,
  initializationError,
  onResume,
  onRestart,
  onReturnToMenu,
}: GameHudProps) => (
  <>
    <div
      role="status"
      aria-label="Vida do barco"
      className="pointer-events-none absolute left-4 top-4 z-10 flex aspect-[320/96] w-[min(28vw,11rem)] items-center justify-center gap-1 bg-contain bg-center bg-no-repeat text-sm font-semibold text-amber-100 sm:gap-2 sm:text-base"
      style={{ backgroundImage: `url(${counterPanel})` }}
    >
      <img src={heartIcon} alt="" className="size-6 object-contain sm:size-8" />
      <span>
        {shipLives}/{maxShipLives}
      </span>
    </div>
    <div
      role="status"
      aria-label="Pontuação"
      className="pointer-events-none absolute right-4 top-4 z-10 flex aspect-[320/96] w-[min(28vw,11rem)] items-center justify-center gap-1 bg-contain bg-center bg-no-repeat text-sm font-semibold text-amber-100 sm:gap-2 sm:text-base"
      style={{ backgroundImage: `url(${counterPanel})` }}
    >
      <img src={scoreIcon} alt="" className="size-6 object-contain sm:size-8" />
      <span>{score}</span>
    </div>
    <div
      role="timer"
      aria-label="Tempo restante"
      className="pointer-events-none absolute left-1/2 top-4 z-10 flex aspect-[320/96] w-[min(28vw,11rem)] -translate-x-1/2 items-center justify-center gap-1 bg-contain bg-center bg-no-repeat text-sm font-semibold text-amber-100 sm:gap-2 sm:text-base"
      style={{ backgroundImage: `url(${counterPanel})` }}
    >
      <img src={timeIcon} alt="" className="size-6 object-contain sm:size-8" />
      <span className="tabular-nums">{timeRemaining} s</span>
    </div>
    {isPaused && shipLives > 0 && timeRemaining > 0 && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-menu-title"
        className="absolute inset-0 z-20 grid place-items-center bg-slate-950/60"
      >
        <section
          className="relative aspect-[755/960] w-[min(90vw,30rem)] bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${panelMenu})` }}
        >
          <h2
            id="pause-menu-title"
            className="absolute inset-x-0 top-[19%] text-center text-3xl font-bold text-amber-100 drop-shadow-md"
          >
            Pausado
          </h2>
          <button
            type="button"
            autoFocus
            className="group absolute left-1/2 top-[44%] h-[9%] w-[46%] -translate-x-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
            onClick={onResume}
          >
            <img
              src={primaryButton}
              alt=""
              className="absolute inset-0 size-full transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
            />
            <img
              src={primaryButtonHover}
              alt=""
              className="absolute inset-0 size-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            <span className="relative z-10 text-sm font-bold text-[oklch(28.2%_0.091_267.935)] sm:text-base">
              Continuar
            </span>
          </button>
          <button
            type="button"
            className="group absolute left-1/2 top-[58%] h-[9%] w-[46%] -translate-x-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
            onClick={onReturnToMenu}
          >
            <img
              src={primaryButton}
              alt=""
              className="absolute inset-0 size-full transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
            />
            <img
              src={primaryButtonHover}
              alt=""
              className="absolute inset-0 size-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            <span className="relative z-10 text-sm font-bold text-[oklch(28.2%_0.091_267.935)] sm:text-base">
              Voltar ao menu
            </span>
          </button>
        </section>
      </div>
    )}
    {(shipLives === 0 || timeRemaining === 0) && (
      <div
        role="alert"
        aria-labelledby="game-over-title"
        className="absolute inset-0 z-20 grid place-items-center bg-slate-950/60"
      >
        <section
          className="relative aspect-[755/960] w-[min(90vw,30rem)] bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${panelMenu})` }}
        >
          <h2
            id="game-over-title"
            className="absolute inset-x-0 top-[15%] text-center text-3xl font-bold text-amber-100 drop-shadow-md"
          >
            Fim de jogo
          </h2>
          <p className="absolute inset-x-0 top-[35%] text-center text-2xl font-bold text-amber-50">
            Pontuação: {score}
          </p>
          <button
            type="button"
            className="group absolute left-1/2 top-[52%] h-[9%] w-[46%] -translate-x-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
            onClick={onRestart}
          >
            <img
              src={primaryButton}
              alt=""
              className="absolute inset-0 size-full transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
            />
            <img
              src={primaryButtonHover}
              alt=""
              className="absolute inset-0 size-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            <span className="relative z-10 text-sm font-bold text-[oklch(28.2%_0.091_267.935)] sm:text-base">
              Reiniciar
            </span>
          </button>
          <button
            type="button"
            className="group absolute left-1/2 top-[66%] h-[9%] w-[46%] -translate-x-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
            onClick={onReturnToMenu}
          >
            <img
              src={primaryButton}
              alt=""
              className="absolute inset-0 size-full transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
            />
            <img
              src={primaryButtonHover}
              alt=""
              className="absolute inset-0 size-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            <span className="relative z-10 text-sm font-bold text-[oklch(28.2%_0.091_267.935)] sm:text-base">
              Voltar ao menu
            </span>
          </button>
        </section>
      </div>
    )}
    {initializationError && (
      <p
        role="alert"
        className="absolute inset-x-0 top-16 z-20 p-4 text-center text-white"
      >
        {initializationError}
      </p>
    )}
  </>
);
