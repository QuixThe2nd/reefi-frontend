import { decimals } from "../config/contracts";
import { formatEther, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

export const RedeemMGPPage = memo((): ReactElement => {
  const { actions, amounts, exchangeRates, withdraws } = useGlobalContext();
  return <Page info={["rMGP can be redeemed for the underlying MGP through the withdrawal queue for a 10% fee or swapped instantly at market rate via Curve.", "The withdrawal queue is processed directly through Magpie, therefore native withdrawals take at minimum 60 days.", "Only 6 withdrawals can be processed through Magpie at once. If all slots are used, withdrawals will be added to the queue once a new slot is made available making worst case withdrawal time 120 days.", "With the 10% withdrawal fee, rMGP depegs under 90% of the underlying value always recover as they can be arbitraged by people willing to wait for withdrawals to be processed.", "Half of the withdrawal fee (5% of withdrawal) is redistributed to yMGP holders as yield, with the other half sent to the Reefi treasury."]}>
    <SwapToken buy={actions.buyMGP} curveAmount={amounts.rmgpMgpCurve} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH"]} label="Redeem via Queue" nativeSwap={actions.redeemRMGP} originalTokenIn="rMGP" tokenOut="MGP" />
    <div className="mt-4 flex justify-between text-sm text-gray-400">
      <span>Native Redemption Rate</span>
      <span>{exchangeRates.curve.rmgpMGP} MGP to rMGP</span>
    </div>
    {withdraws.userPendingWithdraws > 0n ? <>
      <h3 className="mt-4 text-base font-medium">Pending Withdraws</h3>
      <p>{formatEther(withdraws.userPendingWithdraws, decimals.MGP)} MGP</p>
      {withdraws.unlockSchedule[0] ? <p> Unlock available in: {formatTime(Number(withdraws.unlockSchedule[0].endTime) - Date.now() / 1000)} to {formatTime(Number(withdraws.unlockSchedule.at(-1)?.endTime) + 60 * 60 * 24 * 60 - Date.now() / 1000)}</p> : <p>N/A</p>}
    </> : ""}
    {withdraws.userWithdrawable > 0n ? <>
      <h3 className="mt-4 text-base font-medium">Available To Withdraw</h3>
      <p>{formatEther(withdraws.userWithdrawable, decimals.MGP)} MGP</p>
      <button className="h-min w-full rounded-lg bg-green-600 py-2 transition-colors hover:bg-green-700" onClick={actions.withdrawMGP} type="submit">Withdraw MGP</button>
    </> : ""}
  </Page>;
});
RedeemMGPPage.displayName = "RedeemMGPPage";
