import Head from "next/head";
import DiscordIcon from "@/components/icons/DiscordIcon";
import TwitterIcon from "@/components/icons/TwitterIcon";
import TelegramIcon from "@/components/icons/TelegramIcon";
import GithubIcon from "@/components/icons/GithubIcon";
import {
  MouseParallaxContainer,
  MouseParallaxChild,
} from "react-parallax-mouse";
import StandardFormButton from "@/components/inputs/buttons/StandardFormButton";
import Plx from "react-plx";

export default function Home() {
  // parallax config for on scroll parallax (used for mobile)
  const parallaxDataCenterOrb = [
    {
      start: 0,
      end: 200,
      properties: [
        {
          startValue: 0,
          endValue: -89,
          property: "translateX",
        },
        {
          startValue: 0,
          endValue: 34,
          property: "translateY",
        },
      ],
    },
  ];
  const parallaxDataBlueOrb = [
    {
      start: 0,
      end: 300,
      properties: [
        {
          startValue: 0,
          endValue: 80,
          property: "translateX",
        },
        {
          startValue: 0,
          endValue: 10,
          property: "translateY",
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>BaptSwap | Home</title>
      </Head>
      {/* Tablet & Laptop Landing */}
      <div className="hidden md:flex 3xl:hidden">
        <MouseParallaxContainer
          globalFactorX={0.1}
          globalFactorY={0.1}
          className="h-screen w-screen"
        >
          <MouseParallaxChild factorX={0.3} factorY={0.5}>
            <div className="center-orb rounded-full w-4/12 absolute top-48 left-48 animate-orbfloat-1"></div>
          </MouseParallaxChild>
          <MouseParallaxChild factorX={0.8} factorY={0.9}>
            <div className="blue-orb rounded-full w-6/12 absolute -right-[20%] -top-96 animate-orbfloat-2"></div>
          </MouseParallaxChild>
          <MouseParallaxChild factorX={0.2} factorY={0.2}>
            <div className="bg-orb1 rounded-full absolute"></div>
          </MouseParallaxChild>
          <MouseParallaxChild factorX={0.15} factorY={0.15}>
            <div className="bg-orb2 rounded-full absolute"></div>
            <div className="bg-orb3 rounded-full absolute"></div>
            <div className="bg-orb4 rounded-full absolute"></div>
          </MouseParallaxChild>

          <main className="bg-[#121919] h-screen pt-44 px-3.5 flex flex-row">
            <div className="flex flex-col justify-start px-14 z-10">
              <a
                className="h-fit w-fit"
                href="https://discord.gg/fvGrNVN55B"
                target="_blank"
                rel="noreferrer"
              >
                <DiscordIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
              <a
                className="h-fit w-fit"
                href="https://t.me/baptlabs"
                target="_blank"
                rel="noreferrer"
              >
                <TelegramIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
              <a
                className="h-fit w-fit"
                href="https://twitter.com/bapt_labs"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
              <a
                className="h-fit w-fit"
                href="https://github.com/BaptSwap"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
            </div>
            <div className="flex flex-col w-3/4">
              <h2 className="text-white font-bold font-lato text-2xl my-2">
                BAPT <em className="text-bapt_green">SWAP</em>
              </h2>
              <h1 className="text-white font-mina text-8xl lg:text-[8em] w-3/4 leading-none z-10 font-black text-shadow-9xl">
                Swap. Stake. Secure.
              </h1>
              <StandardFormButton
                label="Learn More"
                alt="outline"
                className="w-1/4 mt-16 z-10 hidden lg:flex"
                onClick={() => {
                  window.open("https://docs.baptlabs.com");
                }}
              />
            </div>
            <div className="flex flex-col h-fit border-l-2 border-white/50 absolute -right-72 bottom-32">
              <p className="w-2/5 text-white/30 pl-3 pt-3">
                Introducing the first DEX to support fee-on-transfer tokens with
                dedicated launching and locking services on Aptos.
              </p>
              <p className="w-2/5 mt-5 text-white opacity-[70%] pl-3 pb-3">
                Brought to you by BaptLabs. Driving innovation and adoption on
                Aptos.
              </p>
            </div>
          </main>
        </MouseParallaxContainer>
      </div>
      {/* Mobile Landing */}
      <div className="flex md:hidden 3xl:hidden ">
        <MouseParallaxContainer
          globalFactorX={0.1}
          globalFactorY={0.1}
          className="h-screen"
        >
          <MouseParallaxChild factorX={0.3} factorY={0.5}>
            <Plx parallaxData={parallaxDataCenterOrb}>
              <div className="-scale-50 md:scale-0 center-orb rounded-full w-8/12 sm:w-3/12 xs:w-4/12 top-24 left-3 absolute animate-orbfloat-1"></div>
            </Plx>
          </MouseParallaxChild>
          <MouseParallaxChild factorX={0.8} factorY={0.9}>
            <Plx parallaxData={parallaxDataBlueOrb} className="">
              <div className="-scale-50 md:scale-0 blue-orb z-10 rounded-full w-11/12 sm:w-10/12 xs:w-9/12 top-96 sm:top-[30rem] xs:top-[35rem] left-72 absolute animate-orbfloat-2"></div>
            </Plx>
          </MouseParallaxChild>
          <MouseParallaxChild factorX={0.2} factorY={0.2}>
            <div className="bg-orb1 rounded-full absolute"></div>
          </MouseParallaxChild>
          <MouseParallaxChild factorX={0.15} factorY={0.15}>
            <div className="bg-orb2 rounded-full absolute"></div>
            <div className="bg-orb3 rounded-full absolute"></div>
            <div className="bg-orb4 rounded-full absolute top-28 -left-56 z-0"></div>
          </MouseParallaxChild>

          <main className="h-screen  flex flex-col px-10 pt-1 z-5">
            <div className="flex flex-row justify-between">
              <a
                className="h-fit w-fit"
                href="https://discord.gg/fvGrNVN55B"
                target="_blank"
                rel="noreferrer"
              >
                <DiscordIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
              <a
                className="h-fit w-fit"
                href="https://t.me/baptlabs"
                target="_blank"
                rel="noreferrer"
              >
                <TelegramIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
              <a
                className="h-fit w-fit"
                href="https://twitter.com/bapt_labs"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
              <a
                className="h-fit w-fit"
                href="https://github.com/BaptSwap"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
            </div>
            <div className="flex flex-col mt-8">
              <h1 className="text-white font-mina text-7xl md:text-[8em] leading-none z-10 font-black text-shadow-9xl">
                Swap. Stake. Secure.
              </h1>
            </div>
            <div className="flex flex-col h-fit w-4/5 mt-10 xs:mt-32">
              <p className=" text-gray pt-3">
                Introducing the first DEX to support fee-on-transfer tokens with
                dedicated launching and locking services on Aptos.
              </p>
              <p className="mt-5 text-off_white pb-3">
                Brought to you by BaptLabs. Driving innovation and adoption on
                Aptos.
              </p>
            </div>
          </main>
        </MouseParallaxContainer>
      </div>
      {/* 4k+ Landing */}
      <div className="hidden md:hidden 3xl:flex">
        <MouseParallaxContainer
          globalFactorX={0.1}
          globalFactorY={0.1}
          className="h-screen w-screen"
        >
          <MouseParallaxChild factorX={0.3} factorY={0.5}>
            <div className="center-orb rounded-full w-2/12 absolute top-48 left-[45rem] 4xl:left-[70rem] animate-orbfloat-1"></div>
          </MouseParallaxChild>
          <MouseParallaxChild factorX={0.8} factorY={0.9}>
            <div className="blue-orb rounded-full w-6/12 absolute -right-[20%] -bottom-96 animate-orbfloat-2"></div>
          </MouseParallaxChild>
          <MouseParallaxChild factorX={0.2} factorY={0.2}>
            <div className="bg-orb1 rounded-full absolute"></div>
          </MouseParallaxChild>
          <MouseParallaxChild factorX={0.15} factorY={0.15}>
            <div className="bg-orb2 rounded-full absolute"></div>
            <div className="bg-orb3 rounded-full absolute"></div>
            <div className="bg-orb4 rounded-full absolute"></div>
          </MouseParallaxChild>

          <main className="bg-[#121919] h-screen w-screen justify-center pt-44 px-[20rem] 4xl:px-[25%] flex flex-row">
            <div className="flex flex-col justify-start pr-14 z-10">
              <a
                className="h-fit w-fit"
                href="https://discord.gg/fvGrNVN55B"
                target="_blank"
                rel="noreferrer"
              >
                <DiscordIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
              <a
                className="h-fit w-fit"
                href="https://t.me/baptlabs"
                target="_blank"
                rel="noreferrer"
              >
                <TelegramIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
              <a
                className="h-fit w-fit"
                href="https://twitter.com/bapt_labs"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
              <a
                className="h-fit w-fit"
                href="https://github.com/BaptSwap"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="fill-white/50 hover:cursor-pointer hover:fill-white w-8 my-4" />
              </a>
            </div>
            <div className="flex flex-col w-3/4">
              <h2 className="text-white font-bold font-lato text-2xl my-2">
                BAPT <em className="text-bapt_green">SWAP</em>
              </h2>
              <h1 className="text-white font-mina text-8xl lg:text-[8em] leading-none z-10 font-black text-shadow-9xl">
                Swap. Stake. Secure.
              </h1>
              <StandardFormButton
                label="Learn More"
                alt="outline"
                className="w-1/4 4xl:w-[15rem] mt-16 z-10 hidden lg:flex"
                onClick={() => {
                  window.open("https://docs.baptlabs.com");
                }}
              />
              <div className="flex flex-col h-fit border-l-2 border-white/50 absolute bottom-44 right-0 w-4/12">
                <p className="w-2/5 text-white/30 pl-3 pt-3">
                  Introducing the first DEX to support fee-on-transfer tokens
                  with dedicated launching and locking services on Aptos.
                </p>
                <p className="w-2/5 mt-5 text-white opacity-[70%] pl-3 pb-3">
                  Brought to you by BaptLabs. Driving innovation and adoption on
                  Aptos.
                </p>
              </div>
            </div>
          </main>
        </MouseParallaxContainer>
      </div>
    </>
  );
}
