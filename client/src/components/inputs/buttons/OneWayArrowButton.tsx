import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const OneWayArrowButton = () => {
  useEffect(() => {}, []);

  return (
    <div className="align-center">
      <div className="-m-2 w-12 h-12 transition ease-in-out rounded-full bg-black text-off_white hover:bg-opacity-80 flex justify-center items-center sticky z-10">
        <FontAwesomeIcon
          className="rounded-full p-2 bg-darkgray text-white/70"
          icon={faArrowDown}
          style={{ width: "1.25em", height: "1.25em" }}
        />
      </div>
    </div>
  );
};

export default OneWayArrowButton;
