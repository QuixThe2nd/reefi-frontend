/*
 * TODO: ERC4626 support
 * TODO: Make rMGP and lockManager separate so the contract can be upgraded without requiring migration on users end
 * TODO: Coin logo
 * TODO: reefi priority queue. withdraw slot 1 is free, 2: 10 MGP, 3: 100 MGP, 4: 500 MGP, 5: 1000 MGP, 6: 10000 MGP. if lets say 4 withdraw slots are being used, but user only wants to pay when it costs 100 MGP, they can join the queue and be included next time theres only 2 slots being used.
 * TODO: Make *MGP on either chain burnable in exchange for the same coin on another chain. E.g. if you have rMGP on BSC and arbitrum starts performing better, you can burn your BSC *MGP for ARB *MGP. This averages out yields and depegs across chains allowing BSC & ARB to maintain the same yields. If rMGP on arb has performed better than BSC, you can mint on BSC and burn on ARB.
 */

import { aprToApy, formatEther, formatNumber } from "./utilities";
import { useGlobalContext, GlobalProvider } from "./contexts/GlobalContext";
import { useState, ReactElement } from "react";

import { Badge, YieldBadge } from "./components/YieldBadge";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { ClaimYield } from "./pages/ClaimYield";
import { CompoundYield } from "./pages/CompoundYield";
import { ConnectWallet } from "./components/ConnectWallet";
import { Contracts } from "./components/Contracts";
import { ConversionRates } from "./components/ConversionRates";
import { ErrorCard } from "./components/ErrorCard";
import { Features } from "./components/Features";
import { GetMGPPage } from "./pages/GetMGPPage";
import { GetRMGPPage } from "./pages/GetRMGPPage";
import { GetYMGPPage } from "./pages/GetYMGPPage";
import { Header } from "./components/Header";
import { LockPage } from "./pages/LockPage";
import { NotificationCard } from "./components/NotificationCard";
import PegCard from "./components/PegCard";
import { QASection } from "./components/Questions";
import { RedeemRMGPPage } from "./pages/RedeemRMGPPage";
import { SupplyLiquidityPage } from "./pages/SupplyLiquidityPage";
import { TokenCards } from "./components/TokenCards";
import { UnlockPage } from "./pages/UnlockPage";

import type { EIP1193EventMap, EIP1193RequestFn, EIP1474Methods } from "viem";

/*
 * Import { Web3Provider } from '@ethersproject/providers';
 * Import snapshot from '@snapshot-labs/snapshot.js';
 */

