import React, { useEffect, useRef, useState } from "react";
import baptswap_icon from "../../public/HEAD_Negative.png";
import baptswap_banner from "../../public/baptswap_banner.svg";

import Image from "next/image";
import Link from "next/link";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import OtherMenuButton from "./inputs/buttons/OtherMenuButton";
import autoAnimate from "@formkit/auto-animate";
import { Squash as Hamburger } from "hamburger-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { motion, LayoutGroup } from "framer-motion";

const Header = () => {
  const [chartHoverOpen, toggleChartHoverOpen] = useState<boolean>(false);
  const router = useRouter();

  const headerItems = [
    { label: "Swap", url: "/swap" },
    { label: "Pools", url: "/pools" },
    { label: "Liquidity", url: "/liquidity" },
    { label: "Bridge", url: "/bridge" },
    { label: "Coin Deploy", url: "coindeployer" },
  ];

  const HeaderItem = ({ label, url, selected, onClick }) => (
    <motion.div
      layout
      className="mx-2 text-lg relative hover:cursor-pointer first-child:ml-2"
      onClick={onClick}
      animate={{ opacity: selected ? 1 : 0.5 }}
    >
      {label}
      {selected && (
        <motion.div
          className="absolute top-full left-0 w-full rounded-xs h-[2.5px] bg-bapt_green"
          layoutId="underline"
        />
      )}
    </motion.div>
  );

  const [selected, setSelected] = useState(router.pathname);

  const [show, setShow] = useState(false);
  const parent = useRef(null);
  const reveal = () => setShow(!show);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <>
      {/* Website Header */}
      <div className="hidden md:flex 3xl:hidden z-20 absolute top-0 w-full h-25 flex-row justify-between items-center  p-8 px-14">
        <div className="flex flex-row items-center">
          <Link href="/">
            <Image src="/HEAD_Negative.png" width={50} height={50} alt="" />
          </Link>
          <div className="grid place-items-center bg-bapt_black h-full w-full space-3 mx-5">
            <div className="flex justify-between">
              <LayoutGroup>
                {headerItems.map((item, i) => (
                  <Link key={i} href={`${item.url}`}>
                    <HeaderItem
                      label={item.label}
                      url={item.url}
                      selected={selected === item.url}
                      onClick={() => {
                        setSelected(item.url);
                      }}
                    />
                  </Link>
                ))}
              </LayoutGroup>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between w-auto space-x-4 h-full">
          {/* <ThemeButton /> */}
          <WalletSelector />
          {/* <OtherMenuButton /> */}
        </div>
      </div>
      {/* Mobile Header */}
      {/* TO DO: as a user i want to view the chart dropddown on mobile */}
      <div className="flex flex-col md:hidden 3xl:hidden z-20" ref={parent}>
        <div className="flex flex-row w-full border-b-2 border-b-bapt_green/30 justify-between items-center bg-black/30 backdrop-blur px-6 py-3">
          <Link href="/">
            <Image
              src={baptswap_icon}
              alt="BaptSwap Logo"
              className="w-9/12 max-w-[80px]"
            />
          </Link>
          <div className="flex flex-row items-center">
            <div className="pr-3 h-fit">
              <WalletSelector />
            </div>
            <div className="rounded-full">
              <Hamburger
                rounded
                color="#2dd8a7"
                toggled={show}
                toggle={reveal}
                size={20}
                duration={0.3}
                easing="ease-in-out"
              />
            </div>
          </div>
        </div>
        {show && (
          <div className="bg-bapt_green/10 backdrop-blur border-b-2 border-gray/50 text-off_white">
            {/* <div className="p-3 flex flex-col items-center justify-start pb-2 text-off_white"> */}
            <div className="flex justify-between pt-4 pb-5 px-2 overflow-x-scroll">
              <LayoutGroup>
                {headerItems.map((item, i) => (
                  <Link key={i} href={`${item.url}`}>
                    {item.label === "Liquidity" ? (
                      <HeaderItem
                        label={"LP"}
                        url={item.url}
                        selected={selected === item.url}
                        onClick={() => {
                          setSelected(item.url);
                        }}
                      />
                    ) : (
                      <HeaderItem
                        label={item.label}
                        url={item.url}
                        selected={selected === item.url}
                        onClick={() => {
                          setSelected(item.url);
                        }}
                      />
                    )}
                  </Link>
                ))}
              </LayoutGroup>
            </div>
            <Link href="http://docs.baptlabs.com/" target="_blank">
              <div className="flex flex-row bg-off_white/20 px-4 py-3 text-xs">
                Learn More & Docs
                <FontAwesomeIcon
                  className="w-3x h-3 p-0.5 px-2"
                  icon={faArrowUpRightFromSquare}
                />
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* 4k+ Header */}
      <div className="hidden md:hidden 3xl:flex z-20 absolute top-0 w-full h-25 flex-row justify-center items-center  p-8 px-14">
        <div className="flex flex-row items-center">
          <Link href="/">
            <Image src="/HEAD_Negative.png" width={50} height={50} alt="" />
          </Link>
          <div className="grid place-items-center bg-bapt_black h-full w-full space-3 mx-5">
            <div className="flex justify-between">
              <LayoutGroup>
                {headerItems.map((item, i) => (
                  <Link key={i} href={`${item.url}`}>
                    <HeaderItem
                      label={item.label}
                      url={item.url}
                      selected={selected === item.url}
                      onClick={() => {
                        setSelected(item.url);
                      }}
                    />
                  </Link>
                ))}
              </LayoutGroup>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between w-auto space-x-4 h-full">
          {/* <ThemeButton /> */}
          <WalletSelector />
          {/* <OtherMenuButton /> */}
        </div>
      </div>
    </>
  );
};

export default Header;
