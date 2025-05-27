import { JSX, ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput';
import { TokenApproval } from '../components/TokenApproval';
import { formatTime, formatEther } from '../utils';
import { Coins } from '../App';

interface Props {
  rmgpBalance: bigint | undefined,
  sendAmount: bigint,
  rmgpAllowanceCurve: bigint | undefined,
  mgpRMGPRate: number,
  rmgpMgpCurveAmount: bigint | undefined,
  userWithdrawable: bigint | undefined,
  onApprove: (infinity: boolean, curve: boolean) => Promise<void>
  setSendAmount: (value: bigint) => void
  redeemRMGP: () => void
  buyMGP: () => void
  withdrawMGP: () => void
  decimals: Record<Coins, number>
  userPendingWithdraws: bigint | undefined
  unsubmittedWithdraws: bigint | undefined
  unlockSchedule: readonly {
    startTime: bigint;
    endTime: bigint;
    amountInCoolDown: bigint;
  }[] | undefined
}

export const RedeemPage = ({ rmgpBalance, sendAmount, rmgpAllowanceCurve, mgpRMGPRate, rmgpMgpCurveAmount, userWithdrawable, onApprove, setSendAmount, redeemRMGP, buyMGP, withdrawMGP, decimals, userPendingWithdraws, unsubmittedWithdraws, unlockSchedule }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Redeem rMGP" token={{ symbol: 'rMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={rmgpBalance} value={sendAmount} onChange={setSendAmount} />
      <div className="grid grid-cols-2 gap-2">
        <button type="submit" className="py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={redeemRMGP}>Redeem via Queue ({mgpRMGPRate*formatEther(sendAmount)*0.9} MGP)</button>
        <div>
          <TokenApproval sendAmount={sendAmount} allowance={rmgpAllowanceCurve} onApprove={onApprove} tokenSymbol='rMGP' curve={true} />
          <div className="relative">
            <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={buyMGP}>Redeem Instantly on Curve ({formatEther(rmgpMgpCurveAmount ?? 0n)} MGP)</button>
            {rmgpMgpCurveAmount !== undefined && ((): JSX.Element | null => {
              const directRate = mgpRMGPRate*formatEther(sendAmount)*0.9
              const curveRate = formatEther(rmgpMgpCurveAmount);
              const premiumDiscount = ((curveRate - directRate) / directRate) * 100;
              const isPremium = premiumDiscount > 0;
              return Math.abs(premiumDiscount) >= 0.01 ? <span className={`absolute -top-2 right-0 text-xs px-2 py-1 rounded ${isPremium ? 'bg-green-800/80 text-green-200' : 'bg-red-800/80 text-red-200'}`}>{isPremium ? '+' : ''}{premiumDiscount.toFixed(2)}%</span> : null;
            })()}
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-400 flex justify-between">
        <span>Native Redemption Rate</span>
        <span>{mgpRMGPRate*0.9} MGP to rMGP</span>
      </div>
      {userPendingWithdraws === undefined ? <p>Loading...</p> : userPendingWithdraws > 0n ? <>
        <h3 className="text-md font-medium mt-4">Pending Withdraws</h3>
        <p>{formatEther(userPendingWithdraws, decimals.MGP)} MGP</p>
        {unlockSchedule?.[0] ? <p>Unlock available in: {formatTime(Number(unlockSchedule[0].endTime)-(+new Date()/1000))} to {formatTime((unsubmittedWithdraws !== undefined ? Number(unlockSchedule[unlockSchedule.length-1]?.endTime) + 60*60*24*60 : Number(unlockSchedule[unlockSchedule.length-1]?.endTime))-(+new Date()/1000))}</p> : <p>N/A</p>}
      </> : ''}
      {userWithdrawable === undefined ? <p>Loading...</p> : userWithdrawable > 0n ? <>
        <h3 className="text-md font-medium mt-4">Available To Withdraw</h3>
        <p>{formatEther(userWithdrawable, decimals.MGP)} MGP</p>
        <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700}" onClick={withdrawMGP}>Withdraw MGP</button>
      </> : ''}
    </div>
    <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
      <div className="flex items-start">
        <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <div>
          <span className="font-medium text-indigo-300">About</span>
          <p className="text-gray-300 mt-1">rMGP can be redeemed for the underlying MGP through the withdrawal queue for a 10% fee or swapped instantly at market rate via Curve.</p>
          <p className="text-gray-300 mt-1">The withdrawal queue is processed directly through Magpie, therefore native withdrawals take at minimum 60 days.</p>
          <p className="text-gray-300 mt-1">Only 6 withdrawals can be processed through Magpie at once. If all slots are used, withdrawals will be added to the queue once a new slot is made available making worst case withdrawal time 120 days.</p>
          <p className="text-gray-300 mt-1">With the 10% withdrawal fee, rMGP depegs under 90% of the underlying value always recover as they can be arbitraged by people willing to wait for withdrawals to be processed.</p>
          <p className="text-gray-300 mt-1">Half of the withdrawal fee (5% of withdrawal) is redistributed to yMGP holders as yield, with the other half sent to the Reefi treasury.</p>
        </div>
      </div>
    </div>
  </>
}
