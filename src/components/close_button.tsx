import closeIcon from "../../assets/png/retina/ui/controls/icon_close.png";

type CloseButtonProps = {
  onClick: () => void;
};

export const Close_Button = ({ onClick }: CloseButtonProps) => {
  return (
    <button
      type="button"
      aria-label="Close options"
      onClick={onClick}
      className="
        absolute
        right-[10%]
        top-[9%]
        z-20
        size-12
        cursor-pointer
        transition-transform
        duration-150
        hover:scale-110
        focus-visible:scale-110
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-white
        active:scale-95
      "
    >
      <img
        src={closeIcon}
        alt=""
        className="pointer-events-none size-full object-contain"
      />
    </button>
  );
};
