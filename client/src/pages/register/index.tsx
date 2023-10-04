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
      type_arguments: [TOKEN_LIST[4].address],
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
            <div className="text-2xl font-bold">REGISTER NEBULA</div>
            <StandardCard
              title="Register NEBULA"
              content={<div className="flex flex-col space-y-4"></div>}
              contentAction={
                connected ? (
                  <StandardFormButton
                    label="Register NEBULA"
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
          </div>
        </main>
      </MouseParallaxContainer>
    </>
  );
}
