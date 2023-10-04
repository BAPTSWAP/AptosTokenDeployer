import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { StandardButtonProps } from "../StandardFormButton";

const BadgeTitle: React.FC<StandardButtonProps> = ({
  label,
  onClick,
  className,
  alt,
}) => {
  useEffect(() => {}, []);
  // default classes
  let altClasses: string =
    "border-[1px] badge badge-l p-3 px-5 [ border-darkgray bg-black/20 text-off_white/70 ]";

  // alt class definitions
  if (alt === "danger") {
    altClasses =
      "border-[1px] badge badge-l p-3 px-5 [ border-yellow-500 bg-black/20 text-yellow-500 ]";
  }

  return <div className={` ${altClasses} ${className}`}>{label}</div>;
};

export default BadgeTitle;
