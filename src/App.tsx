/*
 * TODO: page urls in docs
 * TODO: Merge docs and q&a
 * TODO: Start with deposit limit, airdrop 1 REEFI for 1 MGP deposited
 */

import vlMGP from "../public/icons/vlMGP.png";

import { aprToApy } from "./utilities";
import { coins } from "./state/useContracts";
import { useActions } from "./state/useActions";
import { useReefiState } from "./state/useReefiState";
import { useState, useEffect } from "react";

import { Bridge } from "./pages/Bridge";
import { BurnSYMGP } from "./pages/BurnSYMGP";
import { BurnWSTMGP } from "./pages/BurnWSTMGP";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { CompoundYield } from "./pages/CompoundYield";
import { ContractsCard } from "./components/Contracts";
import { Documentation } from "./pages/Documentation";
import { ErrorCard } from "./components/ErrorCard";
import { Features } from "./components/Features";
import { FixedYield } from "./pages/FixedYield";
import { GetBMGP } from "./pages/GetBMGP";
import { GetMGP } from "./pages/GetMGP";
import { GetSTMGP } from "./pages/GetSTMGP";
import { GetSYMGP } from "./pages/GetSYMGP";
import { GetVMGP } from "./pages/GetVMGP";
import { GetWSTMGP } from "./pages/GetWSTMGP";
import { GetYMGP } from "./pages/GetYMGP";
import { Header } from "./components/Header";
import { NotificationCard } from "./components/NotificationCard";
import PegCard from "./components/PegCard";
import { QASection } from "./components/Questions";
import { SellYMGP } from "./pages/SellYMGP";
import { SupplyLiquidity } from "./pages/SupplyLiquidity";
import { TokenCards } from "./components/TokenCards";
import { YieldBadge } from "./components/YieldBadge";

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

export type Pages = "GetMGP" | "GetSTMGP" | "GetWSTMGP" | "GetYMGP" | "GetVMGP" | "GetSYMGP" | "BurnSYMGP" | "SellYMGP" | "BurnWSTMGP" | "GetBMGP" | "BurnBMGP" | "SupplyLiquidity" | "claim" | "vote" | "FixedYield" | "bridge" | "documentation";

