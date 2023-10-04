import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const MobileMenuButton = () => {
  useEffect(() => {}, []);

  return (
    <button className="transition ease-in-out h-full rounded-full bg-off_black text-bapt_green  hover:bg-opacity-80 flex justify-center items-center p-1">
      <FontAwesomeIcon
        className="w-4 h-4 p-0.5 px-2"
        icon={faBars}
        // style={{ width: "1.25em", height: "1.25em" }}
      />
    </button>
  );
};

export default MobileMenuButton;
