/*
 * TODO: Dont call vlMGP directly in rMGP, instead make a lockManager to allow for rMGP upgrades.
 * TODO: ERC4626 support
 * TODO: reefi priority queue. withdraw slot 1 is free, 2: 10 MGP, 3: 100 MGP, 4: 500 MGP, 5: 1000 MGP, 6: 10000 MGP. if lets say 4 withdraw slots are being used, but user only wants to pay when it costs 100 MGP, they can join the queue and be included next time theres only 2 slots being used.
 * TODO: tokenise each rmgp->mgp withdraw batch with like wmgp-aug-4, that slowly regains its peg with fixed interest
 * TODO: make buttons load during action
 * TODO: page urls
 * TODO: Start with deposit limit, airdrop 1 REEFI for 1 MGP deposited
 */

import vlMGP from "../public/icons/vlMGP.png";

import { aprToApy, formatEther, formatNumber } from "./utilities";
import { coins } from "./config/contracts";
import { useReefiState } from "./state/useReefiState";
import { useState, useEffect, useMemo } from "react";

import { Badge, YieldBadge } from "./components/YieldBadge";
import { BridgePage } from "./pages/BridgePage";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { ClaimVMGPYield } from "./pages/ClaimVMGPYield";
import { ClaimYield } from "./pages/ClaimYMGPYield";
import { CompoundYield } from "./pages/CompoundYield";
import { ConnectWallet } from "./components/ConnectWallet";
import { Contracts } from "./components/Contracts";
import { Documentation } from "./components/Documentation";
import { ErrorCard } from "./components/ErrorCard";
import { Features } from "./components/Features";
import { FixedYieldPage } from "./pages/FixedYieldPage";
import { GetMGPPage } from "./pages/GetMGPPage";
import { GetRMGPPage } from "./pages/GetRMGPPage";
import { GetVMGPPage } from "./pages/GetVMGPPage";
import { GetWRMGPPage } from "./pages/GetWRMGP";
import { GetYMGPPage } from "./pages/GetYMGPPage";
import { Header } from "./components/Header";
import { LockPage } from "./pages/LockYMGPPage";
import { LockVMGPPage } from "./pages/LockVMGPPage";
import { MigrateVLMGPPage } from "./pages/MigrateVLMGPPage";
import { NotificationCard } from "./components/NotificationCard";
import PegCard from "./components/PegCard";
import { QASection } from "./components/Questions";
import { RedeemRMGPPage } from "./pages/RedeemRMGPPage";
import { RedeemYMGPPage } from "./pages/RedeemYMGPPage";
import { SupplyLiquidityPage } from "./pages/SupplyLiquidityPage";
import { TokenCards } from "./components/TokenCards";
import { UnlockPage } from "./pages/UnlockYMGPPage";
import { UnlockVMGPPage } from "./pages/UnlockVMGPPage";
import { UnwrapWRMGPPage } from "./pages/UnwrapWRMGP";
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

export type Pages = "getMGP" | "deposit" | "convert" | "lock" | "buyVotes" | "supplyLiquidity" | "unlock" | "redeem" | "claim" | "vote" | "redeemYMGP" | "fixedYield" | "getVMGP" | "lockVMGP" | "bridge" | "unlockVMGP" | "documentation" | "migrateVLMGP";