/*
1 rMGP = 1.2 BSC MGP
1 rMGP = 1.4 ARB MGP
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
  const {
    actions: { depositMGP, buyMGP, redeemRMGP, withdrawMGP, compoundRMGP, lockYMGP, claimYMGPRewards, unlockYMGP, supplyLiquidity, approve, convertMGP, sellYMGP, mintWETH, swap, buyRMGP, buyYMGP, depositRMGP },
    allowances, amounts, updateAmounts,
    exchangeRates,
    locked,
    prices,
    rewards,
    supplies,
    wallet: { ens, chain, account, isConnecting, setChain, connectWallet, connectRequired },
    withdraws,
    balances
  } = useGlobalContext();

  return <div className="flex h-screen bg-gray-900 text-white">
    <ConnectWallet connectRequired={connectRequired} isConnecting={isConnecting} connectWallet={connectWallet} />
    <ErrorCard error={error} setError={setError} />
    <div className="grow overflow-auto">
      <Header ens={ens} chain={chain} account={account} isConnecting={isConnecting} setChain={setChain} connectWallet={connectWallet} mgpBalance={balances.MGP} rmgpBalance={balances.rMGP} ymgpBalance={balances.yMGP} cmgpBalance={balances.cMGP} />
      <div className="flex flex-col gap-6 p-4 md:mx-16 md:p-6 lg:mx-24 xl:mx-28">
        <TokenCards mgpLocked={locked.MGP[56] + locked.MGP[42_161]} mgpPrice={prices.MGP} mgpSupply={supplies.MGP} rmgpSupply={supplies.rMGP} ymgpSupply={supplies.yMGP} ymgpLocked={locked.yMGP} reefiMGPLocked={locked.reefiMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} rmgpYmgpCurveRate={exchangeRates.rmgpYMGP} />
        <Features mgpAPR={rewards.mgpAPR} lockedYmgpAPY={rewards.lockedYmgpAPY} mgpPrice={prices.MGP} vmgpSupply={supplies.vMGP} reefiLockedMGP={locked.reefiMGP} vmgpMGPCurveRate={0.5} />
        <Card>
          <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row w-full">
            <div className="flex rounded-lg bg-gray-700 p-1">
              <Button size="sm" variant={page === "getMGP" ? "primary" : "clear"} onClick={() => setPage(page === "getMGP" ? undefined : "getMGP")} type="button">Get MGP</Button>
              <Button size="sm" variant={page === "deposit" ? "primary" : "clear"} onClick={() => setPage(page === "deposit" ? undefined : "deposit")} type="button">Get rMGP</Button>
              <Button size="sm" variant={page === "compoundRMGP" ? "primary" : "clear"} onClick={() => setPage(page === "compoundRMGP" ? undefined : "compoundRMGP")} type="button">Compound Yield</Button>
              <Button size="sm" variant={page === "redeem" ? "primary" : "clear"} onClick={() => setPage(page === "redeem" ? undefined : "redeem")} type="button">Redeem rMGP</Button>
            </div>
            <div className="flex h-min flex-row-reverse">
              <div className="flex gap-1">
                <YieldBadge apr={rewards.mgpAPR} asset="MGP" breakdown={[{ apr: rewards.mgpAPR, asset: "Original vlMGP" }]} />
                <YieldBadge apy={aprToApy(rewards.mgpAPR) * 0.9} asset="rMGP" breakdown={[{ apy: aprToApy(rewards.mgpAPR) * 0.9, asset: "vlMGP" }]} />
              </div>
            </div>
          </div>
          {page === "getMGP" && <GetMGPPage mgpAPR={rewards.mgpAPR} balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} chain={chain} buyMGP={buyMGP} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} />}
          {page === "deposit" && <GetRMGPPage mgpAPR={rewards.mgpAPR} depositMGP={depositMGP} balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} chain={chain} buyRMGP={buyRMGP} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} />}
          {page === "compoundRMGP" && <CompoundYield uncompoundedMGPYield={rewards.uncompoundedMGPYield} estimatedCompoundGasFee={rewards.estimatedCompoundGasFee} pendingRewards={rewards.pendingRewards} estimatedCompoundAmount={rewards.estimatedCompoundAmount} mgpAPR={rewards.mgpAPR} reefiMGPLocked={locked.reefiMGP} chain={chain} prices={prices} compoundRMGP={compoundRMGP} />}
          {page === "redeem" && <RedeemRMGPPage buyMGP={buyMGP} redeemRMGP={redeemRMGP} withdrawMGP={withdrawMGP} unlockSchedule={withdraws.unlockSchedule} balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} userPendingWithdraws={withdraws.userPending} userWithdrawable={withdraws.userWithdrawable} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} />}
          <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
          <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
            <div className="flex rounded-lg bg-gray-700 p-1">
              <Button size="sm" variant={page === "convert" ? "primary" : "clear"} onClick={() => setPage(page === "convert" ? undefined : "convert")} type="button">Get yMGP</Button>
              <Button size="sm" variant={page === "lock" ? "primary" : "clear"} onClick={() => setPage(page === "lock" ? undefined : "lock")} type="button">Lock yMGP</Button>
              <Button size="sm" variant={page === "claimYMGP" ? "primary" : "clear"} onClick={() => setPage(page === "claimYMGP" ? undefined : "claimYMGP")} type="button">Claim Yield</Button>
              <Button size="sm" variant={page === "unlock" ? "primary" : "clear"} onClick={() => setPage(page === "unlock" ? undefined : "unlock")} type="button">Unlock yMGP</Button>
            </div>
            <div className="flex h-min flex-row-reverse">
              <div className="flex gap-1">
                <YieldBadge apy={aprToApy(rewards.mgpAPR) * 0.9} asset="yMGP" breakdown={[{ apy: aprToApy(rewards.mgpAPR) * 0.9, asset: "rMGP" }]} />
                <YieldBadge apy={Number(locked.reefiMGP) * aprToApy(rewards.mgpAPR) * 0.05 / Number(locked.yMGP) + aprToApy(rewards.mgpAPR) * 0.9} asset="Locked yMGP" breakdown={[{ apy: aprToApy(rewards.mgpAPR) * 0.9, asset: "Base vlMGP" }, { apr: Number(locked.reefiMGP) * rewards.mgpAPR * 0.05 / Number(locked.yMGP), asset: "Boosted vlMGP" }, { asset: "Withdrawals", value: "Variable" }]} suffix='+' />
              </div>
            </div>
          </div>
          {page === "convert" && <GetYMGPPage balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} buyYMGP={buyYMGP} depositRMGP={depositRMGP} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} />}
          {page === "lock" && <LockPage ymgpBalance={balances.yMGP} setSend={updateAmounts.send} send={amounts.send} lockYMGP={lockYMGP} mgpAPR={rewards.mgpAPR} reefiLockedMGP={locked.reefiMGP} ymgpLocked={locked.yMGP} />}
          {page === "claimYMGP" && <ClaimYield claimYMGPRewards={claimYMGPRewards} lockedYMGP={locked.yMGP} unclaimedUserYield={rewards.unclaimedUserYield} uncompoundedMGPYield={rewards.uncompoundedMGPYield} userLockedYMGP={locked.userYMGP} ymgpHoldings={balances.ymgpHoldings} ymgpSupply={supplies.yMGP} />}
          {page === "unlock" && <UnlockPage sendAmount={amounts.send} setSendAmount={updateAmounts.send} unlockYMGP={unlockYMGP} ymgpBalance={balances.yMGP} />}
          <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
          <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
            <div className="flex rounded-lg bg-gray-700 p-1">
              <Button size="sm" variant={page === "buyVotes" ? "primary" : "clear"} onClick={() => setPage(page === "buyVotes" ? undefined : "buyVotes")} type="button">Get vMGP</Button>
              <Button size="sm" variant={page === "vote" ? "primary" : "clear"} onClick={() => setPage(page === "vote" ? undefined : "vote")} type="button">Vote</Button>
            </div>
            <div className="flex h-min flex-row-reverse">
              <div className="flex gap-1">
                <Badge title="Vote Multiplier" value={`${formatNumber(Number(supplies.rMGP) / Number(supplies.vMGP), 2)}x+`} breakdown={[
                  {
                    asset: "Reefi's vlMGP",
                    value: formatNumber(formatEther(locked.reefiMGP))
                  },
                  {
                    asset: "Votable vMGP",
                    value: formatNumber(formatEther(supplies.vMGP))
                  }
                ]} />
              </div>
            </div>
          </div>
          <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
          <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
            <div className="flex rounded-lg bg-gray-700 p-1">
              <Button size="sm" variant={page === "supplyLiquidity" ? "primary" : "clear"} onClick={() => setPage(page === "supplyLiquidity" ? undefined : "supplyLiquidity")} type="button">Supply Liquidity</Button>
            </div>
            <div className="flex h-min flex-row-reverse">
              <div className="flex gap-1">
                <YieldBadge
                  apy={rewards.cmgpAPY}
                  asset="cMGP"
                  breakdown={[
                    { apy: 0, asset: `${(100 * Number(balances.curveMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) / (Number(balances.curveMGP) + Number(balances.curveRMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) + Number(balances.curveYMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP))).toFixed(2)}% MGP` },
                    { apy: aprToApy(rewards.mgpAPR) * 0.9, asset: `${(100 * Number(balances.curveRMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) / (Number(balances.curveMGP) + Number(balances.curveRMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) + Number(balances.curveYMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP))).toFixed(2)}% rMGP` },
                    { apy: aprToApy(rewards.mgpAPR) * 0.9, asset: `${(100 * Number(balances.curveYMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) / (Number(balances.curveMGP) + Number(balances.curveRMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) + Number(balances.curveYMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP))).toFixed(2)}% yMGP` },
                    { apy: rewards.cmgpPoolAPY, asset: "Swap Fees" }
                  ]}
                />
              </div>
            </div>
          </div>
          {page === "supplyLiquidity" && <SupplyLiquidityPage mgpBalance={balances.MGP} rmgpBalance={balances.rMGP} ymgpBalance={balances.yMGP} mgpCurveBalance={balances.curveMGP} rmgpCurveBalance={balances.curveRMGP} ymgpCurveBalance={balances.curveYMGP} setMgpLPAmount={updateAmounts.lp.MGP} mgpLPAmount={amounts.lp.MGP} rmgpLPAmount={amounts.lp.rMGP} ymgpLPAmount={amounts.lp.yMGP} setRmgpLPAmount={updateAmounts.lp.rMGP} setYmgpLPAmount={updateAmounts.lp.yMGP} supplyLiquidity={supplyLiquidity} />}
        </Card>
        <QASection />
        <div className="flex gap-6">
          <PegCard token="rMGP" data={{ burn: Number(locked.reefiMGP) / Number(supplies.rMGP) * 0.9, marketBuy: 1 / exchangeRates.mgpRMGP, marketSell: exchangeRates.rmgpMGP, mint: Number(locked.reefiMGP) / Number(supplies.rMGP), originalBurn: 0.9, originalMint: 1, spread: 100 / exchangeRates.mgpRMGP / exchangeRates.rmgpMGP - 100 }} targetToken="MGP" />
          <PegCard token="yMGP" data={{ burn: 0, marketBuy: 1 / exchangeRates.rmgpYMGP, marketSell: exchangeRates.ymgpRMGP, mint: 1, spread: 100 / exchangeRates.rmgpYMGP / exchangeRates.ymgpRMGP - 100 }} targetToken="rMGP" />
        </div>
        <ConversionRates />
        <Contracts chain={chain} />
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
