/* eslint-disable @next/next/no-img-element */
import { TokenType } from "@/util/tokenList";
import React from "react";
import { IconProps } from "./DiscordIcon";

type OverlappingTokenIconsProps = {
  tokenX: TokenType;
  tokenY: TokenType;
};

const OverlappingTokenIcons: React.FC<OverlappingTokenIconsProps> = ({
  tokenX,
  tokenY,
}) => {
  return (
    <div className="flex justify-start">
      <div className="flex items-center md:space-x-3">
        <div>
          <div className="avatar">
            <div className="rounded-full w-14 h-14 card-shadow bg-black">
              <img src={tokenX.iconSrc} alt={`${tokenX.name} Icon`} />
            </div>
          </div>
          <div className="relative -left-4 avatar">
            <div className="rounded-full w-14 h-14 card-shadow bg-black">
              <img src={tokenY.iconSrc} alt={`${tokenY.name} Icon`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlappingTokenIcons;
