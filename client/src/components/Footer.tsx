import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="bottom-0 w-full border-t-2 border-bapt_subgreen flex flex-col md:space-y-0 md:flex-row items-center p-2 bg-bapt_black">
      <div className="flex flex-row flex-wrap w-full">
        <div className="flex flex-col md:w-1/2 w-full">
          <div className="flex flex-row w-full justify-start items-center px-4 bg-bapt_black md:pb-4 mt-2">
            <Link href="/">
              <Image src="/HEAD_Negative.png" width={40} height={40} alt="" />
            </Link>
            <h2 className="flex flex-row text-white font-bold font-lato text-2xl px-2">
              BAPT <em className="text-bapt_green">SWAP</em>
            </h2>
          </div>
          <div className="w-full px-4">
            {" "}
            <p className="bg-bapt_black">
              © 2023 BaptLabs. All Rights Reserved. Use of this site is subject
              to certain{" "}
              <a
                href="https://docs.baptlabs.com/legal-disclaimers/terms-of-use"
                target="_blank"
                rel="noreferrer"
                className="text-bapt_green"
              >
                Terms Of Use
              </a>
              .
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-row flex-wrap justify-start md:space-x-20 p-2">
          <div className="flex flex-col w-full md:w-fit items-start md:px-0 px-4 py-3 md:py-0">
            <div className="font-black text-lg text-bapt_green">Community</div>
            <ul className="hover:cursor-pointer text-white">
              <li className="hover:text-bapt_green">
                <Link href="https://twitter.com/baptswap" target="_blank">
                  Twitter
                </Link>
              </li>
              <li className="hover:text-bapt_green">
                {" "}
                <Link
                  href="https://discord.com/invite/fvGrNVN55B"
                  target="_blank"
                >
                  Discord
                </Link>
              </li>
              <li className="hover:text-bapt_green">
                {" "}
                <Link href="https://t.me/baptlabs" target="_blank">
                  Telegram
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col w-full md:w-fit items-start md:px-0 px-4 py-3 md:py-0">
            <div className="font-black text-lg text-bapt_green">Analytics</div>
            <ul className="hover:cursor-pointer text-white">
              <li className="hover:text-bapt_green">
                {" "}
                <Link
                  href="https://www.coingecko.com/en/exchanges/baptswap"
                  target="_blank"
                >
                  CoinGecko
                </Link>
              </li>
              <li className="hover:text-bapt_green">
                {" "}
                <Link
                  href="https://www.geckoterminal.com/aptos/baptswap/pools"
                  target="_blank"
                >
                  GeckoTerminal
                </Link>
              </li>
              <li className="hover:text-bapt_green">
                {" "}
                <Link
                  href="https://defillama.com/protocol/baptswap"
                  target="_blank"
                >
                  DefiLlama
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col w-full md:w-fit items-start md:px-0 px-4 py-3 md:py-0 md:mb-5">
            <div className="font-black text-lg text-bapt_green">Resources</div>
            <ul className="hover:cursor-pointer text-white">
              <li className="hover:text-bapt_green">
                {" "}
                <Link href="https://github.com/baptswap" target="_blank">
                  GitHub
                </Link>
              </li>
              <li className="hover:text-bapt_green">
                {" "}
                <Link
                  href="https://github.com/ContractWolf/smart-contract-audits/blob/main/ContractWolf_Audit_BAPT_SWAP.pdf"
                  target="_blank"
                >
                  ContractWolf Audit
                </Link>
              </li>
              <li className="hover:text-bapt_green">
                {" "}
                <Link href="https://docs.baptlabs.com" target="_blank">
                  Docs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
