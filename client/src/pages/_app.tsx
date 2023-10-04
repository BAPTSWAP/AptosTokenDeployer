import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Head from "next/head";

import { PetraWallet } from "petra-plugin-wallet-adapter";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { MSafeWalletAdapter } from "msafe-plugin-wallet-adapter";
import Header from "@/components/Header";
import { GoogleAnalytics } from "nextjs-google-analytics";
import MobileFooter from "@/components/MobileFooter";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  const wallets = [
    new PetraWallet(),
    new TrustWallet(),
    new PontemWallet(),
    new RiseWallet(),
    new MartianWallet(),
    new MSafeWalletAdapter(),
  ];

  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <Head>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/HEAD_Positive.png" />
      </Head>
      <div className="bg-[#121919] font-lato ">
        <GoogleAnalytics gaMeasurementId={"G-6XH0FW9T46"} />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </AptosWalletAdapterProvider>
  );
}
