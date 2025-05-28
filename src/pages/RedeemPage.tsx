import { ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput';
import { formatTime, formatEther } from '../utils';
import { InfoCard } from '../components/InfoCard';
import { BuyOnCurve } from '../components/BuyOnCurve';
import { Coins } from '../config/contracts';

interface Props {
  readonly rmgpBalance: bigint,
  readonly sendAmount: bigint,
  readonly rmgpAllowanceCurve: bigint,
  readonly rmgpMGPRate: number,
  readonly rmgpMgpCurveAmount: bigint,
  readonly userWithdrawable: bigint,
  readonly onApprove: (_infinity: boolean, _curve: boolean) => Promise<void>
  readonly setSendAmount: (_value: bigint) => void
  readonly redeemRMGP: () => void
  readonly buyMGP: () => void
  readonly withdrawMGP: () => void
  readonly decimals: Readonly<Record<Coins, number>>
  readonly userPendingWithdraws: bigint
  readonly unlockSchedule: readonly {
    readonly startTime: bigint;
    readonly endTime: bigint;
    readonly amountInCoolDown: bigint;
  }[] | undefined
}

export const RedeemPage = ({ rmgpBalance, sendAmount, rmgpAllowanceCurve, rmgpMGPRate, rmgpMgpCurveAmount, userWithdrawable, onApprove, setSendAmount, redeemRMGP, buyMGP, withdrawMGP, decimals, userPendingWithdraws, unlockSchedule }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Redeem rMGP" token={{ symbol: 'rMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={rmgpBalance} value={sendAmount} onChange={setSendAmount} />
      <div className="grid grid-cols-2 gap-2">
        <button type="submit" className="py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={redeemRMGP}>Redeem via Queue ({rmgpMGPRate*formatEther(sendAmount)} MGP)</button>
        <BuyOnCurve sendAmount={sendAmount} curveAmount={rmgpMgpCurveAmount} allowanceCurve={rmgpAllowanceCurve} rate={rmgpMGPRate} onApprove={onApprove} buy={buyMGP} tokenASymbol='rMGP' tokenBSymbol='MGP' />
      </div>
      <div className="mt-4 text-sm text-gray-400 flex justify-between">
        <span>Native Redemption Rate</span>
        <span>{rmgpMGPRate} MGP to rMGP</span>
      </div>
      {userPendingWithdraws > 0n ? <>
        <h3 className="text-md font-medium mt-4">Pending Withdraws</h3>
        <p>{formatEther(userPendingWithdraws, decimals.MGP)} MGP</p>
        {unlockSchedule?.[0] ? <p>Unlock available in: {formatTime(Number(unlockSchedule[0].endTime)-(Date.now()/1000))} to {formatTime(Number(unlockSchedule.at(-1)?.endTime)+60*60*24*60 - (Date.now()/1000))}</p> : <p>N/A</p>}
      </> : ''}
      {userWithdrawable > 0n ? <>
        <h3 className="text-md font-medium mt-4">Available To Withdraw</h3>
        <p>{formatEther(userWithdrawable, decimals.MGP)} MGP</p>
        <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700}" onClick={withdrawMGP}>Withdraw MGP</button>
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
}
