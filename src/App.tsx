// TODO: ERC4626 support
// TODO: Make rMGP and lockManager separate so the contract can be upgraded without requiring migration on users end
// TODO: Coin logo

import { useState, ReactElement } from 'react'
import { type EIP1193EventMap, type EIP1193RequestFn, type EIP1474Methods } from 'viem'
import { TokenCards } from './components/TokenCards'
import { Header } from './components/Header'
import { ConversionRates } from './components/ConversionRates'
import { Contracts } from './components/Contracts'
import { ConnectWallet } from './components/ConnectWallet'
import { ErrorCard } from './components/ErrorCard'
import { DepositPage } from './pages/DepositPage'
import { SupplyLiquidityPage } from './pages/SupplyLiquidityPage'
import { RedeemPage } from './pages/RedeemPage'
import { LockPage } from './pages/LockPage'
import { UnlockPage } from './pages/UnlockPage'
import { QASection } from './components/Questions';
import { GlobalProvider, useGlobalContext } from './contexts/GlobalContext';
import { ConvertPage } from './pages/ConvertPage'
import { YieldBadge } from './components/YieldBadge'
import { aprToApy } from './utils'
import { CompoundYield } from './pages/CompoundYield'
import { ClaimYield } from './pages/ClaimYield'
import { NotificationCard } from './components/NotificationCard'
// import { Web3Provider } from '@ethersproject/providers';
// import snapshot from '@snapshot-labs/snapshot.js';

// const client = new snapshot.Client712('https://testnet.hub.snapshot.org');
// const web3 = new Web3Provider(window.ethereum);
// const receipt = await client.vote(web3, '0x3662f5FccDA09Ec5b71c9e2fdCf7D71CbEc622E0', {
//   space: 'parsay.eth',
//   proposal: '0xc216cb43644422545e344f1fa004e5f90816dfc07f9a9c60eadde2ca685a402f',
//   type: 'single-choice',
//   choice: 1,
//   app: 'my-app'
// });

declare global {
  interface Window {
    ethereum?: {
      on: <event extends keyof EIP1193EventMap>(event: event, _listener: EIP1193EventMap[event]) => void;
      removeListener: <event extends keyof EIP1193EventMap>(event: event, _listener: EIP1193EventMap[event]) => void;
      request: EIP1193RequestFn<EIP1474Methods>;
    };
  }
}

export type Pages = 'deposit' | 'convert' | 'lock' | 'buyVotes' | 'supplyLiquidity' | 'unlock' | 'redeem' | 'compoundRMGP' | 'claimYMGP' | 'vote'

