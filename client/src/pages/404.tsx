import Head from "next/head";
import Image from "next/image";

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

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>BaptSwap | 404</title>
      </Head>
    </>
  );
}
