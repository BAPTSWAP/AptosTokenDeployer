import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

export type SwapArrowsButtonProps = {
  handleClick: () => void;
};

const SwapArrowsButton: React.FC<SwapArrowsButtonProps> = ({ handleClick }) => {
  useEffect(() => {}, []);

  return (
    <div className="align-center">
      <button
        onClick={() => {
          handleClick();
        }}
        className="-m-5 w-12 h-12 transition ease-in-out rounded-full bg-black text-off_white hover:bg-opacity-80 flex justify-center items-center sticky z-10"
      >
        <FontAwesomeIcon
          className="rounded-full p-2 bg-darkgray text-white/70 [ hover:inner-border-[1px] inner-border-bapt_green/30 ]"
          icon={faArrowsRotate}
          style={{ width: "1.25em", height: "1.25em" }}
        />
      </button>
    </div>
  );
};

export default SwapArrowsButton;
