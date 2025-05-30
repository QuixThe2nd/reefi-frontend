import { memo, type ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput';
import { formatTime, formatEther } from '../utils';
import { InfoCard } from '../components/InfoCard';
import { BuyOnCurve } from '../components/BuyOnCurve';
import { useGlobalContext } from '../contexts/GlobalContext';
import { decimals } from '../config/contracts';

export const RedeemPage = memo((): ReactElement => {
  const { actions, balances, amounts, allowances, exchangeRates, withdraws } = useGlobalContext()
  return <>
    <div className="rounded-lg mt-4">
      <AmountInput label="Get MGP" token={{ symbol: 'rMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={balances.RMGP[0]} value={amounts.send} onChange={amounts.setSend} />
      <div className="grid grid-cols-2 gap-2">
        <button type="submit" className="py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={actions.redeemRMGP}>Redeem via Queue ({exchangeRates.curve.rmgpMGP*formatEther(amounts.send)} MGP)</button>
        <BuyOnCurve sendAmount={amounts.send} curveAmount={amounts.rmgpMgpCurve} allowanceCurve={allowances.curve.RMGP[0]} rate={exchangeRates.curve.rmgpMGP} onApprove={actions.approve} buy={actions.buyMGP} tokenASymbol='rMGP' tokenBSymbol='MGP' />
      </div>
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
        <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700}" onClick={actions.withdrawMGP}>Withdraw MGP</button>
      </> : ''}
    </div>
    <InfoCard text={[
      "rMGP can be redeemed for the underlying MGP through the withdrawal queue for a 10% fee or swapped instantly at market rate via Curve.",
      "The withdrawal queue is processed directly through Magpie, therefore native withdrawals take at minimum 60 days.",
      "Only 6 withdrawals can be processed through Magpie at once. If all slots are used, withdrawals will be added to the queue once a new slot is made available making worst case withdrawal time 120 days.",
      "With the 10% withdrawal fee, rMGP depegs under 90% of the underlying value always recover as they can be arbitraged by people willing to wait for withdrawals to be processed.",
      "Half of the withdrawal fee (5% of withdrawal) is redistributed to yMGP holders as yield, with the other half sent to the Reefi treasury."
    ]} />
  </>
})
RedeemPage.displayName = 'RedeemPage'
