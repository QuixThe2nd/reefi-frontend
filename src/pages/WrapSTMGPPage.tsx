import { memo, type ReactElement } from "react";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { Chains, CoreCoinExtended, TransferrableCoin } from "../config/contracts";
import type { UseSendTransactionReturnType, UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../state/useAllowances";
import type { useAmounts } from "../state/useAmounts";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { wagmiConfig } from "..";

interface Properties {
  readonly balances: ReturnType<typeof useBalances>;
  readonly send: bigint;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly chain: Chains;
  readonly approve: (_coin: TransferrableCoin, _spender: "wstMGP" | "stMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _infinity: boolean, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`, _sendTransaction: UseSendTransactionReturnType<typeof wagmiConfig>["sendTransaction"]) => void;
  readonly setSend: (_send: bigint) => void;
  readonly nativeSwap: (_tokenIn: CoreCoinExtended, _tokenOut: CoreCoinExtended, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
}

export const WrapSTMGPPage = memo(({ balances, setSend, send, allowances, chain, approve, mintWETH, swap, curveAmounts, supplies, nativeSwap }: Properties): ReactElement => <Page info={<span>stMGP can be wrapped for wstMGP. 1 stMGP receives 1 vlMGP worth of wstMGP. stMGP can be wrapped on any chain.</span>} noTopMargin>
  <SwapToken allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH", "MGP", "wstMGP", "yMGP", "vMGP"]} label="Unwrap" mintWETH={mintWETH} nativeSwap={nativeSwap} originalTokenIn="stMGP" send={send} setSend={setSend} supplies={supplies} swap={swap} tokenOut="wstMGP" />
</Page>);
WrapSTMGPPage.displayName = "WrapSTMGPPage";
