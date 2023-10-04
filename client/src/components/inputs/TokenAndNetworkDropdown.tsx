/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import BnbImage from "../../../public/external_media/bnb-chain.png";
import AptosImage from "../../../public/external_media/aptos-transparent.png";

export type TokenAndNetworkDropdownProps = {
  networkName?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEmptyToken: boolean;
};

const TokenAndNetworkDropdown: React.FC<TokenAndNetworkDropdownProps> = ({
  networkName,
  type,
  onChange,
  isEmptyToken,
}) => {
  // const [isEmptyToken, checkIsEmptyToken] = useState<boolean>(true);

  useEffect(() => {}, []);

  return (
    <div className=" w-full bg-darkgray/70 rounded-t-2xl">
      <div className="flex flex-row  text-off_white">
        <div className="flex flex-col w-full p-4">
          <div className="flex flex-row mt-1">
            {networkName === "Aptos" ? (
              <img
                className="h-6 square mr-2"
                src={AptosImage.src}
                alt="aptos_token_icon"
              />
            ) : (
              <img
                className="h-6 square mr-2"
                src={BnbImage.src}
                alt="bsc_token_icon"
              />
            )}
            <p>{networkName}</p>
          </div>
        </div>
        <div className="flex flex-col w-8/12 p-4 bg-darkgray rounded-t-2xl">
          {isEmptyToken ? (
            <button className="flex flex-row justify-between bg-black/50 w-12/12 transition ease-in-out rounded-full pr-3 pl-4 py-1 [ hover:bg-black/70 ]">
              <div>
                <p className="block text-gray/50">Select Token</p>
              </div>
              <FontAwesomeIcon
                className="mx-2 my-1.5"
                icon={faAngleDown}
                style={{ width: "0.75em", height: "0.75em" }}
              />
            </button>
          ) : (
            <button className="flex flex-row justify-between bg-black/50 w-12/12 transition ease-in-out rounded-full pr-3 pl-4 py-1 [ hover:bg-black/70 ] text-off_white">
              <div className="flex flex-row">
                <img
                  className="w-4 h-4 mr-2 my-1"
                  src="https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/bapt.webp"
                  alt="token_icon"
                />
                <p className="">BAPT</p>
              </div>
              <FontAwesomeIcon
                className="mx-2 my-1.5"
                icon={faAngleDown}
                style={{ width: "0.75em", height: "0.75em" }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenAndNetworkDropdown;
