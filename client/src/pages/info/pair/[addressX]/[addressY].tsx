/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, Types } from "aptos";
import { useEffect, useState } from "react";
import {
  MouseParallaxChild,
  MouseParallaxContainer,
} from "react-parallax-mouse";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import FullWidthCard from "@/components/cards/FullWidthCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCircleQuestion,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import SlimButton from "@/components/inputs/buttons/SlimButton";
import { TokenType, TOKEN_LIST } from "@/util/tokenList";
import { formatBalance, numberWithCommas } from "@/util/formatNumbers";
import { MAINNET_NODE_URL, SWAP_ADDRESS } from "@/util/globals";
import { useRouter } from "next/router";
import NotFoundPage from "@/pages/404";
import { TokenPairMetadataType } from "@/pages/swap";
import BadgeTitle from "@/components/inputs/buttons/badges/Title";
import OverlappingTokenIcons from "@/components/icons/OverlappingTokenIcons";

// ----------+---~*-------*~---+----------
// THIS PAGE IS ACCESSIBLE THROUGH URL: localhost:3000/info/pair/${token_addressX}/${token_addressY}
// ----------+---~*-------*~---+----------

export type RewardsPoolUserInfoType = {
  reward_debt_x: string;
  reward_debt_y: string;
  staked_tokens: string;
  withdrawn_x: string;
  withdrawn_y: string;
};

export type RewardsPoolInfoType = {
  dds_x: string;
  dds_y: string;
  precision_factor: string;
  staked_tokens: string;
};

