import { formatEther, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";

import { Chains, Coins, decimals } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";
import { UseAllowances } from "../hooks/useAllowances";
import { UseBalances } from "../hooks/useBalances";
import { UsePrices } from "../hooks/usePrices";
import { UseWithdraws } from "../hooks/useWithdraws";

interface Properties {
  buyMGP: () => void;
  redeemRMGP: () => void;
  withdrawMGP: () => void;
  unlockSchedule: UseWithdraws["withdraws"]["unlockSchedule"];
  userPendingWithdraws: UseWithdraws["withdraws"]["userPending"];
  userWithdrawable: UseWithdraws["withdraws"]["userWithdrawable"];
  balances: UseBalances["balances"];
  setSend: (_send: bigint) => void;
  send: bigint;
  prices: UsePrices;
  ymgpMgpCurveRate: number;
  mgpRmgpCurveRate: number;
  mgpRmgpCurveAmount: bigint;
  rmgpYmgpCurveAmount: bigint;
  rmgpMgpCurveAmount: bigint;
  mgpYmgpCurveAmount: bigint;
  ymgpRmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  ymgpVmgpCurveAmount: bigint;
  allowances: UseAllowances["allowances"];
  sendAmount: bigint;
  chain: Chains;
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: Coins, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
}

export const RedeemRMGPPage = memo(({ buyMGP, redeemRMGP, withdrawMGP, unlockSchedule, userPendingWithdraws, ymgpVmgpCurveAmount, userWithdrawable, balances, setSend, send, prices, ymgpMgpCurveRate, mgpRmgpCurveRate, mgpRmgpCurveAmount, rmgpYmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, sendAmount, chain, approve, convertMGP, sellYMGP, mintWETH, swap, lockedReefiMGP, rmgpSupply }: Properties): ReactElement => <Page info={["rMGP can be redeemed for the underlying MGP through the withdrawal queue or swapped instantly at market rate via Curve.", "The withdrawal queue is processed directly through Magpie, therefore native withdrawals take at minimum 60 days.", "Only 6 withdrawals can be processed through Magpie at once. If all slots are used, withdrawals will be added to the queue once a new slot is made available making worst case withdrawal time 120 days."]}>
  <SwapToken buy={buyMGP} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH"]} label="Redeem via Queue" nativeSwap={redeemRMGP} originalTokenIn="rMGP" tokenOut="MGP" balances={balances} setSend={setSend} send={send} prices={prices} ymgpMgpCurveRate={ymgpMgpCurveRate} mgpRmgpCurveRate={mgpRmgpCurveRate} mgpRmgpCurveAmount={mgpRmgpCurveAmount} rmgpYmgpCurveAmount={rmgpYmgpCurveAmount} rmgpMgpCurveAmount={rmgpMgpCurveAmount} mgpYmgpCurveAmount={mgpYmgpCurveAmount} ymgpRmgpCurveAmount={ymgpRmgpCurveAmount} ymgpMgpCurveAmount={ymgpMgpCurveAmount} allowances={allowances} sendAmount={sendAmount} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={lockedReefiMGP} rmgpSupply={rmgpSupply} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} />
  <div className="mt-4 flex justify-between text-sm text-gray-400">
    <span>Native Withdraw Time</span>
    <span>{unlockSchedule.length === 6 ? formatTime(Number(unlockSchedule[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2) : formatTime(60 * 60 * 24 * 30 * 2)}</span>
  </div>
  {userPendingWithdraws > 0n ? <>
    <h3 className="mt-4 text-base font-medium">Pending Withdraws</h3>
    <p>{formatEther(userPendingWithdraws, decimals.MGP)} MGP</p>
    {unlockSchedule[0] ? <p> Unlock available in: {formatTime(Number(unlockSchedule[0].endTime) - Date.now() / 1000)} to {formatTime(Number(unlockSchedule.at(-1)?.endTime) + 60 * 60 * 24 * 60 - Date.now() / 1000)}</p> : <p>N/A</p>}
  </> : ""}
  {userWithdrawable > 0n ? <>
    <h3 className="mt-4 text-base font-medium">Available To Withdraw</h3>
    <p>{formatEther(userWithdrawable, decimals.MGP)} MGP</p>
    <button className="h-min w-full rounded-lg bg-green-600 py-2 transition-colors hover:bg-green-700" onClick={withdrawMGP} type="submit">Withdraw MGP</button>
  </> : ""}
</Page>);
RedeemRMGPPage.displayName = "RedeemMGPPage";
