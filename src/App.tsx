// TODO: ERC4626 support

import { useState, ReactElement } from 'react'
import Diagram from '../public/diagram.svg'
import { type EIP1193EventMap, type EIP1193RequestFn, type EIP1474Methods } from 'viem'
import { decimals, publicClients, contracts } from './config/contracts';
import { TokenCards } from './components/TokenCards'
import { Header } from './components/Header'
import { YieldBadges } from './components/YieldBadges'
import { Navbar } from './components/Navbar'
import { ConversionRates } from './components/ConversionRates'
import { Contracts } from './components/Contracts'
import { PendingRewards } from './components/PendingRewards'
import { ConnectWallet } from './components/ConnectWallet'
import { ErrorCard } from './components/ErrorCard'
import { DepositPage } from './pages/DepositPage'
import { SupplyLiquidityPage } from './pages/SupplyLiquidityPage'
import { ConvertPage } from './pages/ConvertPage'
import { RedeemPage } from './pages/RedeemPage'
import { LockPage } from './pages/LockPage'
import { UnlockPage } from './pages/UnlockPage'
import { useAllowances } from './hooks/useAllowances'
import { useBalances } from './hooks/useBalances'
import { useWallet } from './hooks/useWallet'
import { useSupplies } from './hooks/useSupplies'
import { usePrices } from './hooks/usePrices'
import { useExchangeRates } from './hooks/useExchangeRates'
import { useYield } from './hooks/useYield'
import { useActions } from './hooks/useActions'
import { useWithdraws } from './hooks/useWithdraws'
import { useAmounts } from './hooks/useAmounts'
import { useLocked } from './hooks/useLocked'
import { useContracts } from './hooks/useContracts';
// import { Web3Provider } from '@ethersproject/providers';
// import snapshot from '@snapshot-labs/snapshot.js';

// const client = new snapshot.Client712('https://testnet.hub.snapshot.org');
// const web3 = new Web3Provider(window.ethereum);
// const receipt = await client.vote(web3, '0x3662f5FccDA09Ec5b71c9e2fdCf7D71CbEc622E0', {
//   space: 'parsay.eth',
//   proposal: '0xc216cb43644422545e344f1fa004e5f90816dfc07f9a9c60eadde2ca685a402f',
//   type: 'single-choice',
//   choice: 1,
//   reason: 'Choice 1 make lot of sense',
//   app: 'my-app'
// });
// console.log(receipt)

declare global {
  interface Window {
    ethereum?: {
      on: <event extends keyof EIP1193EventMap>(event: event, _listener: EIP1193EventMap[event]) => void;
      removeListener: <event extends keyof EIP1193EventMap>(event: event, _listener: EIP1193EventMap[event]) => void;
      request: EIP1193RequestFn<EIP1474Methods>;
    };
  }
}

export type Pages = 'deposit' | 'convert' | 'lock' | 'buyVotes' | 'supplyLiquidity' | 'unlock' | 'redeem'

