/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, Types } from "aptos";
import MAUImage from "../../../public/external_media/MAU-icon.jpeg";
import BaptImage from "../../../public/external_media/baptlabs-mini.png";
import { useEffect, useState } from "react";
import {
  MouseParallaxChild,
  MouseParallaxContainer,
} from "react-parallax-mouse";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import FullWidthCard from "@/components/cards/FullWidthCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import SlimButton from "@/components/inputs/buttons/SlimButton";
import { TokenType, TOKEN_LIST } from "@/util/tokenList";
import { formatBalance, numberWithCommas } from "@/util/formatNumbers";
import { MAINNET_NODE_URL, SWAP_ADDRESS } from "@/util/globals";
import Link from "next/link";
import StandardFormButton from "@/components/inputs/buttons/StandardFormButton";
import PoolRow from "@/components/table/PoolRow";

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

export default function Pools() {
  const rewardsPoolList = [
    { stakedToken: TOKEN_LIST[0], pairedToken: TOKEN_LIST[1] },
    { stakedToken: TOKEN_LIST[4], pairedToken: TOKEN_LIST[1] },
    { stakedToken: TOKEN_LIST[7], pairedToken: TOKEN_LIST[1] },
  {
      stakedToken: {
        name: "BaptLabs",
        symbol: "BAPTV1",
        iconSrc: BaptImage.src,
        address:
          "0xb73a7b82af68fc1ba6e123688b95adec1fec0bcfc256b5d3a43de227331a7abd::baptlabs::BaptLabs",
        decimals: 8,
      },
      pairedToken: TOKEN_LIST[1],
    },
    {
      stakedToken: {
        name: "MAU Protocol",
        symbol: "MAU",
        iconSrc: MAUImage.src,
        address:
          "0xf8fa55ff4265fa9586f74d00da4858b8a0d2320bbe94cb0e91bf3a40773eb60::MAU::MAU",
        decimals: 6,
      },
      pairedToken: TOKEN_LIST[1],
    },
  ];

  return (
    <div className="static">
      <Head>
        <title>BaptSwap | Pools</title>
      </Head>
      <MouseParallaxContainer
        globalFactorX={0.1}
        globalFactorY={0.1}
        className="w-screen z-0"
      >
        <MouseParallaxChild factorX={0.5} factorY={0.7}>
          <div className="relative flex justify-center">
            <div className="absolute top-28 -left-4 w-28 h-28 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70  "></div>
            <div className="absolute top-28 -right-4 w-72 h-72 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70 "></div>
            <div className="absolute top-96 left-28 w-72 h-72 bg-bapt_green/30  rounded-full filter blur-3xl opacity-70 "></div>
          </div>
        </MouseParallaxChild>

        <main className="md:py-40 md:mb-80 z-20 overflow-scroll 3xl:w-[75rem] 3xl:mx-auto">
          <div className="flex flex-col justify-center items-center py-10 px-3 md:p-10 h-full space-y-24">
            <FullWidthCard
              title="Current Staking Pools"
              content={
                <div className="flex flex-col space-y-2 px-2">
                  {/* Website table */}
                  {rewardsPoolList.map((pool) => {
                    return (
                      <PoolRow
                        key={pool.stakedToken.address}
                        inputToken={pool.stakedToken}
                        outputToken={pool.pairedToken}
                      />
                    );
                  })}
                </div>
              }
            />
            <div className="flex flex-col items-center text-center">
              <p className="text-gray py-2 text-sm px-10">
                By interacting with BaptSwap, you agree to our Terms of Use.
              </p>
              <StandardFormButton
                className="opacity-70 px-16"
                label="Terms of Use"
                onClick={() => {
                  window.location.href =
                    "https://docs.baptlabs.com/legal-disclaimers/terms-of-use";
                }}
                alt="outline-gray"
              />
            </div>
          </div>
        </main>
      </MouseParallaxContainer>
    </div>
  );
}