const App = () => {
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [page, setPage] = useState<Pages | undefined>(window.location.pathname.replace("/", "") as Pages | null ?? "buyVotes");
  const { actions, allowances, balances, rewards, exchangeRates, supplies, prices, amounts, amountsActions, wallet, updateWallet, withdraws } = useReefiState({ setError, setNotification });

  const lockedYmgpAPY = useMemo(() => Number(balances.rMGP.MGP) * aprToApy(rewards.vlmgpAPR) * 0.05 / Number(balances.user.lyMGP) + aprToApy(rewards.vlmgpAPR) * 0.9, [balances.rMGP.MGP, rewards.vlmgpAPR, balances.user.lyMGP]);

  const calculateFixedYield = () => {
    const burnRate = Number(balances.rMGP.MGP) / Number(supplies.rMGP);
    const fixedYieldPercent = (exchangeRates.mgpRMGP / burnRate - 1) * 100;
    const withdrawalTime = withdraws.reefi.unlockSchedule.length === 6 ? Number(withdraws.reefi.unlockSchedule[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2 : 60 * 60 * 24 * 30 * 2;
    const daysToWithdraw = withdrawalTime / (60 * 60 * 24);
    return `${(fixedYieldPercent / 100 * (365 / daysToWithdraw) * 100).toFixed(2)}%`;
  };

  useEffect(() => {
    history.pushState(undefined, "", page ?? "./");
  }, [page]);

  return <>
    <ErrorCard error={error} setError={setError} />
    <NotificationCard notification={notification} setNotification={setNotification} />
    <div className="flex h-screen bg-gray-900 text-white">
      <ConnectWallet connectRequired={wallet.connectionRequired} isConnecting={wallet.isConnecting} connectWallet={updateWallet.connectWallet} />
      <ErrorCard error={error} setError={setError} />
      <div className="grow overflow-auto">
        <Header ens={wallet.ens} chain={wallet.chain} page={page} setPage={setPage} account={wallet.account} isConnecting={wallet.isConnecting} setChain={updateWallet.setChain} connectWallet={updateWallet.connectWallet} mgpBalance={balances.user.MGP} rmgpBalance={balances.user.rMGP} ymgpBalance={balances.user.yMGP} cmgpBalance={balances.user.cMGP} />
        <div className="flex flex-col gap-6 p-4 md:mx-16 md:p-6 lg:mx-24 xl:mx-28">
          {(() => {
            if (page === "documentation") return <Documentation />;

            if (page === "claim") return <div className="flex flex-col h-screen bg-gray-900 text-white">
              <ConnectWallet connectRequired={wallet.connectionRequired} isConnecting={wallet.isConnecting} connectWallet={updateWallet.connectWallet} />
              <ErrorCard error={error} setError={setError} />
              <Card>
                <CompoundYield uncompoundedMGPYield={rewards.reefi.vlMGP.estimatedMGP} uncompoundedYMGPYield={formatEther(rewards.reefi.vlMGP.estimatedYMGP)} estimatedCompoundGasFee={rewards.reefi.vlMGP.estimatedGas} pendingRewards={rewards.reefi.vlMGP.pendingRewards} mgpAPR={rewards.vlmgpAPR} reefiMGPLocked={balances.rMGP.MGP} prices={prices} compoundRMGP={actions.compoundRMGP} />
              </Card>
              <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Claim yMGP Rewards</h2>
                  <ClaimYield claimYMGPRewards={actions.claimYMGPRewards} lockedYMGP={supplies.lyMGP} unclaimedUserYield={rewards.user.lyMGP} uncompoundedMGPYield={rewards.reefi.vlMGP.estimatedMGP} userLockedYMGP={balances.user.lyMGP} ymgpHoldings={balances.yMGP.rMGP} ymgpSupply={supplies.yMGP} />
                </Card>
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Claim vMGP Rewards</h2>
                  <ClaimVMGPYield claimVMGPRewards={actions.claimVMGPRewards} unclaimedUserVMGPYield={rewards.user.lvMGP} vmgpHoldings={balances.vMGP.yMGP} />
                </Card>
              </div>
            </div>;

            if (page === "vote") return <div className="flex flex-col h-screen bg-gray-900 text-white">
              <ConnectWallet connectRequired={wallet.connectionRequired} isConnecting={wallet.isConnecting} connectWallet={updateWallet.connectWallet} />
              <ErrorCard error={error} setError={setError} />
              <VotePage vmgpBalance={balances.user.vMGP} vmgpSupply={supplies.vMGP} lvmgpSupply={supplies.lvMGP} reefiMgpLocked={balances.rMGP.MGP} onVote={actions.onVote} ymgpBalance={balances.user.yMGP} />
            </div>;

            if (page === "bridge") return <div className="flex flex-col h-screen bg-gray-900 text-white">
              <ConnectWallet connectRequired={wallet.connectionRequired} isConnecting={wallet.isConnecting} connectWallet={updateWallet.connectWallet} />
              <ErrorCard error={error} setError={setError} />
              <Card>
                <h2 className="mb-4 text-xl font-bold">Bridge wrMGP</h2>
                <BridgePage />
              </Card>
              <div className="grid grid-cols-1 gap-6 pb-6 mt-6 lg:grid-cols-2">
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Wrap rMGP</h2>
                  <GetWRMGPPage balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} chain={wallet.chain} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} />
                </Card>
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Unwrap wrMGP</h2>
                  <UnwrapWRMGPPage balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} chain={wallet.chain} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} />
                </Card>
              </div>
            </div>;

            return <>
              <TokenCards mgpLocked={supplies.vlMGP} mgpPrice={prices.MGP} mgpSupply={supplies.MGP} rmgpSupply={supplies.rMGP} ymgpSupply={supplies.yMGP} ymgpLocked={supplies.lyMGP} reefiMGPLocked={balances.rMGP.MGP} mgpRmgpCurveRate={exchangeRates.mgpRMGP} rmgpYmgpCurveRate={exchangeRates.rmgpYMGP} ymgpVmgpCurveRate={exchangeRates.ymgpVMGP} vmgpSupply={supplies.vMGP} />
              <Features mgpAPR={rewards.vlmgpAPR} lockedYmgpAPY={lockedYmgpAPY} mgpPrice={prices.MGP} vmgpSupply={supplies.vMGP} reefiLockedMGP={balances.rMGP.MGP} vmgpMGPCurveRate={0.5} />
              <div className="rounded-xl border border-dashed border-yellow-700 bg-gray-900/80 p-4">
                <h3 className="mb-2 text-lg font-semibold text-yellow-400">⚠️ Important Notice</h3>
                <p className="text-sm text-gray-300">Reefi is in <strong>very early beta</strong>. Please only deposit small amounts that you can afford to lose. The protocol may contain unknown bugs and should be used with caution</p>
              </div>
              <Card>
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button size="sm" variant={page === "getMGP" ? "primary" : "clear"} onClick={() => setPage(page === "getMGP" ? undefined : "getMGP")} type="button" tooltip="Buy the Magpie governance token">Get MGP</Button>
                    {balances.user.vlMGP > 0n && <Button size="sm" variant={page === "migrateVLMGP" ? "primary" : "clear"} onClick={() => setPage(page === "migrateVLMGP" ? undefined : "migrateVLMGP")} type="button" tooltip="Unlock your illiquid vlMGP">Migrate vlMGP</Button>}
                    <Button size="sm" variant={page === "deposit" ? "primary" : "clear"} onClick={() => setPage(page === "deposit" ? undefined : "deposit")} type="button" tooltip="Deposit your Magpie and earn auto compounded & liquid yield">Get rMGP</Button>
                    {balances.user.rMGP > 0n && <Button size="sm" variant={page === "redeem" ? "primary" : "clear"} onClick={() => setPage(page === "redeem" ? undefined : "redeem")} type="button" tooltip="Withdraw the underlying MGP from rMGP">Withdraw MGP</Button>}
                    <Button size="sm" variant={page === "fixedYield" ? "primary" : "clear"} onClick={() => setPage(page === "fixedYield" ? undefined : "fixedYield")} type="button" tooltip="Earn fixed interest by buying depegged rMGP and redeeming">Fixed Yield</Button>
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <YieldBadge apr={rewards.vlmgpAPR} asset="Locked MGP" breakdown={[{ apr: rewards.vlmgpAPR, asset: "vlMGP", logo: vlMGP }]} logo={vlMGP} />
                      <YieldBadge apy={aprToApy(rewards.vlmgpAPR) * 0.9} asset="rMGP" breakdown={[{ apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: "vlMGP", logo: vlMGP }]} logo={coins.rMGP.icon} />
                      <YieldBadge value={calculateFixedYield()} asset="rMGP Fixed Yield" breakdown={[{ value: `${((exchangeRates.mgpRMGP / (Number(balances.rMGP.MGP) / Number(supplies.rMGP)) - 1) * 100).toFixed(2)}%`, asset: "rMGP Discount", logo: coins.rMGP.icon }]} logo={coins.rMGP.icon} />
                    </div>
                  </div>
                </div>
                {page === "migrateVLMGP" && <MigrateVLMGPPage balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} chain={wallet.chain} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} curveAmounts={amounts.curve} supplies={supplies} curveBuy={actions.curveBuy} nativeSwap={actions.unlockVLMGP} />}
                {page === "getMGP" && <GetMGPPage mgpAPR={rewards.vlmgpAPR} balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} chain={wallet.chain} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} curveAmounts={amounts.curve} supplies={supplies} curveBuy={actions.curveBuy} />}
                {page === "deposit" && <GetRMGPPage mgpAPR={rewards.vlmgpAPR} depositMGP={actions.depositMGP} balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} chain={wallet.chain} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} curveBuy={actions.curveBuy} nativeSwap={actions.depositMGP} curveAmounts={amounts.curve} supplies={supplies} />}
                {page === "redeem" && <RedeemRMGPPage withdrawMGP={actions.withdrawMGP} unlockSchedule={withdraws.reefi.unlockSchedule} balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} userPendingWithdraws={withdraws.user.pending} userWithdrawable={withdraws.user.ready} chain={wallet.chain} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} curveAmounts={amounts.curve} supplies={supplies} curveBuy={actions.curveBuy} nativeSwap={actions.withdrawMGP} />}
                {page === "fixedYield" && <FixedYieldPage mgpAPR={rewards.vlmgpAPR} balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} chain={wallet.chain} rmgpSupply={supplies.rMGP} unlockSchedule={withdraws.reefi.unlockSchedule} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} curveAmounts={amounts.curve} supplies={supplies} curveBuy={actions.curveBuy} nativeSwap={actions.nativeSwap} />}
                <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button size="sm" variant={page === "convert" ? "primary" : "clear"} onClick={() => setPage(page === "convert" ? undefined : "convert")} type="button" tooltip="Convert your rMGP for yMGP for better yield potential">Get yMGP</Button>
                    <Button size="sm" variant={page === "lock" ? "primary" : "clear"} onClick={() => setPage(page === "lock" ? undefined : "lock")} type="button" tooltip="Lock your yMGP for boosted yield">Lock yMGP</Button>
                    {balances.user.lyMGP > 0n && <Button size="sm" variant={page === "unlock" ? "primary" : "clear"} onClick={() => setPage(page === "unlock" ? undefined : "unlock")} type="button" tooltip="Withdraw your yMGP from the locker">Unlock yMGP</Button>}
                    {balances.user.yMGP > 0n && <Button size="sm" variant={page === "redeemYMGP" ? "primary" : "clear"} onClick={() => setPage(page === "redeemYMGP" ? undefined : "redeemYMGP")} type="button" tooltip="Convert your yMGP back to rMGP">Redeem yMGP</Button>}
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <YieldBadge apy={aprToApy(rewards.vlmgpAPR) * 0.9} asset="yMGP" breakdown={[{ apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: "rMGP", logo: coins.rMGP.icon }]} logo={coins.yMGP.icon} />
                      <YieldBadge apy={Number(balances.rMGP.MGP) * aprToApy(rewards.vlmgpAPR) * 0.05 / Number(supplies.lyMGP) + aprToApy(rewards.vlmgpAPR) * 0.9} asset="Locked yMGP" breakdown={[{ apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: "rMGP", logo: coins.rMGP.icon }, { apr: Number(balances.rMGP.MGP) * rewards.vlmgpAPR * 0.05 / Number(supplies.lyMGP), asset: "Boosted vlMGP", logo: vlMGP }, { asset: "yMGP Withdraws", value: "Variable", logo: coins.yMGP.icon }]} suffix='+' logo={coins.yMGP.icon} />
                    </div>
                  </div>
                </div>
                {page === "convert" && <GetYMGPPage balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} chain={wallet.chain} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} curveAmounts={amounts.curve} supplies={supplies} curveBuy={actions.curveBuy} nativeSwap={actions.depositRMGP} />}
                {page === "lock" && <LockPage ymgpBalance={balances.user.yMGP} setSend={amountsActions.setSend} send={amounts.send} lockYMGP={actions.lockYMGP} mgpAPR={rewards.vlmgpAPR} reefiLockedMGP={balances.rMGP.MGP} ymgpLocked={supplies.lyMGP} />}
                {page === "unlock" && <UnlockPage send={amounts.send} setSendAmount={amountsActions.setSend} unlockYMGP={actions.unlockYMGP} lymgpBalance={balances.user.lyMGP} />}
                {page === "redeemYMGP" && <RedeemYMGPPage withdrawMGP={actions.withdrawMGP} unlockSchedule={withdraws.reefi.unlockSchedule} balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} userPendingWithdraws={withdraws.user.pending} userWithdrawable={withdraws.user.ready} chain={wallet.chain} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} curveAmounts={amounts.curve} supplies={supplies} curveBuy={actions.curveBuy} nativeSwap={actions.redeemRMGP} />}
                <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button size="sm" variant={page === "getVMGP" ? "primary" : "clear"} onClick={() => setPage(page === "getVMGP" ? undefined : "getVMGP")} type="button" tooltip="Buy lifetime boosted voting rights">Get vMGP</Button>
                    <Button size="sm" variant={page === "lockVMGP" ? "primary" : "clear"} onClick={() => setPage(page === "lockVMGP" ? undefined : "lockVMGP")} type="button" tooltip="Earn yield by selling individual votes">Lock vMGP</Button>
                    {balances.user.lvMGP !== 0n && <Button size="sm" variant={page === "unlockVMGP" ? "primary" : "clear"} onClick={() => setPage(page === "unlockVMGP" ? undefined : "unlockVMGP")} type="button" tooltip="Withdraw your vMGP from the locker">Unlock vMGP</Button>}
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <Badge title="Vote Multiplier" value={`${formatNumber(Number(balances.rMGP.MGP) / Number(supplies.vMGP), 2)}x`} breakdown={[{ asset: "Reefi's vlMGP", logo: vlMGP, value: formatNumber(formatEther(balances.rMGP.MGP)) }, { asset: "Votable vMGP", value: formatNumber(formatEther(supplies.vMGP)), logo: coins.vMGP.icon }]} />
                    </div>
                  </div>
                </div>
                {page === "getVMGP" && <GetVMGPPage balances={balances} setSend={amountsActions.setSend} send={amounts.send} allowances={allowances} chain={wallet.chain} approve={actions.approve} mintWETH={actions.mintWETH} swap={actions.swap} curveAmounts={amounts.curve} supplies={supplies} curveBuy={actions.curveBuy} nativeSwap={actions.nativeSwap} />}
                {page === "lockVMGP" && <LockVMGPPage vmgpBalance={balances.user.vMGP} setSend={amountsActions.setSend} send={amounts.send} mgpAPR={rewards.vlmgpAPR} />}
                {page === "unlockVMGP" && <UnlockVMGPPage send={amounts.send} setSendAmount={amountsActions.setSend} unlockVMGP={actions.unlockVMGP} lvmgpBalance={balances.user.lvMGP} />}
                <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button size="sm" variant={page === "supplyLiquidity" ? "primary" : "clear"} onClick={() => setPage(page === "supplyLiquidity" ? undefined : "supplyLiquidity")} type="button" tooltip="Become a Curve LP and earn additional LP yield">Supply Liquidity</Button>
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <YieldBadge
                        apy={rewards.cmgpPoolAPY + aprToApy(rewards.vlmgpAPR) * 0.9 * Number(balances.curve.rMGP + balances.curve.yMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP) / (Number(balances.curve.MGP) + Number(balances.curve.rMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP) + Number(balances.curve.yMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP))}
                        asset="cMGP"
                        breakdown={[
                          { apy: 0, asset: `${(100 * Number(balances.curve.MGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP) / (Number(balances.curve.MGP) + Number(balances.curve.rMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP) + Number(balances.curve.yMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP))).toFixed(0)}% MGP`, logo: coins.MGP.icon },
                          { apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: `${(100 * Number(balances.curve.rMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP) / (Number(balances.curve.MGP) + Number(balances.curve.rMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP) + Number(balances.curve.yMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP))).toFixed(0)}% rMGP`, logo: coins.rMGP.icon },
                          { apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: `${(100 * Number(balances.curve.yMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP) / (Number(balances.curve.MGP) + Number(balances.curve.rMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP) + Number(balances.curve.yMGP) * Number(balances.rMGP.MGP) / Number(supplies.rMGP))).toFixed(0)}% yMGP`, logo: coins.yMGP.icon },
                          { apy: rewards.cmgpPoolAPY, asset: "Swap Fees", logo: coins.cMGP.icon }
                        ]}
                        logo={coins.cMGP.icon}
                      />
                    </div>
                  </div>
                </div>
                {page === "supplyLiquidity" && <SupplyLiquidityPage mgpBalance={balances.user.MGP} rmgpBalance={balances.user.rMGP} ymgpBalance={balances.user.yMGP} mgpCurveBalance={balances.curve.MGP} rmgpCurveBalance={balances.curve.rMGP} ymgpCurveBalance={balances.curve.yMGP} setLPAmounts={amountsActions.setLP} mgpLPAmount={amounts.lp.MGP} rmgpLPAmount={amounts.lp.rMGP} ymgpLPAmount={amounts.lp.yMGP} supplyLiquidity={actions.supplyLiquidity} />}
              </Card>
              <QASection />
              <div className="flex gap-6">
                <PegCard token="rMGP" targetToken="MGP" spread={100 / exchangeRates.mgpRMGP / exchangeRates.rmgpMGP - 100}
                  rates={[
                    { label: "Mint", value: Number(balances.rMGP.MGP) / Number(supplies.rMGP), color: "green", required: true },
                    { label: "Buy", value: 1 / exchangeRates.mgpRMGP, color: "blue", required: true },
                    { label: "Sell", value: exchangeRates.rmgpMGP, color: "red", required: true },
                    { label: "Orig Mint", value: 1, color: "emerald" },
                    { label: "Target", value: Number(supplies.rMGP) / Number(balances.rMGP.MGP) / (1 + aprToApy(rewards.vlmgpAPR) * (withdraws.reefi.unlockSchedule.length === 6 ? Number(withdraws.reefi.unlockSchedule[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2 : 60 * 60 * 24 * 30 * 2 / (60 * 60 * 24)) / 365), color: "purple", required: true }
                  ]}
                />
                <PegCard token="yMGP" targetToken="rMGP" spread={100 / exchangeRates.rmgpYMGP / exchangeRates.ymgpRMGP - 100}
                  rates={[
                    { label: "Mint", value: 1, color: "green", required: true },
                    { label: "Buy", value: 1 / exchangeRates.rmgpYMGP, color: "blue", required: true },
                    { label: "Sell", value: exchangeRates.ymgpRMGP, color: "red", required: true },
                    { label: "Burn", value: 0.75, color: "purple", required: true }
                  ]} />
                <PegCard token="vMGP" targetToken="yMGP" spread={100 / exchangeRates.ymgpVMGP / exchangeRates.vmgpYMGP - 100}
                  rates={[
                    { label: "Mint", value: 1, color: "green", required: true },
                    { label: "Buy", value: 1 / exchangeRates.ymgpVMGP, color: "blue", required: true },
                    { label: "Sell", value: exchangeRates.vmgpYMGP, color: "red", required: true },
                    { label: "Burn", value: 0, color: "purple", required: true }
                  ]} />
              </div>
              <Contracts chain={wallet.chain} />
            </>;
          })()}
        </div>
      </div>
    </div>
  </>;
};
export default App;
