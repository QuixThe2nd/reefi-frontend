/*
 * TODO: ERC4626 support
 * TODO: Make rMGP and lockManager separate so the contract can be upgraded without requiring migration on users end
 * TODO: reefi priority queue. withdraw slot 1 is free, 2: 10 MGP, 3: 100 MGP, 4: 500 MGP, 5: 1000 MGP, 6: 10000 MGP. if lets say 4 withdraw slots are being used, but user only wants to pay when it costs 100 MGP, they can join the queue and be included next time theres only 2 slots being used.
 * TODO: tokenise each rmgp->mgp withdraw batch with like wmgp-aug-4, that slowly regains its peg with fixed interest
 * TODO: make buttons load during action
 * TODO: Docs
 */

import vlMGP from "../public/icons/vlMGP.png";

import { aprToApy, formatEther, formatNumber } from "./utilities";
import { coins } from "./config/contracts";
import { useGlobalContext, GlobalProvider } from "./contexts/GlobalContext";
import { useState, ReactElement } from "react";

import { Badge, YieldBadge } from "./components/YieldBadge";
import { Button } from "./components/Button";
import { BuyVotesPage } from "./pages/BuyVotesPage";
import { Card } from "./components/Card";
import { ClaimVMGPYield, ClaimVMGPYieldComponent } from "./pages/ClaimVMGPYield";
import { ClaimYield } from "./pages/ClaimYMGPYield";
import { CompoundYield } from "./pages/CompoundYield";
import { ConnectWallet } from "./components/ConnectWallet";
import { Contracts } from "./components/Contracts";
import { ErrorCard } from "./components/ErrorCard";
import { Features } from "./components/Features";
import { FixedYieldPage } from "./pages/FixedYieldPage";
import { GetMGPPage } from "./pages/GetMGPPage";
import { GetRMGPPage } from "./pages/GetRMGPPage";
import { GetVMGPPage } from "./pages/GetVMGPPage";
import { GetYMGPPage } from "./pages/GetYMGPPage";
import { Header } from "./components/Header";
import { LockPage } from "./pages/LockYMGPPage";
import { LockVMGPPage } from "./pages/LockVMGPPage";
import { NotificationCard } from "./components/NotificationCard";
import PegCard from "./components/PegCard";
import { QASection } from "./components/Questions";
import { RedeemRMGPPage } from "./pages/RedeemRMGPPage";
import { RedeemYMGPPage } from "./pages/RedeemYMGPPage";
import { SupplyLiquidityPage } from "./pages/SupplyLiquidityPage";
import { TokenCards } from "./components/TokenCards";
import { UnlockPage } from "./pages/UnlockYMGPPage";
import { UnlockVMGPPage } from "./pages/UnlockVMGPPage";
import { VotePage } from "./pages/VotePage";

import { type EIP1193EventMap, type EIP1193RequestFn, type EIP1474Methods } from "viem";

/*
 * Import { Web3Provider } from '@ethersproject/providers';
 * Import snapshot from '@snapshot-labs/snapshot.js';
 */

