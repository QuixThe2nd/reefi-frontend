import { memo, type ReactElement } from 'react'
import { formatTime, formatEther } from '../utils';
import { useGlobalContext } from '../contexts/GlobalContext';
import { decimals } from '../config/contracts';
import { Page } from '../components/Page';
import { SwapToken } from '../components/SwapToken';

export const RedeemPage = memo((): ReactElement => {
  const { actions, amounts, exchangeRates, withdraws } = useGlobalContext()
  return <Page info={[
    "rMGP can be redeemed for the underlying MGP through the withdrawal queue for a 10% fee or swapped instantly at market rate via Curve.",
    "The withdrawal queue is processed directly through Magpie, therefore native withdrawals take at minimum 60 days.",
    "Only 6 withdrawals can be processed through Magpie at once. If all slots are used, withdrawals will be added to the queue once a new slot is made available making worst case withdrawal time 120 days.",
    "With the 10% withdrawal fee, rMGP depegs under 90% of the underlying value always recover as they can be arbitraged by people willing to wait for withdrawals to be processed.",
    "Half of the withdrawal fee (5% of withdrawal) is redistributed to yMGP holders as yield, with the other half sent to the Reefi treasury."
  ]}>
    <SwapToken originalTokenIn="RMGP" tokenOut="MGP" nativeRate={0.9*exchangeRates.mintRMGP} curveAmount={amounts.rmgpMgpCurve} buy={actions.buyMGP} nativeSwap={actions.redeemRMGP} label="Redeem via Queue" />
    <div className="mt-4 text-sm text-gray-400 flex justify-between">
      <span>Native Redemption Rate</span>
      <span>{exchangeRates.curve.rmgpMGP} MGP to rMGP</span>
    </div>
    {withdraws.userPendingWithdraws > 0n ? <>
      <h3 className="text-md font-medium mt-4">Pending Withdraws</h3>
      <p>{formatEther(withdraws.userPendingWithdraws, decimals.MGP)} MGP</p>
      {withdraws.unlockSchedule[0] ? <p>Unlock available in: {formatTime(Number(withdraws.unlockSchedule[0].endTime)-(Date.now()/1000))} to {formatTime(Number(withdraws.unlockSchedule.at(-1)?.endTime)+60*60*24*60 - (Date.now()/1000))}</p> : <p>N/A</p>}
    </> : ''}
    {withdraws.userWithdrawable > 0n ? <>
      <h3 className="text-md font-medium mt-4">Available To Withdraw</h3>
      <p>{formatEther(withdraws.userWithdrawable, decimals.MGP)} MGP</p>
      <button type="submit" className="w-full py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min}" onClick={actions.withdrawMGP}>Withdraw MGP</button>
    </> : ''}
  </Page>
})
RedeemPage.displayName = 'RedeemPage'
