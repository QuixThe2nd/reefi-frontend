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
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly chain: Chains;
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly balances: ReturnType<typeof useBalances>;
  readonly curveBuy: BuyOnCurve;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly odosBuy: BuyOnOdos;
}

export const GetMGP = ({ balances, mgpAPR, setSend, send, allowances, chain, approve, mintWETH, curveAmounts, supplies, curveBuy, nativeSwap, odosBuy }: Properties): ReactElement => <Page info={<span>MGP is Magpie&apos;s governance token. All Reefi derivatives are built around MGP.</span>}>
  <SwapToken allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["wstMGP", "yMGP", "vMGP", "stMGP", "vlMGP", "cMGP", "syMGP", "rMGP", "bMGP"]} label="Swap" mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} originalTokenIn="WETH" send={send} setSend={setSend} supplies={supplies} tokenOut="MGP" />
  <div className="mt-4 text-sm text-gray-400">
    <div className="mb-1 flex justify-between">
      <span>Original APR</span>
      <span>0%</span>
    </div>
    <div className="mb-1 flex justify-between">
      <span>Locked APR</span>
      <span>{Math.round(10_000 * mgpAPR) / 100}%</span>
    </div>
  </div>
</Page>;
