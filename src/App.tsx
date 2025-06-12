/*
 * TODO: Dont call vlMGP directly in wstMGP, instead make a lockManager to allow for wstMGP upgrades.
 * TODO: ERC4626 support
 * TODO: reefi priority queue. withdraw slot 1 is free, 2: 10 MGP, 3: 100 MGP, 4: 500 MGP, 5: 1000 MGP, 6: 10000 MGP. if lets say 4 withdraw slots are being used, but user only wants to pay when it costs 100 MGP, they can join the queue and be included next time theres only 2 slots being used.
 * TODO: tokenise each rmgp->mgp withdraw batch with like wmgp-aug-4, that slowly regains its peg with fixed interest
 * TODO: make buttons load during action
 * TODO: page urls in docs
 * TODO: Start with deposit limit, airdrop 1 REEFI for 1 MGP deposited
 * TODO: Create new rMGP coin worth 200 MGP (~$10). Mint rMGP 200:1 for yMGP yield, then dump yMGP for rMGP on curve.
 * TODO: Merge docs and q&a
 */

import vlMGP from "../public/icons/vlMGP.png";

import { aprToApy, formatEther, formatNumber } from "./utilities";
import { coins } from "./config/contracts";
import { useActions } from "./state/useActions";
import { useChainId } from "wagmi";
import { useReefiState } from "./state/useReefiState";
import { useState, useMemo, useEffect } from "react";

import { Badge, YieldBadge } from "./components/YieldBadge";
import { BridgePage } from "./pages/BridgePage";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { ClaimVMGPYield } from "./pages/ClaimVMGPYield";
import { ClaimYield } from "./pages/ClaimYMGPYield";
import { CompoundYield } from "./pages/CompoundYield";
import { Contracts } from "./components/Contracts";
import { Documentation } from "./pages/Documentation";
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
import { UnwrapWSTMGPPage } from "./pages/UnwrapWSTMGPPage";
import { VotePage } from "./pages/VotePage";
import { WrapSTMGPPage } from "./pages/WrapSTMGPPage";

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

export type Pages = "getMGP" | "deposit" | "convert" | "lock" | "buyVotes" | "supplyLiquidity" | "unlock" | "redeem" | "claim" | "vote" | "redeemYMGP" | "fixedYield" | "getVMGP" | "lockVMGP" | "bridge" | "unlockVMGP" | "documentation" | "migrateVLMGP";

