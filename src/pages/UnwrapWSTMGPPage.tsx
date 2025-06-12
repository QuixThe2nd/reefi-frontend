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
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly chain: Chains;
  readonly approve: (_coin: TransferrableCoin, _spender: "wstMGP" | "stMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _infinity: boolean, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`, _sendTransaction: UseSendTransactionReturnType<typeof wagmiConfig>["sendTransaction"]) => void;
  readonly nativeSwap: (_tokenIn: CoreCoinExtended, _tokenOut: CoreCoinExtended, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
}

export const UnwrapWSTMGPPage = memo(({ balances, setSend, send, allowances, chain, approve, mintWETH, swap, curveAmounts, supplies, nativeSwap }: Properties): ReactElement => <Page info={<span>wstMGP can be unwrapped as stMGP. 1 stMGP represents 1 vlMGP but earns no yield. stMGP can be bridged cross-chain.</span>} noTopMargin>
  <SwapToken allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH"]} label="Wrap" mintWETH={mintWETH} nativeSwap={nativeSwap} originalTokenIn="wstMGP" send={send} setSend={setSend} supplies={supplies} swap={swap} tokenOut="stMGP" />
</Page>);
UnwrapWSTMGPPage.displayName = "UnwrapWSTMGPPage";
