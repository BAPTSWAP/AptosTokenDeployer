/* eslint-disable @next/next/no-img-element */
import StandardCard from "../../components/cards/StandardCard";
import Head from "next/head";
import StandardFormButton from "@/components/inputs/buttons/StandardFormButton";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, Types } from "aptos";
import SwapArrowsButton from "@/components/inputs/buttons/SwapArrowsButton";
import TextFieldWithDropdown from "@/components/inputs/textfields/TextFieldWithDropdown";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MouseParallaxChild,
  MouseParallaxContainer,
} from "react-parallax-mouse";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import BadgeButtonGroup, {
  Badge,
} from "@/components/inputs/buttons/badges/BadgeButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { TokenType, TOKEN_LIST } from "@/util/tokenList";
import React from "react";
import { formatBalance, numberWithCommas } from "@/util/formatNumbers";
import { MAINNET_NODE_URL, SWAP_ADDRESS } from "@/util/globals";
import Link from "next/link";
import SlimButton from "@/components/inputs/buttons/SlimButton";
import { useRouter } from "next/router";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import ContractWolf from "../../../public/external_media/contractwolf.png";
import PriceChart from "@/components/PriceChart";
import FullWidthCard from "@/components/cards/FullWidthCard";

export type TokenPairMetadataType = {
  balance_x: String;
  balance_y: String;
  liquidity_fee: String;
  rewards_fee: String;
  team_fee: String;
  team_balance_x?: String;
  team_balance_y?: String;
  treasury_balance_x?: String;
  treasury_balance_y?: String;
  treasury_fee?: String;
  owner?: String;
};

