import React, { useEffect, useRef, useState } from "react";
import baptswap_icon from "../../public/baptswap_icon.svg";
import baptswap_banner from "../../public/baptswap_banner.svg";

import Image from "next/image";
import Link from "next/link";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import OtherMenuButton from "./inputs/buttons/OtherMenuButton";
import SlimButton from "./inputs/buttons/SlimButton";
import autoAnimate from "@formkit/auto-animate";
import { Squash as Hamburger } from "hamburger-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const MobileFooter = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const parent = useRef(null);
  const reveal = () => setShow(!show);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const {
    connect,
    account,
    network,
    connected,
    disconnect,
    wallet,
    wallets,
    signAndSubmitTransaction,
    signTransaction,
    signMessage,
    signMessageAndVerify,
  } = useWallet();

  return (
    <>
      {/* Mobile Footer */}
      <div ref={parent} className="sticky bottom-0 md:hidden 3xl:hidden z-20">
        {show && (
          <div className="bg-gray/50 p-6 backdrop-blur border-b-2 border-gray/50 text-off_white">
            <Link href="http://docs.baptlabs.com/" target="_blank">
              <div className="flex flex-row bg-off_white/20 p-4">
                Learn More & Docs
                <FontAwesomeIcon
                  className="w-4 h-4 p-0.5 px-2"
                  icon={faArrowUpRightFromSquare}
                />
              </div>
            </Link>
          </div>
        )}
        <div className="flex flex-row items-center justify-between bg-bapt_green/20 border-t-2 border-bapt_green/30 text-off_white backdrop-blur px-6 py-3">
          <div className="space-x-3">
            <Link href="/swap">
              <div className="border-off_white/30 border-r-[1px] pr-2">
                <p
                  className={
                    router.pathname == "/swap"
                      ? "border-b-[2px] border-bapt_green"
                      : ""
                  }
                >
                  Swap
                </p>
              </div>
            </Link>
            <Link href="/pools">
              <div className="border-off_white/30 border-r-[1px] pr-2">
                <p
                  className={
                    router.pathname == "/pools"
                      ? "border-b-[2px] border-bapt_green"
                      : ""
                  }
                >
                  Pools
                </p>
              </div>
            </Link>
            <Link href="/redeemLP">
              <div className="border-off_white/30 border-r-[1px] pr-2">
                <p
                  className={
                    router.pathname == "/redeemLP"
                      ? "border-b-[2px] border-bapt_greenn"
                      : ""
                  }
                >
                  Redeem LP
                </p>
              </div>
            </Link>
            <Link href="/bridge">
              <div className="">
                <p
                  className={
                    router.pathname == "/bridge"
                      ? "border-b-[2px] border-bapt_green"
                      : ""
                  }
                >
                  Bridge
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFooter;
