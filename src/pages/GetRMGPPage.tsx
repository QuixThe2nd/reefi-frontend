import { aprToApy } from "../utilities";
import { memo, type ReactElement } from "react";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { PrimaryCoin, Chains, CoreCoin, TransferrableCoin } from "../config/contracts";
import type { UseSendTransactionReturnType, UseWriteContractReturnType } from "wagmi";
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
  readonly curveBuy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly approve: (_coin: TransferrableCoin, _spender: "wstMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _infinity: boolean, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`, _sendTransaction: UseSendTransactionReturnType<typeof wagmiConfig>["sendTransaction"]) => void;
}

export const GetRMGPPage = memo(({ mgpAPR, balances, setSend, send, allowances, chain, curveBuy, nativeSwap, approve, mintWETH, swap, curveAmounts, supplies }: Properties): ReactElement => <Page info={<span>MGP can be converted to wstMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards.</span>}>
  <SwapToken allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["CKP", "PNP", "EGP", "LTP", "lvMGP", "lyMGP", "vlMGP", "WETH", "ETH", "cMGP", "stMGP", "vMGP", "yMGP"]} label="Mint" mintWETH={mintWETH} nativeSwap={nativeSwap} originalTokenIn="MGP" send={send} setSend={setSend} supplies={supplies} swap={swap} tokenOut="wstMGP" />
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
</Page>);
GetRMGPPage.displayName = "GetRMGPPage";
