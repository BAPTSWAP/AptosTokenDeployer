import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export type StandardButtonProps = {
  label: React.ReactNode;
  alt?: string;
  onClick?: any;
  className?: string;
} & React.ButtonHTMLAttributes<any>;

const StandardFormButton: React.FC<StandardButtonProps> = ({
  label,
  alt,
  onClick,
  className,
}) => {
  useEffect(() => {}, []);
  let altClasses: string = "";
  if (alt === "outline") {
    altClasses =
      "border-1 border-bapt_green text-bapt_green bg-bapt_black/90 [ hover:bg-black/0 hover:border-bapt_subgreen hover:text-bapt_subgreen ]";
  } else if (alt === "outline-gray") {
    altClasses =
      "border-1 border-gray text-gray bg-bapt_black/90 [ hover:bg-black/0 hover:border-bapt_subgreen hover:text-bapt_subgreen ]";
  } else {
    // primary button with no alt
    altClasses =
      "[ hover:bg-bapt_green/80 ] text-black  border-0 bg-bapt_green";
  }

  return (
    <button
      onClick={onClick}
      className={`font-bold text-md btn rounded-full h-auto p-1 ${className} ${altClasses}`}
    >
      {label}
    </button>
  );
};

export default StandardFormButton;
