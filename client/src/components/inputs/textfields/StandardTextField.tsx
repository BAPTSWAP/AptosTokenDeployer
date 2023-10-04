import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export type StandardTextFieldProps = {
  alt?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

const StandardTextField: React.FC<StandardTextFieldProps> = ({
  alt,
  placeholder,
  type,
  value,
  onChange,
  name
}) => {
  useEffect(() => {}, []);

  return (
    <div
      className={`flex flex-row w-full bg-darkgray p-4 px-5 pl-6 
                    ${
                      alt === "bridge"
                        ? "rounded-b-2xl"
                        : "rounded-2xl hover:inner-border-[1px] inner-border-bapt_green/30"
                    }`}
    >
      <input
        name={name}
        type={type || "text"}
        placeholder={placeholder}
        className="bg-transparent mr-3 transition ease-in-out w-full h-auto outline-none text-white/60"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default StandardTextField;