const App = () => {
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [page, setPage] = useState<Pages | undefined>((() => {
    const path = window.location.pathname.replace("/", "") as Pages | "";
    if (path === "") return "GetSTMGP";
    return path;
  })());
  const { amounts, amountsActions, allowances, balances, exchangeRates, supplies, rewards, prices, bonds } = useReefiState();
  const actions = useActions({ amounts, allowances, setError, setNotification });

  const calculateFixedYield = () => {
    const fixedYieldPercent = (1 - exchangeRates.stMGP.MGP) * 100;
    const withdrawalTime = bonds.length === 6 ? Number(bonds[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2 : 60 * 60 * 24 * 30 * 2;
    const daysToWithdraw = withdrawalTime / (60 * 60 * 24);
    return `${(fixedYieldPercent / 100 * (365 / daysToWithdraw) * 100).toFixed(2)}%`;
  };

  useEffect(() => {
    history.pushState(undefined, "", page ?? "./");
  }, [page]);

  useEffect(() => {
    if (error.length > 0) {
      const timeout = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [error]);

  const stmgpTarget = () => {
    const withdrawWaitDays = 60 + (bonds.length === 6 ? (Number(bonds[0]?.endTime) - Date.now() / 1000) / 60 / 60 / 24 / 30 / 2 : 0);
    const dailyAPY = rewards.stMGP.APY / 365;
    const missedYield = dailyAPY * withdrawWaitDays;
    return 1 - missedYield;
  };

  return <>
    <ErrorCard error={error} setError={setError} />
    <NotificationCard notification={notification} setNotification={setNotification} />
    <div className="flex h-screen bg-gray-900 text-white">
      {/* <ConnectWallet connectRequired={wallet.connectionRequired} connectWallet={updateWallet.connectWallet} isConnecting={wallet.isConnecting} /> */}
      <div className="grow overflow-auto">
        <Header balances={balances.user} page={page} setPage={setPage} />
        <div className="flex flex-col gap-6 p-4 md:mx-16 md:p-6 lg:mx-24 xl:mx-28">
          {(() => {
            if (page === "documentation") return <Documentation />;

            if (page === "claim") return <Card>
              <CompoundYield compoundRMGP={actions.compoundRMGP} estimatedCompoundGasFee={rewards.vlMGP.estimatedGas} mgpAPR={rewards.vlMGP.APR} pendingRewards={rewards.vlMGP.pendingRewards} prices={prices} reefiMGPLocked={supplies.stMGP} uncompoundedMGPYield={rewards.vlMGP.estimatedMGP} uncompoundedRMGPYield={rewards.vlMGP.estimatedRMGP} />
            </Card>;

            if (page === "vote") return <div className="flex flex-col h-screen bg-gray-900 text-white">
              {/* <VotePage lvmgpSupply={supplies.lvMGP} reefiMgpLocked={supplies.stMGP} vmgpBalance={balances.user.vMGP} vmgpSupply={supplies.vMGP} vote={actions.vote} ymgpBalance={balances.user.yMGP} /> */}
            </div>;

            if (page === "bridge") return <div className="flex flex-col h-screen bg-gray-900 text-white">
              <Card>
                <h2 className="mb-4 text-xl font-bold">Bridge stMGP</h2>
                <Bridge />
              </Card>
              <div className="grid grid-cols-1 gap-6 pb-6 mt-6 lg:grid-cols-2">
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Wrap stMGP</h2>
                  <GetWSTMGP allowances={allowances} approve={actions.approve} balances={balances} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />
                </Card>
                <Card>
                  <h2 className="mb-4 text-xl font-bold">Unwrap wstMGP</h2>
                  <BurnWSTMGP allowances={allowances} approve={actions.approve} balances={balances} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />
                </Card>
              </div>
            </div>;

            return <>
              <TokenCards mgpPrice={prices.MGP} mgpStmgpCurveRate={exchangeRates.MGP.stMGP} stmgpRmgpCurveRate={exchangeRates.stMGP.rMGP} supplies={supplies} wstmgpYmgpCurveRate={1 / exchangeRates.wstMGP.yMGP} ymgpVmgpCurveRate={exchangeRates.yMGP.vMGP} />
              <Features mgpAPR={rewards.vlMGP.APR} mgpPrice={prices.MGP} reefiLockedMGP={supplies.stMGP} syMGPAPY={rewards.syMGP.APY} vmgpMGPCurveRate={exchangeRates.vMGP.MGP} vmgpSupply={supplies.vMGP} />
              <div className="rounded-xl border border-dashed border-yellow-700 bg-gray-900/80 p-4">
                <h3 className="mb-2 text-lg font-semibold text-yellow-400">⚠️ Important Notice</h3>
                <p className="text-sm text-gray-300">Reefi is in very early beta. Please only deposit small amounts that you can afford to lose. The protocol may contain unknown bugs and should be used with caution.</p>
              </div>
              <Card>
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button onClick={() => setPage(page === "GetMGP" ? undefined : "GetMGP")} size="sm" tooltip="Buy the Magpie governance token" type="button" variant={page === "GetMGP" ? "primary" : "clear"}>Get MGP</Button>
                    <Button onClick={() => setPage(page === "GetSTMGP" ? undefined : "GetSTMGP")} size="sm" tooltip="Deposit your Magpie and earn auto compounded & liquid yield" type="button" variant={page === "GetSTMGP" ? "primary" : "clear"}>Get stMGP</Button>
                    {balances.user.stMGP !== 0n && <Button onClick={() => setPage(page === "GetBMGP" ? undefined : "GetBMGP")} size="sm" tooltip="Withdraw the underlying MGP from wstMGP" type="button" variant={page === "GetBMGP" ? "primary" : "clear"}>Issue Bond</Button>}
                    <Button onClick={() => setPage(page === "FixedYield" ? undefined : "FixedYield")} size="sm" tooltip="Earn fixed interest by buying depegged wstMGP and redeeming" type="button" variant={page === "FixedYield" ? "primary" : "clear"}>Fixed Yield</Button>
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <YieldBadge apr={rewards.vlMGP.APR} asset="vlMGP" breakdown={[{ apr: rewards.vlMGP.APR, asset: "vlMGP", logo: vlMGP }]} logo={vlMGP} />
                      <YieldBadge apy={aprToApy(rewards.vlMGP.APR) * 0.9} asset="stMGP" breakdown={[{ apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: "vlMGP", logo: vlMGP }]} logo={coins.wstMGP.icon} />
                      <YieldBadge asset="bMGP Fixed Yield" breakdown={[{ value: `${((1 - exchangeRates.stMGP.MGP) * 100).toFixed(2)}%`, asset: "stMGP Discount", logo: coins.stMGP.icon }]} logo={coins.stMGP.icon} value={calculateFixedYield()} />
                    </div>
                  </div>
                </div>
                {page === "GetMGP" && <GetMGP allowances={allowances} approve={actions.approve} balances={balances} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mgpAPR={rewards.vlMGP.APR} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />}
                {page === "GetSTMGP" && <GetSTMGP allowances={allowances} approve={actions.approve} balances={balances} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mgpAPR={rewards.vlMGP.APR} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />}
                {page === "GetBMGP" && <GetBMGP allowances={allowances} approve={actions.approve} balances={balances} bonds={bonds} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />}
                {page === "FixedYield" && <FixedYield allowances={allowances} approve={actions.approve} balances={balances} bonds={bonds} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} lockedReefiMGP={supplies.stMGP} mgpAPR={rewards.vlMGP.APR} mgpRmgpCurveAmount={amounts.curve.MGP_wstMGP} mgpRmgpCurveRate={exchangeRates.MGP.stMGP} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} rmgpSupply={supplies.wstMGP} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />}
                <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button onClick={() => setPage(page === "GetYMGP" ? undefined : "GetYMGP")} size="sm" tooltip="Convert your wstMGP for yMGP for better yield potential" type="button" variant={page === "GetYMGP" ? "primary" : "clear"}>Get yMGP</Button>
                    <Button onClick={() => setPage(page === "GetSYMGP" ? undefined : "GetSYMGP")} size="sm" tooltip="Lock your yMGP for boosted yield" type="button" variant={page === "GetSYMGP" ? "primary" : "clear"}>MGP Synth</Button>
                    {balances.user.syMGP > 0n && <Button onClick={() => setPage(page === "BurnSYMGP" ? undefined : "BurnSYMGP")} size="sm" tooltip="Withdraw your yMGP from the locker" type="button" variant={page === "BurnSYMGP" ? "primary" : "clear"}>Withdraw syMGP</Button>}
                    {balances.user.yMGP > 0n && <Button onClick={() => setPage(page === "SellYMGP" ? undefined : "SellYMGP")} size="sm" tooltip="Convert your yMGP back to wstMGP" type="button" variant={page === "SellYMGP" ? "primary" : "clear"}>Sell yMGP</Button>}
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <YieldBadge apy={aprToApy(rewards.vlMGP.APR) * 0.9} asset="yMGP" breakdown={[{ apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: "wstMGP", logo: coins.wstMGP.icon }]} logo={coins.yMGP.icon} />
                      <YieldBadge apy={Number(supplies.stMGP) * aprToApy(rewards.vlMGP.APR) * 0.05 / Number(supplies.syMGP) + aprToApy(rewards.vlMGP.APR) * 0.9} asset="MGP Synth" breakdown={[{ apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: "wstMGP", logo: coins.wstMGP.icon }, { apr: Number(supplies.stMGP) * rewards.vlMGP.APR * 0.05 / Number(supplies.syMGP), asset: "Boosted vlMGP", logo: vlMGP }, { asset: "yMGP Withdraws", value: "Variable", logo: coins.yMGP.icon }]} logo={coins.yMGP.icon} suffix="+" />
                    </div>
                  </div>
                </div>
                {page === "GetYMGP" && <GetYMGP allowances={allowances} approve={actions.approve} balances={balances} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />}
                {page === "GetSYMGP" && <GetSYMGP mgpAPR={rewards.vlMGP.APR} nativeSwap={actions.nativeSwap} reefiLockedMGP={supplies.stMGP} rmgpBalance={balances.user.rMGP} send={amounts.send} setSend={amountsActions.setSend} ymgpBalance={balances.user.yMGP} ymgpLocked={supplies.syMGP} />}
                {page === "BurnSYMGP" && <BurnSYMGP lymgpBalance={balances.user.syMGP} nativeSwap={actions.nativeSwap} send={amounts.send} setSendAmount={amountsActions.setSend} />}
                {page === "SellYMGP" && <SellYMGP allowances={allowances} approve={actions.approve} balances={balances} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />}
                <div className="bg-gray-500 w-full h-[0.5px] mt-8" />
                <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row mt-8 w-full">
                  <div className="flex rounded-lg bg-gray-700 p-1">
                    <Button onClick={() => setPage(page === "SupplyLiquidity" ? undefined : "SupplyLiquidity")} size="sm" tooltip="Become a Curve LP and earn additional LP yield" type="button" variant={page === "SupplyLiquidity" ? "primary" : "clear"}>Supply Liquidity</Button>
                    <Button onClick={() => setPage(page === "GetVMGP" ? undefined : "GetVMGP")} size="sm" tooltip="Become a Curve LP and earn additional LP yield" type="button" variant={page === "GetVMGP" ? "primary" : "clear"}>Get vMGP</Button>
                  </div>
                  <div className="flex h-min flex-row-reverse">
                    <div className="flex gap-1">
                      <YieldBadge apy={rewards.cmgpPoolAPY + aprToApy(rewards.vlMGP.APR) * 0.9 * Number(balances.curve.stMGP + balances.curve.yMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) / (Number(balances.curve.MGP) + Number(balances.curve.stMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) + Number(balances.curve.yMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP))} asset="cMGP" breakdown={[{ apy: 0, asset: `${(100 * Number(balances.curve.MGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) / (Number(balances.curve.MGP) + Number(balances.curve.stMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) + Number(balances.curve.yMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP))).toFixed(0)}% MGP`, logo: coins.MGP.icon }, { apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: `${(100 * Number(balances.curve.stMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) / (Number(balances.curve.MGP) + Number(balances.curve.stMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) + Number(balances.curve.yMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP))).toFixed(0)}% wstMGP`, logo: coins.wstMGP.icon }, { apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: `${(100 * Number(balances.curve.yMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) / (Number(balances.curve.MGP) + Number(balances.curve.stMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) + Number(balances.curve.yMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP))).toFixed(0)}% yMGP`, logo: coins.yMGP.icon }, { apy: rewards.cmgpPoolAPY, asset: "Swap Fees", logo: coins.cMGP.icon }]} logo={coins.cMGP.icon} />
                    </div>
                  </div>
                </div>
                {page === "SupplyLiquidity" && <SupplyLiquidity mgpBalance={balances.user.MGP} mgpCurveBalance={balances.curve.MGP} mgpLPAmount={amounts.lp.MGP} rmgpBalance={balances.user.rMGP} rmgpCurveBalance={balances.curve.rMGP} rmgpLPAmount={amounts.lp.rMGP} setLPAmounts={amountsActions.setLP} stmgpBalance={balances.user.stMGP} stmgpCurveBalance={balances.curve.stMGP} stmgpLPAmount={amounts.lp.stMGP} supplyLiquidity={actions.supplyLiquidity} vmgpBalance={balances.user.vMGP} vmgpCurveBalance={balances.curve.vMGP} vmgpLPAmount={amounts.lp.vMGP} ymgpBalance={balances.user.yMGP} ymgpCurveBalance={balances.curve.yMGP} ymgpLPAmount={amounts.lp.yMGP} />}
                {page === "GetVMGP" && <GetVMGP allowances={allowances} approve={actions.approve} balances={balances} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />}
              </Card>
              <QASection />
              <div className="grid grid-cols-2 gap-6">
                <PegCard rates={[{ label: "Target", value: stmgpTarget(), color: "purple", required: true }, { label: "Sell", value: exchangeRates.stMGP.MGP, color: "red", required: true }, { label: "Buy", value: 1 / exchangeRates.MGP.stMGP, color: "blue", required: true }, { label: "Mint", value: 1, color: "green", required: true }]} softPeg spread={100 / exchangeRates.MGP.stMGP / exchangeRates.stMGP.MGP - 100} targetToken="MGP" token="stMGP" />
                <PegCard rates={[{ label: "Orig Mint", value: 1, color: "emerald" }, { label: "Mint", value: Number(supplies.stMGP) / Number(supplies.stMGP_shares), color: "green", required: true }]} spread={0} targetToken="stMGP" token="wstMGP" />
                <PegCard rates={[{ label: "Burn", value: 0.75, color: "purple", required: true }, { label: "Sell", value: exchangeRates.yMGP.stMGP, color: "red", required: true }, { label: "Buy", value: 1 / exchangeRates.stMGP.yMGP, color: "blue", required: true }, { label: "Mint", value: 1, color: "green", required: true }]} spread={100 / exchangeRates.stMGP.yMGP / exchangeRates.yMGP.stMGP - 100} targetToken="wstMGP" token="yMGP" />
                <PegCard rates={[{ label: "Burn", value: 0, color: "purple", required: true }, { label: "Sell", value: exchangeRates.vMGP.yMGP, color: "red", required: true }, { label: "Buy", value: 1 / exchangeRates.yMGP.vMGP, color: "blue", required: true }, { label: "Mint", value: 1, color: "green", required: true }]} spread={100 / exchangeRates.yMGP.vMGP / exchangeRates.vMGP.yMGP - 100} targetToken="yMGP" token="vMGP" />
              </div>
              <ContractsCard />
            </>;
          })()}
        </div>
      </div>
    </div>
  </>;
};
export default App;
