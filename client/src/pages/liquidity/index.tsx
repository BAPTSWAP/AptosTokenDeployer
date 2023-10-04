/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import {
  MouseParallaxChild,
  MouseParallaxContainer,
} from "react-parallax-mouse";
import FullWidthCard from "@/components/cards/FullWidthCard";
import { TokenType, TOKEN_LIST, LP_LIST } from "@/util/tokenList";
import LiquidityTableRow from "@/components/table/LiquidityTableRow";
import SlimButton from "@/components/inputs/buttons/SlimButton";
import Link from "next/link";

export type RewardsPoolUserInfoType = {
  reward_debt_x: string;
  reward_debt_y: string;
  staked_tokens: string;
  withdrawn_x: string;
  withdrawn_y: string;
};

export type RewardsPoolInfoType = {
  dds_x: string;
  dds_y: string;
  precision_factor: string;
  staked_tokens: string;
};

// TO DO: pull TVL
// TO DO: mobile formatting
export default function Liquidity() {
  return (
    <div className="static">
      <Head>
        <title>BaptSwap | Liquidity List</title>
      </Head>
      <MouseParallaxContainer
        globalFactorX={0.1}
        globalFactorY={0.1}
        className="w-screen z-0"
      >
        <MouseParallaxChild factorX={0.5} factorY={0.7}>
          <div className="relative hidden md:flex justify-center z-0">
            <div className="absolute top-28 -left-4 w-28 h-28 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70 z-0  "></div>
            <div className="absolute top-28 -right-4 w-72 h-72 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70 z-0  "></div>
            <div className="absolute top-96 left-28 w-72 h-72 bg-bapt_green/30  rounded-full filter blur-3xl opacity-70 z-0 "></div>
          </div>
        </MouseParallaxChild>

        <main className="mb-36 md:py-40 md:mb-80 z-20 overflow-scroll 3xl:w-[75rem] 3xl:mx-auto">
          <div className="flex flex-col justify-center items-center py-10 md:p-10 h-full space-y-5">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row w-full px-5">
              {/* settings */}
              <div className="flex flex-row w-full justify-center md:justify-end space-x-4 text-md md:text-md px-4 md:px-0 z-20 ">
                <Link href="/liquidity/add">
                  <SlimButton
                    label="Add LP"
                    className="flex transition ease-in-out text-md px-5 w-fit bg-bapt_green text-black hover:opacity-50"
                  />
                </Link>
                <Link href="/liquidity/redeem">
                  <SlimButton
                    label="Redeem LP"
                    className="flex transition ease-in-out text-md px-5 w-fit bg-bapt_green text-black hover:opacity-50"
                  />
                </Link>
                <Link href="/createPair">
                  <SlimButton
                    label="Create Pair"
                    className="flex transition ease-in-out text-md px-5 w-fit bg-bapt_green text-black hover:opacity-50"
                  />
                </Link>
              </div>
              {/* settings */}
              {/* <div className="hidden md:flex flex-row w-full justify-center md:justify-end space-x-4 text-sm md:text-md px-4 md:px-0 z-20 ">
                <div className="flex flex-row h-auto items-center space-x-2">
                  <input
                    type="checkbox"
                    className="toggle toggle-sm toggle-secondary"
                  />
                  <p className="text-off_white/50">My Pairs</p>
                </div>
              </div> */}
            </div>

            {/* liquidity */}
            <div className="px-3 w-full">
              <FullWidthCard
                title="Liquidity Pairs"
                content={
                  <div className="flex overflow-x-auto w-full rounded-2xl border-[1px] border-off_white/20">
                    <div className="flex flex-col space-y-3 p-3 w-full">
                      {LP_LIST.map((LP, i) => {
                        return (
                          <LiquidityTableRow
                            key={LP.LPaddress}
                            tokenX={LP.tokenX}
                            tokenY={LP.tokenY}
                          />
                        );
                      })}
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </main>
      </MouseParallaxContainer>
    </div>
  );
}