export default function Swap() {
  const router = useRouter();

  const [inputToken, setInputToken] = useState<TokenType>(TOKEN_LIST[1]);
  const [outputToken, setOutputToken] = useState<TokenType>(TOKEN_LIST[0]);
  // Determines exact input or exact output
  const [inputType, setInputType] = useState<boolean>(true);

  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");

  const [inputBalance, setInputBalance] = useState<number>(0);
  const [outputBalance, setOutputBalance] = useState<number>(0);

  const [tokenPairMetadata, setTokenPairMetadata] =
    useState<TokenPairMetadataType>();
  const [totalTax, setTotalTax] = useState<number>(0);

  const [tradeWarning, setTradeWarning] = useState<boolean>(false);

  const aptosClient = new AptosClient(MAINNET_NODE_URL, {
    WITH_CREDENTIALS: false,
  });

  const [isOutputRegistered, setIsOutputRegistered] = useState<boolean>(false);

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

  const determineBalance = (
    checkInput: boolean,
    account: any,
    token: TokenType
  ) => {
    fetch(
      `${MAINNET_NODE_URL}/accounts/${account.address}/resource/0x1::coin::CoinStore<${token.address}>`
    )
      .then((res) => res.json())
      .then((res) => {
        if (checkInput) {
          // handle input
          setInputBalance(0);

          if (res.data.coin.value) {
            setInputBalance(res.data.coin.value);
          }
        } else {
          // handle output
          setOutputBalance(0);

          if (res.data.coin.value) {
            setOutputBalance(res.data.coin.value);
            setIsOutputRegistered(true);
          } else {
            setIsOutputRegistered(false);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitAndUpdate = async (payload: Types.TransactionPayload) => {
    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");

      updatePage();
      setInputAmount("0");
      setOutputAmount("0");
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const onSignAndSubmitTransaction = async () => {
    if (inputType) {
      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${SWAP_ADDRESS}::router::swap_exact_input`,
        type_arguments: [inputToken.address, outputToken.address],
        arguments: [
          (Number(inputAmount) * 10 ** inputToken.decimals).toFixed(0),
          (Number(outputAmount) * 10 ** outputToken.decimals * 0.85).toFixed(0),
        ], // 1 is in Octas
      };

      submitAndUpdate(payload);
    } else {
      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${SWAP_ADDRESS}::router::swap_exact_output`,
        type_arguments: [inputToken.address, outputToken.address],
        arguments: [
          (Number(outputAmount) * 10 ** outputToken.decimals).toFixed(0),
          (Number(inputAmount) * 10 ** inputToken.decimals * 1.15).toFixed(0),
        ], // 1 is in Octas
      };

      submitAndUpdate(payload);
    }
  };

  const onRegisterToken = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: "0x1::managed_coin::register",
      type_arguments: [outputToken.address],
      arguments: [], // 1 is in Octas
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");

      setIsOutputRegistered(true);
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const updatePage = () => {
    let url = "";

    if (inputToken.address < outputToken.address) {
      url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${inputToken.address},${outputToken.address}>`;
    } else {
      url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${outputToken.address},${inputToken.address}>`;
    }

    fetch(`${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/${url}`)
      .then((res) => res.json())
      .then((res) => {
        let data = res.data;

        let metadata: TokenPairMetadataType = {
          balance_x: data.balance_x.value,
          balance_y: data.balance_y.value,
          liquidity_fee: data.liquidity_fee,
          team_fee: data.team_fee,
          rewards_fee: data.rewards_fee,
        };

        setTokenPairMetadata(metadata);
      })
      .catch((e) => {
        console.log(e);
      });

    if (connected && account) {
      // Determine balance of input token
      if (inputToken.address != "") {
        determineBalance(true, account, inputToken);
      }

      // Determine balance of output token
      if (outputToken.address != "") {
        determineBalance(false, account, outputToken);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calculateRate = (amount: string, conversionRate: number) => {
    return Number(amount) * conversionRate;
  };

  const onSelectInputToken = useCallback(
    (val: React.SetStateAction<TokenType>) => {
      setInputToken(val);
    },
    [setInputToken]
  );

  const onSelectOutputToken = useCallback(
    (val: React.SetStateAction<TokenType>) => {
      setOutputToken(val);
    },
    [setOutputToken]
  );

  useEffect(() => {
    setInputAmount("0");
    setOutputAmount("0");
  }, [inputToken, outputToken]);

  useEffect(() => {
    const { inputToken, outputToken } = router.query;

    if (!inputToken || !outputToken) return;

    const foundInput = TOKEN_LIST.find((token) => token.address == inputToken);
    const foundOutput = TOKEN_LIST.find(
      (token) => token.address == outputToken
    );

    if (!foundInput || !foundOutput) return;

    setInputToken(foundInput);
    setOutputToken(foundOutput);
  }, [router]);

  useEffect(() => {
    outputToken && onSelectOutputToken(outputToken);
  }, [onSelectOutputToken, outputToken]);

  useEffect(() => {
    inputToken && onSelectInputToken(inputToken);
  }, [onSelectInputToken, inputToken]);

  // autoanimate for show tax
  const [showTax, setShowTax] = useState(false);
  const [parent] = useAutoAnimate();
  const revealTax = () => setShowTax(!showTax);

  // switch tokens
  const handleSwapSelectedTokens = () => {
    let prevInput = inputToken;
    let prevOutput = outputToken;

    onSelectInputToken(prevOutput);
    onSelectOutputToken(prevInput);

    let prevInputAmount = inputAmount;
    let prevOutputAmount = outputAmount;

    setInputAmount(prevOutputAmount);
    setOutputAmount(prevInputAmount);
  };

  // calculate taz
  useEffect(() => {
    if (tokenPairMetadata) {
      let totalFee =
        Number(tokenPairMetadata.liquidity_fee) +
        Number(tokenPairMetadata.rewards_fee) +
        Number(tokenPairMetadata.team_fee);

      setTotalTax(totalFee);
    }
  }, [tokenPairMetadata]);

  // Grab reserves when two tokens selected
  useEffect(() => {
    if (inputToken.address == "" || outputToken.address == "") return;

    // TO DO: Reuse updatePage() here
    let url = "";

    if (inputToken.address < outputToken.address) {
      url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${inputToken.address},${outputToken.address}>`;
    } else {
      url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${outputToken.address},${inputToken.address}>`;
    }

    setTokenPairMetadata(undefined);
    setTradeWarning(false);

    fetch(`${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/${url}`)
      .then((res) => res.json())
      .then((res) => {
        let data = res.data;

        let metadata: TokenPairMetadataType = {
          balance_x: data.balance_x.value,
          balance_y: data.balance_y.value,
          liquidity_fee: data.liquidity_fee,
          team_fee: data.team_fee,
          rewards_fee: data.rewards_fee,
        };

        setTokenPairMetadata(metadata);

        if (
          data.balance_x.value < 100 * 10 ** 8 ||
          data.balance_x.value < 100 * 10 ** 8
        ) {
          setTradeWarning(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [inputToken, outputToken]);

  // called when connected
  useEffect(() => {
    if (!connected) {
      setInputBalance(0);
      setOutputBalance(0);
    }

    if (connected && account) {
      // Determine balance of input token
      if (inputToken.address != "") {
        determineBalance(true, account, inputToken);
      }

      // Determine balance of output token
      if (outputToken.address != "") {
        determineBalance(false, account, outputToken);
      }
    }
  }, [connected, inputToken, outputToken, account]);

  return (
    <div className="static">
      <Head>
        <title>BaptSwap | Swap</title>
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

        <main className="md:pt-40 md:mb-20 z-20  overflow-scroll">
          <div className="flex flex-col justify-center w-full max-w-full md:max-w-90 min-w-86 xl:w-30 xl:max-w-30 xl:min-w-30 items-center py-10 px-3 md:p-10 h-full space-y-24">
            <div className="flex flex-col w-full 3xl:w-[50%] lg:flex-row md:space-y-5 lg:space-y-0 lg:space-x-5 ">
              <div className="w-full 3xl:w-2/3">
                <FullWidthCard
                  title="Chart"
                  content={
                    <PriceChart
                      inputToken={inputToken}
                      outputToken={outputToken}
                    />
                  }
                />
              </div>
              <div className="w-full lg:w-1/3 lg:pt-0 pt-5">
                <StandardCard
                  title="Swap"
                  content={
                    <div
                      className="flex flex-col space-y-4 sm:space-y-2"
                      ref={parent}
                    >
                      <div className="flex flex-col items-center w-full sm:space-y-0 space-y-2">
                        <TextFieldWithDropdown
                          id="input"
                          value={inputAmount}
                          type="number"
                          placeholder="0.0"
                          onChange={(e) => {
                            revealTax();
                            console.log("input change");
                            setInputType(true);
                            setInputAmount(e.target.value);

                            if (tokenPairMetadata) {
                              if (inputToken.address < outputToken.address) {
                                setOutputAmount(
                                  calculateRate(
                                    e.target.value,
                                    (Number(tokenPairMetadata.balance_y) *
                                      10 ** inputToken.decimals) /
                                      (Number(tokenPairMetadata.balance_x) *
                                        10 ** outputToken.decimals)
                                  ).toString()
                                );
                              } else {
                                setOutputAmount(
                                  calculateRate(
                                    e.target.value,
                                    (Number(tokenPairMetadata.balance_x) *
                                      10 ** inputToken.decimals) /
                                      (Number(tokenPairMetadata.balance_y) *
                                        10 ** outputToken.decimals)
                                  ).toString()
                                );
                              }
                            }
                          }}
                          handleSelect={onSelectInputToken}
                          optionResetSelect={inputToken}
                          balance={inputBalance}
                        />

                        <SwapArrowsButton
                          handleClick={() => handleSwapSelectedTokens()}
                        />

                        <TextFieldWithDropdown
                          id="output"
                          value={outputAmount}
                          type="number"
                          placeholder="0.0"
                          onChange={(e) => {
                            console.log("output change");
                            setInputType(false);
                            setOutputAmount(e.target.value);

                            if (tokenPairMetadata) {
                              if (inputToken.address < outputToken.address) {
                                setInputAmount(
                                  calculateRate(
                                    e.target.value,
                                    (Number(tokenPairMetadata.balance_x) *
                                      10 ** outputToken.decimals) /
                                      (Number(tokenPairMetadata.balance_y) *
                                        10 ** inputToken.decimals) /
                                      ((10000 - totalTax - 30) / 10000)
                                  ).toString()
                                );
                              } else {
                                setInputAmount(
                                  calculateRate(
                                    e.target.value,
                                    (Number(tokenPairMetadata.balance_y) *
                                      10 ** outputToken.decimals) /
                                      (Number(tokenPairMetadata.balance_x) *
                                        10 ** inputToken.decimals) /
                                      ((10000 - totalTax - 30) / 10000)
                                  ).toString()
                                );
                              }
                            }
                          }}
                          handleSelect={onSelectOutputToken}
                          optionResetSelect={outputToken}
                          balance={outputBalance}
                        />
                      </div>

                      {/* TAX */}
                      {tokenPairMetadata &&
                        outputToken.name !== "" &&
                        inputToken.name !== "" && (
                          <div className="py-2 px-6 flex flex-col space-y-4 sm:space-y-3 items-center w-full text-off_white/40 my-3 text-sm">
                            {tradeWarning && (
                              <div
                                className="justify-left w-full flex flex-col border-0 h-fit badge badge-l p-3 px-5 
                          [ bg-red-800 text-off_white ] opacity-80"
                              >
                                <p>LOW LIQUIDITY WARNING</p>
                                <p>
                                  The selected token pair has very low liquidity
                                  and your trades may result in the loss of your
                                  funds. Please exercise caution.
                                </p>
                              </div>
                            )}
                            <p
                              className="justify-left w-full border-[1px] badge badge-l p-3 px-5 
                          [ border-darkgray bg-black/20 text-off_white ] opacity-80"
                            >
                              Token Pair Reserves
                            </p>
                            {inputToken.address < outputToken.address ? (
                              <div className="flex flex-col w-full">
                                <div className="flex col-span-1 space-x-1">
                                  <p className="text-left">
                                    {numberWithCommas(
                                      formatBalance(
                                        Number(tokenPairMetadata.balance_x),
                                        inputToken.decimals
                                      ),
                                      inputToken.decimals
                                    )}
                                  </p>
                                  <p className="font-black">
                                    {inputToken.symbol}
                                  </p>
                                </div>
                                <div className="flex col-span-1 space-x-1 ">
                                  <p className="text-left">
                                    {numberWithCommas(
                                      formatBalance(
                                        Number(tokenPairMetadata.balance_y),
                                        outputToken.decimals
                                      ),
                                      outputToken.decimals
                                    )}
                                  </p>
                                  <p className="font-black">
                                    {outputToken.symbol}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 lg:grid-cols-2 md:justify-between gap-1 w-full">
                                <div className="flex col-span-1 space-x-1">
                                  <p className="text-left">
                                    {numberWithCommas(
                                      formatBalance(
                                        Number(tokenPairMetadata.balance_y),
                                        inputToken.decimals
                                      ),
                                      inputToken.decimals
                                    )}
                                  </p>
                                  <p className="font-black">
                                    {inputToken.symbol}
                                  </p>
                                </div>
                                <div className="flex col-span-1 space-x-1 lg:justify-end justify-start">
                                  <p className="text-right">
                                    {numberWithCommas(
                                      formatBalance(
                                        Number(tokenPairMetadata.balance_x),
                                        outputToken.decimals
                                      ),
                                      outputToken.decimals
                                    )}
                                  </p>
                                  <p className="font-black">
                                    {outputToken.symbol}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="w-full">
                              <Link
                                href={`/info/pair/${inputToken.address}/${outputToken.address}`}
                              >
                                <SlimButton
                                  label={
                                    <div>
                                      View Pair Info
                                      <FontAwesomeIcon
                                        className="w-3 h-3 p-0.5 pl-2"
                                        icon={faArrowUpRightFromSquare}
                                      />
                                    </div>
                                  }
                                  className="transition ease-in-out bg-bapt_green/20 text-bapt_green font-medium w-full [ hover:opacity-60 ] h-6"
                                />
                              </Link>
                            </div>
                            <div className="border-t-[0.5px] border-gray/50 pt-3 w-full">
                              <p
                                className="justify-left w-full border-[1px] badge badge-l p-3 px-5 
                          [ border-darkgray bg-black/20 text-off_white ] opacity-80 "
                              >
                                Fees
                              </p>
                            </div>

                            <div className="flex flex-row justify-between w-full ">
                              <p className="text-left">Fee (0.3%)</p>
                              <div className="text-right flex flex-row space-x-1">
                                <p className="">
                                  {(
                                    (Number(inputAmount) * 3) /
                                    1000
                                  ).toLocaleString(undefined, {
                                    maximumSignificantDigits: 8,
                                  })}
                                </p>
                                <p> {inputToken.symbol}</p>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between w-full">
                              <p className="text-left">
                                Tax ({totalTax / 100}%)
                              </p>
                              <div className="text-right flex flex-row space-x-1">
                                <p className="">
                                  {(
                                    (Number(inputAmount) * totalTax) /
                                    10000
                                  ).toLocaleString(undefined, {
                                    maximumSignificantDigits: 8,
                                  })}
                                </p>
                                <p> {inputToken.symbol}</p>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between w-full">
                              <p className="text-left">Slippage %</p>
                              <BadgeButtonGroup>
                                <Badge label="Auto" isSelected={true} />
                              </BadgeButtonGroup>
                            </div>
                            <div className="flex flex-row text-left font-black justify-between w-full text-off_white border-t-[0.5px] border-gray/50 pt-2">
                              <p>YOU WILL RECEIVE</p>
                              <div className="flex flex-row">
                                <div
                                  className="mr-2 tooltip tooltip-left font-normal text-off_white/30"
                                  data-tip="This amount includes taxes, fees, and gas. Amount may vary due to possible slippage."
                                >
                                  <FontAwesomeIcon
                                    className=" text-bapt_green/50 [ hover:text-bapt_subgreen ]"
                                    icon={faCircleQuestion}
                                    style={{ width: "1em", height: "1em" }}
                                  />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:space-x-1">
                                  <div className="flex">
                                    <p>~</p>
                                    <p className="text-right">
                                      {inputType
                                        ? (
                                            Number(outputAmount) -
                                            (Number(outputAmount) *
                                              (totalTax + 30)) /
                                              10000
                                          ).toLocaleString(undefined, {
                                            maximumSignificantDigits:
                                              outputToken.decimals,
                                          })
                                        : Number(outputAmount).toLocaleString(
                                            undefined,
                                            {
                                              maximumSignificantDigits:
                                                outputToken.decimals,
                                            }
                                          )}
                                    </p>
                                  </div>
                                  <p className="text-right">
                                    {outputToken.symbol}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  }
                  contentAction={
                    connected ? (
                      isOutputRegistered ? (
                        tokenPairMetadata ? (
                          <StandardFormButton
                            label="Swap"
                            onClick={onSignAndSubmitTransaction}
                            className="w-full"
                          />
                        ) : (
                          <StandardFormButton
                            label="Non-existent Pair"
                            onClick={() => {}}
                            className="w-full"
                            alt="outline-gray"
                          />
                        )
                      ) : (
                        <StandardFormButton
                          label="Register Token"
                          onClick={onRegisterToken}
                          className="w-full"
                        />
                      )
                    ) : (
                      <StandardFormButton
                        label="Connect Wallet"
                        onClick={() => {}}
                        className="w-full hover:cursor-default"
                        alt="outline-gray"
                      />
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="text-gray py-2 text-sm px-10">Audited By</p>
              <a
                href="https://github.com/ContractWolf/smart-contract-audits/blob/main/ContractWolf_Audit_BAPT_SWAP.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="w-72"
                  src={ContractWolf.src}
                  alt="ContractWolf Logo"
                />
              </a>
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="text-gray py-2 text-sm px-10">
                By interacting with BaptSwap, you agree to our Terms of Use.
              </p>
              <StandardFormButton
                className="opacity-70 px-16"
                label="Terms of Use"
                onClick={() => {
                  window.location.href =
                    "https://docs.baptlabs.com/legal-disclaimers/terms-of-use";
                }}
                alt="outline-gray"
              />
            </div>
          </div>
        </main>
      </MouseParallaxContainer>
    </div>
  );
}
