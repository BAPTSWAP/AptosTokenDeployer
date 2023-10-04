/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import AptosImage from "../../../../public/external_media/aptos-transparent.png";
import { TokenType, TOKEN_LIST } from "@/util/tokenList";
import TokenDropdownSelector from "../dropdowns/TokenDropdownSelector";

export type TextFieldWithDropdownProps = {
  id?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelect: React.Dispatch<React.SetStateAction<TokenType>>;
  resetSelect?: boolean;
  optionResetSelect?: TokenType;
  balance?: number;
  ref?: any;
};

const TextFieldWithDropdown: React.FC<TextFieldWithDropdownProps> = ({
  placeholder,
  type,
  value,
  onChange,
  handleSelect,
  balance,
  ref,
  resetSelect,
  optionResetSelect,
}) => {
  const [val, setVal] = useState<string>("");

  const [useBalance, toggleUseBalance] = useState<boolean>(false);

  const handleUseBalance = () => {
    setVal(String(balance));
    // toggleUseBalance(!useBalance);
    // setVal(String(balance));
  };

  // useEffect(() => {
  //   const newToken = handleChangeToken();

  //   handleSelect(newToken);
  // }, [handleChangeToken]);

  return (
    <>
      <div
        ref={ref}
        className="flex flex-row justify-between w-full bg-darkgray p-4 px-5 pl-6 rounded-2xl [ hover:inner-border-[1px] inner-border-bapt_green/30 ]"
      >
        <input
          type={type || "text"}
          placeholder={placeholder}
          className="bg-transparent mr-3 transition ease-in-out w-11/12 sm:w-full h-auto outline-none text-white/60"
          value={value}
          onChange={onChange}
        />
        <TokenDropdownSelector
          onSelected={handleSelect}
          onClickBalance={handleUseBalance}
          balance={balance}
          // resetSelect={resetSelect}
          optionResetSelect={optionResetSelect}
        />
      </div>
    </>
  );
};

export default TextFieldWithDropdown;