/*

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
  interface Window {
    ethereum?: {
      on: <event extends keyof EIP1193EventMap>(event: event, _listener: EIP1193EventMap[event]) => void;
      removeListener: <event extends keyof EIP1193EventMap>(event: event, _listener: EIP1193EventMap[event]) => void;
      request: EIP1193RequestFn<EIP1474Methods>;
    };
  }
}

export type Pages = "getMGP" | "deposit" | "convert" | "lock" | "buyVotes" | "supplyLiquidity" | "unlock" | "redeem" | "claim" | "vote" | "redeemYMGP" | "fixedYield" | "getVMGP" | "lockVMGP" | "bridge" | "unlockVMGP";

const Content = ({ page, setPage, error, setError }: { page: Pages | undefined; setPage: (_page: Pages | undefined) => void; error: string; setError: (_error: string) => void }) => {
  const {
    actions: { depositMGP, buyMGP, redeemRMGP, withdrawMGP, compoundRMGP, lockYMGP, claimYMGPRewards, unlockYMGP, supplyLiquidity, approve, convertMGP, sellYMGP, mintWETH, swap, buyRMGP, buyYMGP, depositRMGP },
    wallet: { chain, isConnecting, connectWallet, connectRequired },
    allowances, amounts, updateAmounts, exchangeRates, locked, prices, rewards, supplies, withdraws, balances
  } = useGlobalContext();

  const calculateFixedYield = () => {
    const burnRate = Number(locked.reefiMGP) / Number(supplies.rMGP);
    const fixedYieldPercent = (exchangeRates.mgpRMGP / burnRate - 1) * 100;
    const withdrawalTime = withdraws.unlockSchedule.length === 6 ? Number(withdraws.unlockSchedule[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2 : 60 * 60 * 24 * 30 * 2;
    const daysToWithdraw = withdrawalTime / (60 * 60 * 24);
    return `${(fixedYieldPercent / 100 * (365 / daysToWithdraw) * 100).toFixed(2)}%`;
  };

  if (page === "claim") return <div className="flex flex-col h-screen bg-gray-900 text-white">
    <ConnectWallet connectRequired={connectRequired} isConnecting={isConnecting} connectWallet={connectWallet} />
    <ErrorCard error={error} setError={setError} />
    <Card>
      <CompoundYield uncompoundedMGPYield={rewards.uncompoundedMGPYield} estimatedCompoundGasFee={rewards.estimatedCompoundGasFee} pendingRewards={rewards.pendingRewards} estimatedCompoundAmount={rewards.estimatedCompoundAmount} mgpAPR={rewards.mgpAPR} reefiMGPLocked={locked.reefiMGP} chain={chain} prices={prices} compoundRMGP={compoundRMGP} />
    </Card>
    <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-xl font-bold">Claim yMGP Rewards</h2>
        <ClaimYield claimYMGPRewards={claimYMGPRewards} lockedYMGP={locked.yMGP} unclaimedUserYield={rewards.unclaimedUserYield} uncompoundedMGPYield={rewards.uncompoundedMGPYield} userLockedYMGP={locked.userYMGP} ymgpHoldings={balances.ymgpHoldings} ymgpSupply={supplies.yMGP} />
      </Card>
      <Card>
        <h2 className="mb-4 text-xl font-bold">Claim vMGP Rewards</h2>
        <ClaimVMGPYield claimVMGPRewards={() => claimVMGPRewards()} unclaimedUserVMGPYield={rewards.unclaimedUserVMGPYield} vmgpHoldings={balances.vmgpHoldings} />
      </Card>
    </div>
  </div>;

  if (page === "vote") return <div className="flex flex-col h-screen bg-gray-900 text-white">
    <ConnectWallet connectRequired={connectRequired} isConnecting={isConnecting} connectWallet={connectWallet} />
    <ErrorCard error={error} setError={setError} />
    <div className="grid grid-cols-1 gap-6 pb-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-xl font-bold">Vote</h2>
        <VotePage vmgpBalance={balances.vMGP} vmgpSupply={supplies.vMGP} reefiMgpLocked={locked.reefiMGP} rmgpSupply={supplies.rMGP} proposals={[
          {
            id: "0x1234567890abcdef",
            title: "Increase vlMGP Lock Duration to 180 Days",
            description: "Proposal to extend the maximum lock duration for vlMGP from 120 to 180 days to increase protocol stability and reduce sell pressure.",
            choices: ["For", "Against", "Abstain"],
            start: Math.floor(Date.now() / 1000) - 86_400 * 2,
            end: Math.floor(Date.now() / 1000) + 86_400 * 5,
            state: "active" as const,
            scores: [2, 4, 1],
            votes: 124
          },
          {
            id: "0xabcdef1234567890",
            title: "Add USDC/WETH Pool to Magpie Rewards",
            description: "Add the new USDC/WETH liquidity pool to the Magpie rewards program with 15% allocation weight.",
            choices: ["Add with 15% weight", "Add with 10% weight", "Add with 20% weight", "Do not add"],
            start: Math.floor(Date.now() / 1000) - 86_400 * 1,
            end: Math.floor(Date.now() / 1000) + 86_400 * 6,
            state: "active" as const,
            scores: [1, 2, 2, 0],
            votes: 89
          },
          {
            id: "0x9876543210fedcba",
            title: "Treasury Diversification Strategy",
            description: "Diversify protocol treasury holdings by allocating 30% to stablecoins and 20% to ETH, reducing MGP concentration risk.",
            choices: ["Approve diversification", "Reject diversification"],
            start: Math.floor(Date.now() / 1000) - 86_400 * 10,
            end: Math.floor(Date.now() / 1000) - 86_400 * 3,
            state: "closed" as const,
            scores: [3, 1],
            votes: 156
          }
        ]}
        onVote={async (proposalId: string, choice: number) => {
          console.log("Voting on proposal:", proposalId, "choice:", choice);
        }}
        onRefresh={async () => {
          console.log("Refreshing proposals");
        }}
        isLoading={false}
        />
      </Card>
      <Card>
        <h2 className="mb-4 text-xl font-bold">Buy Votes</h2>
        <BuyVotesPage balances={balances} yMGPBalance={balances.yMGP} lockedYMGPBalance={balances.lyMGP} totalLockedYMGP={locked.yMGP} reefiMgpLocked={locked.reefiMGP} onBuyVotes={() => onBuyVotes()} />
      </Card>
    </div>
  </div>;

  if (page === "bridge") return <div className="flex flex-col h-screen bg-gray-900 text-white">
    <ConnectWallet connectRequired={connectRequired} isConnecting={isConnecting} connectWallet={connectWallet} />
    <ErrorCard error={error} setError={setError} />
    <Card>
      <h2 className="mb-4 text-xl font-bold">Bridge wrMGP</h2>
      <p>Issue wrMGP on BSC and ARB. Bridge both coins with wormhole, so each chain has a wrMGP and a bridged wrMGP. Add unbridge() function on wrMGP that takes the whitelisted bridged wrMGP and swaps it to the chains native wrMGP.</p>
    </Card>
    <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 text-xl font-bold">Wrap rMGP</h2>
        <p>1 rMGP = 1 MGP, by wrapping 1 rMGP youll get 1.5 wrMGP if MGP/rMGP mint rate is 1.5.</p>
      </Card>
      <Card>
        <h2 className="mb-4 text-xl font-bold">Unwrap wrMGP</h2>
        <p>On unwrap, you receive 1 MGP's worth of rMGP for each wrMGP. wrMGP does receive any yield.</p>
      </Card>
    </div>
  </div>;

  return <>
    <TokenCards mgpLocked={locked.MGP[56] + locked.MGP[42_161]} mgpPrice={prices.MGP} mgpSupply={supplies.MGP} rmgpSupply={supplies.rMGP} ymgpSupply={supplies.yMGP} ymgpLocked={locked.yMGP} reefiMGPLocked={locked.reefiMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} rmgpYmgpCurveRate={exchangeRates.rmgpYMGP} ymgpVmgpCurveRate={exchangeRates.ymgpVMGP} vmgpSupply={supplies.vMGP} />
    <Features mgpAPR={rewards.mgpAPR} lockedYmgpAPY={rewards.lockedYmgpAPY} mgpPrice={prices.MGP} vmgpSupply={supplies.vMGP} reefiLockedMGP={locked.reefiMGP} vmgpMGPCurveRate={0.5} />
    <div className="rounded-xl border border-dashed border-yellow-700 bg-gray-900/80 p-4">
      <h3 className="mb-2 text-lg font-semibold text-yellow-400">⚠️ Important Notice</h3>
      <p className="text-sm text-gray-300">Reefi is in <strong>very early beta</strong>. Please only deposit small amounts that you can afford to lose. The protocol may contain unknown bugs and should be used with caution</p>
    </div>
    <Card>
      <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row w-full">
        <div className="flex rounded-lg bg-gray-700 p-1">
          <Button size="sm" variant={page === "getMGP" ? "primary" : "clear"} onClick={() => setPage(page === "getMGP" ? undefined : "getMGP")} type="button">Get MGP</Button>
          <Button size="sm" variant={page === "deposit" ? "primary" : "clear"} onClick={() => setPage(page === "deposit" ? undefined : "deposit")} type="button">Get rMGP</Button>
          {balances.rMGP > 0n && <Button size="sm" variant={page === "redeem" ? "primary" : "clear"} onClick={() => setPage(page === "redeem" ? undefined : "redeem")} type="button">Redeem rMGP</Button>}
          <Button size="sm" variant={page === "fixedYield" ? "primary" : "clear"} onClick={() => setPage(page === "fixedYield" ? undefined : "fixedYield")} type="button">Fixed Yield</Button>
        </div>
        <div className="flex h-min flex-row-reverse">
          <div className="flex gap-1">
            <YieldBadge apr={rewards.mgpAPR} asset="Locked MGP" breakdown={[{ apr: rewards.mgpAPR, asset: "vlMGP", logo: vlMGP }]} logo={vlMGP} />
            <YieldBadge apy={aprToApy(rewards.mgpAPR) * 0.9} asset="rMGP" breakdown={[{ apy: aprToApy(rewards.mgpAPR) * 0.9, asset: "vlMGP", logo: vlMGP }]} logo={coins.rMGP.icon} />
            <YieldBadge value={calculateFixedYield()} asset="rMGP Fixed Yield" breakdown={[{ value: `${((exchangeRates.mgpRMGP / (Number(locked.reefiMGP) / Number(supplies.rMGP)) - 1) * 100).toFixed(2)}%`, asset: "rMGP Discount", logo: coins.rMGP.icon }]} logo={coins.rMGP.icon} />
          </div>
        </div>
      </div>
      {page === "getMGP" && <GetMGPPage mgpAPR={rewards.mgpAPR} balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} chain={chain} buyMGP={buyMGP} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} />}
      {page === "deposit" && <GetRMGPPage mgpAPR={rewards.mgpAPR} depositMGP={depositMGP} balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} chain={chain} buyRMGP={buyRMGP} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} />}
      {page === "redeem" && <RedeemRMGPPage buyMGP={buyMGP} redeemRMGP={redeemRMGP} withdrawMGP={withdrawMGP} unlockSchedule={withdraws.unlockSchedule} balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} userPendingWithdraws={withdraws.userPending} userWithdrawable={withdraws.userWithdrawable} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} />}
      {page === "fixedYield" && <FixedYieldPage mgpAPR={rewards.mgpAPR} balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} chain={chain} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} unlockSchedule={withdraws.unlockSchedule} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} buyRMGPAndWithdraw={() => buyRMGPAndWithdraw()} />}
      <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
      <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
        <div className="flex rounded-lg bg-gray-700 p-1">
          <Button size="sm" variant={page === "convert" ? "primary" : "clear"} onClick={() => setPage(page === "convert" ? undefined : "convert")} type="button">Get yMGP</Button>
          <Button size="sm" variant={page === "lock" ? "primary" : "clear"} onClick={() => setPage(page === "lock" ? undefined : "lock")} type="button">Lock yMGP</Button>
          {balances.lyMGP > 0n && <Button size="sm" variant={page === "unlock" ? "primary" : "clear"} onClick={() => setPage(page === "unlock" ? undefined : "unlock")} type="button">Unlock yMGP</Button>}
          {balances.yMGP > 0n && <Button size="sm" variant={page === "redeemYMGP" ? "primary" : "clear"} onClick={() => setPage(page === "redeemYMGP" ? undefined : "redeemYMGP")} type="button">Redeem yMGP</Button>}
        </div>
        <div className="flex h-min flex-row-reverse">
          <div className="flex gap-1">
            <YieldBadge apy={aprToApy(rewards.mgpAPR) * 0.9} asset="yMGP" breakdown={[{ apy: aprToApy(rewards.mgpAPR) * 0.9, asset: "rMGP", logo: coins.rMGP.icon }]} logo={coins.yMGP.icon} />
            <YieldBadge apy={Number(locked.reefiMGP) * aprToApy(rewards.mgpAPR) * 0.05 / Number(locked.yMGP) + aprToApy(rewards.mgpAPR) * 0.9} asset="Locked yMGP" breakdown={[{ apy: aprToApy(rewards.mgpAPR) * 0.9, asset: "rMGP", logo: coins.rMGP.icon }, { apr: Number(locked.reefiMGP) * rewards.mgpAPR * 0.05 / Number(locked.yMGP), asset: "Boosted vlMGP", logo: vlMGP }, { asset: "yMGP Withdraws", value: "Variable", logo: coins.yMGP.icon }]} suffix='+' logo={coins.yMGP.icon} />
          </div>
        </div>
      </div>
      {page === "convert" && <GetYMGPPage balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} buyYMGP={buyYMGP} depositRMGP={depositRMGP} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} />}
      {page === "lock" && <LockPage ymgpBalance={balances.yMGP} setSend={updateAmounts.send} send={amounts.send} lockYMGP={lockYMGP} mgpAPR={rewards.mgpAPR} reefiLockedMGP={locked.reefiMGP} ymgpLocked={locked.yMGP} />}
      {page === "unlock" && <UnlockPage sendAmount={amounts.send} setSendAmount={updateAmounts.send} unlockYMGP={unlockYMGP} lymgpBalance={balances.lyMGP} />}
      {page === "redeemYMGP" && <RedeemYMGPPage buyRMGP={buyRMGP} redeemYMGP={() => redeemYMGP} withdrawMGP={withdrawMGP} unlockSchedule={withdraws.unlockSchedule} balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} userPendingWithdraws={withdraws.userPending} userWithdrawable={withdraws.userWithdrawable} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} />}
      <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
      <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
        <div className="flex rounded-lg bg-gray-700 p-1">
          <Button size="sm" variant={page === "getVMGP" ? "primary" : "clear"} onClick={() => setPage(page === "getVMGP" ? undefined : "getVMGP")} type="button">Get vMGP</Button>
          <Button size="sm" variant={page === "lockVMGP" ? "primary" : "clear"} onClick={() => setPage(page === "lockVMGP" ? undefined : "lockVMGP")} type="button">Lock vMGP</Button>
          {balances.lvMGP !== 0n && <Button size="sm" variant={page === "unlockVMGP" ? "primary" : "clear"} onClick={() => setPage(page === "unlockVMGP" ? undefined : "unlockVMGP")} type="button">Unlock vMGP</Button>}
        </div>
        <div className="flex h-min flex-row-reverse">
          <div className="flex gap-1">
            <Badge title="Vote Multiplier" value={`${formatNumber(Number(locked.reefiMGP) / Number(supplies.vMGP), 2)}x`} breakdown={[{ asset: "Reefi's vlMGP", logo: vlMGP, value: formatNumber(formatEther(locked.reefiMGP)) }, { asset: "Votable vMGP", value: formatNumber(formatEther(supplies.vMGP)), logo: coins.vMGP.icon }]} />
          </div>
        </div>
      </div>
      {page === "getVMGP" && <GetVMGPPage balances={balances} setSend={updateAmounts.send} send={amounts.send} prices={prices} ymgpMgpCurveRate={exchangeRates.ymgpMGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} mgpRmgpCurveAmount={amounts.curve.mgpRmgp} rmgpYmgpCurveAmount={amounts.curve.rmgpYmgp} rmgpMgpCurveAmount={amounts.curve.rmgpMgp} mgpYmgpCurveAmount={amounts.curve.mgpYmgp} ymgpRmgpCurveAmount={amounts.curve.ymgpRmgp} ymgpMgpCurveAmount={amounts.curve.ymgpMgp} allowances={allowances} sendAmount={amounts.send} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} buyVMGP={() => buyVMGP()} mintVMGP={() => mintVMGP()} lockedReefiMGP={locked.reefiMGP} rmgpSupply={supplies.rMGP} ymgpVmgpCurveAmount={amounts.send} />}
      {page === "lockVMGP" && <LockVMGPPage vmgpBalance={balances.vMGP} setSend={updateAmounts.send} send={amounts.send} lockYMGP={() => lockVMGP()} mgpAPR={rewards.mgpAPR} />}
      {page === "unlockVMGP" && <UnlockVMGPPage sendAmount={amounts.send} setSendAmount={updateAmounts.send} unlockVMGP={() => unlockVMGP()} lvmgpBalance={balances.lvMGP} />}
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
                {
                  apy: 0,
                  asset: `${(100 * Number(balances.curveMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) / (Number(balances.curveMGP) + Number(balances.curveRMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) + Number(balances.curveYMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP))).toFixed(0)}% MGP`,
                  logo: coins.MGP.icon
                },
                {
                  apy: aprToApy(rewards.mgpAPR) * 0.9,
                  asset: `${(100 * Number(balances.curveRMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) / (Number(balances.curveMGP) + Number(balances.curveRMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) + Number(balances.curveYMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP))).toFixed(0)}% rMGP`,
                  logo: coins.rMGP.icon
                },
                {
                  apy: aprToApy(rewards.mgpAPR) * 0.9,
                  asset: `${(100 * Number(balances.curveYMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) / (Number(balances.curveMGP) + Number(balances.curveRMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP) + Number(balances.curveYMGP) * Number(locked.reefiMGP) / Number(supplies.rMGP))).toFixed(0)}% yMGP`,
                  logo: coins.yMGP.icon
                },
                {
                  apy: rewards.cmgpPoolAPY,
                  asset: "Swap Fees",
                  logo: coins.cMGP.icon
                }
              ]}
              logo={coins.cMGP.icon}
            />
          </div>
        </div>
      </div>
      {page === "supplyLiquidity" && <SupplyLiquidityPage mgpBalance={balances.MGP} rmgpBalance={balances.rMGP} ymgpBalance={balances.yMGP} mgpCurveBalance={balances.curveMGP} rmgpCurveBalance={balances.curveRMGP} ymgpCurveBalance={balances.curveYMGP} setMgpLPAmount={updateAmounts.lp.MGP} mgpLPAmount={amounts.lp.MGP} rmgpLPAmount={amounts.lp.rMGP} ymgpLPAmount={amounts.lp.yMGP} setRmgpLPAmount={updateAmounts.lp.rMGP} setYmgpLPAmount={updateAmounts.lp.yMGP} supplyLiquidity={supplyLiquidity} />}
    </Card>
    <QASection />
    <div className="flex gap-6">
      <PegCard token="rMGP" targetToken="MGP" spread={100 / exchangeRates.mgpRMGP / exchangeRates.rmgpMGP - 100}
        rates={[
          { label: "Mint", value: Number(locked.reefiMGP) / Number(supplies.rMGP), color: "green", required: true },
          { label: "Buy", value: 1 / exchangeRates.mgpRMGP, color: "blue", required: true },
          { label: "Sell", value: exchangeRates.rmgpMGP, color: "red", required: true },
          { label: "Orig Mint", value: 1, color: "emerald" },
          { label: "Target", value: Number(supplies.rMGP) / Number(locked.reefiMGP) / (1 + aprToApy(rewards.mgpAPR) * (withdraws.unlockSchedule.length === 6 ? Number(withdraws.unlockSchedule[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2 : 60 * 60 * 24 * 30 * 2 / (60 * 60 * 24)) / 365), color: "purple", required: true }
        ]}
      />
      <PegCard token="yMGP" targetToken="rMGP" spread={100 / exchangeRates.rmgpYMGP / exchangeRates.ymgpRMGP - 100}
        rates={[
          { label: "Mint", value: 1, color: "green", required: true },
          { label: "Buy", value: 1 / exchangeRates.rmgpYMGP, color: "blue", required: true },
          { label: "Sell", value: exchangeRates.ymgpRMGP, color: "red", required: true },
          { label: "Burn", value: 0.75, color: "purple", required: true }
        ]} />
    </div>
    <Contracts chain={chain} />
  </>;
};

const AppContent = (): ReactElement => {
  const [page, setPage] = useState<Pages | undefined>("buyVotes");
  const [error, setError] = useState("");
  const { wallet: { ens, chain, account, isConnecting, setChain, connectWallet, connectRequired }, balances } = useGlobalContext();
  return <div className="flex h-screen bg-gray-900 text-white">
    <ConnectWallet connectRequired={connectRequired} isConnecting={isConnecting} connectWallet={connectWallet} />
    <ErrorCard error={error} setError={setError} />
    <div className="grow overflow-auto">
      <Header ens={ens} chain={chain} page={page} setPage={setPage} account={account} isConnecting={isConnecting} setChain={setChain} connectWallet={connectWallet} mgpBalance={balances.MGP} rmgpBalance={balances.rMGP} ymgpBalance={balances.yMGP} cmgpBalance={balances.cMGP} />
      <div className="flex flex-col gap-6 p-4 md:mx-16 md:p-6 lg:mx-24 xl:mx-28">
        <Content page={page} setPage={setPage} error={error} setError={setError} />
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
