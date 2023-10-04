import React, { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import SettingsIcon from "../icons/SettingsIcon";
import { SimpleCardProps } from "./StandardCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import BadgeTitle from "../inputs/buttons/badges/Title";

// General card which takes in title and content and applies a bg color
const FullWidthCard: React.FC<SimpleCardProps> = ({
  title,
  alt,
  content,
  hasBackButton,
  hasSettings,
  contentSettings,
  contentAction,
}) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const parent = useRef(null);
  const reveal = () => setShow(!show);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  let altClasses: string = "";
  if (alt === "alt") {
    altClasses =
      "bg-bapt_subgreen/30 border-[1px] border-opacity-20 border-bapt_green";
  } else {
    // primary button with no alt
    altClasses = "border-[1px] border-solid border-white border-opacity-30 ";
  }

  // TO DO: adjust for 4k screens
  return (
    <div
      ref={parent}
      className={`flex flex-col card-shadow rounded-3xl justify-center items-center p-3 px-0 md:px-4 pb-6 backdrop-blur-xl
                [ h-auto w-full max-w-full md:max-w-90 min-w-86 xl:w-30 ]
                [ bg-bapt_black/30 bg-gradient-to-b from-black/30 to-black/60 ]
                 ${altClasses}`}
    >
      <div className="px-2 py-1 pb-3 text-left w-full">
        {hasSettings ? (
          <div className="flex flex-row justify-between items-center">
            <BadgeTitle label={title} />
            <div onClick={reveal}>
              <SettingsIcon className="stroke-white/50 stroke-[0.2rem] hover:cursor-pointer hover:stroke-white w-7" />
            </div>
          </div>
        ) : hasBackButton ? (
          <div className="flex flex-row justify-left space-x-3 items-center ">
            <div onClick={() => router.back()}>
              <FontAwesomeIcon
                className="align-middle text-bapt_green w-5 h-7 hover:cursor-pointer hover:text-bapt_subgreen"
                icon={faArrowLeft}
                // style={{ width: "1.25em", height: "1.25em" }}
              />
            </div>
            <BadgeTitle label={title} />
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

export default FullWidthCard;
