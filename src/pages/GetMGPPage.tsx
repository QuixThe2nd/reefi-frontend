import { memo, type ReactElement } from "react";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { Chains, CoreCoinExtended, PrimaryCoin, TransferrableCoin } from "../config/contracts";
import type { UseSendTransactionReturnType, UseWriteContractReturnType } from "wagmi";
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
  readonly approve: (_coin: TransferrableCoin, _spender: "wstMGP" | "stMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _infinity: boolean, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`, _sendTransaction: UseSendTransactionReturnType<typeof wagmiConfig>["sendTransaction"]) => void;
  readonly balances: ReturnType<typeof useBalances>;
  readonly curveBuy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly nativeSwap: (_tokenIn: CoreCoinExtended, _tokenOut: CoreCoinExtended, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
}

export const GetMGPPage = memo(({ balances, mgpAPR, setSend, send, allowances, chain, approve, mintWETH, swap, curveAmounts, supplies, curveBuy, nativeSwap }: Properties): ReactElement => <Page info={<span>MGP is Magpie&apos;s governance token. All Reefi derivatives are built around MGP.</span>}>
  <SwapToken allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["wstMGP", "yMGP", "vMGP", "lyMGP", "lvMGP", "stMGP", "vlMGP", "cMGP"]} label="Swap" mintWETH={mintWETH} nativeSwap={nativeSwap} originalTokenIn="WETH" send={send} setSend={setSend} supplies={supplies} swap={swap} tokenOut="MGP" />
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
</Page>);
GetMGPPage.displayName = "GetMGPPage";
