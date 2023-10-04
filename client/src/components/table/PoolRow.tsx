/* eslint-disable @next/next/no-img-element */
import { MAINNET_NODE_URL, SWAP_ADDRESS } from "@/util/globals";
import { TokenType, TOKEN_LIST } from "@/util/tokenList";
import React, { useEffect, useState } from "react";
import { AptosClient, Types } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { RewardsPoolInfoType, RewardsPoolUserInfoType } from "@/pages/pools";
import { formatBalance, numberWithCommas } from "@/util/formatNumbers";
import StandardFormButton from "../inputs/buttons/StandardFormButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export type PoolRowType = {
  inputToken: TokenType;
  outputToken: TokenType;
};

const PoolRow: React.FC<PoolRowType> = ({ inputToken, outputToken }) => {
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

  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");

  const [inputBalance, setInputBalance] = useState<number>(0);
  const [outputBalance, setOutputBalance] = useState<number>(0);

  // autoanimate for show tax
  const [showDetails, setShowDetails] = useState(false);
  const revealDetails = () => setShowDetails(!showDetails);
  const [parent] = useAutoAnimate();

  const [rewardsPoolInfo, setRewardsPoolInfo] =
    useState<RewardsPoolUserInfoType>();
  const [poolInfo, setPoolInfo] = useState<RewardsPoolInfoType>();

  const [pendingX, setPendingX] = useState<number>(0);
  const [pendingY, setPendingY] = useState<number>(0);

  const aptosClient = new AptosClient(MAINNET_NODE_URL, {
    WITH_CREDENTIALS: false,
  });

  const onSignAndSubmitTransaction = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${SWAP_ADDRESS}::router::stake_tokens_in_pool`,
      type_arguments: [inputToken.address, outputToken.address],
      arguments: [Number(inputAmount) * 10 ** inputToken.decimals], // 1 is in Octas
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");
      console.log(response?.hash);

      // Update pool info
      updatePoolInfo();

      // Update user stake info
      updateUserStakeInfo();
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const onWithdrawStake = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${SWAP_ADDRESS}::router::withdraw_tokens_from_pool`,
      type_arguments: [inputToken.address, outputToken.address],
      arguments: [Number(outputAmount) * 10 ** inputToken.decimals], // 1 is in Octas
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");
      console.log(response?.hash);

      // Update pool info
      updatePoolInfo();

      // Update user stake info
      updateUserStakeInfo();
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const claimRewards = async () => {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${SWAP_ADDRESS}::router::claim_rewards_from_pool`,
      type_arguments: [inputToken.address, outputToken.address],
      arguments: [], // 1 is in Octas
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      // if you want to wait for transaction
      await aptosClient.waitForTransaction(response?.hash || "");
      console.log(response?.hash);

      // Update pool info
      updatePoolInfo();

      // Update user stake info
      updateUserStakeInfo();
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const updatePoolInfo = () => {
    fetch(
      `${MAINNET_NODE_URL}/accounts/${SWAP_ADDRESS}/resource/${SWAP_ADDRESS}::swap::TokenPairRewardsPool<${outputToken.address}, ${inputToken.address}>`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const data = res.data;

        const pool_info: RewardsPoolInfoType = {
          dds_x: data.magnified_dividends_per_share_x,
          dds_y: data.magnified_dividends_per_share_y,
          precision_factor: data.precision_factor,
          staked_tokens: data.staked_tokens,
        };

        setPoolInfo(pool_info);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateUserStakeInfo = () => {
    fetch(
      `${MAINNET_NODE_URL}/accounts/${account?.address}/resource/${SWAP_ADDRESS}::swap::RewardsPoolUserInfo<${outputToken.address}, ${inputToken.address}, ${inputToken.address}>`
    )
      .then((res) => res.json())
      .then((res) => {
        const data = res.data;

        const pool_data: RewardsPoolUserInfoType = {
          reward_debt_x: data.reward_debt_x,
          reward_debt_y: data.reward_debt_y,
          staked_tokens: data.staked_tokens.value,
          withdrawn_x: data.withdrawn_x,
          withdrawn_y: data.withdrawn_y,
        };

        setRewardsPoolInfo(pool_data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (connected && account) {
      updatePoolInfo();
      updateUserStakeInfo();
    }
  }, [connected, account]);

  useEffect(() => {
    if (connected && account) {
      // Determine balance of input token
      if (inputToken.address != "") {
        setInputBalance(0);

        // Determine balance of input token
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

        updatePoolInfo();
      }
    }
  }, [connected, inputToken, outputToken, account]);

  useEffect(() => {
    // Calculate pending rewards
    if (!poolInfo || !rewardsPoolInfo) return;

    const pending_x = (
      (Number(rewardsPoolInfo.staked_tokens) * Number(poolInfo.dds_x)) /
        Number(poolInfo.precision_factor) -
      Number(rewardsPoolInfo.reward_debt_x)
    ).toFixed(0);

    const pending_y = (
      (Number(rewardsPoolInfo.staked_tokens) * Number(poolInfo.dds_y)) /
        Number(poolInfo.precision_factor) -
      Number(rewardsPoolInfo.reward_debt_y)
    ).toFixed(0);

    console.log(pending_x);

    setPendingX(Number(pending_x));
    setPendingY(Number(pending_y));
  }, [poolInfo, rewardsPoolInfo]);

  return (
    <div>
      <div className="flex overflow-x-auto w-full rounded-2xl border-[1px] border-off_white/20">
        <table className="table table-zebra table-fixed w-full">
          <tbody>
            {/* row 1 */}
            <tr
              onClick={() => {
                revealDetails();
              }}
            >
              <td className="flex flex-row justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-14 h-14">
                      <img
                        src={inputToken.iconSrc}
                        alt={`${inputToken.name} Icon`}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Stake {inputToken.symbol}</div>
                    <div className="text-sm opacity-50">Stake to Earn</div>
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-xs px-5"
                  onClick={() => {
                    revealDetails();
                  }}
                >
                  {showDetails ? "hide" : "expand"}
                </button>
              </td>
            </tr>
            {showDetails && (
              <tr className="w-full">
                <td>
                  <div className="flex flex-col w-full space-y-3">
                    <div className="md:flex md:flex-row space-x-0 md:space-x-3 space-y-3 md:space-y-0">
                      <div className="flex flex-col space-y-2 md:w-full border-[1px] rounded-2xl border-off_white/20 p-3 md:px-5 md:p-4">
                        <div
                          className="border-[1px] badge badge-l p-3 px-5 font-bold
                           [ border-darkgray bg-black/20 text-off_white ] opacity-40"
                        >
                          Your Rewards
                        </div>
                        <div className="grid grid-cols-1 flex-row pb-2 md:space-y-3 space-y-0 overflow-x-auto">
                          <div className="flex space-x-3">
                            <p className="text-2xl ">
                              {numberWithCommas(
                                formatBalance(pendingX, outputToken.decimals)
                              )}
                            </p>
                            <p className="text-2xl">{outputToken.symbol}</p>
                          </div>
                          <div className="flex space-x-3">
                            <p className="text-2xl ">
                              {numberWithCommas(
                                formatBalance(pendingY, inputToken.decimals)
                              )}
                            </p>
                            <p className="text-2xl">{inputToken.symbol}</p>
                          </div>
                        </div>
                        {connected ? (
                          <StandardFormButton
                            label="Claim Rewards"
                            onClick={claimRewards}
                            className="bg-bapt_green text-black"
                          />
                        ) : (
                          <StandardFormButton
                            label="Connect Wallet"
                            onClick={() => {}}
                            className="w-full hover:cursor-default"
                            alt="outline-gray"
                          />
                        )}
                      </div>
                      <div className="flex flex-col space-y-2 md:w-full border-[1px] rounded-2xl border-off_white/20 p-3 md:px-5 md:p-4">
                        <div
                          className="border-[1px] badge badge-l p-3 px-5 font-bold 
                           [ border-darkgray bg-black/20 text-off_white ] opacity-40"
                        >
                          Manage Stake
                        </div>
                        <div className="flex flex-row space-x-2 ">
                          <p> Balance:</p>
                          <p className="">
                            {numberWithCommas(
                              formatBalance(inputBalance, inputToken.decimals)
                            )}
                          </p>
                          <p> {inputToken.symbol}</p>
                        </div>

                        <div className="flex flex-row w-full">
                          <div className="flex flex-row justify-between w-full bg-darkgray p-4 md:px-5 rounded-xl rounded-r-none [ hover:inner-border-[1px] inner-border-bapt_green/30 ]">
                            <input
                              type={"text"}
                              placeholder={`Ex. 1 ${inputToken.symbol}`}
                              className=" bg-transparent transition ease-in-out h-auto outline-none text-white/60"
                              value={inputAmount}
                              onChange={(e) => {
                                setInputAmount(e.target.value);
                              }}
                            />
                          </div>
                          {connected ? (
                            <button
                              className="w-32 font-bold transition ease-in-out rounded-l-none rounded-xl bg-bapt_green text-off_black  hover:bg-opacity-80 flex justify-center items-center p-2"
                              onClick={onSignAndSubmitTransaction}
                            >
                              Stake
                            </button>
                          ) : (
                            <button className="transition ease-in-out rounded-l-none rounded-xl bg-bapt_green text-off_black  hover:bg-opacity-80 flex justify-center items-center p-2">
                              <FontAwesomeIcon
                                className="mx-1 my-1.5"
                                icon={faWallet}
                                style={{
                                  width: "0.75em",
                                  height: "0.75em",
                                }}
                              />
                            </button>
                          )}
                        </div>
                        <div className="flex flex-row w-full">
                          <div className="flex flex-row justify-between w-full bg-darkgray p-4 md:px-5 rounded-xl rounded-r-none [ hover:inner-border-[1px] inner-border-bapt_green/30 ]">
                            <input
                              type={"text"}
                              placeholder={`Ex. 1 ${inputToken.symbol}`}
                              className="bg-transparent transition ease-in-out h-auto outline-none text-white/60"
                              value={outputAmount}
                              onChange={(e) => {
                                setOutputAmount(e.target.value);
                              }}
                            />
                          </div>
                          {connected ? (
                            <button
                              className="w-32 font-bold transition ease-in-out rounded-l-none rounded-xl bg-gray text-black hover:opacity-70 flex justify-center items-center p-2"
                              onClick={onWithdrawStake}
                            >
                              Withdraw
                            </button>
                          ) : (
                            <button className="transition ease-in-out rounded-l-none rounded-xl bg-bapt_green text-off_black  hover:bg-opacity-80 flex justify-center items-center p-2">
                              <FontAwesomeIcon
                                className="mx-1 my-1.5"
                                icon={faWallet}
                                style={{
                                  width: "0.75em",
                                  height: "0.75em",
                                }}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="w-fit md:w-full">
                        <div className="flex flex-col md:flex-row justify-between p-4">
                          <div className="text-left">Your stake:</div>
                          <div className="text-right flex flex-row space-x-2">
                            <p className="">
                              {rewardsPoolInfo
                                ? numberWithCommas(
                                    formatBalance(
                                      Number(rewardsPoolInfo.staked_tokens),
                                      inputToken.decimals
                                    )
                                  )
                                : formatBalance(0, 8)}
                            </p>
                            <p> {inputToken.symbol}</p>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row  justify-between p-4">
                          <div className="text-left">Total staked:</div>
                          <div className="text-right flex flex-row space-x-2">
                            <p className="">
                              {poolInfo
                                ? numberWithCommas(
                                    formatBalance(
                                      Number(poolInfo.staked_tokens),
                                      inputToken.decimals
                                    )
                                  )
                                : formatBalance(0, 8)}
                            </p>
                            <p> {inputToken.symbol}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoolRow;
