import panelMenu from "../../assets/png/retina/ui/menu/panel_menu.png";
import primaryButton from "../../assets/png/retina/ui/menu/button_primary_normal.png";
import primaryButtonHover from "../../assets/png/retina/ui/menu/button_primary_hover.png";

type MatchHistoryEntry = {
  id: string;
  dateTime: string;
  dateLabel: string;
  score: number;
  duration: string;
  result: "TIME UP" | "DEFEATED";
};

type MatchHistoryProps = {
  isOpen: boolean;
  onClose: () => void;
};

const matchHistory: MatchHistoryEntry[] = [
  {
    id: "match-1",
    dateTime: "2026-10-08T19:36:00",
    dateLabel: "08 OCT / 19:36",
    score: 24,
    duration: "02:00",
    result: "TIME UP",
  },
  {
    id: "match-2",
    dateTime: "2026-10-08T19:28:00",
    dateLabel: "08 OCT / 19:28",
    score: 18,
    duration: "01:42",
    result: "DEFEATED",
  },
  {
    id: "match-3",
    dateTime: "2026-10-08T19:20:00",
    dateLabel: "08 OCT / 19:20",
    score: 22,
    duration: "02:00",
    result: "TIME UP",
  },
  {
    id: "match-4",
    dateTime: "2026-10-08T19:12:00",
    dateLabel: "08 OCT / 19:12",
    score: 11,
    duration: "01:18",
    result: "DEFEATED",
  },
  {
    id: "match-5",
    dateTime: "2026-10-07T22:05:00",
    dateLabel: "07 OCT / 22:05",
    score: 20,
    duration: "02:00",
    result: "TIME UP",
  },
];

export const Match_History_Menu = ({ isOpen, onClose }: MatchHistoryProps) => {
  return (
    <section
      aria-labelledby="match-history-title"
      className={`absolute z-100 aspect-[755/960] w-[min(90vw,30rem)] bg-contain bg-center ${isOpen ? "" : "hidden"}`}
      style={{ backgroundImage: `url(${panelMenu})` }}
    >
      <h2
        id="match-history-title"
        className="absolute inset-x-0 top-[15%] text-center text-3xl font-bold text-amber-100 drop-shadow-md"
      >
        Match History
      </h2>
      <p className="absolute inset-x-0 top-[23%] text-center text-xs font-semibold uppercase tracking-wider text-amber-100/70">
        Your recent battles
      </p>
      <div className="absolute inset-x-[9%] top-[29%] text-amber-100">
        <table className="w-full table-fixed border-separate border-spacing-y-1 text-left">
          <thead className="text-[9px] font-bold uppercase tracking-wider text-amber-100/65 sm:text-[10px]">
            <tr>
              <th scope="col" className="w-[39%] px-2 pb-1">
                Date
              </th>
              <th scope="col" className="w-[15%] px-1 pb-1 text-right">
                Points
              </th>
              <th scope="col" className="w-[19%] px-1 pb-1 text-right">
                Time
              </th>
              <th scope="col" className="w-[27%] px-2 pb-1 text-right">
                Result
              </th>
            </tr>
          </thead>
          <tbody className="text-[10px] sm:text-xs">
            {matchHistory.map((match, index) => (
              <tr
                key={match.id}
                className={index === 0 ? "bg-amber-300/20" : "bg-slate-950/45"}
              >
                <td className="rounded-l px-2 py-2 font-medium">
                  <time dateTime={match.dateTime}>{match.dateLabel}</time>
                </td>
                <td className="px-1 py-2 text-right font-bold tabular-nums text-amber-300">
                  {match.score}
                </td>
                <td className="px-1 py-2 text-right font-medium tabular-nums">
                  {match.duration}
                </td>
                <td
                  className={`rounded-r px-2 py-2 text-right text-[9px] font-bold sm:text-[10px] ${match.result === "TIME UP" ? "text-emerald-200" : "text-rose-200"}`}
                >
                  {match.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="absolute inset-x-0 top-[68%] flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-amber-100/80">
        <button
          type="button"
          aria-label="Previous page"
          className="grid size-8 place-items-center rounded-full border border-amber-300/50 bg-amber-300/10 text-lg text-amber-200"
        >
          &lt;
        </button>
        <span>Page 1 of 2</span>
        <button
          type="button"
          aria-label="Next page"
          className="grid size-8 place-items-center rounded-full border border-amber-300/50 bg-amber-300/10 text-lg text-amber-200"
        >
          &gt;
        </button>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="cursor-pointer group absolute left-1/2 top-[78%] h-[9%] w-[46%] -translate-x-1/2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
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
