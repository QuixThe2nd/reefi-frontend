import { formatEther, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";
import { useAllowances } from "../state/useAllowances";
import { useAmounts } from "../state/useAmounts";
import { useBalances } from "../state/useBalances";
import { useSupplies } from "../state/useSupplies";
import { useWithdraws } from "../state/useWithdraws";

import { Chains, decimals, AllCoin, CoreCoin, PrimaryCoin } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

interface Properties {
  withdrawMGP: () => void;
  unlockSchedule: ReturnType<typeof useWithdraws>[0]["reefi"]["unlockSchedule"];
  userPendingWithdraws: ReturnType<typeof useWithdraws>[0]["user"]["pending"];
  userWithdrawable: ReturnType<typeof useWithdraws>[0]["user"]["ready"];
  balances: ReturnType<typeof useBalances>[0];
  setSend: (_send: bigint) => void;
  send: bigint;
  allowances: ReturnType<typeof useAllowances>[0];
  chain: Chains;
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: AllCoin, _infinity: boolean) => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  curveBuy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin) => void;
  nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin) => void;
  curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  supplies: ReturnType<typeof useSupplies>[0];
}

export const RedeemYMGPPage = memo(({ withdrawMGP, unlockSchedule, userPendingWithdraws, userWithdrawable, balances, setSend, send, allowances, chain, approve, mintWETH, swap, curveAmounts, supplies, curveBuy, nativeSwap }: Properties): ReactElement => <Page info={["yMGP can be redeemed for 75% of it's underlying rMGP instantly or swapped at market rate via Curve.", "The 25% withdraw fee is distributed to yMGP lockers."]}>
  <SwapToken excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH"]} label="Redeem" originalTokenIn="yMGP" tokenOut="rMGP" balances={balances} setSend={setSend} send={send} allowances={allowances} chain={chain} approve={approve} mintWETH={mintWETH} swap={swap} curveAmounts={curveAmounts} supplies={supplies} curveBuy={curveBuy} nativeSwap={nativeSwap} />
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
