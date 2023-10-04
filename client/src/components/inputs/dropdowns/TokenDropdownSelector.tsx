/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { TokenType, TOKEN_LIST } from "@/util/tokenList";
import { formatBalance, numberWithCommas } from "@/util/formatNumbers";

export const TokenWithIcon: React.FC<TokenType> = ({
  name,
  iconSrc,
  symbol,
  address,
}) => {
  return (
    <div className="flex flex-row justify-start text-white/70 sm:w-full">
      <img
        className="w-6 h-6 mr-1 sm:mr-2 rounded-full"
        src={iconSrc}
        alt="token_icon"
      />
      <p className="text-off_white">{symbol}</p>
    </div>
  );
};

type DropdownItemProps = {
  token: TokenType;
  handleSelected: React.Dispatch<React.SetStateAction<TokenType>>;
};
const DropdownItem: React.FC<DropdownItemProps> = ({
  token,
  handleSelected,
}) => {
  return (
    <li
      className="hover:bg-off_white/10 rounded-lg flex-row"
      onClick={() => handleSelected(token)}
    >
      <TokenWithIcon
        name={token.name}
        iconSrc={token.iconSrc}
        symbol={token.symbol}
        address={token.address}
        decimals={token.decimals}
      />
    </li>
  );
};

type DropdownProps = {
  onSelected: React.Dispatch<React.SetStateAction<TokenType>>;
  balance?: number;
  className?: string;
  onClickBalance: React.Dispatch<React.SetStateAction<number>>;
  resetSelect?: boolean;
  optionResetSelect?: TokenType;
};
const TokenDropdownSelector: React.FC<DropdownProps> = ({
  onSelected,
  balance,
  onClickBalance,
  className,
  resetSelect,
  optionResetSelect,
}) => {
  const [selected, setSelected] = useState<TokenType>({
    name: "",
    iconSrc: "",
    symbol: "",
    address: "",
    decimals: 0,
  });

  const handleSelected = useCallback(
    (val: React.SetStateAction<TokenType>) => {
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
    <div className="flex flex-col w-10/12 m-0 hover:cursor-pointer">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          className={`flex flex-row justify-between transition ease-in-out w-full rounded-xl sm:rounded-full pr-1 sm:pr-3 pl-2 sm:pl-4 py-1
                       ${
                         className
                           ? className
                           : `[ bg-black/50 hover:bg-black/70 ]`
                       } text-white/70`}
        >
          <div className="inline-block text-gray/50">
            {selected.name == "" ? (
              "Select Token"
            ) : (
              <TokenWithIcon
                name={selected["name"]}
                iconSrc={selected["iconSrc"]}
                symbol={selected["symbol"]}
                address={selected["address"]}
                decimals={selected["decimals"]}
              />
            )}
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
          {TOKEN_LIST.map((token, i) => {
            return (
              <DropdownItem
                token={token}
                handleSelected={handleSelected}
                key={token.address}
              />
            );
          })}
          {/* <li className="hover:bg-off_white/10 rounded-lg">
            <a>View More</a>
          </li> */}
        </ul>
      </div>
      {balance ? (
        <div>
          <p className="text-off_white text-right text-xs mt-2 px-2">
            Balance:
            <a
              className="pl-1"
              onClick={() => {
                onClickBalance(balance);
              }}
            >
              {numberWithCommas(
                formatBalance(balance, selected["decimals"]),
                selected["decimals"]
              )}
            </a>
          </p>
        </div>
      ) : (
        <div>
          <p className="text-off_white text-right text-xs mt-2 px-2">
            Balance: 0
          </p>
        </div>
      )}
    </div>
  );
};

export default TokenDropdownSelector;
