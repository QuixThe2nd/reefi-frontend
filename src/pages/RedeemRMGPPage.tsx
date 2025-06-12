import { decimals, type Chains, type CoreCoin, type PrimaryCoin, type TransferrableCoin } from "../config/contracts";
import { formatEther, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";
import { useWriteContract, type UseSendTransactionReturnType, type UseWriteContractReturnType } from "wagmi";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { useAllowances } from "../state/useAllowances";
import type { useAmounts } from "../state/useAmounts";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { useWithdraws } from "../state/useWithdraws";
import type { wagmiConfig } from "..";

interface Properties {
  readonly withdrawMGP: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly unlockSchedule: ReturnType<typeof useWithdraws>["reefi"]["unlockSchedule"];
  readonly userPendingWithdraws: ReturnType<typeof useWithdraws>["user"]["pending"];
  readonly userWithdrawable: ReturnType<typeof useWithdraws>["user"]["ready"];
  readonly balances: ReturnType<typeof useBalances>;
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly chain: Chains;
  readonly approve: (_coin: TransferrableCoin, _spender: "wstMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _infinity: boolean, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`, _sendTransaction: UseSendTransactionReturnType<typeof wagmiConfig>["sendTransaction"]) => void;
  readonly curveBuy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
}

export const RedeemRMGPPage = memo(({ withdrawMGP, unlockSchedule, userPendingWithdraws, userWithdrawable, balances, setSend, send, allowances, chain, approve, mintWETH, swap, curveAmounts, supplies, curveBuy, nativeSwap }: Properties): ReactElement => {
  const { writeContract } = useWriteContract();
  return <Page info={[<span key="wst redeem">wstMGP can be redeemed for the underlying MGP through the withdrawal queue or swapped instantly at market rate via Curve.</span>, <span key="withdraw queue">The withdrawal queue is processed directly through Magpie, therefore native withdrawals take at minimum 60 days.</span>, <span key="withdraw slots">Only 6 withdrawals can be processed through Magpie at once. If all slots are used, withdrawals will be added to the queue once a new slot is made available making worst case withdrawal time 120 days.</span>]}>
    <SwapToken allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH", "ETH", "cMGP", "vMGP", "yMGP", "lyMGP", "lvMGP", "vlMGP", "stMGP"]} label="Redeem via Queue" mintWETH={mintWETH} nativeSwap={nativeSwap} originalTokenIn="wstMGP" send={send} setSend={setSend} supplies={supplies} swap={swap} tokenOut="MGP" />
    <div className="mt-4 flex justify-between text-sm text-gray-400">
      <span>Native Withdraw Time</span>
      <span>{unlockSchedule.length === 6 ? formatTime(Number(unlockSchedule[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2) : formatTime(60 * 60 * 24 * 30 * 2)}</span>
    </div>
    {userPendingWithdraws > 0n ? <>
      <h3 className="mt-4 text-base font-medium">Pending Withdraws</h3>
      <p>{formatEther(userPendingWithdraws, decimals.MGP)} MGP</p>
      {unlockSchedule[0] ? <p>Unlock available in: {formatTime(Number(unlockSchedule[0].endTime) - Date.now() / 1000)} to {formatTime(Number(unlockSchedule.at(-1)?.endTime) + 60 * 60 * 24 * 60 - Date.now() / 1000)}</p> : <p>N/A</p>}
    </> : ""}
    {userWithdrawable > 0n ? <>
      <h3 className="mt-4 text-base font-medium">Available To Withdraw</h3>
      <p>{formatEther(userWithdrawable, decimals.MGP)} MGP</p>
      <button className="h-min w-full rounded-lg bg-green-600 py-2 transition-colors hover:bg-green-700" onClick={() => withdrawMGP(writeContract)} type="submit">Withdraw MGP</button>
    </> : ""}
  </Page>;
});
RedeemRMGPPage.displayName = "RedeemMGPPage";
