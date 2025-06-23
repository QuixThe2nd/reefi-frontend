import { aprToApy } from "../utilities";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { ApproveFunction } from "../actions/approve";
import type { BuyOnCurve } from "../actions/buyOnCurve";
import type { BuyOnOdos } from "../actions/buyOnOdos";
import type { Chains, CoreCoin } from "../state/useContracts";
import type { ReactElement } from "react";
import type { UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../state/useAllowances";
import type { useAmounts } from "../state/useAmounts";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { wagmiConfig } from "..";

interface Properties {
  readonly mgpAPR: number;
  readonly send: bigint;
  readonly chain: Chains;
  readonly balances: ReturnType<typeof useBalances>;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly setSend: (_send: bigint) => void;
  readonly curveBuy: BuyOnCurve;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly odosBuy: BuyOnOdos;
}

export const GetSTMGP = ({ mgpAPR, balances, setSend, send, allowances, chain, curveBuy, nativeSwap, approve, mintWETH, curveAmounts, supplies, odosBuy }: Properties): ReactElement => <Page info={<span>MGP can be converted to stMGP to earn auto compounded (rebasing) yield. Yield is accrued from vlMGP SubDAO Rewards.</span>}>
  <SwapToken allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["CKP", "PNP", "EGP", "LTP", "vlMGP", "WETH", "ETH", "cMGP", "vMGP", "yMGP", "wstMGP", "syMGP", "rMGP", "bMGP"]} label="Mint" mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} originalTokenIn="MGP" send={send} setSend={setSend} supplies={supplies} tokenOut="stMGP" />
  <div className="mt-4 text-sm text-gray-400">
    <div className="mb-1 flex justify-between">
      <span>Original APR</span>
      <span>{Math.round(10_000 * mgpAPR) / 100}%</span>
    </div>
    <div className="mb-1 flex justify-between">
      <span>Reward APY</span>
      <span>{Math.round(10_000 * aprToApy(mgpAPR) * 0.9) / 100}%</span>
    </div>
  </div>
</Page>;
