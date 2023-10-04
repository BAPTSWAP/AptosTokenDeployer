import StandardCard from "../../components/cards/StandardCard";
import Head from "next/head";
import StandardFormButton from "@/components/inputs/buttons/StandardFormButton";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, Types } from "aptos";
import { useEffect, useState } from "react";
import { MAINNET_NODE_URL, SWAP_ADDRESS } from "@/util/globals";
import { TOKEN_LIST } from "@/util/tokenList";
import {
  MouseParallaxChild,
  MouseParallaxContainer,
} from "react-parallax-mouse";

export const TESTNET_NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";

export default function Bridge() {
  const [inputType, setInputType] = useState<string>("BAPT");
  const [outputType, setOutputType] = useState<string>("BAPT");

  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");

  const [isBaptRegistered, setIsBaptRegistered] = useState<boolean>(false);

  const aptosClient = new AptosClient(MAINNET_NODE_URL, {
    WITH_CREDENTIALS: false,
  });

  const {
    account,
    network,
    connected,
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
      function: "0x1::managed_coin::register",
      type_arguments: [TOKEN_LIST[0].address],
      arguments: [], // 1 is in Octas
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");
      console.log(response?.hash);

      setIsBaptRegistered(true);
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const calculateOutputAmount = (conversionRate: number) => {
    return parseInt(inputAmount, 10) * conversionRate;
  };

  useEffect(() => {
    if (!account) return;

    fetch(
      `https://fullnode.testnet.aptoslabs.com/v1/accounts/${account?.address}/resources`
    )
      .then((res) => res.json())
      .then((res) => {
        setIsBaptRegistered(false);

        res.map((resource: any) => {
          if (
            resource.type == `0x1::coin::CoinStore<${TOKEN_LIST[0].address}>`
          ) {
            setIsBaptRegistered(true);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [account]);

  // is called whenever inputAmount is changed
  useEffect(() => {
    // testing with arbitrary conversion rate of 0.0005
    setOutputAmount(calculateOutputAmount(0.0005).toString());
  }, [inputAmount]);

  return (
    <>
      <Head>
        <title>BaptSwap | Bridge</title>
      </Head>
      <MouseParallaxContainer
        globalFactorX={0.1}
        globalFactorY={0.1}
        className="w-screen z-0"
      >
        <MouseParallaxChild factorX={0.5} factorY={0.7}>
          <div className="relative flex justify-center">
            <div className="absolute top-28 -left-4 w-28 h-28 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70  z-0 "></div>
            <div className="absolute top-28 -right-4 w-72 h-72 bg-blob_blue/30 rounded-full filter blur-3xl opacity-70 z-0 "></div>
            <div className="absolute top-96 left-28 w-72 h-72 bg-bapt_green/30  rounded-full filter blur-3xl opacity-70 z-0 "></div>
          </div>
        </MouseParallaxChild>

        <main className="md:py-40 z-20">
          <div className="flex flex-col justify-center items-center py-10 px-3 md:p-10  h-full space-y-24">
            <div
              className="flex flex-col card-shadow rounded-3xl justify-center items-center p-3 px-4 pb-6 backdrop-blur-md
                [ h-auto w-full max-w-[500px] min-w-[320px]]
                [ bg-bapt_black/80 bg-gradient-to-b from-black/30 to-black/60 ]
                [ border-[1px] border-solid border-white border-opacity-20 ]"
            >
              <div className="text-yellow-500 underline">
                PLEASE READ BEFORE BRIDGING
              </div>
              <p className="my-4 text-center">
                It is extremely important that you follow all steps correctly to
                receive your BAPT tokens on Aptos without any delays.
              </p>
              <p className="my-4 text-center">
                Bridging your BAPT tokens from BSC to Aptos involves two steps:
              </p>
              <p className="mt-4 mb-2">
                1. Register BAPT in your Aptos-compatible wallet.{" "}
                <span className="text-yellow-500">
                  (This is REQUIRED for you to receive your tokens)
                </span>
              </p>
              <p className="mt-2 mb-4">
                2. Deposit your BAPT (BSC) into the smart contract and enter
                your Aptos destination address.{" "}
              </p>
              <p className="text-center text-yellow-500 my-4">
                (The destination wallet MUST have registered BAPT in order to
                receive tokens)
              </p>
              <p className="my-4 text-center">
                NOTE: The airdropping of BAPT tokens on Aptos is fufilled
                manually by our team, so if you haven&apos;t received your
                tokens in a timely manner, please reach out to an official team
                member!
              </p>
            </div>
            <div className="text-2xl font-bold">
              STEP 1: REGISTER BAPT ON APTOS
            </div>
            <StandardCard
              title="Register BAPT"
              content={<div className="flex flex-col space-y-4"></div>}
              contentAction={
                connected ? (
                  <StandardFormButton
                    label="Register BAPT"
                    onClick={onSignAndSubmitTransaction}
                    className="w-full"
                  />
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
            <div className="text-2xl font-bold">STEP 2: BRIDGE BAPT ON BSC</div>
            <StandardCard
              title="Bridge BAPT"
              content={
                <div className="flex flex-col space-y-4 w-full">
                  <div className="text-center">
                    The link below leads to the BSC bridge hosted at our old
                    site.
                  </div>
                  <div className="text-center my-4 text-yellow-500">
                    {" "}
                    Make sure you&apos;ve registered BAPT on your Aptos wallet
                    before pasting the address in the dApp.
                  </div>
                  <div className="break-words">
                    Aptos Address:{" "}
                    <span className="text-bapt_green">{account?.address}</span>
                  </div>
                  {account ? (
                    <div
                      className="hover:cursor-pointer border-1 border-bapt_green text-center text-bapt_green bg-bapt_black/90 [ hover:bg-black/0 hover:border-bapt_subgreen hover:text-bapt_subgreen ]"
                      onClick={() => {
                        if (account)
                          navigator.clipboard.writeText(account?.address);
                      }}
                    >
                      Copy to Clipboard
                    </div>
                  ) : (
                    <div className="border-1 border-bapt_green text-center text-bapt_green bg-bapt_black/90 [ hover:bg-black/0 hover:border-bapt_subgreen hover:text-bapt_subgreen ]">
                      Connect Wallet
                    </div>
                  )}
                </div>
              }
              contentAction={
                <StandardFormButton
                  label="Visit BSC Bridge"
                  onClick={() => {
                    window.location.href = "https://baptlabs.com/bridge";
                  }}
                  className="w-full"
                />
              }
            />
          </div>
        </main>
      </MouseParallaxContainer>
    </>
  );
}
