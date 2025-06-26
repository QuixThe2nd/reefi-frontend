import { formatTime } from "../utilities";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { ApproveFunction } from "../actions/approve";
import type { Bond } from "../state/useBonds";
import type { BuyOnCurve } from "../actions/buyOnCurve";
import type { BuyOnOdos } from "../actions/buyOnOdos";
import type { CoreCoin } from "../state/useContracts";
import type { ReactElement } from "react";
import type { UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../state/useAllowances";
import type { useAmounts } from "../state/useAmounts";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { wagmiConfig } from "..";

interface Properties {
  readonly bonds: readonly Bond[];
  readonly balances: ReturnType<typeof useBalances>;
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly odosBuy: BuyOnOdos;
  readonly curveBuy: BuyOnCurve;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
}

export const GetBMGP = ({ bonds, balances, setSend, send, allowances, approve, mintWETH, odosBuy, curveAmounts, supplies, curveBuy, nativeSwap }: Properties): ReactElement => {
  // const { writeContract } = useWriteSaveContract("bMGP Minted");
  const withdrawTime = bonds.length === 6 ? formatTime(Number(bonds[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2) : formatTime(60 * 60 * 24 * 30 * 2);
  return <Page info={[<span key="stMGP redeem">stMGP can be redeemed for the underlying MGP through the withdrawal queue or swapped instantly at market rate via Curve.</span>, <span key="withdraw queue">The withdrawal queue is processed directly through Magpie, therefore native withdrawals take at minimum 60 days.</span>, <span key="withdraw slots">Only 6 withdrawals can be processed through Magpie at once. If all slots are used, withdrawals will be added to the queue once a new slot is made available making worst case withdrawal time 120 days.</span>]}>
    <SwapToken allowances={allowances} approve={approve} balances={balances} curveAmounts={curveAmounts} curveBuy={curveBuy} label="Issue bond" mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} send={send} setSend={setSend} supplies={supplies} tokenOut="bMGP" tokensIn={["stMGP"]} />
    <div className="mt-4 flex justify-between text-sm text-gray-400">
      <span>Native Withdraw Time</span>
      <span>{withdrawTime}</span>
    </div>
    {/* {userPendingWithdraws > 0n ? <>
      <h3 className="mt-4 text-base font-medium">Pending Withdraws</h3>
      <p>{formatEther(userPendingWithdraws, decimals.MGP)} MGP</p>
      {bonds[0] ? <p>Unlock available in: {formatTime(Number(bonds[0].endTime) - Date.now() / 1000)} to {formatTime(Number(bonds.at(-1)?.endTime) + 60 * 60 * 24 * 60 - Date.now() / 1000)}</p> : <p>N/A</p>}
    </> : ""} */}
    {/* {userWithdrawable > 0n ? <>
      <h3 className="mt-4 text-base font-medium">Available To Withdraw</h3>
      <p>{formatEther(userWithdrawable, decimals.MGP)} MGP</p>
      <button className="h-min w-full rounded-lg bg-green-600 py-2 transition-colors hover:bg-green-700" onClick={() => withdrawMGP(writeContract)} type="submit">Withdraw MGP</button>
    </> : ""} */}
  </Page>;
};
