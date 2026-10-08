import panelMenu from "../../assets/png/retina/ui/menu/panel_menu.png";
import primaryButton from "../../assets/png/retina/ui/menu/button_primary_normal.png";
import primaryButtonHover from "../../assets/png/retina/ui/menu/button_primary_hover.png";

const rankingEntries = [
  { position: 1, player: "Player One", score: 284 },
  { position: 2, player: "Player Two", score: 231 },
  { position: 3, player: "Player Three", score: 198 },
  { position: 4, player: "Player Four", score: 142 },
  { position: 5, player: "Player Five", score: 96 },
];

type RankingProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Ranking_Menu = ({ isOpen, onClose }: RankingProps) => {
  return (
    <section
      aria-labelledby="ranking-menu-title"
      className={`absolute z-100 aspect-[755/960] w-[min(90vw,30rem)] bg-contain bg-center ${isOpen ? "" : "hidden"} `}
      style={{ backgroundImage: `url(${panelMenu})` }}
    >
      <h2
        id="ranking-menu-title"
        className="absolute inset-x-0 top-[15%] text-center text-3xl font-bold text-amber-100 drop-shadow-md"
      >
        Ranking
      </h2>
      <div className="absolute inset-x-[12%] top-[27%] text-amber-100">
        <div className="grid grid-cols-[2.5rem_1fr_4rem] px-3 pb-2 text-xs font-bold uppercase tracking-wider text-amber-100/70">
          <span>#</span>
          <span>Player</span>
          <span className="text-right">Score</span>
        </div>
        <ol aria-label="Top players" className="space-y-1">
          {rankingEntries.map(({ position, player, score }) => (
            <li
              key={position}
              className="grid grid-cols-[2.5rem_1fr_4rem] items-center rounded-sm border-b border-amber-100/15 bg-slate-950/20 px-3 py-2 text-sm"
            >
              <span
                className={
                  position <= 3
                    ? "font-bold text-amber-300"
                    : "text-amber-100/70"
                }
              >
                {String(position).padStart(2, "0")}
              </span>
              <span className="truncate font-medium">{player}</span>
              <span className="text-right font-bold tabular-nums">{score}</span>
            </li>
          ))}
        </ol>
      </div>
      <button
        type="button"
        className="cursor-pointer group absolute left-1/2 top-[78%] h-[9%] w-[46%] -translate-x-1/2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
        onClick={() => onClose()}
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
          Main Menu
        </span>
      </button>
    </section>
  );
};
