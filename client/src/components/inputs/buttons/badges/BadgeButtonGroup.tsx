import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { StandardButtonProps } from "../StandardFormButton";

type BadgeGroupProps = {
  label: string;
  isSelected?: boolean;
  isSmall?: boolean;
};
export const Badge: React.FC<BadgeGroupProps> = ({
  label,
  isSelected,
  isSmall,
}) => {
  let altClasses: string = "";
  if (isSmall) altClasses = "text-xs";
  return isSelected ? (
    <div
      className={`items-center px-3 rounded-full bg-bapt_green/20 text-bapt_green text-center ${altClasses}`}
    >
      <p>{label}</p>
    </div>
  ) : (
    <div
      className={`items-center px-3 rounded-full bg-gray/20 text-gray text-center ${altClasses}`}
    >
      <p>{label}</p>
    </div>
  );
};

type BadgeButtonGroupProps = {
  label?: string;
  alt?: string;
} & React.ButtonHTMLAttributes<any>;

const BadgeButtonGroup: React.FC<BadgeButtonGroupProps> = ({
  children,
  alt,
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

  return <div className="flex flex-row space-x-2">{children}</div>;
};

export default BadgeButtonGroup;
