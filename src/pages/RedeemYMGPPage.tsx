import { formatEther, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";
import { useAllowances } from "../state/useAllowances";
import { useBalances } from "../state/useBalances";
import { usePrices } from "../state/usePrices";
import { useWithdraws } from "../state/useWithdraws";

import { Chains, decimals, TradeableCoinExtended } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

interface Properties {
  buyRMGP: () => void;
  redeemYMGP: () => void;
  withdrawMGP: () => void;
  unlockSchedule: ReturnType<typeof useWithdraws>[0]["reefi"]["unlockSchedule"];
  userPendingWithdraws: ReturnType<typeof useWithdraws>[0]["user"]["pending"];
  userWithdrawable: ReturnType<typeof useWithdraws>[0]["user"]["ready"];
  balances: ReturnType<typeof useBalances>[0];
  setSend: (_send: bigint) => void;
  send: bigint;
  prices: ReturnType<typeof usePrices>[0];
  ymgpMgpCurveRate: number;
  mgpRmgpCurveRate: number;
  mgpRmgpCurveAmount: bigint;
  rmgpYmgpCurveAmount: bigint;
  rmgpMgpCurveAmount: bigint;
  mgpYmgpCurveAmount: bigint;
  ymgpRmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  ymgpVmgpCurveAmount: bigint;
  allowances: ReturnType<typeof useAllowances>[0];
  chain: Chains;
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: TradeableCoinExtended, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
}

export const RedeemYMGPPage = memo(({ buyRMGP, redeemYMGP, withdrawMGP, unlockSchedule, userPendingWithdraws, userWithdrawable, balances, setSend, send, prices, ymgpMgpCurveRate, mgpRmgpCurveRate, mgpRmgpCurveAmount, ymgpVmgpCurveAmount, rmgpYmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, chain, approve, convertMGP, sellYMGP, mintWETH, swap, lockedReefiMGP, rmgpSupply }: Properties): ReactElement => <Page info={["yMGP can be redeemed for 75% of it's underlying rMGP instantly or swapped at market rate via Curve.", "The 25% withdraw fee is distributed to yMGP lockers."]}>
  <SwapToken buy={buyRMGP} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH"]} label="Redeem" nativeSwap={redeemYMGP} originalTokenIn="yMGP" tokenOut="rMGP" balances={balances} setSend={setSend} send={send} prices={prices} ymgpMgpCurveRate={ymgpMgpCurveRate} mgpRmgpCurveRate={mgpRmgpCurveRate} mgpRmgpCurveAmount={mgpRmgpCurveAmount} rmgpYmgpCurveAmount={rmgpYmgpCurveAmount} rmgpMgpCurveAmount={rmgpMgpCurveAmount} mgpYmgpCurveAmount={mgpYmgpCurveAmount} ymgpRmgpCurveAmount={ymgpRmgpCurveAmount} ymgpMgpCurveAmount={ymgpMgpCurveAmount} allowances={allowances} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={lockedReefiMGP} rmgpSupply={rmgpSupply} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} />
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
RedeemYMGPPage.displayName = "RedeemYMGPPage";
