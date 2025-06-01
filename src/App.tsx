/*
 * TODO: ERC4626 support
 * TODO: Make rMGP and lockManager separate so the contract can be upgraded without requiring migration on users end
 * TODO: Coin logo
 */

import { aprToApy, formatNumber } from "./utilities";
import { useGlobalContext, GlobalProvider } from "./contexts/GlobalContext";
import { useState, ReactElement } from "react";

import { Badge, YieldBadge } from "./components/YieldBadge";
import { ClaimYield } from "./pages/ClaimYield";
import { CompoundYield } from "./pages/CompoundYield";
import { ConnectWallet } from "./components/ConnectWallet";
import { Contracts } from "./components/Contracts";
import { ConversionRates } from "./components/ConversionRates";
import { ErrorCard } from "./components/ErrorCard";
import { Features } from "./pages/Features";
import { GetMGPPage } from "./pages/GetMGPPage";
import { GetRMGPPage } from "./pages/GetRMGPPage";
import { GetYMGPPage } from "./pages/GetYMGPPage";
import { Header } from "./components/Header";
import { LockPage } from "./pages/LockPage";
import { NotificationCard } from "./components/NotificationCard";
import { QASection } from "./components/Questions";
import { RedeemMGPPage } from "./pages/RedeemMGPPage";
import { SupplyLiquidityPage } from "./pages/SupplyLiquidityPage";
import { TokenCards } from "./components/TokenCards";
import { UnlockPage } from "./pages/UnlockPage";

import type { EIP1193EventMap, EIP1193RequestFn, EIP1474Methods } from "viem";

/*
 * Import { Web3Provider } from '@ethersproject/providers';
 * Import snapshot from '@snapshot-labs/snapshot.js';
 */

/*
 * Const client = new snapshot.Client712('https://testnet.hub.snapshot.org');
 * Const web3 = new Web3Provider(window.ethereum);
 * Const receipt = await client.vote(web3, '0x3662f5FccDA09Ec5b71c9e2fdCf7D71CbEc622E0', {
 *   Space: 'parsay.eth',
 *   Proposal: '0xc216cb43644422545e344f1fa004e5f90816dfc07f9a9c60eadde2ca685a402f',
 *   Type: 'single-choice',
 *   Choice: 1,
 *   App: 'my-app'
 * });
 */

declare global {
  // eslint-disable-next-line
  interface Window {
    ethereum?: {
      on: <event extends keyof EIP1193EventMap>(event: event, _listener: EIP1193EventMap[event]) => void;
      removeListener: <event extends keyof EIP1193EventMap>(event: event, _listener: EIP1193EventMap[event]) => void;
      request: EIP1193RequestFn<EIP1474Methods>;
    };
  }
}

export type Pages = "getMGP" | "deposit" | "convert" | "lock" | "buyVotes" | "supplyLiquidity" | "unlock" | "redeem" | "compoundRMGP" | "claimYMGP" | "vote";

