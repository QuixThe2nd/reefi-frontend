/*
 * TODO: page urls in docs
 * TODO: Merge docs and q&a
 * TODO: Start with deposit limit, airdrop 1 REEFI for 1 MGP deposited
 */

import { useActions } from "./state/useActions";
import { useState, useEffect, use } from "react";

import { Bridge } from "./pages/Bridge";
import { Card } from "./components/Card";
import { CompoundYield } from "./pages/CompoundYield";
import { ContractsCard } from "./components/Contracts";
import { Documentation } from "./pages/Documentation";
import { ErrorCard } from "./components/ErrorCard";
import { Features } from "./components/Features";
import { FixedYield } from "./pages/FixedYield";
import { GetBMGP } from "./pages/GetBMGP";
import { GetSYMGP } from "./pages/GetSYMGP";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { NotificationCard } from "./components/NotificationCard";
import { PegCards } from "./components/PegCards";
import { QASection } from "./components/Questions";
import { ReefiContext } from ".";
import { SupplyLiquidity } from "./pages/SupplyLiquidity";
import { SwapPage } from "./pages/SwapPage";
import { TokenCards } from "./components/TokenCards";
import { VotePage } from "./pages/VotePage";

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

export type Pages = "GetMGP" | "GetSTMGP" | "GetWSTMGP" | "GetYMGP" | "GetVMGP" | "GetSYMGP" | "GetBMGP" | "SupplyLiquidity" | "claim" | "vote" | "FixedYield" | "bridge" | "documentation";
export type Section = "stake" | "vault" | "advanced";

