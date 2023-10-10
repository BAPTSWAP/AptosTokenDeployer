/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { ABI } from "./ABI";
import { createEntryPayload } from "@thalalabs/surf";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import StandardCard from "../../components/cards/StandardCard";
import StandardTextField from "@/components/inputs/textfields/StandardTextField";
import { Switch } from '@headlessui/react';
import { Warning } from "./alerts";
import {AptosClient, Types, TxnBuilderTypes, HexString, BCS } from "aptos";
import { useState } from "react";
import {
  MouseParallaxChild,
  MouseParallaxContainer,
} from "react-parallax-mouse";
import FullWidthCard from "@/components/cards/FullWidthCard";
import StandardFormButton from "@/components/inputs/buttons/StandardFormButton";


interface APIresponseParams {
    code: Number,
    status: string,
    data: any

}


// update this
const GENERATOR_ENDPOINT = "http://localhost:1337/api/generate"
const BAPT_FRAMEWORK_ADDRESS = "0xed86ad2e64f0fbf22233a33f6307995499d881a91ffd55ce0a553f8c82bed363"
const DEV_NODE = "https://fullnode.devnet.aptoslabs.com"

const SIMPLE_COMPILE_ENDPOINT = "http://localhost:1337/api/simplecompile"


// initial form data
const intialFormValues = {
    name: "",
    symbol: "",
    decimal: 8,
    supply: "",
    monitor_supply: true
}

// css helper
const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}


