/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import SettingsIcon from "../icons/SettingsIcon";
import BadgeTitle from "../inputs/buttons/badges/Title";
import { TokenType } from "@/util/tokenList";
import { Badge } from "../inputs/buttons/badges/BadgeButtonGroup";
import OverlappingTokenIcons from "../icons/OverlappingTokenIcons";
import { useRouter } from "next/router";
import Link from "next/link";
import SlimButton from "../inputs/buttons/SlimButton";
import { numberWithCommas } from "@/util/formatNumbers";

// General card which takes in title and content and applies a bg color

export type LiquidityRowProps = {
  tokenX: TokenType;
  tokenY: TokenType;
  key: string;
};

const LiquidityTableRow: React.FC<LiquidityRowProps> = ({
  tokenX,
  tokenY,
  key,
}) => {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const revealDetails = () => setShowDetails(!showDetails);
  const [total24hVol, setTotal24hVol] = useState(0);

  // get 24h Vol of pair
  useEffect(() => {
    // determine which token is not APT
    let contractAddress =
      tokenX.symbol === "APT" ? tokenY.address : tokenX.address;

    // using coinfecko's api, calculate 24h volumes
    fetch(`https://api.coingecko.com/api/v3/exchanges/baptswap`)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        for (const ticker of res.tickers) {
          if (
            ticker.base.toLowerCase() === contractAddress.toLowerCase() ||
            ticker.target.toLowerCase() === contractAddress.toLowerCase()
          ) {
            setTotal24hVol(ticker.converted_volume.usd);
            break;
          }
        }
      });
  }, []);

  return (
    <>
      <div
        key={key}
        className={`w-full flex flex-col space-y-2
           bg-off_white/5 p-3 px-5 rounded-xl [ sm:flex-row sm:space-y-0 sm:items-center ]`}
        onClick={() => {
          revealDetails();
        }}
      >
        {/* TO DO: what if width of names is too long?  */}
        <div className="flex flex-row w-fit items-center sm:w-[370px] sm:min-w-[370px]">
          <OverlappingTokenIcons tokenX={tokenX} tokenY={tokenY} />
          <div className="flex flex-col space-y-1 [ md:justify-start ]">
            <div className="flex flex-row space-x-1 items-center">
              <div className="font-bold">
                {tokenX.name} - {tokenY.name}
              </div>
            </div>
            <div className="">
              <div className=" text-white/50 font-medium">
                {tokenX.symbol}-{tokenY.symbol}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full md:w-2/4 justify-between space-x-3 px-3 lg:pr-52 xl:pr-72">
          <div>
            <div>Volume (24h)</div>
            <div className="text-sm md:text-md ">
              ${numberWithCommas(total24hVol, 2)}
            </div>
          </div>
          {/* <div>
            <div>APY</div>
            <div className="text-sm md:text-md">12%</div>
          </div> */}
        </div>

        <div className="hidden md:flex w-full justify-end">
          <Link href={`/info/pair/${tokenX.address}/${tokenY.address}`}>
            <SlimButton
              label={<div>View Pair Info</div>}
              className="transition ease-in-out bg-bapt_green/20 text-bapt_green font-medium w-[150px] [ hover:opacity-60 ] h-6"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default LiquidityTableRow;