const App = () => {
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [page, setPage] = useState<Pages | "">((window.location.pathname.split("/")[2] ?? "") as Pages | "");
  const [activeSection, setActiveSection] = useState<Section | "">(window.location.pathname.split("/")[1] as Section | "");
  const { amounts, amountsActions, allowances, balances, exchangeRates, supplies, rewards, prices, bonds } = use(ReefiContext); // TODO: get rid of this and move useContext to be within each component
  const actions = useActions({ amounts, allowances, setError, setNotification }); // TODO: get rid of this and move useContext to be within each component

  useEffect(() => {
    if (activeSection === "") {
      history.pushState(undefined, "", "/");
      setPage("");
    } else if (page) history.pushState(undefined, "", `/${activeSection}/${page}`);
    else history.pushState(undefined, "", `/${activeSection}`);
  }, [page, activeSection]);

  useEffect(() => {
    if (error.length > 0) {
      const timeout = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [error]);

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

            if (page === "bridge") return <div className="flex flex-col h-screen bg-gray-900 text-white">
              <Card>
                <h2 className="mb-4 text-xl font-bold">Bridge wstMGP</h2>
                <Bridge />
              </Card>
            </div>;

            return <>
              <TokenCards mgpPrice={prices.MGP} mgpStmgpCurveRate={exchangeRates.MGP.stMGP} stmgpRmgpCurveRate={exchangeRates.stMGP.rMGP} supplies={supplies} wstmgpYmgpCurveRate={1 / exchangeRates.wstMGP.yMGP} ymgpVmgpCurveRate={exchangeRates.yMGP.vMGP} />
              <Features mgpAPR={rewards.vlMGP.APR} mgpPrice={prices.MGP} reefiLockedMGP={supplies.stMGP} syMGPAPY={rewards.syMGP.APY} vmgpMGPCurveRate={exchangeRates.vMGP.MGP} vmgpSupply={supplies.vMGP} />
              <div className="rounded-xl border border-dashed border-yellow-700 bg-gray-900/80 p-4">
                <h3 className="mb-2 text-lg font-semibold text-yellow-400">⚠️ Important Notice</h3>
                <p className="text-sm text-gray-300">Reefi is in very early beta. Please only deposit small amounts that you can afford to lose. The protocol may contain unknown bugs and should be used with caution.</p>
              </div>
              <Navigation activeSection={activeSection} balances={balances} bonds={bonds} exchangeRates={exchangeRates} page={page} rewards={rewards} setActiveSection={setActiveSection} setPage={setPage} supplies={supplies} />
              {(page === "GetMGP" || page === "GetSTMGP" || page === "GetBMGP" || page === "FixedYield" || page === "GetYMGP" || page === "GetSYMGP" || page === "SupplyLiquidity" || page === "GetVMGP" || page === "GetWSTMGP" || page === "vote") && <Card>
                {/* TODO: Change pages to <SwapPage> to reduce a fuck ton of redundancy */}
                {page === "GetMGP" && <SwapPage approve={actions.approve} curveBuy={actions.curveBuy} info={<span>MGP is Magpie&apos;s governance token. All Reefi derivatives are built around MGP.</span>} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} tokenOut="MGP" tokensIn={["PNP", "CKP", "EGP", "LTP", "WETH", "ETH"]} />}
                {page === "GetSTMGP" && <SwapPage approve={actions.approve} curveBuy={actions.curveBuy} info={<span>MGP can be converted to stMGP to earn auto compounded (rebasing) yield. Yield is accrued from vlMGP SubDAO Rewards.</span>} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} tokenOut="stMGP" tokensIn={["MGP"]} />}
                {page === "GetBMGP" && <GetBMGP allowances={allowances} approve={actions.approve} balances={balances} bonds={bonds} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />}
                {page === "FixedYield" && <FixedYield allowances={allowances} approve={actions.approve} balances={balances} bonds={bonds} curveAmounts={amounts.curve} curveBuy={actions.curveBuy} lockedReefiMGP={supplies.stMGP} mgpAPR={rewards.vlMGP.APR} mgpRmgpCurveAmount={amounts.curve.MGP_wstMGP} mgpRmgpCurveRate={exchangeRates.MGP.stMGP} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} rmgpSupply={supplies.wstMGP} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} />}
                {page === "GetYMGP" && <SwapPage approve={actions.approve} curveBuy={actions.curveBuy} info={<span>yMGP is backed 1:1 by wstMGP. 1 yMGP can be redeemed for 0.75 wstMGP. yMGP alone has no additional benefit over wstMGP, it must be locked for boosted yield.</span>} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} tokenOut="yMGP" tokensIn={["wstMGP"]} />}
                {page === "GetSYMGP" && <GetSYMGP mgpAPR={rewards.vlMGP.APR} nativeSwap={actions.nativeSwap} rmgpBalance={balances.user.rMGP} send={amounts.send} setSend={amountsActions.setSend} stmgpSupply={supplies.stMGP} symgpBalance={balances.user.syMGP} ymgpBalance={balances.user.yMGP} ymgpLocked={balances.syMGP.yMGP} />}
                {page === "SupplyLiquidity" && <SupplyLiquidity mgpBalance={balances.user.MGP} mgpCurveBalance={balances.curve.MGP} mgpLPAmount={amounts.lp.MGP} rmgpBalance={balances.user.rMGP} rmgpCurveBalance={balances.curve.rMGP} rmgpLPAmount={amounts.lp.rMGP} setLPAmounts={amountsActions.setLP} stmgpBalance={balances.user.stMGP} stmgpCurveBalance={balances.curve.stMGP} stmgpLPAmount={amounts.lp.stMGP} supplyLiquidity={actions.supplyLiquidity} vmgpBalance={balances.user.vMGP} vmgpCurveBalance={balances.curve.vMGP} vmgpLPAmount={amounts.lp.vMGP} ymgpBalance={balances.user.yMGP} ymgpCurveBalance={balances.curve.yMGP} ymgpLPAmount={amounts.lp.yMGP} />}
                {page === "GetVMGP" && <SwapPage approve={actions.approve} curveBuy={actions.curveBuy} info={<span>yMGP is backed 1:1 by wstMGP. 1 yMGP can be redeemed for 0.75 wstMGP. yMGP alone has no additional benefit over wstMGP, it must be locked for boosted yield.</span>} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} tokenOut="vMGP" tokensIn={["yMGP"]} />}
                {page === "GetWSTMGP" && <SwapPage approve={actions.approve} curveBuy={actions.curveBuy} info={<span>stMGP can be wrapped for wstMGP. 1 stMGP receives 1 vlMGP worth of wstMGP.</span>} mintWETH={actions.mintWETH} nativeSwap={actions.nativeSwap} odosBuy={actions.buyOnOdos} tokenOut="wstMGP" tokensIn={["stMGP"]} />}
                {page === "vote" && <VotePage reefiMgpLocked={supplies.stMGP} vmgpBalance={balances.user.vMGP} vmgpSupply={supplies.vMGP} vote={actions.vote} />}
              </Card>}
              <PegCards balances={balances} bonds={bonds} exchangeRates={exchangeRates} rewards={rewards} supplies={supplies} />
              <QASection />
              <ContractsCard />
            </>;
          })()}
        </div>
      </div>
    </div>
  </>;
};
export default App;
