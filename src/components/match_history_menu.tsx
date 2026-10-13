import panelMenu from "../../assets/png/retina/ui/menu/panel_menu.png";
import primaryButton from "../../assets/png/retina/ui/menu/button_primary_normal.png";
import primaryButtonHover from "../../assets/png/retina/ui/menu/button_primary_hover.png";
import type { MatchHistoryEntry } from "../types/match_history";

type MatchHistoryProps = {
  isOpen: boolean;
  onClose: () => void;
  matches: MatchHistoryEntry[];
};

const formatDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const getEndReasonLabel = (endReason: MatchHistoryEntry["endReason"]) => {
  switch (endReason) {
    case "time-expired":
      return "Time ended";
    case "ship-destroyed":
      return "Ship destroyed";
    case "returned-to-menu":
      return "Left match";
  }
};

export const Match_History_Menu = ({
  isOpen,
  onClose,
  matches,
}: MatchHistoryProps) => {
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
      <div className="absolute inset-x-[9%] top-[29%] bottom-[22%] overflow-y-auto text-amber-100">
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
            {matches.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-2 py-8 text-center text-sm text-amber-100/75"
                >
                  No matches recorded yet.
                </td>
              </tr>
            ) : (
              matches.map((match) => (
                <tr key={match.id} className="bg-slate-950/45">
                  <td className="rounded-l px-2 py-2 font-medium">
                    <time dateTime={match.dateTime}>
                      {new Date(match.dateTime).toLocaleString()}
                    </time>
                  </td>
                  <td className="px-1 py-2 text-right font-bold tabular-nums text-amber-300">
                    {match.score}
                  </td>
                  <td className="px-1 py-2 text-right font-medium tabular-nums">
                    {formatDuration(match.durationSeconds)}
                  </td>
                  <td className="rounded-r px-2 py-2 text-right text-[9px] font-bold sm:text-[10px]">
                    {getEndReasonLabel(match.endReason)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
