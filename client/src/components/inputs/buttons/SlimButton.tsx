import React, { useEffect } from "react";

export type SlimButtonProps = {
  label: React.ReactNode;
  alt?: string;
  onClick?: any;
  className?: string;
} & React.ButtonHTMLAttributes<any>;

const SlimButton: React.FC<SlimButtonProps> = ({
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
  } else if (alt === "off_black") {
    altClasses = "bg-off_black text-off_white/90";
  }

  return (
    <button
      onClick={onClick}
      className={`font-bold text-md rounded-full  m-0 px-2 ${altClasses} ${className}`}
    >
      {label}
    </button>
  );
};

export default SlimButton;
