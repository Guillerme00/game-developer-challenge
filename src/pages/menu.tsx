import homeBackground from "../../assets/png/retina/ui/menu/home_background.png";
import MenuPlay from "../../assets/png/retina/ui/menu/title_pirate_battle.png";
import controlKeyBackground from "../../assets/png/retina/ui/menu/button_primary_normal.png";

import { Main_Button } from "../components/main_button";
import { Secondary_Button } from "../components/secondary_button";

const ControlKey = ({
  label,
  wide = false,
}: {
  label: string;
  wide?: boolean;
}) => (
  <kbd
    className={`relative grid h-10 ${wide ? "w-24" : "w-10"} shrink-0 place-items-center font-mono text-sm font-bold text-slate-950`}
  >
    <img
      src={controlKeyBackground}
      alt=""
      className="absolute inset-0 h-full w-full object-fill"
    />
    <span className="relative z-10">{label}</span>
  </kbd>
);

export const MenuPage = () => {
  return (
    <div
      className="h-full w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${homeBackground})` }}
    >
      {/* Menu */}
      <div className="flex flex-col items-center justify-center gap-[8px]">
        <img src={MenuPlay} alt="pirate battle menu logo" />
        <Main_Button label="Play" />
        <Main_Button label="Options" />
        {/* Ranking e Match History */}
        <div>
          <Secondary_Button label="Ranking" />
          <Secondary_Button label="Match History" />
        </div>
        <section
          aria-label="Game controls"
          className="mt-8 w-[min(92vw,56rem)] rounded-md border border-white/20 px-4 py-3 text-white shadow-lg backdrop-blur-sm"
        >
          <ul className="mt-3 grid grid-cols-2 items-end gap-4 text-center sm:grid-cols-3 lg:grid-cols-5">
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
              <ControlKey label="MOUSE" wide />
            </li>
            <li className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold">Fire front</span>
              <div className="flex gap-2">
                <ControlKey label="R" />
                <ControlKey label="M1" />
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
      </div>
    </div>
  );
};
