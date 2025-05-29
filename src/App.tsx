// TODO: ERC4626 support
import { useState, ReactElement } from 'react'
import { type EIP1193EventMap, type EIP1193RequestFn, type EIP1474Methods } from 'viem'
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
import { RedeemPage } from './pages/RedeemPage'
import { LockPage } from './pages/LockPage'
import { UnlockPage } from './pages/UnlockPage'
import { QASection } from './components/Questions';
import { GlobalProvider } from './contexts/GlobalContext';
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

export type Pages = 'deposit' | 'convert' | 'lock' | 'buyVotes' | 'supplyLiquidity' | 'unlock' | 'redeem'

const AppContent = (): ReactElement => {
  const [page, setPage] = useState<Pages>('deposit')
  const [error, setError] = useState('')

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <ConnectWallet />
      <ErrorCard error={error} setError={setError} />
      <div className="flex-grow overflow-auto">
        <div className="p-4 md:p-6">
          <Header />
          <TokenCards />
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
            <YieldBadges />
            <Navbar page={page} setPage={setPage} />
            {page === 'deposit' && <DepositPage />}
            {/* {page === 'buyVotes' && <BuyVotesPage sendAmount={amounts.send} ymgpAllowance={allowances.ymgp} ymgpAllowanceCurve={allowances.ymgpCurve} ymgpBalance={balances.ymgp} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} onApprove={approve} setSendAmount={amounts.setSend} />} */}
            {page === 'redeem' && <RedeemPage />}
            {page === 'supplyLiquidity' && <SupplyLiquidityPage />}
            {page === 'lock' && <LockPage />}
            {page === 'unlock' && <UnlockPage />}
          </div>
          <PendingRewards />
          <ConversionRates />
          <QASection />
          <Contracts />
        </div>
      </div>
    </div>
  );
};

const App = (): ReactElement => {
  const [error, setError] = useState('')
  const [page] = useState<Pages>('deposit')

  return (
    <GlobalProvider setError={setError} page={page} >
      <ErrorCard error={error} setError={setError} />
      <AppContent />
    </GlobalProvider>
  )
}
export default App;
