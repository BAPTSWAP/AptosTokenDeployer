/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { TokenType, TOKEN_LIST } from "@/util/tokenList";
import { formatBalance, numberWithCommas } from "@/util/formatNumbers";

type DropdownItemProps = {
  option: string;
  handleSelected: React.Dispatch<React.SetStateAction<string>>;
};
const DropdownItem: React.FC<DropdownItemProps> = ({
  option,
  handleSelected,
}) => {
  return (
    <li
      className="hover:bg-off_white/10 rounded-lg flex-row text-center px-3 py-2"
      onClick={() => handleSelected(option)}
    >
      {option}
    </li>
  );
};

type DropdownProps = {
  options: string[];
  onSelected: React.Dispatch<React.SetStateAction<string>>;
  purpose?: string;
  defaultOption?: string;
  resetSelect?: boolean;
  optionResetSelect?: string;
};
const StandardDropdown: React.FC<DropdownProps> = ({
  purpose,
  options,
  onSelected,
  resetSelect,
  optionResetSelect,
  defaultOption,
}) => {
  const [selected, setSelected] = useState<string>("");

  const handleSelected = useCallback(
    (val: React.SetStateAction<string>) => {
      val && setSelected(val);
    },
    [setSelected]
  );

  useEffect(() => {
    if (optionResetSelect && selected !== optionResetSelect) {
      setSelected(optionResetSelect);
    }
  }, [optionResetSelect]);

  useEffect(() => {
    selected && onSelected(selected);
  }, [onSelected, selected]);

  return (
    <div className="flex flex-col w-full m-0 hover:cursor-pointer">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          className={`flex flex-row justify-between transition ease-in-out w-full rounded-xl sm:rounded-full pr-1 sm:pr-3 pl-2 sm:pl-4 py-1
                       [ bg-black/50 hover:bg-black/70 ] text-white/70`}
        >
          <div className="inline-block text-gray/50">
            {selected == ""
              ? !purpose && !defaultOption
                ? `Select option`
                : `${purpose}: ${defaultOption}`
              : `${purpose}: ${selected}`}
          </div>
          <FontAwesomeIcon
            className="mx-1 md:mx-2 my-1.5"
            icon={faAngleDown}
            style={{ width: "0.75em", height: "0.75em" }}
          />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow
                         [ bg-off_black bg-gradient-to-b from-black/30 to-black/60 ] 
                         rounded-xl w-52 text-off_white
                         border-[0.5px] border-gray"
        >
          {options.map((option, i) => {
            return (
              <DropdownItem
                option={option}
                handleSelected={handleSelected}
                key={i}
              />
            );
          })}
          {/* <li className="hover:bg-off_white/10 rounded-lg">
            <a>View More</a>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default StandardDropdown;
