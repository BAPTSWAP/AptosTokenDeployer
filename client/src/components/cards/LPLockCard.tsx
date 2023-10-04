/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import SettingsIcon from "../icons/SettingsIcon";
import BadgeTitle from "../inputs/buttons/badges/Title";
import { TokenType } from "@/util/tokenList";
import { Badge } from "../inputs/buttons/badges/BadgeButtonGroup";
import OverlappingTokenIcons from "../icons/OverlappingTokenIcons";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { motion } from "framer-motion";
import Link from "next/link";
// import DateCountdown from "react-date-countdown-timer";

// General card which takes in title and content and applies a bg color

type LockCardProps = {
  tokenX: TokenType;
  tokenY: TokenType;
  lock: Date;
  unlock: Date;
  alt?: string;
};

const LPLockCard: React.FC<LockCardProps> = ({
  tokenX,
  tokenY,
  lock,
  unlock,
}) => {
  const [isActive, toggleActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<any>(null);

  const calculateTimeLeft = () => {
    if (+unlock < +new Date()) {
      return 0;
    }
    let difference = Math.abs((+unlock - +new Date()) / 1000);
    let timeLeft: any = {};

    // structure
    const s = {
      // year: 31536000,
      // month: 2592000,
      // week: 604800, // uncomment row to ignore or add your own row
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    Object.keys(s).forEach(function (key) {
      timeLeft[key] = Math.floor(difference / s[key]);
      difference -= timeLeft[key] * s[key];
    });

    return timeLeft;
  };

  useEffect(() => {
    setTimeout(() => {
      const time = calculateTimeLeft();
      if (time === 0) {
        toggleActive(false);
      } else {
        toggleActive(true);
        setTimeLeft(time);
      }
    }, 1000);
  });

  const shineMotion = {
    rest: {
      opacity: 0,
      transition: {
        duration: 1,
        type: "spring",
        ease: "slide",
      },
      transform: "translateX(-20rem)",
    },
    hover: {
      opacity: 1,
      transform: "translateX(25rem)",
      transition: {
        duration: 1.5,
        type: "spring",
        ease: "slide",
      },
    },
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className={`flex flex-col card-shadow rounded-xl justify-center items-center p-3 px-4 pb-6 backdrop-blur-2xl
                [ h-auto overflow-hidden ] transition ease-in-out relative
                ${
                  isActive
                    ? `[ bg-bapt_green/30 bg-gradient-to-b from-black/30 to-black/60 ] 
                       [ hover:from-white/[0.01] hover:to-black/50  ]`
                    : "[ bg-bapt_black/30 bg-gradient-to-b from-black/30 to-black/60 ] opacity-70 "
                }
                [ border-[1px] border-solid border-white border-opacity-30 ] `}
    >
      {isActive && (
        <motion.div variants={shineMotion}>
          <div className="[ absolute rounded-3xl -translate-y-5 bg-off_white/60 h-[19rem] w-[40px] -skew-x-12 z-20 ] "></div>
          <div className="[ absolute rounded-3xl -left-[50px] -translate-y-5 bg-off_white/30 h-[19rem] w-[10px] -skew-x-12 z-20 ] "></div>
        </motion.div>
      )}

      {/* header badges */}
      <div className="px-2 py-1 pb-3 text-left w-full">
        <div className="flex flex-row justify-between items-center">
          <BadgeTitle label={`${tokenX.symbol}-${tokenY.symbol}`} />
          <div>
            {isActive ? (
              <Badge label="Active" isSelected={true} isSmall={true} />
            ) : (
              <Badge label="Inactive" isSelected={false} isSmall={true} />
            )}
          </div>
        </div>
      </div>
      {/* body */}
      <div className="w-full flex flex-col space-y-3">
        {/* Overlapping avatars */}
        <div className="flex flex-row items-center">
          <OverlappingTokenIcons tokenX={tokenX} tokenY={tokenY} />
          <div className="overflow-scroll w-[55%]">
            {tokenX.name} / {tokenY.name}
          </div>
        </div>
        <div className="flex flex-row w-full justify-between">
          <div>Amount</div>
          <div>123,000 LP</div>
        </div>
        <div className="flex flex-row w-full justify-between">
          <div>Value</div>
          <div>4,200 USDC</div>
        </div>
        <div className="border-t-[1px] border-off_white/30"></div>
        {isActive ? (
          <div className="flex flex-row w-full justify-between text-sm">
            <div>Remaining</div>
            <div className="flex flex-row justify-end space-x-2">
              {timeLeft && (
                <>
                  {timeLeft.week && <div>{timeLeft.week} weeks</div>}
                  <div>{timeLeft.day} days</div>
                  <div>
                    {timeLeft.hour}:{timeLeft.minute}:{timeLeft.second}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-row w-full justify-between text-sm">
            <div>Locked</div>
            <div>{lock.toUTCString()}</div>
          </div>
        )}
        <div className="flex flex-row w-full justify-between text-sm">
          <div>Unlocked</div>
          <div>{unlock.toUTCString()}</div>
        </div>
        {/* {tokenX.address} */}
      </div>
    </motion.div>
  );
};

export default LPLockCard;
