import StandardCard from "../../components/cards/StandardCard";
import Head from "next/head";
import StandardFormButton from "@/components/inputs/buttons/StandardFormButton";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, Types } from "aptos";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MouseParallaxChild,
  MouseParallaxContainer,
} from "react-parallax-mouse";
import autoAnimate from "@formkit/auto-animate";
import { TokenType, TOKEN_LIST } from "@/util/tokenList";
import TokenDropdownSelector, {
  TokenWithIcon,
} from "@/components/inputs/dropdowns/TokenDropdownSelector";
import StandardTextField from "@/components/inputs/textfields/StandardTextField";
import { TokenPairMetadataType } from "../swap";
import { formatBalance, numberWithCommas } from "@/util/formatNumbers";
import { MAINNET_NODE_URL, SWAP_ADDRESS } from "@/util/globals";

export default function RedeemLP() {
  const [inputToken, setInputToken] = useState<TokenType>({
    name: "",
    iconSrc: "",
    address: "",
    symbol: "",
    decimals: 0,
  });
  const [outputToken, setOutputToken] = useState<TokenType>({
    name: "",
    iconSrc: "",
    address: "",
    symbol: "",
    decimals: 0,
  });

  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount1, setOutputAmount1] = useState<string>("");
  const [outputAmount2, setOutputAmount2] = useState<string>("");

  const [inputBalance, setInputBalance] = useState<number>(0);
  const [outputBalance, setOutputBalance] = useState<number>(0);

  const [tokenPairMetadata, setTokenPairMetadata] =
    useState<TokenPairMetadataType>();

  const [LPSupply, setLPSupply] = useState<string>();
  const [LPBalance, setLPBalance] = useState<string>();

  // autoanimate for show tax
  const [showSlippage, setShowSlippage] = useState(false);
  const parent = useRef(null);
  const revealSlippage = () => setShowSlippage(!showSlippage);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

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

  const onSignAndSubmitTransaction = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${SWAP_ADDRESS}::router::remove_liquidity`,
      type_arguments: [inputToken.address, outputToken.address],
      arguments: [
        (Number(inputAmount) * 10 ** inputToken.decimals).toFixed(0),
        0,
        0,
      ], // 1 is in Octas
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");
      console.log(response?.hash);
      setOutputAmount1("0");
      setOutputAmount2("0");
      setInputAmount("0");

      setTokenPairMetadata(undefined);

      if (inputToken.address == "" || outputToken.address == "") return;

      let url = "";
      let lp_url = "";

      if (inputToken.address < outputToken.address) {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${inputToken.address},${outputToken.address}>`;
        lp_url = `${SWAP_ADDRESS}::swap::LPToken<${inputToken.address},${outputToken.address}>`;
      } else {
        url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${outputToken.address},${inputToken.address}>`;
        lp_url = `${SWAP_ADDRESS}::swap::LPToken<${outputToken.address},${inputToken.address}>`;
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

      fetch(
        `${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/0x1::coin::CoinInfo<${lp_url}>`
      )
        .then((res) => res.json())
        .then((res) => {
          let data = res.data;

          try {
            if (data.supply.vec[0].integer.vec[0].value) {
              setLPSupply(data.supply.vec[0].integer.vec[0].value);
            }
          } catch {}
        });
      // Determine balance of input token
      if (inputToken.address != "") {
        setInputBalance(0);

        fetch(
          `${MAINNET_NODE_URL}/accounts/${account?.address}/resource/0x1::coin::CoinStore<${inputToken.address}>`
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.data.coin.value) {
              setInputBalance(res.data.coin.value);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // Determine balance of output token
      if (outputToken.address != "") {
        setOutputBalance(0);

        fetch(
          `${MAINNET_NODE_URL}/accounts/${account?.address}/resource/0x1::coin::CoinStore<${outputToken.address}>`
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.data.coin.value) {
              setOutputBalance(res.data.coin.value);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

      fetch(
        `${MAINNET_NODE_URL}/accounts/${account?.address}/resource/0x1::coin::CoinStore<${lp_url}>`
      )
        .then((res) => res.json())
        .then((res) => {
          let data = res.data;

          console.log(data);

          try {
            if (data.coin.value) {
              setLPBalance(data.coin.value);
            }
          } catch {
            setLPBalance("0");
          }
        });
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const onWalletConnectFormClick = async () => {
    console.log({ inputAmount });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calculateOutputAmount = (conversionRate: number) => {
    return parseFloat(inputAmount) * conversionRate;
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

  const handleUseBalance = () => {
    console.log("trying");
  };

  // called when connected
  useEffect(() => {
    if (!connected) {
      setInputBalance(0);
      setOutputBalance(0);
    }

    if (connected && account) {
      // Determine balance of input token
      if (inputToken.address != "") {
        setInputBalance(0);

        fetch(
          `${MAINNET_NODE_URL}/accounts/${account.address}/resource/0x1::coin::CoinStore<${inputToken.address}>`
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.data.coin.value) {
              setInputBalance(res.data.coin.value);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // Determine balance of output token
      if (outputToken.address != "") {
        setOutputBalance(0);

        fetch(
          `${MAINNET_NODE_URL}/accounts/${account.address}/resource/0x1::coin::CoinStore<${outputToken.address}>`
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.data.coin.value) {
              setOutputBalance(res.data.coin.value);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (tokenPairMetadata) {
        let lp_url = "";

        if (inputToken.address < outputToken.address) {
          lp_url = `${SWAP_ADDRESS}::swap::LPToken<${inputToken.address},${outputToken.address}>`;
        } else {
          lp_url = `${SWAP_ADDRESS}::swap::LPToken<${outputToken.address},${inputToken.address}>`;
        }

        fetch(
          `${MAINNET_NODE_URL}/accounts/${account.address}/resource/0x1::coin::CoinStore<${lp_url}>`
        )
          .then((res) => res.json())
          .then((res) => {
            let data = res.data;

            console.log(data);

            try {
              if (data.coin.value) {
                setLPBalance(data.coin.value);
              }
            } catch {
              setLPBalance("0");
            }
          });
      }
    }
  }, [connected, inputToken, outputToken, account, tokenPairMetadata]);

  // Grab reserves when two tokens selected
  useEffect(() => {
    setTokenPairMetadata(undefined);

    if (inputToken.address == "" || outputToken.address == "") return;

    let url = "";
    let lp_url = "";

    if (inputToken.address < outputToken.address) {
      url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${inputToken.address},${outputToken.address}>`;
      lp_url = `${SWAP_ADDRESS}::swap::LPToken<${inputToken.address},${outputToken.address}>`;
    } else {
      url = `${SWAP_ADDRESS}::swap::TokenPairMetadata<${outputToken.address},${inputToken.address}>`;
      lp_url = `${SWAP_ADDRESS}::swap::LPToken<${outputToken.address},${inputToken.address}>`;
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

    fetch(
      `${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/0x1::coin::CoinInfo<${lp_url}>`
    )
      .then((res) => res.json())
      .then((res) => {
        let data = res.data;

        try {
          if (data.supply.vec[0].integer.vec[0].value) {
            setLPSupply(data.supply.vec[0].integer.vec[0].value);
          }
        } catch {}
      });
  }, [inputToken, outputToken]);

  // Estimate output amounts
  useEffect(() => {
    if (Number(inputAmount) > 0 && tokenPairMetadata) {
      const lp_ratio = (Number(inputAmount) * 10 ** 8) / Number(LPSupply);

      if (inputToken.address < outputToken.address) {
        setOutputAmount1(
          (lp_ratio * Number(tokenPairMetadata.balance_x)).toFixed(4).toString()
        );
        setOutputAmount2(
          (lp_ratio * Number(tokenPairMetadata.balance_y)).toFixed(4).toString()
        );
      } else {
        setOutputAmount2(
          (lp_ratio * Number(tokenPairMetadata.balance_x)).toFixed(4).toString()
        );
        setOutputAmount1(
          (lp_ratio * Number(tokenPairMetadata.balance_y)).toFixed(4).toString()
        );
      }
    }
  }, [inputAmount, tokenPairMetadata, inputToken, outputToken]);

  return (
    <div className="static">
      <Head>
        <title>BaptSwap | Redeem LP</title>
      </Head>
      <MouseParallaxContainer
        globalFactorX={0.1}
        globalFactorY={0.1}
        className="h-screen w-screen z-0"
      >
        <MouseParallaxChild factorX={0.5} factorY={0.7}>
          <div className="relative flex justify-center">
            <div className="absolute top-28 -left-4 w-28 h-28 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70  "></div>
            <div className="absolute top-28 -right-4 w-72 h-72 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70 "></div>
            <div className="absolute top-96 left-28 w-72 h-72 bg-bapt_green/30  rounded-full filter blur-3xl opacity-70 "></div>
          </div>
        </MouseParallaxChild>

        <main className="pb-20 md:py-40 md:mb-80 z-20  overflow-scroll">
          <div className="flex flex-col justify-center items-center py-10 px-3 md:p-10  h-full space-y-9">
            <StandardCard
              title="Redeem Liquidity"
              content={
                <div className="flex flex-col space-y-5" ref={parent}>
                  <div className="space-y-2">
                    <h2 className="text-off_white">Choose Liquidity Pair</h2>
                    <div className="flex flex-row items-center justify-between w-full space-x-3">
                      <div className="w-full flex justify-center">
                        <TokenDropdownSelector
                          onSelected={onSelectInputToken}
                          onClickBalance={handleUseBalance}
                          balance={inputBalance}
                          className="bg-darkgray hover:bg-darkgray/50"
                        />
                      </div>
                      <div className="flex text-xl font-bold">+</div>
                      <div className="w-full flex justify-center">
                        <TokenDropdownSelector
                          onSelected={onSelectOutputToken}
                          onClickBalance={handleUseBalance}
                          balance={outputBalance}
                          className="bg-darkgray hover:bg-darkgray/50"
                        />
                      </div>
                    </div>
                  </div>
                  {LPBalance && (
                    <div className="flex text-off_white text-left mt-2 px-2 space-x-2">
                      <p>LP Balance:</p>
                      <span className="pl-1">
                        {numberWithCommas(formatBalance(Number(LPBalance), 8))}
                      </span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h2 className="text-off_white">Redeem Amount</h2>
                    <StandardTextField
                      value={inputAmount}
                      placeholder="0.0"
                      onChange={(e) => {
                        setInputAmount(e.target.value);
                        revealSlippage();
                      }}
                    />
                  </div>
                  {/* TO DO: Add "..." if number is too big */}
                  <div className="space-y-2">
                    <h2 className="text-off_white">Output</h2>
                    <div className="flex flex-row bg-black border-[1px] border-solid border-white border-opacity-20  rounded-2xl p-5 space-x-2">
                      <div className="flex flex-col w-full space-y-2">
                        {inputToken.name ? (
                          <div>
                            <TokenWithIcon
                              address={inputToken.address}
                              name={inputToken.name}
                              iconSrc={inputToken.iconSrc}
                              symbol={inputToken.symbol}
                              decimals={inputToken.decimals}
                            />

                            <p className="text-off_white text-md">
                              {isNaN(Number(outputAmount1))
                                ? "0.0"
                                : formatBalance(
                                    Number(outputAmount1),
                                    inputToken.decimals
                                  ).toFixed(4)}
                            </p>
                          </div>
                        ) : (
                          <div>Please Select Token</div>
                        )}
                      </div>
                      <div className="flex flex-col w-full space-y-2">
                        {outputToken.name ? (
                          <div>
                            <TokenWithIcon
                              address={outputToken.address}
                              name={outputToken.name}
                              iconSrc={outputToken.iconSrc}
                              symbol={outputToken.symbol}
                              decimals={outputToken.decimals}
                            />

                            <p className="text-off_white text-md">
                              {isNaN(Number(outputAmount2))
                                ? "0.0"
                                : formatBalance(
                                    Number(outputAmount2),
                                    outputToken.decimals
                                  ).toFixed(4)}
                            </p>
                          </div>
                        ) : (
                          <div>Please Select Token</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* TO DO: on click badge button group */}
                  {/* SLIPPAGE */}
                  {/* {inputAmount.length > 0 &&
                    outputToken.name !== "" &&
                    inputToken.name !== "" && (
                      <div className="py-2 px-6 flex flex-col space-y-3 items-center w-full text-off_white/40 my-3 text-sm">
                        <div className="flex flex-row justify-between w-full">
                          <p className="text-left">Slippage %</p>
                          <BadgeButtonGroup />
                        </div>
                      </div>
                    )} */}
                </div>
              }
              contentAction={
                // if output token not selected show "Select Token"
                // if insufficient (input) token balance
                connected ? (
                  tokenPairMetadata ? (
                    <StandardFormButton
                      label="Redeem"
                      onClick={onSignAndSubmitTransaction}
                      className="w-full"
                    />
                  ) : (
                    <StandardFormButton
                      label="Pair Not created"
                      onClick={() => {}}
                      className="w-full"
                      alt="outline-gray"
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
            {/* <StandardCard
              title="Currency Reserves"
              content={
                <div className="flex flex-col space-y-2" ref={parent}></div>
              }
            /> */}
          </div>
        </main>
      </MouseParallaxContainer>
    </div>
  );
}
