/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import StandardCard from "../../components/cards/StandardCard";
import StandardTextField from "@/components/inputs/textfields/StandardTextField";
import { Switch } from '@headlessui/react';
import { Warning } from "./alerts";
import {AptosClient, Types} from "aptos";
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
const BAPT_FRAMEWORK_ADDRESS = "0x55cf2898ff4d43116a9afae911d6f69c9807bf575ee8180c26d7a2eae06336c5"
const DEV_NODE = "https://fullnode.devnet.aptoslabs.com"


// initial form data
const intialFormValues = {
    name: "",
    symbol: "",
    decimal: 8,
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
        if (name =="symbol") {
            checkDeploy(value);
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

    // calls API to publish the type
    const publishType = () => {
        setIsTypePublishing(true);
        let payload = {
            coinType: formData.symbol,
            addr: account?.address
        }
        return fetch(GENERATOR_ENDPOINT, {
            method: "post",
            mode: 'cors',//turn off this when production
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json", 'Accept': 'application/json' }
        })
        .then((res) => {setIsTypePublishing(false); return res.json()})
        .catch(err => {setIsTypePublishing(false); console.log(err)})

    }

    // initializes the coin by calling BAPT_FRAMEWORK::Deployer::generate_coin
    const initializeCoin = async () => {
        setIsDeploying(true);
        const payload: Types.TransactionPayload = {
            type: "entry_function_payload",
            function: `${BAPT_FRAMEWORK_ADDRESS}::Deployer::generate_coin`,
            type_arguments: [`${BAPT_FRAMEWORK_ADDRESS}::CoinBucket::${formData.symbol.toUpperCase()}`],
            arguments: [formData.name, formData.symbol, formData.decimal, formData.monitor_supply],
        };

        console.log(payload);

        const response = await signAndSubmitTransaction(payload);
        try {
            await aptosClient.waitForTransaction(response.hash);
            setsubmitMessage(`Txn sucessfully submitted on ${network?.name}, TxnHash: ${response.hash}`)
            // console.log(response.hash, network?.name);
        } catch (error) {
            console.error(error);
        }
        setIsDeploying(false);
    }

    // publishes and deploys the cointype
    const publishTypeAndDeployCoin = async (e) => {
        e.preventDefault();
        let dep_stat = await checkDeploy(formData.symbol);
        setIsGenerating(true);

        if (dep_stat == false) return;

        // console.log("ONLY FLAG", onlyDeploy);

        if (onlyDeploy){
            setIsDeploying(true);
            initializeCoin()
                .then(_ => setIsGenerating(false))
                .then(_ => setOnlyDeploy(false))
                .catch(err => {console.log("err", err); setIsDeploying(false);setIsGenerating(false)})

        } else {
            setIsTypePublishing(true);
            return publishType()
                    .then((res:  APIresponseParams) => {
                        if (res?.code != 200) {
                            console.log("BAD API", res);
                            throw new Error("BAD REQUEST");
                        } else {
                            console.log(res);
                        }
                    })
                    .then(_ => setIsTypePublishing(false))
                    .then(_ => initializeCoin())
                    .then(_ => setIsGenerating(false))
                    .catch(err => {console.log("err", err); setIsTypePublishing(false); setIsGenerating(false)})
        }
    }

    // checks if the coinType can direcly be initialized.
    const checkDeploy = (coinType) => {
        return checkPublish(coinType).then(res => {
            // console.log("OUBBED", res);
            if (res) {
                return checkCoinRegister(coinType)
                    .then((res) => {
                        // console.log("INTED", res);
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
    const checkPublish = (coinType) => {
        return aptosClient.getAccountModule(BAPT_FRAMEWORK_ADDRESS, "CoinBucket")
                .then(dat => (dat.abi?.structs.map(s => s.name)))
                .then((coins) => {
                    if (coins?.includes(coinType.toUpperCase())) {
                        return true;
                    } else {
                        return false;
                    }
                })
    }

    // For setting the message for checking based on the coin publish and initialize status
    const checkCoinType = (coinType) => {
        let msg  = "";
        setCheckMessage(msg);
        checkPublish(coinType)
            .then((published) => {
                if (published) {
                    return checkCoinRegister(coinType)
                        .then((initStat) => {
                            if (initStat && published) setCheckMessage("Coin Type published and Initialized");
                            else if (published && !initStat) setCheckMessage("Coin Type is published but not initialized");
                        })
                } else {
                    setCheckMessage("Coin Type is avalible to publish and initialize");
                }

            })
            // .then(res => setCheckMessage(msg))
            // .then(res => console.log("why", res))
            .catch(err => console.log(err)
        );
    
    }
    
    // checks if the coin is initialize => returns bool
    const checkCoinRegister = (ctype) => {
        return aptosClient.view({
                arguments: [],
                function: "0x1::coin::is_coin_initialized",
                type_arguments: [`${BAPT_FRAMEWORK_ADDRESS}::CoinBucket::${ctype.toUpperCase()}`]
            })
            .then((res) => {
                console.log("The init stat",res);
                return res[0];
            })
            .catch((err) => console.log(err));
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
                                            <form onSubmit={(e) => {publishTypeAndDeployCoin(e)}}>
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
                                        <StandardTextField
                                            value={coinType}
                                            placeholder="CoinType"
                                            onChange={(e) => {
                                                setCoinType(e.target.value);
                                            }}
                                        />
                                        <br></br>
                                        {/* onclick of this button check if the entered coin is initialized by the wallet owner */}
                                        <StandardFormButton
                                            label="Check"
                                            onClick={() => {checkCoinType(coinType)}}
                                            className="w-full hover:cursor-default"
                                        />
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
