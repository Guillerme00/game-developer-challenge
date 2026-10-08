import primaryButton from "../../assets/png/retina/ui/menu/button_primary_normal.png";
import primaryButtonHover from "../../assets/png/retina/ui/menu/button_primary_hover.png";

type MainButtonProps = {
  label: string;
  onClick?: () => void;
};

export const Secondary_Button = ({ label, onClick }: MainButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-14 w-48 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <img
        src={primaryButton}
        alt=""
        className="absolute inset-0 h-full w-full object-fill group-hover:opacity-0 group-focus-visible:opacity-0"
      />
      <img
        src={primaryButtonHover}
        alt=""
        className="absolute inset-0 h-full w-full object-fill opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span className="relative z-10 text-xl font-bold text-oklch(28.2% 0.091 267.935)">
        {label}
      </span>
    </button>
  );
};
