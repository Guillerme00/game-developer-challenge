import { useState } from "react";
import panelMenu from "../../assets/png/retina/ui/menu/panel_menu.png";
import roundButton from "../../assets/png/retina/ui/controls/button_round_normal.png";
import roundButtonHover from "../../assets/png/retina/ui/controls/button_round_hover.png";
import roundButtonPressed from "../../assets/png/retina/ui/controls/button_round_pressed.png";
import iconMinus from "../../assets/png/retina/ui/controls/icon_minus.png";
import iconPlus from "../../assets/png/retina/ui/controls/icon_plus.png";
import primaryButton from "../../assets/png/retina/ui/menu/button_primary_normal.png";
import primaryButtonHover from "../../assets/png/retina/ui/menu/button_primary_hover.png";

type StepButtonProps = {
  icon: string;
  label: string;
  onClick: () => void;
  disabled: boolean;
};

type SettingStepperProps = {
  title: string;
  value: string;
  range: string;
  top: string;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
};

type OptionsProps = {
  isOpen: boolean;
  onClose: () => void;
};

const StepButton = ({ icon, label, onClick, disabled }: StepButtonProps) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="group relative grid size-11 shrink-0 cursor-pointer place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100 disabled:cursor-not-allowed disabled:opacity-45"
  >
    <img
      src={roundButton}
      alt=""
      className="absolute inset-0 size-full transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
    />
    <img
      src={roundButtonHover}
      alt=""
      className="absolute inset-0 size-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
    />
    <img
      src={roundButtonPressed}
      alt=""
      className="absolute inset-0 size-full opacity-0 group-active:opacity-100"
    />
    <img src={icon} alt="" className="relative z-10 size-5 object-contain" />
  </button>
);

const SettingStepper = ({
  title,
  value,
  range,
  top,
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
}: SettingStepperProps) => {
  const titleId = title.toLowerCase().replaceAll(" ", "-");

  return (
    <div className={`absolute inset-x-[14%] ${top} text-center text-amber-100`}>
      <h3 id={titleId} className="text-sm font-semibold sm:text-base">
        {title}
      </h3>
      <div className="mt-3 flex items-center justify-center gap-5 sm:gap-7">
        <StepButton
          icon={iconMinus}
          label={`Decrease ${title.toLowerCase()}`}
          onClick={onDecrease}
          disabled={decreaseDisabled}
        />
        <output
          aria-labelledby={titleId}
          className="min-w-24 text-2xl font-bold tabular-nums text-amber-50"
        >
          {value}
        </output>
        <StepButton
          icon={iconPlus}
          label={`Increase ${title.toLowerCase()}`}
          onClick={onIncrease}
          disabled={increaseDisabled}
        />
      </div>
      <p className="mt-2 text-xs text-amber-100/75">{range}</p>
    </div>
  );
};

export const Options_Menu = ({ isOpen, onClose }: OptionsProps) => {
  const [sessionTimeSeconds, setSessionTimeSeconds] = useState(120);
  const [spawnIntervalHalfSeconds, setSpawnIntervalHalfSeconds] = useState(8);

  const spawnIntervalSeconds = spawnIntervalHalfSeconds / 2;

  return (
    <section
      aria-labelledby="options-menu-title"
      id="options-menu-panel"
      className={`absolute z-100 aspect-[755/960] w-[min(90vw,30rem)] bg-contain bg-center ${isOpen ? "" : "hidden"}`}
      style={{ backgroundImage: `url(${panelMenu})` }}
    >
      <h2
        id="options-menu-title"
        className="absolute inset-x-0 top-[15%] text-center text-3xl font-bold text-amber-100 drop-shadow-md"
      >
        Options
      </h2>
      <SettingStepper
        title="Game session time"
        value={`${sessionTimeSeconds / 60} min`}
        range="Range: 1-3 min"
        top="top-[27%]"
        onDecrease={() =>
          setSessionTimeSeconds((current) => Math.max(60, current - 30))
        }
        onIncrease={() =>
          setSessionTimeSeconds((current) => Math.min(180, current + 30))
        }
        decreaseDisabled={sessionTimeSeconds === 60}
        increaseDisabled={sessionTimeSeconds === 180}
      />
      <SettingStepper
        title="Enemy spawn interval"
        value={`${spawnIntervalSeconds.toFixed(1)} s`}
        range="Range: 3-10 s · Step: 0.5 s"
        top="top-[49%]"
        onDecrease={() =>
          setSpawnIntervalHalfSeconds((current) => Math.max(6, current - 1))
        }
        onIncrease={() =>
          setSpawnIntervalHalfSeconds((current) => Math.min(20, current + 1))
        }
        decreaseDisabled={spawnIntervalHalfSeconds === 6}
        increaseDisabled={spawnIntervalHalfSeconds === 20}
      />
      <button
        type="button"
        className="cursor-pointer group absolute left-1/2 top-[78%] h-[9%] w-[46%] -translate-x-1/2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
        onClick={onClose}
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