export default function PairInfo() {
  // pull info from URL params [address] and [chain]
  const router = useRouter();
  // convert address to token

  const [tokenX, setTokenX] = useState<TokenType>({
    name: "",
    iconSrc: "",
    symbol: "",
    address: "",
    decimals: 0,
  });
  const [tokenY, setTokenY] = useState<TokenType>({
    name: "",
    iconSrc: "",
    symbol: "",
    address: "",
    decimals: 0,
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [liquidityFee, setLiquidityFee] = useState<string>("0");
  const [teamFee, setTeamFee] = useState<string>("0");
  const [rewardsFee, setRewardsFee] = useState<string>("0");

  useEffect(() => {
    const { addressX, addressY } = router.query;

    const foundX = TOKEN_LIST.find((token) => token.address == addressX);
    const foundY = TOKEN_LIST.find((token) => token.address == addressY);

    console.log(foundX);
    console.log(foundY);

    console.log(addressX);
    console.log(addressY);

    if (foundX && foundY) {
      if (foundX.address < foundX.address) {
        setTokenX(foundX);
        setTokenY(foundY);
      } else {
        setTokenX(foundY);
        setTokenY(foundX);
      }
    }
  }, [TOKEN_LIST, router]);

  const [tokenPairMetadata, setTokenPairMetadata] =
    useState<TokenPairMetadataType>();

  // autoanimate for show tax
  const [showDetails, toggleShowDetails] = useState(false);
  const [parent] = useAutoAnimate();

  // check if owner, set to true for testing
  const [isOwner, toggleIsOwner] = useState(false);

  const aptosClient = new AptosClient(MAINNET_NODE_URL, {
    WITH_CREDENTIALS: false,
  });

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

  // Grab reserves when two tokens selected
  useEffect(() => {
    if (!tokenX || !tokenY) return;

    if (tokenX.address == "" || tokenY.address == "") return;

    // TO DO: Reuse updatePage() here
    let url = "";

    if (tokenX.address < tokenY.address) {
      url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenX.address},${tokenY.address}>`;
    } else {
      url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenY.address},${tokenX.address}>`;
    }

    fetch(`${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/${url}`)
      .then((res) => res.json())
      .then((res) => {
        let data = res.data;

        console.log("data", data);

        let metadata: TokenPairMetadataType = {
          balance_x: data.balance_x.value,
          balance_y: data.balance_y.value,
          liquidity_fee: data.liquidity_fee,
          team_fee: data.team_fee,
          rewards_fee: data.rewards_fee,
          team_balance_x: data.team_balance_x.value,
          team_balance_y: data.team_balance_y.value,
          treasury_balance_x: data.treasury_balance_x.value,
          treasury_balance_y: data.treasury_balance_y.value,
          treasury_fee: data.treasury_fee,
          owner: data.owner,
        };

        setTokenPairMetadata(metadata);
        toggleShowDetails(true);
        if (account?.address === metadata.owner) {
          toggleIsOwner(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [tokenX, tokenY]);

  useEffect(() => {
    if (!tokenPairMetadata) return;

    if (account?.address === tokenPairMetadata.owner) {
      toggleIsOwner(true);
    } else {
      toggleIsOwner(false);
    }
  }, [connected, account, tokenPairMetadata]);

  useEffect(() => {
    if (!account) return;

    if (
      account.address ==
      "0xb73a7b82af68fc1ba6e123688b95adec1fec0bcfc256b5d3a43de227331a7abd"
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [account]);

  const extractTreasuryFees = async () => {
    if (!tokenX || !tokenY) return;
    if (!tokenX.address || !tokenY.address) return;

    let type_arguments: string[] = [];

    if (tokenX.address < tokenY.address) {
      type_arguments = [tokenX.address, tokenY.address];
    } else {
      type_arguments = [tokenY.address, tokenX.address];
    }

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${SWAP_ADDRESS}::swap::withdraw_fee`,
      type_arguments: type_arguments,
      arguments: [], // 1 is in Octas
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");

      // TO DO: Reuse updatePage() here
      let url = "";

      if (tokenX.address < tokenY.address) {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenX.address},${tokenY.address}>`;
      } else {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenY.address},${tokenX.address}>`;
      }

      fetch(`${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/${url}`)
        .then((res) => res.json())
        .then((res) => {
          let data = res.data;

          console.log("data", data);

          let metadata: TokenPairMetadataType = {
            balance_x: data.balance_x.value,
            balance_y: data.balance_y.value,
            liquidity_fee: data.liquidity_fee,
            team_fee: data.team_fee,
            rewards_fee: data.rewards_fee,
            team_balance_x: data.team_balance_x.value,
            team_balance_y: data.team_balance_y.value,
            treasury_balance_x: data.treasury_balance_x.value,
            treasury_balance_y: data.treasury_balance_y.value,
            treasury_fee: data.treasury_fee,
            owner: data.owner,
          };

          setTokenPairMetadata(metadata);
          toggleShowDetails(true);
          if (account?.address === metadata.owner) {
            toggleIsOwner(true);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const editTokenFees = async () => {
    if (!tokenX || !tokenY) return;

    let type_arguments: string[] = [];

    if (tokenX.address < tokenY.address) {
      type_arguments = [tokenX.address, tokenY.address];
    } else {
      type_arguments = [tokenY.address, tokenX.address];
    }

    console.log(type_arguments);

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${SWAP_ADDRESS}::swap::set_token_fees`,
      type_arguments: type_arguments,
      arguments: [
        Number(liquidityFee) * 100,
        Number(teamFee) * 100,
        Number(rewardsFee) * 100,
      ], // 1 is in Octas
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");

      // TO DO: Reuse updatePage() here
      let url = "";

      if (tokenX.address < tokenY.address) {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenX.address},${tokenY.address}>`;
      } else {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenY.address},${tokenX.address}>`;
      }

      fetch(`${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/${url}`)
        .then((res) => res.json())
        .then((res) => {
          let data = res.data;

          console.log("data", data);

          let metadata: TokenPairMetadataType = {
            balance_x: data.balance_x.value,
            balance_y: data.balance_y.value,
            liquidity_fee: data.liquidity_fee,
            team_fee: data.team_fee,
            rewards_fee: data.rewards_fee,
            team_balance_x: data.team_balance_x.value,
            team_balance_y: data.team_balance_y.value,
            treasury_balance_x: data.treasury_balance_x.value,
            treasury_balance_y: data.treasury_balance_y.value,
            treasury_fee: data.treasury_fee,
            owner: data.owner,
          };

          setTokenPairMetadata(metadata);
          toggleShowDetails(true);
          if (account?.address === metadata.owner) {
            toggleIsOwner(true);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const createRewardsPool = async () => {
    if (!tokenX || !tokenY) return;

    let type_arguments: string[] = [];

    if (tokenX.address < tokenY.address) {
      type_arguments = [tokenX.address, tokenY.address];
    } else {
      type_arguments = [tokenY.address, tokenX.address];
    }

    console.log(type_arguments);

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${SWAP_ADDRESS}::router::create_rewards_pool`,
      type_arguments: type_arguments,
      arguments: [false], // 1 is in Octas
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");

      // TO DO: Reuse updatePage() here
      let url = "";

      if (tokenX.address < tokenY.address) {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenX.address},${tokenY.address}>`;
      } else {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenY.address},${tokenX.address}>`;
      }

      fetch(`${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/${url}`)
        .then((res) => res.json())
        .then((res) => {
          let data = res.data;

          console.log("data", data);

          let metadata: TokenPairMetadataType = {
            balance_x: data.balance_x.value,
            balance_y: data.balance_y.value,
            liquidity_fee: data.liquidity_fee,
            team_fee: data.team_fee,
            rewards_fee: data.rewards_fee,
            team_balance_x: data.team_balance_x.value,
            team_balance_y: data.team_balance_y.value,
            treasury_balance_x: data.treasury_balance_x.value,
            treasury_balance_y: data.treasury_balance_y.value,
            treasury_fee: data.treasury_fee,
            owner: data.owner,
          };

          setTokenPairMetadata(metadata);
          toggleShowDetails(true);
          if (account?.address === metadata.owner) {
            toggleIsOwner(true);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const extractTeamFees = async () => {
    if (!tokenX || !tokenY) return;

    let type_arguments: string[] = [];

    if (tokenX.address < tokenY.address) {
      type_arguments = [tokenX.address, tokenY.address];
    } else {
      type_arguments = [tokenY.address, tokenX.address];
    }

    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${SWAP_ADDRESS}::swap::withdraw_team_fee`,
      type_arguments: type_arguments,
      arguments: [], // 1 is in Octas
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");

      // TO DO: Reuse updatePage() here
      let url = "";

      if (tokenX.address < tokenY.address) {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenX.address},${tokenY.address}>`;
      } else {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${tokenY.address},${tokenX.address}>`;
      }

      fetch(`${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/${url}`)
        .then((res) => res.json())
        .then((res) => {
          let data = res.data;

          console.log("data", data);

          let metadata: TokenPairMetadataType = {
            balance_x: data.balance_x.value,
            balance_y: data.balance_y.value,
            liquidity_fee: data.liquidity_fee,
            team_fee: data.team_fee,
            rewards_fee: data.rewards_fee,
            team_balance_x: data.team_balance_x.value,
            team_balance_y: data.team_balance_y.value,
            treasury_balance_x: data.treasury_balance_x.value,
            treasury_balance_y: data.treasury_balance_y.value,
            treasury_fee: data.treasury_fee,
            owner: data.owner,
          };

          setTokenPairMetadata(metadata);
          toggleShowDetails(true);
          if (account?.address === metadata.owner) {
            toggleIsOwner(true);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <div className="static">
      <Head>
        <title>BaptSwap | Pair Info</title>
      </Head>
      <MouseParallaxContainer
        globalFactorX={0.1}
        globalFactorY={0.1}
        className="w-screen z-0"
      >
        <MouseParallaxChild factorX={0.5} factorY={0.7}>
          <div className="relative flex justify-center">
            <div className="absolute top-28 -left-4 w-28 h-28 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70  "></div>
            <div className="absolute top-28 -right-4 w-72 h-72 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70 "></div>
            <div className="absolute top-96 left-28 w-72 h-72 bg-bapt_green/30  rounded-full filter blur-3xl opacity-70 "></div>
          </div>
        </MouseParallaxChild>

        {/* Put this part before </body> tag */}
        <input type="checkbox" id="edit-fees-modal" className="modal-toggle" />
        <label htmlFor="edit-fees-modal" className="modal cursor-pointer">
          <label className="modal-box relative" htmlFor="">
            <h3 className="text-lg font-bold">Edit Fees</h3>
            <div className="flex flex-row justify-between space-x-2 my-2">
              <p>Liquidity Fee (%):</p>
              <input
                type={"text"}
                placeholder={`0`}
                className=" bg-darkgray rounded-xl px-2 transition ease-in-out h-auto outline-none text-white/60"
                value={liquidityFee}
                onChange={(e) => {
                  setLiquidityFee(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-row justify-between space-x-2 my-2">
              <p>Team Fee (%):</p>
              <input
                type={"text"}
                placeholder={`0`}
                className=" bg-darkgray rounded-xl px-2 transition ease-in-out h-auto outline-none text-white/60"
                value={teamFee}
                onChange={(e) => {
                  setTeamFee(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-row justify-between space-x-2 my-2">
              <p>Rewards Fee (%):</p>
              <input
                type={"text"}
                placeholder={`0`}
                className=" bg-darkgray rounded-xl px-2 transition ease-in-out h-auto outline-none text-white/60"
                value={rewardsFee}
                onChange={(e) => {
                  setRewardsFee(e.target.value);
                }}
              />
            </div>
            <SlimButton
              label={
                <label
                  htmlFor="edit-fees-modal"
                  className="w-full px-5 hover:cursor-pointer"
                >
                  Save Fees
                </label>
              }
              onClick={editTokenFees}
              className="flex transition ease-in-out text-md w-fit bg-bapt_green text-black hover:opacity-50"
            />
          </label>
        </label>

        <main className="md:py-40 md:mb-80 z-20 overflow-scroll">
          {tokenX && tokenY && (
            <div className="flex flex-col justify-center items-center py-10 px-3 md:p-10 h-full space-y-24">
              <FullWidthCard
                title="Token Pair Info"
                content={
                  <div className="flex flex-col space-y-2">
                    <div className="flex overflow-x-auto w-full rounded-2xl">
                      <table className="table table-zebra table-fixed overflow-x-clip w-full">
                        <tbody ref={parent} className="w-fit">
                          {/* row 1 */}
                          <tr className="">
                            <td className="flex justify-center">
                              <div className="flex items-center">
                                {/* Overlapping avatars */}
                                <OverlappingTokenIcons
                                  tokenX={tokenX}
                                  tokenY={tokenY}
                                />

                                <div className="space-y-1 md:space-y-0 md:pl-8">
                                  {/* Pairing Names */}
                                  <div className="flex flex-col md:flex-row font-bold">
                                    {tokenX.name} - {tokenY.name}
                                    <div className="md:pl-2 text-white/50 font-medium">
                                      {tokenX.symbol}-{tokenY.symbol}
                                    </div>
                                  </div>
                                  {/* Conversion Rates */}
                                  {/* <div className="flex flex-col md:flex-row space-y-1 md:space-x-3">
                                    <div className="flex space-x-1">
                                      <div className="avatar">
                                        <div className="rounded-full w-5 h-5 card-shadow bg-black">
                                          <img
                                            src={tokenX.iconSrc}
                                            alt={`${tokenX.name} Icon`}
                                          />
                                        </div>
                                      </div>
                                      <div className="text-sm opacity-50">
                                        1 {tokenX.symbol} = 0.123{" "}
                                        {tokenY.symbol}
                                      </div>
                                    </div>
                                    <div className="flex space-x-1">
                                      <div className="avatar">
                                        <div className="rounded-full w-5 h-5 card-shadow bg-black">
                                          <img
                                            src={tokenY.iconSrc}
                                            alt={`${tokenY.name} Icon`}
                                          />
                                        </div>
                                      </div>
                                      <div className="text-sm opacity-50">
                                        123 {tokenY.symbol} = 0.1{" "}
                                        {tokenX.symbol}
                                      </div>
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </td>
                          </tr>
                          {showDetails && (
                            <tr className="">
                              <td className="flex justify-center">
                                {tokenPairMetadata && (
                                  <div className="flex flex-col w-full space-y-3">
                                    <div className="flex flex-col lg:space-y-0 space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                                      {tokenX.address < tokenY.address
                                        ? PairDetails(
                                            tokenX,
                                            "x",
                                            tokenPairMetadata,
                                            isAdmin
                                          )
                                        : PairDetails(
                                            tokenX,
                                            "y",
                                            tokenPairMetadata,
                                            isAdmin
                                          )}
                                      {tokenX.address < tokenY.address
                                        ? PairDetails(
                                            tokenY,
                                            "y",
                                            tokenPairMetadata,
                                            isAdmin
                                          )
                                        : PairDetails(
                                            tokenY,
                                            "x",
                                            tokenPairMetadata,
                                            isAdmin
                                          )}
                                    </div>
                                    <div className="overflow-x-auto w-full border-[1px] rounded-2xl border-off_white/20 p-4 px-5">
                                      <p>Pair Owner Address:</p>
                                      <p className="text-sm text-gray">
                                        {tokenPairMetadata?.owner}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}

                          <tr className="">
                            <td className="flex justify-center">
                              <div className="flex flex-col w-full space-y-3">
                                {tokenPairMetadata && (
                                  <div className="flex flex-row space-x-3">
                                    <div className="flex flex-col space-y-2 w-full border-[1px] rounded-2xl border-off_white/20 p-4 px-5">
                                      <p className="text-lg">Tax Breakdown</p>
                                      <div className="flex flex-row justify-between items-end w-full">
                                        <p className="text-xs">
                                          Liquidity Fee:
                                        </p>
                                        <p className="text-gray">
                                          {Number(
                                            tokenPairMetadata.liquidity_fee
                                          ) / 100}
                                          %
                                        </p>
                                      </div>
                                      <div className="flex flex-row justify-between items-end w-full">
                                        <p className="text-xs">Team Fee:</p>
                                        <p className="text-gray">
                                          {Number(tokenPairMetadata.team_fee) /
                                            100}
                                          %
                                        </p>
                                      </div>
                                      <div className="flex flex-row justify-between items-end w-full">
                                        <p className="text-xs">Rewards Fee:</p>
                                        <p className="text-gray">
                                          {Number(
                                            tokenPairMetadata.rewards_fee
                                          ) / 100}
                                          %
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {isOwner && (
                                  <div className="flex flex-row space-x-2">
                                    <SlimButton
                                      label={<div>Withdraw Team Fees</div>}
                                      onClick={extractTeamFees}
                                      className="flex transition ease-in-out text-md w-fit bg-bapt_green text-black px-6 hover:opacity-50"
                                    />

                                    <SlimButton
                                      label={
                                        <label
                                          htmlFor="edit-fees-modal"
                                          className="w-full px-6 hover:cursor-pointer"
                                        >
                                          Edit Fees
                                        </label>
                                      }
                                      onClick={() => {}}
                                      className="flex transition ease-in-out text-md w-fit bg-bapt_green text-black hover:opacity-50"
                                    />

                                    <SlimButton
                                      label={<div>Initialize Rewards Pool</div>}
                                      onClick={createRewardsPool}
                                      className="flex transition ease-in-out text-md w-fit bg-bapt_green text-black px-6 hover:opacity-50"
                                    />
                                  </div>
                                )}
                                {isAdmin && (
                                  <SlimButton
                                    label={<div>Withdraw Treasury Fees</div>}
                                    onClick={extractTreasuryFees}
                                    className="flex transition ease-in-out text-md w-fit bg-bapt_green text-black px-6 hover:opacity-50"
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
              />
            </div>
          )}
        </main>
      </MouseParallaxContainer>
    </div>
  );
}

// helper UI component
const PairDetails = (
  token: TokenType,
  tokenPointer: String,
  tokenPairMetadata: TokenPairMetadataType,
  isAdmin: boolean
) => {
  return (
    <div className="flex flex-col space-y-3 sm:space-y-2 w-full border-[1px] rounded-2xl border-off_white/20 p-4 sm:px-5 overflow-scroll">
      <div className="flex space-x-1">
        <p>{token.name}</p>
        <p className="text-gray">{token.symbol}</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-end w-full">
        <p className="text-xs">Decimals:</p>
        <p className="text-gray">{token.decimals}</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-end w-full">
        <p className="text-xs">Pair Reserve:</p>
        <p className="text-gray ">
          {tokenPointer === "x" &&
            numberWithCommas(
              formatBalance(Number(tokenPairMetadata.balance_x), token.decimals)
            )}
          {tokenPointer === "y" &&
            numberWithCommas(
              formatBalance(Number(tokenPairMetadata.balance_y), token.decimals)
            )}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-end w-full">
        <p className="text-xs">Team Balance:</p>
        <p className="text-gray">
          {tokenPointer === "x" &&
            numberWithCommas(
              formatBalance(
                Number(tokenPairMetadata.team_balance_x),
                token.decimals
              )
            )}
          {tokenPointer === "y" &&
            numberWithCommas(
              formatBalance(
                Number(tokenPairMetadata.team_balance_y),
                token.decimals
              )
            )}
        </p>
      </div>
      {isAdmin && (
        <div className="flex flex-row justify-between items-end w-full">
          <p className="text-xs">Treasury Balance:</p>
          <p className="text-gray">
            {tokenPointer === "x" &&
              numberWithCommas(
                formatBalance(
                  Number(tokenPairMetadata.treasury_balance_x),
                  token.decimals
                )
              )}
            {tokenPointer === "y" &&
              numberWithCommas(
                formatBalance(
                  Number(tokenPairMetadata.treasury_balance_y),
                  token.decimals
                )
              )}
          </p>
        </div>
      )}
    </div>
  );
};
