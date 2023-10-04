import AptosImage from "../../public/external_media/aptos-bg-black.png";
import USDCImage from "../../public/external_media/usd-coin.png";
import BaptImage from "../../public/external_media/baptlabs-mini.png";
import MAUImage from "../../public/external_media/MAU-icon.jpeg";
import WARImage from "../../public/external_media/war_coin.svg";
import NEBULAImage from "../../public/external_media/nebula.png";
import BNBImage from "../../public/external_media/BNB.png";
import CAKEImage from "../../public/external_media/CAKE.png";
import USDTImage from "../../public/external_media/USDT.png";
import THLImage from "../../public/external_media/THL.png";
import PEPEImage from "../../public/external_media/pepelogo.png";
import { SWAP_ADDRESS } from "./globals";

export type TokenType = {
  address: string;
  name: string;
  symbol: string;
  iconSrc: string;
  decimals: number;
};

export const TOKEN_LIST: TokenType[] = [
  {
    name: "BAPT",
    symbol: "BAPT",
    iconSrc: BaptImage.src,
    address:
      "0x96868b2182053d9bdd36065f827280fc9fcc39b9e4f8b3055e405212bab7d52::bapt::BAPT",
    decimals: 8,
  },
  {
    name: "Aptos",
    symbol: "APT",
    iconSrc: AptosImage.src,
    address: "0x1::aptos_coin::AptosCoin",
    decimals: 8,
  },
  {
    name: "USDC",
    symbol: "USDC",
    iconSrc: USDCImage.src,
    address:
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
    decimals: 6,
  },
  {
    name: "Layer Zero - Tether USD",
    symbol: "lzUSDT",
    iconSrc: USDTImage.src,
    address:
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
    decimals: 6,
  },
  {
    name: "PEPE",
    symbol: "PEPE",
    iconSrc: PEPEImage.src,
    address:
      "0xc567557b65618aa413428e558bafa965284d23bcbdcc864af15848e0ab73598e::pepe::PEPE",
    decimals: 8,
  },
  {
    name: "Pancakeswap Token",
    symbol: "CAKE",
    iconSrc: CAKEImage.src,
    address:
      "0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT",
    decimals: 8,
  },
  {
    name: "War Coin",
    symbol: "WAR",
    iconSrc: WARImage.src,
    address:
      "0x52ab49a4039c3d2b0aa6e0a00aaed75dcff72a3120ba3610f62d1d0b6032345a::war_coin::WarCoin",
    decimals: 8,
  },
  {
    name: "The Nebula",
    symbol: "NEBULA",
    iconSrc: NEBULAImage.src,
    address:
      "0xfc2c54cd877d119618171927f283a2dd73f4860f76ae26dec43b3d1c05106f38::nebula::Nebula",
    decimals: 8,
  },

  {
    name: "Thala Token",
    symbol: "THL",
    iconSrc: THLImage.src,
    address:
      "0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL",
    decimals: 8,
  },
  {
    name: "BAPT V1",
    symbol: "BAPTv1",
    iconSrc: BaptImage.src,
    address:
      "0xb73a7b82af68fc1ba6e123688b95adec1fec0bcfc256b5d3a43de227331a7abd::baptlabs::BaptLabs",
    decimals: 8,
  },
  {
    name: "MAU V1",
    symbol: "MAUv1",
    iconSrc: MAUImage.src,
    address:
      "0xf8fa55ff4265fa9586f74d00da4858b8a0d2320bbe94cb0e91bf3a40773eb60::MAU::MAU",
    decimals: 8,
  },
];

export type LPType = {
  tokenX: TokenType;
  tokenY: TokenType;
  LPaddress: string;
};

