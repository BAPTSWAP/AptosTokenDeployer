import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

const OtherMenuButton = () => {
  useEffect(() => {}, []);

  return (
    <button className="transition ease-in-out h-full rounded-full bg-bapt_black text-off_white border-[0.01px] border-off_white/30 hover:bg-opacity-80 flex justify-center items-center p-1.5">
      <FontAwesomeIcon
        className="w-5 h-5"
        icon={faEllipsis}
        style={{ width: "1.25em", height: "1.25em" }}
      />
    </button>
  );
};

export default OtherMenuButton;