const App = (): ReactElement => {
  const [page, setPage] = useState<Pages>('deposit')
  const [showDiagram, setShowDiagram] = useState(false)
  const [error, setError] = useState('')

  const { chain, account, ens, connectRequired, connectWallet, isConnecting, setConnectRequired, setChain, clients } = useWallet({ setError })
  const balances = useBalances({ account, chain })
  const allowances = useAllowances({ account, chain })
  const supplies = useSupplies({ chain })
  const prices = usePrices()
  const writeContracts = useContracts({ clients })
  const { sendAmount, setSendAmount, mgpRmgpCurveAmount, rmgpMgpCurveAmount, rmgpYmgpCurveAmount, mgpLPAmount, setMGPLPAmount, rmgpLPAmount, setRMGPLPAmount, ymgpLPAmount, setYMGPLPAmount } = useAmounts({ account, chain })
  const { uncompoundedMGPYield, estimatedCompoundGasFee, mgpAPR, cmgpAPY, cmgpPoolAPY, unclaimedUserYield, pendingRewards, updatePendingRewards, updateUnclaimedUserYield } = useYield({ account, chain, prices, balances })
  const { userWithdrawable, updateUserPendingWithdraws, updateUnsubmittedWithdraws, updateUserWithdrawable, updateUnlockSchedule, userPendingWithdraws, unlockSchedule } = useWithdraws({ account, chain })
  const locked = useLocked({ account, chain })
  const { approve, depositRMGP, buyYMGP, lockYMGP, unlockYMGP, depositMGP, buyRMGP, redeemRMGP, compoundRMGP, claimYMGPRewards, withdrawMGP, supplyLiquidity, buyMGP } = useActions({ page, sendAmount, setConnectRequired, setError, mgpLPAmount, rmgpLPAmount, ymgpLPAmount, updateUserPendingWithdraws, updateUnsubmittedWithdraws, updateUserWithdrawable, updateUnlockSchedule, updatePendingRewards, updateUnclaimedUserYield, updateTotalLockedMGP: locked.updateMGP, updateReefiLockedMGP: locked.updateReefiMGP, updateTotalLockedYMGP: locked.updateYMGP, updateUserLockedYMGP: locked.updateUserYMGP, updateYMGPHoldings: balances.updateYMGPHoldings, clients, account, chain, balances, supplies, allowances, writeContracts })
  const exchangeRates = useExchangeRates({ reefiLockedMGP: locked.reefiMGP, account, chain, supplies })

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <ConnectWallet connectRequired={connectRequired} connectWallet={() => { connectWallet() }} isConnecting={isConnecting} />
      <ErrorCard error={error} setError={setError} />
      <div className="flex-grow overflow-auto">
        <div className="p-4 md:p-6">
          <Header account={account} decimals={decimals} mgpBalance={balances.mgp} rmgpBalance={balances.rmgp} ymgpBalance={balances.ymgp} cmgpBalance={balances.cmgp} userLockedYMGP={locked.userYMGP} ens={ens} chain={chain} isConnecting={isConnecting} connectWallet={connectWallet} setChain={setChain} />
          <TokenCards prices={prices} decimals={decimals} mgpSupply={supplies.mgp} totalLockedMGP={locked.mgp} rmgpSupply={supplies.rmgp} reefiLockedMGP={locked.reefiMGP} ymgpSupply={supplies.ymgp} totalLockedYMGP={locked.ymgp} mgpRMGPRate={exchangeRates.curve.mgpRMGP} rmgpYMGPRate={exchangeRates.curve.rmgpYMGP} />
          <div className="flex flex-col justify-center mb-4 items-center">
            <button type="button" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors w-fit" onClick={() => setShowDiagram(!showDiagram)}>{showDiagram ? 'Hide Diagram' : 'Show Diagram'}</button>
            {showDiagram && <div className="flex justify-center mt-4"><img src={Diagram} alt="Diagram" className="h-120" /></div>}
          </div>
          <h2 className="text-2xl text-red-400 text-center">VERY EARLY BETA</h2>
          <p className="text-center mb-4">Reefi is in very early beta. Please deposit very small amounts that you are okay loosing as Reefi likely has unknown bugs. Curve/cMGP related features are only available on Arbitrum.</p>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
            <YieldBadges mgpAPR={mgpAPR} cmgpAPY={cmgpAPY} cmgpPoolAPY={cmgpPoolAPY} reefiLockedMGP={locked.reefiMGP} totalLockedYMGP={locked.ymgp} mgpCurveBalance={balances.mgpCurve} rmgpCurveBalance={balances.rmgpCurve} ymgpCurveBalance={balances.ymgpCurve} mintRMGPRate={exchangeRates.mintRMGP} />
            <Navbar page={page} setPage={setPage} />
            {page === 'deposit' && <DepositPage sendAmount={sendAmount} mgpAllowance={allowances.mgp} mgpBalance={balances.mgp} mgpAllowanceCurve={allowances.mgpCurve} mgpRmgpCurveAmount={mgpRmgpCurveAmount} mgpRMGPRate={exchangeRates.mintRMGP} mgpAPR={mgpAPR} onApprove={approve} setSendAmount={setSendAmount} depositMGP={depositMGP} buyRMGP={buyRMGP} />}
            {page === 'convert' && <ConvertPage sendAmount={sendAmount} rmgpBalance={balances.rmgp} rmgpAllowance={allowances.rmgp} rmgpAllowanceCurve={allowances.rmgpCurve} rmgpYmgpCurveAmount={rmgpYmgpCurveAmount} onApprove={approve} setSendAmount={setSendAmount} depositRMGP={depositRMGP} buyYMGP={buyYMGP} />}
            {/* {page === 'buyVotes' && <BuyVotesPage sendAmount={sendAmount} ymgpAllowance={allowances.ymgp} ymgpAllowanceCurve={allowances.ymgpCurve} ymgpBalance={balances.ymgp} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} onApprove={approve} setSendAmount={setSendAmount} />} */}
            {page === 'redeem' && <RedeemPage rmgpBalance={balances.rmgp} sendAmount={sendAmount} rmgpAllowanceCurve={allowances.rmgpCurve} rmgpMGPRate={1/exchangeRates.mintRMGP} rmgpMgpCurveAmount={rmgpMgpCurveAmount} userWithdrawable={userWithdrawable} onApprove={approve} setSendAmount={setSendAmount} redeemRMGP={redeemRMGP} buyMGP={buyMGP} withdrawMGP={withdrawMGP} decimals={decimals} userPendingWithdraws={userPendingWithdraws} unlockSchedule={unlockSchedule} />}
            {page === 'supplyLiquidity' && <SupplyLiquidityPage mgpBalance={balances.mgp} rmgpBalance={balances.rmgp} ymgpBalance={balances.ymgp} mgpCurveBalance={balances.mgpCurve} rmgpCurveBalance={balances.rmgpCurve} ymgpCurveBalance={balances.ymgpCurve} mgpLPAmount={mgpLPAmount} ymgpLPAmount={ymgpLPAmount} rmgpLPAmount={rmgpLPAmount} supplyLiquidity={supplyLiquidity} setMGPLPAmount={setMGPLPAmount} setRMGPLPAmount={setRMGPLPAmount} setYMGPLPAmount={setYMGPLPAmount} />}
            {page === 'lock' && <LockPage sendAmount={sendAmount} ymgpBalance={balances.ymgp} totalLockedYMGP={locked.ymgp} mgpAPR={mgpAPR} reefiLockedMGP={locked.reefiMGP} setSendAmount={setSendAmount} lockYMGP={lockYMGP} />}
            {page === 'unlock' && <UnlockPage ymgpBalance={balances.ymgp} sendAmount={sendAmount} setSendAmount={setSendAmount} unlockYMGP={unlockYMGP} />}
          </div>
          <PendingRewards uncompoundedMGPYield={uncompoundedMGPYield} prices={prices} estimatedCompoundGasFee={estimatedCompoundGasFee} ymgpHoldings={balances.ymgpHoldings} ymgpSupply={supplies.ymgp} totalLockedYMGP={locked.ymgp} unclaimedUserYield={unclaimedUserYield} decimals={decimals} mgpRMGPRate={exchangeRates.mintRMGP} reefiLockedMGP={locked.reefiMGP} mgpAPR={mgpAPR} pendingRewards={pendingRewards} compoundRMGP={compoundRMGP} claimYMGPRewards={claimYMGPRewards} />
          <ConversionRates mgpRMGP={exchangeRates.curve.mgpRMGP} rmgpMGP={exchangeRates.curve.rmgpMGP} rmgpYMGP={exchangeRates.curve.rmgpYMGP} ymgpRMGP={exchangeRates.curve.ymgpRMGP} mintRMGP={exchangeRates.mintRMGP} />
          <Contracts contracts={contracts} publicClients={publicClients} chain={chain} />
        </div>
      </div>
    </div>
  );
};
export default App;