const App = () => {
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [page, setPage] = useState<Pages | undefined>((window.location.pathname.replace("/", "") as Pages | null) ?? "deposit");
  const chain = useChainId();

  const { amounts, amountsActions, allowances, balances, exchangeRates, supplies, rewards, withdraws, prices } = useReefiState();
  const actions = useActions({ amounts, allowances, setError, setNotification });

  const lockedYmgpAPY = useMemo(() => Number(balances.wstMGP.MGP) * aprToApy(rewards.vlmgpAPR) * 0.05 / Number(balances.user.lyMGP) + aprToApy(rewards.vlmgpAPR) * 0.9, [balances.wstMGP.MGP, rewards.vlmgpAPR, balances.user.lyMGP]);

  const calculateFixedYield = () => {
    const burnRate = Number(balances.wstMGP.MGP) / Number(supplies.wstMGP);
    const fixedYieldPercent = (exchangeRates.MGP.wstMGP / burnRate - 1) * 100;
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
      {/* <ConnectWallet connectRequired={wallet.connectionRequired} connectWallet={updateWallet.connectWallet} isConnecting={wallet.isConnecting} /> */}
      <div className="grow overflow-auto">
        <Header cmgpBalance={balances.user.cMGP} mgpBalance={balances.user.MGP} page={page} rmgpBalance={balances.user.wstMGP} setPage={setPage} ymgpBalance={balances.user.yMGP} />
        <div className="flex flex-col gap-6 p-4 md:mx-16 md:p-6 lg:mx-24 xl:mx-28">
          {(() => {
            if (page === "documentation") return <Documentation />;

            if (page === "claim") return <div className="flex flex-col h-screen bg-gray-900 text-white">
              <Card>
                <CompoundYield compoundRMGP={actions.compoundRMGP} estimatedCompoundGasFee={rewards.reefi.vlMGP.estimatedGas} mgpAPR={rewards.vlmgpAPR} pendingRewards={rewards.reefi.vlMGP.pendingRewards} prices={prices} reefiMGPLocked={balances.wstMGP.MGP} uncompoundedMGPYield={rewards.reefi.vlMGP.estimatedMGP} uncompoundedYMGPYield={formatEther(rewards.reefi.vlMGP.estimatedYMGP)} />
              </Card>
              <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Claim yMGP Rewards</h2>
                  <ClaimYield claimYMGPRewards={actions.claimYMGPRewards} lockedYMGP={supplies.lyMGP} unclaimedUserYield={rewards.user.lyMGP} uncompoundedMGPYield={rewards.reefi.vlMGP.estimatedMGP} userLockedYMGP={balances.user.lyMGP} ymgpHoldings={balances.yMGP.wstMGP} ymgpSupply={supplies.yMGP} />
                </Card>
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Claim vMGP Rewards</h2>
                  <ClaimVMGPYield claimVMGPRewards={actions.claimVMGPRewards} unclaimedUserVMGPYield={rewards.user.lvMGP} vmgpHoldings={balances.vMGP.yMGP} />
                </Card>
              </div>
            </div>;

            if (page === "vote") return <div className="flex flex-col h-screen bg-gray-900 text-white">
              <VotePage lvmgpSupply={supplies.lvMGP} reefiMgpLocked={balances.wstMGP.MGP} vmgpBalance={balances.user.vMGP} vmgpSupply={supplies.vMGP} vote={actions.vote} ymgpBalance={balances.user.yMGP} />
            </div>;

            if (page === "bridge") return <div className="flex flex-col h-screen bg-gray-900 text-white">
              <Card>
                <h2 className="mb-4 text-xl font-bold">Bridge stMGP</h2>
                <BridgePage />
              </Card>
              <div className="grid grid-cols-1 gap-6 pb-6 mt-6 lg:grid-cols-2">
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Unwrap wstMGP</h2>
                  <UnwrapWSTMGPPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} />
                </Card>
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Wrap stMGP</h2>
                  <WrapSTMGPPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} />
                </Card>
              </div>
            </div>;

            return <>
              <TokenCards mgpLocked={supplies.vlMGP} mgpPrice={prices.MGP} mgpRmgpCurveRate={exchangeRates.MGP.wstMGP} mgpSupply={supplies.MGP} reefiMGPLocked={balances.wstMGP.MGP} rmgpSupply={supplies.wstMGP} rmgpYmgpCurveRate={exchangeRates.wstMGP.yMGP} vmgpSupply={supplies.vMGP} ymgpLocked={supplies.lyMGP} ymgpSupply={supplies.yMGP} ymgpVmgpCurveRate={exchangeRates.yMGP.vMGP} />
              <Features lockedYmgpAPY={lockedYmgpAPY} mgpAPR={rewards.vlmgpAPR} mgpPrice={prices.MGP} reefiLockedMGP={balances.wstMGP.MGP} vmgpMGPCurveRate={0.5} vmgpSupply={supplies.vMGP} />
              <div className="rounded-xl border border-dashed border-yellow-700 bg-gray-900/80 p-4">
                <h3 className="mb-2 text-lg font-semibold text-yellow-400">⚠️ Important Notice</h3>
                <p className="text-sm text-gray-300">Reefi is in very early beta. Please only deposit small amounts that you can afford to lose. The protocol may contain unknown bugs and should be used with caution.</p>
              </div>
              <Card>
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button onClick={() => setPage(page === "getMGP" ? undefined : "getMGP")} size="sm" tooltip="Buy the Magpie governance token" type="button" variant={page === "getMGP" ? "primary" : "clear"}>Get MGP</Button>
                    {balances.user.vlMGP > 0n && <Button onClick={() => setPage(page === "migrateVLMGP" ? undefined : "migrateVLMGP")} size="sm" tooltip="Unlock your illiquid vlMGP" type="button" variant={page === "migrateVLMGP" ? "primary" : "clear"}>Migrate vlMGP</Button>}
                    <Button onClick={() => setPage(page === "deposit" ? undefined : "deposit")} size="sm" tooltip="Deposit your Magpie and earn auto compounded & liquid yield" type="button" variant={page === "deposit" ? "primary" : "clear"}>Get wstMGP</Button>
                    {balances.user.wstMGP > 0n && <Button onClick={() => setPage(page === "redeem" ? undefined : "redeem")} size="sm" tooltip="Withdraw the underlying MGP from wstMGP" type="button" variant={page === "redeem" ? "primary" : "clear"}>Withdraw MGP</Button>}
                    <Button onClick={() => setPage(page === "fixedYield" ? undefined : "fixedYield")} size="sm" tooltip="Earn fixed interest by buying depegged wstMGP and redeeming" type="button" variant={page === "fixedYield" ? "primary" : "clear"}>Fixed Yield</Button>
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <YieldBadge apr={rewards.vlmgpAPR} asset="Locked MGP" breakdown={[{ apr: rewards.vlmgpAPR, asset: "vlMGP", logo: vlMGP }]} logo={vlMGP} />
                      <YieldBadge apy={aprToApy(rewards.vlmgpAPR) * 0.9} asset="wstMGP" breakdown={[{ apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: "vlMGP", logo: vlMGP }]} logo={coins.wstMGP.icon} />
                      <YieldBadge asset="wstMGP Fixed Yield" breakdown={[{ value: `${((exchangeRates.MGP.wstMGP / (Number(balances.wstMGP.MGP) / Number(supplies.wstMGP)) - 1) * 100).toFixed(2)}%`, asset: "wstMGP Discount", logo: coins.wstMGP.icon }]} logo={coins.wstMGP.icon} value={calculateFixedYield()} />
                    </div>
                  </div>
                </div>
                {page === "migrateVLMGP" && <MigrateVLMGPPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} />}
                {page === "getMGP" && <GetMGPPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mgpAPR={rewards.vlmgpAPR} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} />}
                {page === "deposit" && <GetRMGPPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mgpAPR={rewards.vlmgpAPR} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} />}
                {page === "redeem" && <RedeemRMGPPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} unlockSchedule={withdraws.reefi.unlockSchedule} userPendingWithdraws={withdraws.user.pending} userWithdrawable={withdraws.user.ready} withdrawMGP={actions.withdrawMGP} />}
                {page === "fixedYield" && <FixedYieldPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} lockedReefiMGP={balances.wstMGP.MGP} mgpAPR={rewards.vlmgpAPR} mgpRmgpCurveAmount={amounts.curve.MGP_wstMGP} mgpRmgpCurveRate={exchangeRates.MGP.wstMGP} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} rmgpSupply={supplies.wstMGP} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} unlockSchedule={withdraws.reefi.unlockSchedule} />}
                <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button onClick={() => setPage(page === "convert" ? undefined : "convert")} size="sm" tooltip="Convert your wstMGP for yMGP for better yield potential" type="button" variant={page === "convert" ? "primary" : "clear"}>Get yMGP</Button>
                    <Button onClick={() => setPage(page === "lock" ? undefined : "lock")} size="sm" tooltip="Lock your yMGP for boosted yield" type="button" variant={page === "lock" ? "primary" : "clear"}>Lock yMGP</Button>
                    {balances.user.lyMGP > 0n && <Button onClick={() => setPage(page === "unlock" ? undefined : "unlock")} size="sm" tooltip="Withdraw your yMGP from the locker" type="button" variant={page === "unlock" ? "primary" : "clear"}>Unlock yMGP</Button>}
                    {balances.user.yMGP > 0n && <Button onClick={() => setPage(page === "redeemYMGP" ? undefined : "redeemYMGP")} size="sm" tooltip="Convert your yMGP back to wstMGP" type="button" variant={page === "redeemYMGP" ? "primary" : "clear"}>Redeem yMGP</Button>}
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <YieldBadge apy={aprToApy(rewards.vlmgpAPR) * 0.9} asset="yMGP" breakdown={[{ apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: "wstMGP", logo: coins.wstMGP.icon }]} logo={coins.yMGP.icon} />
                      <YieldBadge apy={Number(balances.wstMGP.MGP) * aprToApy(rewards.vlmgpAPR) * 0.05 / Number(supplies.lyMGP) + aprToApy(rewards.vlmgpAPR) * 0.9} asset="Locked yMGP" breakdown={[{ apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: "wstMGP", logo: coins.wstMGP.icon }, { apr: Number(balances.wstMGP.MGP) * rewards.vlmgpAPR * 0.05 / Number(supplies.lyMGP), asset: "Boosted vlMGP", logo: vlMGP }, { asset: "yMGP Withdraws", value: "Variable", logo: coins.yMGP.icon }]} logo={coins.yMGP.icon} suffix="+" />
                    </div>
                  </div>
                </div>
                {page === "convert" && <GetYMGPPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} />}
                {page === "lock" && <LockPage mgpAPR={rewards.vlmgpAPR} nativeSwap={actions.nativeSwap} reefiLockedMGP={balances.wstMGP.MGP} send={amounts.send} setSend={amountsActions.setSend} ymgpBalance={balances.user.yMGP} ymgpLocked={supplies.lyMGP} />}
                {page === "unlock" && <UnlockPage lymgpBalance={balances.user.lyMGP} nativeSwap={actions.nativeSwap} send={amounts.send} setSendAmount={amountsActions.setSend} />}
                {page === "redeemYMGP" && <RedeemYMGPPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} unlockSchedule={withdraws.reefi.unlockSchedule} userPendingWithdraws={withdraws.user.pending} userWithdrawable={withdraws.user.ready} withdrawMGP={actions.withdrawMGP} />}
                <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button onClick={() => setPage(page === "getVMGP" ? undefined : "getVMGP")} size="sm" tooltip="Buy lifetime boosted voting rights" type="button" variant={page === "getVMGP" ? "primary" : "clear"}>Get vMGP</Button>
                    <Button onClick={() => setPage(page === "lockVMGP" ? undefined : "lockVMGP")} size="sm" tooltip="Earn yield by selling individual votes" type="button" variant={page === "lockVMGP" ? "primary" : "clear"}>Lock vMGP</Button>
                    {balances.user.lvMGP !== 0n && <Button onClick={() => setPage(page === "unlockVMGP" ? undefined : "unlockVMGP")} size="sm" tooltip="Withdraw your vMGP from the locker" type="button" variant={page === "unlockVMGP" ? "primary" : "clear"}>Unlock vMGP</Button>}
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <Badge breakdown={[{ asset: "Reefi's vlMGP", logo: vlMGP, value: formatNumber(formatEther(balances.wstMGP.MGP)) }, { asset: "Votable vMGP", value: formatNumber(formatEther(supplies.vMGP)), logo: coins.vMGP.icon }]} title="Vote Multiplier" value={`${formatNumber(Number(balances.wstMGP.MGP) / Number(supplies.vMGP), 2)}x`} />
                    </div>
                  </div>
                </div>
                {page === "getVMGP" && <GetVMGPPage allowances={allowances} approve={actions.approve} balances={balances} chain={chain} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} swap={actions.swap} />}
                {page === "lockVMGP" && <LockVMGPPage lockVMGP={actions.lockVMGP} mgpAPR={rewards.vlmgpAPR} send={amounts.send} setSend={amountsActions.setSend} vmgpBalance={balances.user.vMGP} />}
                {page === "unlockVMGP" && <UnlockVMGPPage lvmgpBalance={balances.user.lvMGP} send={amounts.send} setSendAmount={amountsActions.setSend} unlockVMGP={actions.unlockVMGP} />}
                <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button onClick={() => setPage(page === "supplyLiquidity" ? undefined : "supplyLiquidity")} size="sm" tooltip="Become a Curve LP and earn additional LP yield" type="button" variant={page === "supplyLiquidity" ? "primary" : "clear"}>Supply Liquidity</Button>
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <YieldBadge apy={rewards.cmgpPoolAPY + aprToApy(rewards.vlmgpAPR) * 0.9 * Number(balances.curve.wstMGP + balances.curve.yMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP) / (Number(balances.curve.MGP) + Number(balances.curve.wstMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP) + Number(balances.curve.yMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP))} asset="cMGP" breakdown={[{ apy: 0, asset: `${(100 * Number(balances.curve.MGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP) / (Number(balances.curve.MGP) + Number(balances.curve.wstMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP) + Number(balances.curve.yMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP))).toFixed(0)}% MGP`, logo: coins.MGP.icon }, { apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: `${(100 * Number(balances.curve.wstMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP) / (Number(balances.curve.MGP) + Number(balances.curve.wstMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP) + Number(balances.curve.yMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP))).toFixed(0)}% wstMGP`, logo: coins.wstMGP.icon }, { apy: aprToApy(rewards.vlmgpAPR) * 0.9, asset: `${(100 * Number(balances.curve.yMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP) / (Number(balances.curve.MGP) + Number(balances.curve.wstMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP) + Number(balances.curve.yMGP) * Number(balances.wstMGP.MGP) / Number(supplies.wstMGP))).toFixed(0)}% yMGP`, logo: coins.yMGP.icon }, { apy: rewards.cmgpPoolAPY, asset: "Swap Fees", logo: coins.cMGP.icon }]} logo={coins.cMGP.icon} />
                    </div>
                  </div>
                </div>
                {page === "supplyLiquidity" && <SupplyLiquidityPage mgpBalance={balances.user.MGP} mgpCurveBalance={balances.curve.MGP} mgpLPAmount={amounts.lp.MGP} rmgpBalance={balances.user.wstMGP} rmgpCurveBalance={balances.curve.wstMGP} rmgpLPAmount={amounts.lp.wstMGP} setLPAmounts={amountsActions.setLP} supplyLiquidity={actions.supplyLiquidity} ymgpBalance={balances.user.yMGP} ymgpCurveBalance={balances.curve.yMGP} ymgpLPAmount={amounts.lp.yMGP} />}
              </Card>
              <QASection />
              <div className="flex gap-6">
                <PegCard rates={[{ label: "Mint", value: Number(balances.wstMGP.MGP) / Number(supplies.wstMGP), color: "green", required: true }, { label: "Buy", value: 1 / exchangeRates.MGP.wstMGP, color: "blue", required: true }, { label: "Sell", value: exchangeRates.wstMGP.MGP, color: "red", required: true }, { label: "Orig Mint", value: 1, color: "emerald" }, { label: "Target", value: Number(supplies.wstMGP) / Number(balances.wstMGP.MGP) / (1 + aprToApy(rewards.vlmgpAPR) * (withdraws.reefi.unlockSchedule.length === 6 ? Number(withdraws.reefi.unlockSchedule[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2 : 60 * 60 * 24 * 30 * 2 / (60 * 60 * 24)) / 365), color: "purple", required: true }]} softPeg spread={100 / exchangeRates.MGP.wstMGP / exchangeRates.wstMGP.MGP - 100} targetToken="MGP" token="wstMGP" />
                <PegCard rates={[{ label: "Mint", value: 1, color: "green", required: true }, { label: "Buy", value: 1 / exchangeRates.wstMGP.yMGP, color: "blue", required: true }, { label: "Sell", value: exchangeRates.yMGP.wstMGP, color: "red", required: true }, { label: "Burn", value: 0.75, color: "purple", required: true }]} spread={100 / exchangeRates.wstMGP.yMGP / exchangeRates.yMGP.wstMGP - 100} targetToken="wstMGP" token="yMGP" />
                <PegCard rates={[{ label: "Mint", value: 1, color: "green", required: true }, { label: "Buy", value: 1 / exchangeRates.yMGP.vMGP, color: "blue", required: true }, { label: "Sell", value: exchangeRates.vMGP.yMGP, color: "red", required: true }, { label: "Burn", value: 0, color: "purple", required: true }]} spread={100 / exchangeRates.yMGP.vMGP / exchangeRates.vMGP.yMGP - 100} targetToken="yMGP" token="vMGP" />
              </div>
              <Contracts />
            </>;
          })()}
        </div>
      </div>
    </div>
  </>;
};
export default App;