export const LP_LIST: LPType[] = [
  {
    // BAPT & APT pair
    tokenX: TOKEN_LIST[0],
    tokenY: TOKEN_LIST[1],
    LPaddress:
      TOKEN_LIST[0].address < TOKEN_LIST[1].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[0].address},${TOKEN_LIST[1].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[1].address},${TOKEN_LIST[0].address}>`,
  },
  {
    // APT & USDC pair
    tokenX: TOKEN_LIST[1],
    tokenY: TOKEN_LIST[2],
    LPaddress:
      TOKEN_LIST[1].address < TOKEN_LIST[2].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[1].address},${TOKEN_LIST[2].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[2].address},${TOKEN_LIST[1].address}>`,
  },
  {
    // USDC & lzUSDT pair
    tokenX: TOKEN_LIST[2],
    tokenY: TOKEN_LIST[3],
    LPaddress:
      TOKEN_LIST[2].address < TOKEN_LIST[3].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[2].address},${TOKEN_LIST[3].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[3].address},${TOKEN_LIST[2].address}>`,
  },
  {
    // APT & PEPE pair
    tokenX: TOKEN_LIST[1],
    tokenY: TOKEN_LIST[4],
    LPaddress:
      TOKEN_LIST[1].address < TOKEN_LIST[4].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[1].address},${TOKEN_LIST[4].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[4].address},${TOKEN_LIST[1].address}>`,
  },
  {
    // APT & CAKE pair
    tokenX: TOKEN_LIST[1],
    tokenY: TOKEN_LIST[5],
    LPaddress:
      TOKEN_LIST[1].address < TOKEN_LIST[5].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[1].address},${TOKEN_LIST[5].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[5].address},${TOKEN_LIST[1].address}>`,
  },
  {
    // APT & Werewolf pair
    tokenX: TOKEN_LIST[1],
    tokenY: TOKEN_LIST[6],
    LPaddress:
      TOKEN_LIST[1].address < TOKEN_LIST[6].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[1].address},${TOKEN_LIST[6].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[6].address},${TOKEN_LIST[1].address}>`,
  },
  {
    // APT & Nebula pair
    tokenX: TOKEN_LIST[1],
    tokenY: TOKEN_LIST[7],
    LPaddress:
      TOKEN_LIST[1].address < TOKEN_LIST[7].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[1].address},${TOKEN_LIST[7].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[7].address},${TOKEN_LIST[1].address}>`,
  },
  {
    // APT & THL pair
    tokenX: TOKEN_LIST[1],
    tokenY: TOKEN_LIST[8],
    LPaddress:
      TOKEN_LIST[1].address < TOKEN_LIST[8].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[1].address},${TOKEN_LIST[8].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[8].address},${TOKEN_LIST[1].address}>`,
  },
  {
    // BAPTv1 & APT pair
    tokenX: TOKEN_LIST[9],
    tokenY: TOKEN_LIST[1],
    LPaddress:
      TOKEN_LIST[9].address < TOKEN_LIST[1].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[9].address},${TOKEN_LIST[1].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[1].address},${TOKEN_LIST[9].address}>`,
  },
  {
    // Mauv1 & APT pair
    tokenX: TOKEN_LIST[10],
    tokenY: TOKEN_LIST[1],
    LPaddress:
      TOKEN_LIST[10].address < TOKEN_LIST[1].address
        ? `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[10].address},${TOKEN_LIST[1].address}>`
        : `${SWAP_ADDRESS}::swap::TokenPairMetadata<${TOKEN_LIST[1].address},${TOKEN_LIST[10].address}>`,
  },
];

export type LockerTokenType = {
  token: TokenType;
  lock?: Date;
  unlock?: Date;
};

export const LOCKER_TOKEN_LIST: LockerTokenType[] = [
  {
    token: TOKEN_LIST[0],
    lock: new Date("2023-03-23T02:24:00+00:00"),
    unlock: new Date("2023-02-20T02:24:00+00:00"),
  },
  {
    token: TOKEN_LIST[1],
    lock: new Date("2023-03-10T02:24:00+00:00"),
    unlock: new Date("2023-04-20T02:24:00+00:00"),
  },
  {
    token: TOKEN_LIST[2],
    lock: new Date("2023-03-23T02:24:00+00:00"),
    unlock: new Date("2023-06-20T22:50:00+00:00"),
  },
];

export type LockerLiquidityType = {
  pair: LPType;
  lock?: Date;
  unlock?: Date;
};

export const LOCKER_LIQUIDITY_LIST: LockerLiquidityType[] = [
  {
    pair: LP_LIST[0],
    lock: new Date("2023-03-23T02:24:00+00:00"),
    unlock: new Date("2023-04-20T02:24:00+00:00"),
  },
  {
    pair: LP_LIST[1],
    lock: new Date("2023-03-10T02:24:00+00:00"),
    unlock: new Date("2023-03-20T02:24:00+00:00"),
  },
  {
    pair: LP_LIST[2],
    lock: new Date("2023-03-23T02:24:00+00:00"),
    unlock: new Date("2023-06-20T22:50:00+00:00"),
  },
];
