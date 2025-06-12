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
  readonly balances: ReturnType<typeof useBalances>;
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly chain: Chains;
  readonly approve: (_coin: TransferrableCoin, _spender: "wstMGP" | "stMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _infinity: boolean, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`, _sendTransaction: UseSendTransactionReturnType<typeof wagmiConfig>["sendTransaction"]) => void;
  readonly curveBuy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly nativeSwap: (_tokenIn: CoreCoinExtended, _tokenOut: CoreCoinExtended, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
}

export const GetYMGPPage = memo(({ balances, setSend, send, allowances, chain, approve, mintWETH, swap, curveAmounts, supplies, curveBuy, nativeSwap }: Properties): ReactElement => <Page info={<span>yMGP is backed 1:1 by wstMGP. 1 yMGP can be redeemed for 0.75 wstMGP. yMGP alone has no additional benefit over wstMGP, it must be locked for boosted yield.</span>}>
  <SwapToken allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["CKP", "EGP", "PNP", "LTP", "WETH", "ETH", "cMGP", "stMGP", "vlMGP", "lyMGP", "lvMGP", "MGP", "vMGP"]} label="Mint" mintWETH={mintWETH} nativeSwap={nativeSwap} originalTokenIn="wstMGP" send={send} setSend={setSend} supplies={supplies} swap={swap} tokenOut="yMGP" />
</Page>);
GetYMGPPage.displayName = "ConvertPage";