const AppContent = (): ReactElement => {
  const [page, setPage] = useState<Pages | undefined>('deposit')
  const [error, setError] = useState('')
  const { balances, exchangeRates, locked, rewards } = useGlobalContext()

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <ConnectWallet />
      <ErrorCard error={error} setError={setError} />
      <div className="flex-grow overflow-auto">
        <Header />
        <div className="mt-18 p-4 md:p-6 mx-28 flex flex-col gap-6">
          <TokenCards />
          <div>
            <div className="bg-gray-800 p-3 border border-gray-700 rounded-t-xl">
              <div className="flex justify-between">
                <div className="bg-gray-700 p-1 rounded-lg flex">
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'deposit' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'deposit' ? setPage(undefined) : setPage('deposit')}>Get rMGP</button>
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'redeem' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'redeem' ? setPage(undefined) : setPage('redeem')}>Redeem rMGP</button>
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'compoundRMGP' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'compoundRMGP' ? setPage(undefined) : setPage('compoundRMGP')}>Compound Yield</button>
                </div>
                <div className="flex flex-row-reverse h-min">
                  <div className="flex gap-1">
                    <YieldBadge asset="MGP" apr={rewards.mgpAPR} breakdown={[{ asset: 'Original vlMGP', apr: rewards.mgpAPR }]} />
                    <YieldBadge asset="rMGP" apy={aprToApy(rewards.mgpAPR)*0.9} breakdown={[{ asset: 'vlMGP', apy: aprToApy(rewards.mgpAPR)*0.9 }]} />
                  </div>
                </div>
              </div>
              {page === 'deposit' && <DepositPage />}
              {page === 'redeem' && <RedeemPage />}
              {page === 'compoundRMGP' && <CompoundYield />}
            </div>
            <div className="bg-gray-800 p-3 border border-gray-700">
              <div className="flex justify-between">
                <div className="bg-gray-700 p-1 rounded-lg flex">
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'convert' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'convert' ? setPage(undefined) : setPage('convert')}>Get yMGP</button>
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'lock' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'lock' ? setPage(undefined) : setPage('lock')}>Lock yMGP</button>
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'unlock' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'unlock' ? setPage(undefined) : setPage('unlock')}>Unlock yMGP</button>
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'claimYMGP' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'claimYMGP' ? setPage(undefined) : setPage('claimYMGP')}>Claim Yield</button>
                </div>
                <div className="flex flex-row-reverse h-min">
                  <div className="flex gap-1">
                    <YieldBadge asset="yMGP" apy={aprToApy(rewards.mgpAPR)*0.9} breakdown={[{ asset: 'rMGP', apy: aprToApy(rewards.mgpAPR)*0.9 }]} />
                    <YieldBadge asset="Locked yMGP" apy={((Number(locked.reefiMGP)*aprToApy(rewards.mgpAPR)*0.05)/Number(locked.ymgp))+aprToApy(rewards.mgpAPR)*0.9} suffix='+' breakdown={[
                      { asset: 'Base vlMGP', apy: aprToApy(rewards.mgpAPR)*0.9 },
                      { asset: 'Boosted vlMGP', apr: ((Number(locked.reefiMGP)*rewards.mgpAPR*0.05)/Number(locked.ymgp)) },
                      { asset: 'Withdrawals', apr: 'variable' }
                    ]} />
                  </div>
                </div>
              </div>
              {page === 'convert' && <ConvertPage />}
              {page === 'lock' && <LockPage />}
              {page === 'unlock' && <UnlockPage />}
              {page === 'claimYMGP' && <ClaimYield />}
            </div>
            <div className="bg-gray-800 p-3 border border-gray-700">
              <div className="flex justify-between">
                <div className="bg-gray-700 p-1 rounded-lg flex">
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'buyVotes' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'buyVotes' ? setPage(undefined) : setPage('buyVotes')}>Get vMGP</button>
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'vote' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'vote' ? setPage(undefined) : setPage('vote')}>Vote</button>
                </div>
                {/* <Badge title="Vote Multiplier" value={supplies.vmgp / supplies.rmgp} /> */}
              </div>
              {/* {page === 'buyVotes' && <BuyVotesPage sendAmount={amounts.send} ymgpAllowance={allowances.ymgp} ymgpAllowanceCurve={allowances.ymgpCurve} ymgpBalance={balances.ymgp} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} onApprove={approve} setSendAmount={amounts.setSend} />} */}
            </div>
            <div className="bg-gray-800 p-3 border border-gray-700 rounded-b-xl">
              <div className="flex justify-between">
                <div className="bg-gray-700 p-1 rounded-lg flex">
                  <button type="button" className={`px-2 py-1 rounded-md transition-colors ${page === 'supplyLiquidity' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => page === 'supplyLiquidity' ? setPage(undefined) : setPage('supplyLiquidity')}>Supply Liquidity</button>
                </div>
                <div className="flex flex-row-reverse h-min">
                  <div className="flex gap-1">
                    <YieldBadge asset="cMGP" apy={rewards.cmgpAPY} breakdown={[
                      { asset: `${(100*Number(balances.mgpCurve)*exchangeRates.mintRMGP/(Number(balances.mgpCurve)+(Number(balances.rmgpCurve)*exchangeRates.mintRMGP)+(Number(balances.ymgpCurve)*exchangeRates.mintRMGP))).toFixed(2)}% MGP`, apy: 0 },
                      { asset: `${(100*Number(balances.rmgpCurve)*exchangeRates.mintRMGP/(Number(balances.mgpCurve)+(Number(balances.rmgpCurve)*exchangeRates.mintRMGP)+(Number(balances.ymgpCurve)*exchangeRates.mintRMGP))).toFixed(2)}% rMGP`, apy: aprToApy(rewards.mgpAPR)*0.9 },
                      { asset: `${(100*Number(balances.ymgpCurve)*exchangeRates.mintRMGP/(Number(balances.mgpCurve)+(Number(balances.rmgpCurve)*exchangeRates.mintRMGP)+(Number(balances.ymgpCurve)*exchangeRates.mintRMGP))).toFixed(2)}% yMGP`, apy: aprToApy(rewards.mgpAPR)*0.9 },
                      { asset: 'Swap Fees', apy: rewards.cmgpPoolAPY }
                    ]} />
                  </div>
                </div>
              </div>
              {page === 'supplyLiquidity' && <SupplyLiquidityPage />}
            </div>
          </div>
          <QASection />
          <ConversionRates />
          <Contracts />
        </div>
      </div>
    </div>
  );
};

const App = (): ReactElement => {
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')
  const [page] = useState<Pages>('deposit')

  return (
    <GlobalProvider setError={setError} setNotification={setNotification} page={page} >
      <ErrorCard error={error} setError={setError} />
      <NotificationCard notification={notification} setNotification={setNotification} />
      <AppContent />
    </GlobalProvider>
  )
}
export default App;