const AppContent = (): ReactElement => {
  const [page, setPage] = useState<Pages | undefined>("deposit");
  const [error, setError] = useState("");
  const { balances, exchangeRates, locked, rewards, supplies } = useGlobalContext();

  return <div className="flex h-screen bg-gray-900 text-white">
    <ConnectWallet />
    <ErrorCard error={error} setError={setError} />
    <div className="grow overflow-auto">
      <Header />
      <div className="flex flex-col gap-6 p-4 md:mx-16 md:p-6 lg:mx-24 xl:mx-28">
        <TokenCards />
        <Features />
        <div>
          <div className="rounded-t-xl border border-gray-700 bg-gray-800 p-3">
            <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row">
              <div className="flex rounded-lg bg-gray-700 p-1">
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "getMGP" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "getMGP" ? undefined : "getMGP")} type="button">Get MGP</button>
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "deposit" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "deposit" ? undefined : "deposit")} type="button">Get rMGP</button>
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "compoundRMGP" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "compoundRMGP" ? undefined : "compoundRMGP")} type="button">Compound Yield</button>
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "redeem" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "redeem" ? undefined : "redeem")} type="button">Redeem rMGP</button>
              </div>
              <div className="flex h-min flex-row-reverse">
                <div className="flex gap-1">
                  <YieldBadge apr={rewards.mgpAPR} asset="MGP" breakdown={[{ apr: rewards.mgpAPR, asset: "Original vlMGP" }]} />
                  <YieldBadge apy={aprToApy(rewards.mgpAPR) * 0.9} asset="rMGP" breakdown={[{ apy: aprToApy(rewards.mgpAPR) * 0.9, asset: "vlMGP" }]} />
                </div>
              </div>
            </div>
            {page === "getMGP" && <GetMGPPage />}
            {page === "deposit" && <GetRMGPPage />}
            {page === "compoundRMGP" && <CompoundYield />}
            {page === "redeem" && <RedeemMGPPage />}
          </div>
          <div className="border border-gray-700 bg-gray-800 p-3">
            <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row">
              <div className="flex rounded-lg bg-gray-700 p-1">
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "convert" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "convert" ? undefined : "convert")} type="button">Get yMGP</button>
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "lock" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "lock" ? undefined : "lock")} type="button">Lock yMGP</button>
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "claimYMGP" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "claimYMGP" ? undefined : "claimYMGP")} type="button">Claim Yield</button>
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "unlock" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "unlock" ? undefined : "unlock")} type="button">Unlock yMGP</button>
              </div>
              <div className="flex h-min flex-row-reverse">
                <div className="flex gap-1">
                  <YieldBadge apy={aprToApy(rewards.mgpAPR) * 0.9} asset="yMGP" breakdown={[{ apy: aprToApy(rewards.mgpAPR) * 0.9, asset: "rMGP" }]} />
                  <YieldBadge apy={Number(locked.reefiMGP) * aprToApy(rewards.mgpAPR) * 0.05 / Number(locked.ymgp) + aprToApy(rewards.mgpAPR) * 0.9} asset="Locked yMGP" breakdown={[{ apy: aprToApy(rewards.mgpAPR) * 0.9, asset: "Base vlMGP" }, { apr: Number(locked.reefiMGP) * rewards.mgpAPR * 0.05 / Number(locked.ymgp), asset: "Boosted vlMGP" }, { apr: "variable", asset: "Withdrawals" }]} suffix='+' />
                </div>
              </div>
            </div>
            {page === "convert" && <GetYMGPPage />}
            {page === "lock" && <LockPage />}
            {page === "claimYMGP" && <ClaimYield />}
            {page === "unlock" && <UnlockPage />}
          </div>
          <div className="border border-gray-700 bg-gray-800 p-3">
            <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row">
              <div className="flex rounded-lg bg-gray-700 p-1">
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "buyVotes" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "buyVotes" ? undefined : "buyVotes")} type="button">Get vMGP</button>
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "vote" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "vote" ? undefined : "vote")} type="button">Vote</button>
              </div>
              <div className="flex h-min flex-row-reverse">
                <div className="flex gap-1">
                  <Badge title="Vote Multiplier" value={`${formatNumber(Number(supplies.rmgp) / Number(supplies.vmgp), 2)}x+`} />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-b-xl border border-gray-700 bg-gray-800 p-3">
            <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row">
              <div className="flex rounded-lg bg-gray-700 p-1">
                <button className={`rounded-md px-2 py-1 text-xs transition-colors md:text-sm ${page === "supplyLiquidity" ? "bg-green-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`} onClick={() => setPage(page === "supplyLiquidity" ? undefined : "supplyLiquidity")} type="button">Supply Liquidity</button>
              </div>
              <div className="flex h-min flex-row-reverse">
                <div className="flex gap-1">
                  <YieldBadge
                    apy={rewards.cmgpAPY}
                    asset="cMGP"
                    breakdown={[
                      { apy: 0, asset: `${(100 * Number(balances.mgpCurve) * exchangeRates.mintRMGP / (Number(balances.mgpCurve) + Number(balances.rmgpCurve) * exchangeRates.mintRMGP + Number(balances.ymgpCurve) * exchangeRates.mintRMGP)).toFixed(2)}% MGP` },
                      { apy: aprToApy(rewards.mgpAPR) * 0.9, asset: `${(100 * Number(balances.rmgpCurve) * exchangeRates.mintRMGP / (Number(balances.mgpCurve) + Number(balances.rmgpCurve) * exchangeRates.mintRMGP + Number(balances.ymgpCurve) * exchangeRates.mintRMGP)).toFixed(2)}% rMGP` },
                      { apy: aprToApy(rewards.mgpAPR) * 0.9, asset: `${(100 * Number(balances.ymgpCurve) * exchangeRates.mintRMGP / (Number(balances.mgpCurve) + Number(balances.rmgpCurve) * exchangeRates.mintRMGP + Number(balances.ymgpCurve) * exchangeRates.mintRMGP)).toFixed(2)}% yMGP` },
                      { apy: rewards.cmgpPoolAPY, asset: "Swap Fees" }
                    ]}
                  />
                </div>
              </div>
            </div>
            {page === "supplyLiquidity" && <SupplyLiquidityPage />}
          </div>
        </div>
        <QASection />
        <ConversionRates />
        <Contracts />
      </div>
    </div>
  </div>;
};

const App = (): ReactElement => {
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  return <GlobalProvider setError={setError} setNotification={setNotification}>
    <ErrorCard error={error} setError={setError} />
    <NotificationCard notification={notification} setNotification={setNotification} />
    <AppContent />
  </GlobalProvider>;
};
export default App;
