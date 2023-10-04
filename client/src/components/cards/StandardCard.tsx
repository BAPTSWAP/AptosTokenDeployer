import React, { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import SettingsIcon from "../icons/SettingsIcon";
import BadgeTitle from "../inputs/buttons/badges/Title";

// General card which takes in title and content and applies a bg color

export type SimpleCardProps = {
  title?: string;
  alt?: string;
  hasBackButton?: boolean;
  hasSettings?: boolean;
  contentSettings?: React.ReactNode;
  content: React.ReactNode;
  contentAction?: React.ReactNode;
};

const StandardCard: React.FC<SimpleCardProps> = ({
  title,
  content,
  hasSettings,
  contentSettings,
  contentAction,
}) => {
  const [show, setShow] = useState(false);
  const parent = useRef(null);
  const reveal = () => setShow(!show);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div
      ref={parent}
      className="flex flex-col card-shadow rounded-3xl justify-center items-center p-3 px-4 pb-6 backdrop-blur-2xl
                [ h-auto w-full max-w-[500px] min-w-[320px]]
                [ bg-bapt_black/30 bg-gradient-to-b from-black/30 to-black/60 ]
                [ border-[1px] border-solid border-white border-opacity-30 ]"
    >
      <div className="px-2 py-1 pb-3 text-left w-full">
        {hasSettings ? (
          <div className="flex flex-row justify-between items-center">
            <BadgeTitle label={title} />
            <div onClick={reveal}>
              <SettingsIcon className="stroke-white/50 stroke-[0.2rem] hover:cursor-pointer hover:stroke-white w-7" />
            </div>
          </div>
        ) : (
          title && <BadgeTitle label={title} />
        )}
      </div>
      <div className="w-full">{content}</div>
      {show && <div className="w-full mt-2 px-3">{contentSettings}</div>}
      {contentAction && (
        <div className="w-full mt-2 pt-2 border-t-[0.5px] border-gray/50">
          {contentAction}
        </div>
      )}
    </div>
  );
};

export default StandardCard;
