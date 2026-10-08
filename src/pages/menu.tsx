import homeBackground from "../../assets/png/retina/ui/menu/home_background.png";
import MenuPlay from "../../assets/png/retina/ui/menu/title_pirate_battle.png";
import controlKeyBackground from "../../assets/png/retina/ui/menu/button_primary_normal.png";

import { Main_Button } from "../components/main_button";
import { Secondary_Button } from "../components/secondary_button";
import { Options_Menu } from "../components/options_menu";
import { useState } from "react";
import { Main_Button_Click } from "../components/main_button_click";
import { Ranking_Menu } from "../components/Ranking_menu";
import { Match_History_Menu } from "../components/match_history_menu";

const ControlKey = ({ label }: { label: string }) => (
  <kbd className="relative grid h-10 w-10 shrink-0 place-items-center font-mono text-sm font-bold text-slate-950">
    <img
      src={controlKeyBackground}
      alt=""
      className="absolute inset-0 h-full w-full object-fill"
    />
    <span className="relative z-10">{label}</span>
  </kbd>
);

const ControlMouse = ({
  label,
  description,
  wide = false,
}: {
  label: string;
  description: string;
  wide?: boolean;
}) => (
  <span
    role="img"
    aria-label={description}
    className={`relative grid h-10 ${wide ? "w-24" : "w-10"} shrink-0 place-items-center font-mono text-sm font-bold text-slate-950`}
  >
    <img
      src={controlKeyBackground}
      alt=""
      className="absolute inset-0 h-full w-full object-fill"
    />
    <span aria-hidden="true" className="relative z-10">
      {label}
    </span>
  </span>
);

export const MenuPage = () => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const toggleOptions = () => {
    setIsOptionsOpen((isOpen) => !isOpen);
  };
  const toggleRanking = () => {
    setIsRankingOpen((isOpen) => !isOpen);
  };
  const toggleHistory = () => {
    setIsHistoryOpen((isOpen) => !isOpen);
  };

  const closeOptions = () => setIsOptionsOpen(false);

  return (
    <div
      className="min-h-dvh w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${homeBackground})` }}
    >
      {/* Menu */}
      <div className="flex flex-col items-center justify-center gap-[8px]">
        <img src={MenuPlay} alt="pirate battle menu logo" />
        <Main_Button label="Play" />
        <Main_Button_Click label="Options" click={toggleOptions} />
        {/* Ranking e Match History */}
        <div>
          <Secondary_Button label="Ranking" onClick={toggleRanking} />
          <Secondary_Button label="Match History" onClick={toggleHistory} />
        </div>
        <section
          aria-label="Game controls"
          className="mt-8 w-[min(92vw,56rem)] rounded-md border border-white/20 px-4 py-3 text-white shadow-lg backdrop-blur-sm"
        >
          <ul className="mt-3 grid grid-cols-1 items-end gap-4 text-center md:grid-cols-2 lg:grid-cols-5">
            <li className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold">Move</span>
              <div className="grid grid-cols-3 gap-1">
                <span />
                <ControlKey label="W" />
                <span />
                <ControlKey label="A" />
                <ControlKey label="S" />
                <ControlKey label="D" />
              </div>
            </li>
            <li className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold">Aim</span>
              <ControlMouse label="MOUSE" description="Mouse pointer" wide />
            </li>
            <li className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold">Fire front</span>
              <div className="flex gap-2">
                <ControlKey label="R" />
                <ControlMouse label="M1" description="Mouse button 1" />
              </div>
            </li>
            <li className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold">Fire left</span>
              <ControlKey label="Q" />
            </li>
            <li className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold">Fire right</span>
              <ControlKey label="E" />
            </li>
          </ul>
        </section>
        <Options_Menu isOpen={isOptionsOpen} onClose={closeOptions} />
        <Ranking_Menu isOpen={isRankingOpen} onClose={toggleRanking} />
        <Match_History_Menu isOpen={isHistoryOpen} onClose={toggleHistory} />
      </div>
    </div>
  );
};