export default function CoinDeployer() {
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
    
    const aptosClient = new AptosClient(DEV_NODE, {
        WITH_CREDENTIALS: false,
    });

    // process flag hooks
    const [isTypePublishing, setIsTypePublishing] = useState<Boolean>(false);
    const [isDeploying, setIsDeploying] = useState<Boolean>(false);
    const [isgenerating, setIsGenerating] = useState<Boolean>(false);
    const [onlyDeploy, setOnlyDeploy] = useState<Boolean>(false);

    // data hooks
    const [coinType, setCoinType] = useState<string>("");
    const [formData, setFormData] = useState(intialFormValues);
    const [toggleFlag, setToggleFlag] = useState(true);

    // alert hooks
    const [checkMessage, setCheckMessage] = useState("");
    const [submitMessage, setsubmitMessage] = useState("");

    // form change handlers
    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        if (name == "symbol") {
            checkDirectInitializeAndRetPublishible(value);
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleToggleChange = () => {
        setToggleFlag(!toggleFlag);
        let name = "monitor_supply";
        let value = !toggleFlag;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    // initializes the coin by calling BAPT_FRAMEWORK::Deployer::generate_coin
    const initializeCoin = async () => {
        setIsDeploying(true);
        const payload: Types.TransactionPayload = {
            type: "entry_function_payload",
            function: `${BAPT_FRAMEWORK_ADDRESS}::Deployer::generate_coin`,
            type_arguments: [`${account?.address}::CoinCollection::${formData.symbol.toUpperCase()}`],
            arguments: [formData.name, formData.symbol, formData.decimal, formData.supply, formData.monitor_supply],
        };

        console.log(payload);

        const response = await signAndSubmitTransaction(payload);
        try {
            await aptosClient.waitForTransaction(response.hash);
            setsubmitMessage(`Txn sucessfully submitted on ${network?.name}, TxnHash: ${response.hash}`)
            console.log(response.hash, network?.name);
        } catch (error) {
            console.error(error);
        }
        setIsDeploying(false);
    }


    // checks if the coinType can direcly be initialized.
    const checkDirectInitializeAndRetPublishible = (coinType) => {
        return checkTypePublished(account?.address, coinType).then(res => {
            if (res) {
                return checkCoinInitialized(account?.address, coinType)
                    .then((res) => {
                        if (res) {
                            setOnlyDeploy(false); return false
                        }
                        else {setOnlyDeploy(true); return true }
                    })
            } else {
                setOnlyDeploy(false);
                return true;
            }
        })
    }

    // for checking if a coinType is published
    const checkTypePublished = (addr, coinType) => {
        return aptosClient.getAccountModule(addr, "CoinCollection")
                .then(dat => (dat.abi?.structs.map(s => s.name)))
                .then((coins) => {
                    if (coins?.includes(coinType.toUpperCase())) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(_ => false);
    }

    // For setting the message for checking based on the coin publish and initialize status
    const checkCoinType = (coinType) => {
        let msg  = "";
        setCheckMessage(msg);
        checkTypePublished(account?.address, coinType)
            .then((published) => {
                if (published) {
                    return checkCoinInitialized(account?.address, coinType)
                        .then((initStat) => {
                            if (initStat && published) setCheckMessage("Coin Type published and Initialized");
                            else if (published && !initStat) setCheckMessage("Coin Type is published but not initialized");
                        })
                } else {
                    setCheckMessage("Coin Type is avalible to publish and initialize");
                }

            })
            // .then(res => setCheckMessage(msg))
            .catch(err => console.log(err)
        );
    
    }
    
    // checks if the coin is initialize => returns bool
    const checkCoinInitialized = (addr, ctype) => {
        return aptosClient.view({
                arguments: [],
                function: "0x1::coin::is_coin_initialized",
                type_arguments: [`${addr}::CoinCollection::${ctype.toUpperCase()}`]
            })
            .then((res) => {
                // console.log("The init stat",res);
                return res[0];
            })
            .catch((err) => false);
    }

    const publishPackageV2 = async (client, data) => {

        let packageMetadata = new HexString(data.p.toString("hex")).toUint8Array();
        let modules = new HexString(data.m.toString("hex")).toUint8Array();


        const txn_payload = {
            type: "entry_function_payload",
            ...createEntryPayload(ABI, {
              function: "publish_package_txn",
              type_arguments: [],
              arguments: [Array.from(packageMetadata), [Array.from(modules)]],
            }).rawPayload,
          };


        console.log(txn_payload)

        try {
            const response = await signAndSubmitTransaction(txn_payload);
            await client.waitForTransaction(response.hash);
            setsubmitMessage(`Txn sucessfully submitted on ${network?.name}, TxnHash: ${response.hash}`)
            console.log(response.hash, network?.name);
        } catch (error) {
            console.error(error);
            setIsDeploying(false); setIsGenerating(false);
            throw new Error(`${error}`);
        }

    }


    const publishTypeV2 = async (e, client) => {
        e.preventDefault();
        setIsGenerating(true);
        setIsTypePublishing(false);
        setIsDeploying(false);

        let dep_stat = await checkDirectInitializeAndRetPublishible(formData.symbol);

        if (dep_stat == false) return;

        console.log("ONly dep flag", onlyDeploy, dep_stat);

        if (onlyDeploy){
            setIsDeploying(true);
            return initializeCoin()
                .then(_ => setIsGenerating(false))
                .then(_ => setOnlyDeploy(false))
                .catch(err => {console.log("err", err); setIsDeploying(false);setIsGenerating(false)})

        } else {
            setIsTypePublishing(true);
            let api_payload = {
                coinType: formData.symbol,
                addr: account?.address
            }
            return fetch(SIMPLE_COMPILE_ENDPOINT, {
                method: "post",
                mode: 'cors',//turn off this when production
                body: JSON.stringify(api_payload),
                headers: { "Content-Type": "application/json", "Accept": "application/json" }
            })
            .then((res) => {
                setIsTypePublishing(false);
                setIsDeploying(true);
                return res.json()
            })
            .then((resp: APIresponseParams) => {
                if (!resp) {
                    throw new Error("BAD API");
                }
                return resp
            })
            .then((resp: APIresponseParams) => publishPackageV2(client, resp.data))
            .then(ret => console.log("Type Published"))
            .then(_ => initializeCoin())
            .then(_ => {
                setIsDeploying(false);
                setIsGenerating(false);
            })
            .catch(err => {setIsTypePublishing(false); setIsDeploying(false); setIsGenerating(false); console.log(err)})
        }
        
    }

    const handleCheckCoinAction = (e) => {
        e.preventDefault();
        checkCoinType(coinType)
    }

    return (
    <>
        <Head>
            <title>BaptSwap | Coin Deployer</title>
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

            <main className="md:pt-40 md:mb-20 z-20  overflow-scroll">
                <div className="flex flex-col justify-center w-full max-w-full md:max-w-90 min-w-86 xl:w-30 xl:max-w-30 xl:min-w-30 items-center py-10 px-3 md:p-10 h-full space-y-24">
                    <div className="flex flex-col w-full 3xl:w-[50%] lg:flex-row md:space-y-5 lg:space-y-0 lg:space-x-5 ">
                        <div className="w-full 3xl:w-2/3">
                            {
                                submitMessage ? (
                                    <Warning message={submitMessage} />
                                ) : (<></>)
                            }
                            <br />
                            <FullWidthCard
                                title="Deploy Coin"
                                content={<div className="flex flex-col space-y-4"></div>}
                                contentAction={
                                    connected ? (
                                    <>
                                        <div className="flex flex-col items-right justify-between w-full p-4 md:px-0 rounded-xl">
                                            <div className="w-1/4 mx-4">
                                            <form onSubmit={(e) => {publishTypeV2(e, aptosClient)}}>
                                                <div className="flex flex-row w-full bg-darkgray p-4 px-5 pl-6 rounded-2xl hover:inner-border-[1px] inner-border-bapt_green/30">
                                                    <input
                                                        name="name"
                                                        type={formData.name}
                                                        placeholder={"Coin Name"}
                                                        className="bg-transparent mr-3 transition ease-in-out w-full h-auto outline-none text-white/60"
                                                        value={formData.name}
                                                        onChange={handleFormDataChange}
                                                        required={true}
                                                    />
                                                </div>
                                                <br />
                                                <div className="flex flex-row w-full bg-darkgray p-4 px-5 pl-6 rounded-2xl hover:inner-border-[1px] inner-border-bapt_green/30">
                                                    <input
                                                        name="symbol"
                                                        type={formData.symbol}
                                                        placeholder={"Coin Symbol"}
                                                        className="bg-transparent mr-3 transition ease-in-out w-full h-auto outline-none text-white/60"
                                                        value={formData.symbol}
                                                        onChange={handleFormDataChange}
                                                        required={true}
                                                    />
                                                </div>
                                                <br />
                                                <div className="flex flex-row w-full bg-darkgray p-4 px-5 pl-6 rounded-2xl hover:inner-border-[1px] inner-border-bapt_green/30">
                                                    <input
                                                        name="decimal"
                                                        type="number"
                                                        min="0"
                                                        max="255"
                                                        placeholder={"Decimals (<255)"}
                                                        className="bg-transparent mr-3 transition ease-in-out w-full h-auto outline-none text-white/60"
                                                        value={formData.decimal}
                                                        onChange={handleFormDataChange}
                                                        required={true}
                                                    />
                                                </div>
                                                <br />

                                                <div className="flex flex-row w-full bg-darkgray p-4 px-5 pl-6 rounded-2xl hover:inner-border-[1px] inner-border-bapt_green/30">
                                                    <input
                                                        name="supply"
                                                        type="string"
                                                        placeholder={"Total Supply"}
                                                        className="bg-transparent mr-3 transition ease-in-out w-full h-auto outline-none text-white/60"
                                                        value={formData.supply}
                                                        onChange={handleFormDataChange}
                                                        required={true}
                                                    />
                                                </div>
                                                <br />

                                                <div className="flex flex-row w-full bg-darkgray p-4 px-5 pl-6 rounded-2xl hover:inner-border-[1px] inner-border-bapt_green/30">
                                                <Switch.Group as="div" className="flex items-center justify-between">
                                                    <span className="flex flex-grow flex-col">
                                                        <Switch.Label as="span" className="text-sm font-medium leading-6 text-gray-900" passive>
                                                            Monitor Supply:
                                                        </Switch.Label>
                                                    </span>
                                                    <Switch
                                                        checked={toggleFlag}
                                                        onChange={handleToggleChange}
                                                        className={classNames(
                                                        toggleFlag ? 'bg-indigo-600' : 'bg-gray-200',
                                                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                                                        )}
                                                    >
                                                        <span
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            toggleFlag ? 'translate-x-5' : 'translate-x-0',
                                                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                        )}
                                                        />
                                                    </Switch>
                                                </Switch.Group>
                                                </div>
                                                <br />

                                                {
                                                    isgenerating ? (
                                                        <>

                                                        {
                                                            isTypePublishing ? (<>
                                                                <button
                                                                    className={`font-bold text-md btn rounded-full h-auto p-1 w-full hover:cursor-default border-1 border-gray text-gray bg-bapt_black/90 [ hover:bg-black/0 hover:border-bapt_subgreen hover:text-bapt_subgreen ]`}
                                                                    disabled>
                                                                    Publishing...
                                                                </button>
                                                            </>): (<></>)
                                                        }

                                                        {
                                                            isDeploying ? (<>
                                                                <button
                                                                    className={`font-bold text-md btn rounded-full h-auto p-1 w-full hover:cursor-default border-1 border-gray text-gray bg-bapt_black/90 [ hover:bg-black/0 hover:border-bapt_subgreen hover:text-bapt_subgreen ]`}
                                                                    disabled>
                                                                    Deploying...
                                                                </button>
                                                            </>): (<></>)
                                                        }
                                                        </>
                                                    ): (
                                                        <>
                                                            <StandardFormButton
                                                                label="Publish / Deploy"
                                                                onClick={() => {}}
                                                                className="w-full hover:cursor-default"
                                                                alt=""
                                                            />
                                                        </>
                                                    )
                                                }

                                            </form>

                                            </div>
                                        </div>
                                    </>
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
                        <div className="w-full lg:w-1/3 lg:pt-0 pt-5">
                            {
                                checkMessage ? (
                                    <Warning message={checkMessage} />
                                ) : (<></>)
                            }
                            <br />
                            <StandardCard
                                title="Check Coin"
                                content={
                                    <div className="flex flex-col space-y-4 sm:space-y-2">
                                        <div className="flex flex-col items-center w-full sm:space-y-0 space-y-2"></div>
                                    </div>
                                }
                                contentAction={
                                    connected ? (
                                    <>
                                        <form onSubmit={(e) => handleCheckCoinAction(e)}>
                                            <div className="flex flex-row w-full bg-darkgray p-4 px-5 pl-6 rounded-2xl hover:inner-border-[1px] inner-border-bapt_green/30">
                                                <input
                                                    name="coinType"
                                                    type="string"
                                                    placeholder={"Coin Type"}
                                                    className="bg-transparent mr-3 transition ease-in-out w-full h-auto outline-none text-white/60"
                                                    value={coinType}
                                                    onChange={(e) => {
                                                        setCoinType(e.target.value);
                                                    }}
                                                    required={true}
                                                />
                                            </div>
                                            <br />

                                        {/* <StandardTextField
                                            value={coinType}
                                            placeholder="CoinType"
                                            onChange={(e) => {
                                                setCoinType(e.target.value);
                                            }}
                                        /> */}
                                        <br></br>
                                        {/* onclick of this button check if the entered coin is initialized by the wallet owner */}
                                        <StandardFormButton
                                            label="Check"
                                            onClick={() => {}}
                                            className="w-full hover:cursor-default"
                                        />
                                        </form>
                                    </>
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
                    <p className="text-gray py-2 text-sm px-10">Built By</p>
                    <a
                    href="https://www.3trees.technology/"
                    target="_blank"
                    rel="noreferrer"
                    >
                        3T
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
    </>
  );
}
