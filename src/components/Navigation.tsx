import vlMGP from "../../public/icons/vlMGP.png";

import { aprToApy } from "../utilities";
import { coins } from "../state/useContracts";

import { Button } from "./Button";
import { YieldBadge } from "./YieldBadge";

import type { Pages, Section } from "../App";
import type { useBalances } from "../state/useBalances";
import type { useBonds } from "../state/useBonds";
import type { useExchangeRates } from "../state/useExchangeRates";
import type { useRewards } from "../state/useRewards";
import type { useSupplies } from "../state/useSupplies";

interface Properties {
  readonly balances: ReturnType<typeof useBalances>;
  readonly rewards: ReturnType<typeof useRewards>;
  readonly exchangeRates: ReturnType<typeof useExchangeRates>;
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly bonds: ReturnType<typeof useBonds>;
  readonly page: Pages | "";
  readonly setPage: (_value: Pages | "") => void;
  readonly activeSection: Section | "";
  readonly setActiveSection: (_s: Section | "") => void;
}

export const Navigation = ({ balances, page, setPage, rewards, exchangeRates, supplies, bonds, activeSection, setActiveSection }: Properties) => {
  const calculateFixedYield = () => {
    const fixedYieldPercent = (1 - exchangeRates.stMGP.MGP) * 100;
    const withdrawalTime = bonds.length === 6 ? Number(bonds[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2 : 60 * 60 * 24 * 30 * 2;
    const daysToWithdraw = withdrawalTime / (60 * 60 * 24);
    return `${(fixedYieldPercent / 100 * (365 / daysToWithdraw) * 100).toFixed(2)}%`;
  };

  const cmgpAPY = rewards.cmgpPoolAPY + aprToApy(rewards.vlMGP.APR) * 0.9 * Number(balances.curve.stMGP + balances.curve.yMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) / (Number(balances.curve.MGP) + Number(balances.curve.stMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP) + Number(balances.curve.yMGP) * Number(supplies.stMGP) / Number(supplies.wstMGP)); // TODO: Update this to support 5 coins
  const cmgpBreakdown = [
    {
      apy: 0,
      asset: `${(100 * Number(balances.curve.MGP) / Number(balances.curve.MGP + balances.curve.stMGP + balances.curve.yMGP + balances.curve.vMGP + balances.curve.rMGP)).toFixed(0)}% MGP`,
      logo: coins.MGP.icon
    },
    {
      apy: aprToApy(rewards.vlMGP.APR) * 0.9,
      asset: `${(100 * Number(balances.curve.stMGP) / Number(balances.curve.MGP + balances.curve.stMGP + balances.curve.yMGP + balances.curve.vMGP + balances.curve.rMGP)).toFixed(0)}% stMGP`,
      logo: coins.stMGP.icon
    },
    {
      apy: aprToApy(rewards.vlMGP.APR) * 0.9,
      asset: `${(100 * Number(balances.curve.yMGP) / Number(balances.curve.MGP + balances.curve.stMGP + balances.curve.yMGP + balances.curve.vMGP + balances.curve.rMGP)).toFixed(0)}% yMGP`,
      logo: coins.yMGP.icon
    },
    {
      apy: aprToApy(rewards.vlMGP.APR) * 0.9,
      asset: `${(100 * Number(balances.curve.vMGP) / Number(balances.curve.MGP + balances.curve.stMGP + balances.curve.yMGP + balances.curve.vMGP + balances.curve.rMGP)).toFixed(0)}% vMGP`,
      logo: coins.vMGP.icon
    },
    {
      apy: 0,
      asset: `${(100 * Number(balances.curve.rMGP) / Number(balances.curve.MGP + balances.curve.stMGP + balances.curve.yMGP + balances.curve.vMGP + balances.curve.rMGP)).toFixed(0)}% rMGP`,
      logo: coins.rMGP.icon
    },
    {
      apy: rewards.cmgpPoolAPY,
      asset: "Swap Fees",
      logo: coins.cMGP.icon
    }
  ];

  return activeSection ? <div className="space-y-6">
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group" onClick={() => setActiveSection("")} type="button">
        <svg aria-hidden="true" className="size-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
        <span className="text-sm">Back</span>
      </button>
      <div className="h-4 w-px bg-gray-600" />
      <h2 className="text-xl font-semibold text-white">
        {activeSection === "stake" && "MGP Staking"}
        {activeSection === "vault" && "MGP Vaults"}
        {activeSection === "advanced" && "Liquidity & Governance"}
      </h2>
    </div>
    <div className="flex justify-between">
      <div className="flex flex-wrap gap-3">
        {activeSection === "stake" && <>
          <Button onClick={() => setPage(page === "GetMGP" ? "" : "GetMGP")} size="md" type="button" variant={page === "GetMGP" ? "primary" : "secondary"}>Get MGP</Button>
          <Button onClick={() => setPage(page === "GetSTMGP" ? "" : "GetSTMGP")} size="md" type="button" variant={page === "GetSTMGP" ? "primary" : "secondary"}>Stake MGP</Button>
          {balances.user.stMGP !== 0n && <Button onClick={() => setPage(page === "GetBMGP" ? "" : "GetBMGP")} size="md" type="button" variant={page === "GetBMGP" ? "primary" : "secondary"}>Issue Bond</Button>}
          <Button onClick={() => setPage(page === "FixedYield" ? "" : "FixedYield")} size="md" type="button" variant={page === "FixedYield" ? "primary" : "secondary"}>Fixed Yield</Button>
        </>}
        {activeSection === "vault" && <>
          <Button onClick={() => setPage(page === "GetWSTMGP" ? "" : "GetWSTMGP")} size="md" type="button" variant={page === "GetWSTMGP" ? "primary" : "secondary"}>Wrap stMGP</Button>
          <Button onClick={() => setPage(page === "GetYMGP" ? "" : "GetYMGP")} size="md" type="button" variant={page === "GetYMGP" ? "primary" : "secondary"}>yMGP</Button>
          <Button onClick={() => setPage(page === "GetSYMGP" ? "" : "GetSYMGP")} size="md" type="button" variant={page === "GetSYMGP" ? "primary" : "secondary"}>MGP Synth</Button>
        </>}
        {activeSection === "advanced" && <>
          <Button onClick={() => setPage(page === "SupplyLiquidity" ? "" : "SupplyLiquidity")} size="md" type="button" variant={page === "SupplyLiquidity" ? "primary" : "secondary"}>Supply Liquidity</Button>
          <Button onClick={() => setPage(page === "GetVMGP" ? "" : "GetVMGP")} size="md" type="button" variant={page === "GetVMGP" ? "primary" : "secondary"}>Get vMGP</Button>
          <Button onClick={() => setPage(page === "vote" ? "" : "vote")} size="md" type="button" variant={page === "vote" ? "primary" : "secondary"}>Vote</Button>
        </>}
      </div>
      <div className="flex gap-2 pt-2">
        {activeSection === "stake" && <>
          <YieldBadge apr={rewards.vlMGP.APR} asset="vlMGP" breakdown={[{ apr: rewards.vlMGP.APR, asset: "vlMGP", logo: vlMGP }]} logo={vlMGP} />
          <YieldBadge apy={aprToApy(rewards.vlMGP.APR) * 0.9} asset="stMGP" breakdown={[{ apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: "vlMGP", logo: vlMGP }]} logo={coins.wstMGP.icon} />
          <YieldBadge asset="bMGP Fixed" breakdown={[{ value: `${((1 - exchangeRates.stMGP.MGP) * 100).toFixed(2)}%`, asset: "stMGP Discount", logo: coins.stMGP.icon }]} logo={coins.stMGP.icon} value={calculateFixedYield()} />
        </>}
        {activeSection === "vault" && <>
          <YieldBadge apy={aprToApy(rewards.vlMGP.APR) * 0.9} asset="yMGP" breakdown={[{ apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: "wstMGP", logo: coins.wstMGP.icon }]} logo={coins.yMGP.icon} />
          <YieldBadge apy={Number(supplies.stMGP) * aprToApy(rewards.vlMGP.APR) * 0.05 / Number(supplies.syMGP) + aprToApy(rewards.vlMGP.APR) * 0.9} asset="MGP Synth" breakdown={[{ apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: "wstMGP", logo: coins.wstMGP.icon }, { apr: Number(supplies.stMGP) * rewards.vlMGP.APR * 0.05 / Number(supplies.syMGP), asset: "Boosted vlMGP", logo: vlMGP }, { asset: "yMGP Withdraws", value: "Variable", logo: coins.yMGP.icon }]} logo={coins.yMGP.icon} suffix="+" />
        </>}
        {activeSection === "advanced" && <YieldBadge apy={cmgpAPY} asset="cMGP" breakdown={cmgpBreakdown} logo={coins.cMGP.icon} />}
      </div>
    </div>
  </div> : <div className="space-y-4">
    <h2 className="text-2xl font-bold text-white mb-4">What would you like to do?</h2>
    <div className="space-y-3">
      <button className="w-full group flex items-center justify-between p-6 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-200" onClick={() => setActiveSection("stake")} type="button">
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">MGP Staking</h3>
            <YieldBadge apy={aprToApy(rewards.vlMGP.APR) * 0.9} asset="stMGP" breakdown={[{ apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: "vlMGP", logo: vlMGP }]} logo={coins.wstMGP.icon} />
            <YieldBadge asset="bMGP Fixed" breakdown={[{ value: `${((1 - exchangeRates.stMGP.MGP) * 100).toFixed(2)}%`, asset: "stMGP Discount", logo: coins.stMGP.icon }]} logo={coins.stMGP.icon} value={calculateFixedYield()} />
          </div>
          <p className="text-sm text-gray-400">Get MGP, stake for yield, and earn fixed returns</p>
        </div>
        <div className="text-gray-400 group-hover:text-gray-300 ml-4">
          <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
        </div>
      </button>
      <button className="w-full group flex items-center justify-between p-6 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-200" onClick={() => setActiveSection("vault")} type="button">
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">MGP Vaults</h3>
            <YieldBadge apy={Number(supplies.stMGP) * aprToApy(rewards.vlMGP.APR) * 0.05 / Number(supplies.syMGP) + aprToApy(rewards.vlMGP.APR) * 0.9} asset="MGP Synth" breakdown={[{ apy: aprToApy(rewards.vlMGP.APR) * 0.9, asset: "wstMGP", logo: coins.wstMGP.icon }, { apr: Number(supplies.stMGP) * rewards.vlMGP.APR * 0.05 / Number(supplies.syMGP), asset: "Boosted vlMGP", logo: vlMGP }, { asset: "yMGP Withdraws", value: "Variable", logo: coins.yMGP.icon }]} logo={coins.yMGP.icon} suffix="+" />
          </div>
          <p className="text-sm text-gray-400">Higher yield strategies with yMGP and synthetic positions</p>
        </div>
        <div className="text-gray-400 group-hover:text-gray-300 ml-4">
          <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
        </div>
      </button>
      <button className="w-full group flex items-center justify-between p-6 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-200" onClick={() => setActiveSection("advanced")} type="button">
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">Liquidity & Governance</h3>
            <YieldBadge apy={cmgpAPY} asset="cMGP" breakdown={cmgpBreakdown} logo={coins.cMGP.icon} />
          </div>
          <p className="text-sm text-gray-400">Provide liquidity and participate in governance</p>
        </div>
        <div className="text-gray-400 group-hover:text-gray-300 ml-4">
          <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
        </div>
      </button>
    </div>
  </div>;
};
