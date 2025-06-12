/* eslint @typescript-eslint/no-unnecessary-condition: 0 */
import { contracts, isPrimaryCoin, type Chains, type AllCoinETH, type CoreCoin, type PrimaryCoin, type CoreCoinExtended, type TransferrableCoin } from "../config/contracts";
import { formatEther } from "../utilities";
import { useSendTransaction, useWriteContract, type UseSendTransactionReturnType, type UseWriteContractReturnType } from "wagmi";

import { Button } from "./Button";
import { BuyOnCurve } from "./BuyOnCurve";
import { TokenApproval } from "./TokenApproval";

import type { FlattenRecord, useAmounts } from "../state/useAmounts";
import type { JSX, ReactElement } from "react";
import type { useAllowances } from "../state/useAllowances";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { wagmiConfig } from "..";

interface Properties {
  readonly label: string;
  readonly tokenIn: AllCoinETH;
  readonly tokenOut: AllCoinETH;
  readonly send: bigint;
  readonly chain: Chains;
  readonly balances: ReturnType<typeof useBalances>;
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly curveBuy: undefined | ((_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void);
  readonly nativeSwap: undefined | ((_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void);
  readonly approve: (_coin: TransferrableCoin, _spender: "wstMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _infinity: boolean, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`, _sendTransaction: UseSendTransactionReturnType<typeof wagmiConfig>["sendTransaction"]) => void;
}

const exchangeRates = (tokenIn: CoreCoinExtended, tokenOut: CoreCoinExtended, balances: ReturnType<typeof useBalances>, supplies: ReturnType<typeof useSupplies>): number => {
  if (tokenIn === "MGP" || tokenIn === "vlMGP" || tokenIn === "stMGP") {
    if (tokenOut === "MGP" || tokenOut === "vlMGP" || tokenOut === "stMGP") return 1;
    if (tokenOut === "wstMGP" || tokenOut === "yMGP" || tokenOut === "vMGP" || tokenOut === "lyMGP" || tokenOut === "lvMGP") return supplies.wstMGP === 0n ? 1 : Number(supplies.wstMGP) / Number(balances.wstMGP.MGP);
  } else if (tokenIn === "wstMGP" || tokenIn === "yMGP" || tokenIn === "lyMGP" || tokenIn === "vMGP" || tokenIn === "lvMGP") {
    if (tokenOut === "MGP" || tokenOut === "vlMGP" || tokenOut === "stMGP") return balances.wstMGP.MGP === 0n ? 1 : Number(balances.wstMGP.MGP) / Number(supplies.wstMGP);
    if (tokenOut === "wstMGP" || tokenOut === "yMGP" || tokenOut === "lyMGP" || tokenOut === "vMGP" || tokenOut === "lvMGP") return 1;
  }
  return 0;
};

export const SwapButton = ({ curveBuy, nativeSwap, tokenIn, tokenOut, label, curveAmounts, allowances, send, chain, approve, mintWETH, swap, balances, supplies }: Properties): ReactElement => {
  const { writeContract: writeContractApprove, isPending: isPendingApprove } = useWriteContract();
  const { writeContract: writeContractCurve, isPending: isPendingCurve } = useWriteContract();
  const { writeContract: writeContractETH, isPending: isPendingETH } = useWriteContract();
  const { writeContract: writeContractWETH, isPending: isPendingWETH } = useWriteContract();
  const { writeContract: writeContractNative, isPending: isPendingNative } = useWriteContract();
  const { sendTransaction } = useSendTransaction();
  const buttons = [] as JSX.Element[];
  if (tokenIn === "MGP" && tokenOut === "wstMGP" || tokenIn === "wstMGP" && tokenOut === "yMGP" || tokenIn === "yMGP" && tokenOut === "vMGP" || tokenIn === "yMGP" && tokenOut === "wstMGP") {
    const nativeRate = exchangeRates(tokenIn, tokenOut, balances, supplies);
    buttons.push(<div>
      <TokenApproval allowance={allowances[`${tokenOut}_${tokenIn}` as keyof typeof allowances]} isLoading={isPendingApprove} onApprove={infinity => approve(tokenIn, tokenOut, infinity, writeContractApprove)} send={send} tokenSymbol={tokenIn} />
      <Button className="w-full" isLoading={isPendingNative} onClick={() => nativeSwap?.(tokenIn, tokenOut, writeContractNative)} type="submit">{label} ({formatEther(BigInt(Math.round(Number(send) * nativeRate))).toFixed(4)} {tokenOut})</Button>
    </div>);
    if (isPrimaryCoin(tokenIn) && isPrimaryCoin(tokenOut) && curveBuy) buttons.push(<BuyOnCurve allowanceCurve={allowances[`cMGP_${tokenIn}`]} buy={curveBuy} curveAmount={curveAmounts[`${tokenIn}_${tokenOut}` as keyof FlattenRecord<Record<PrimaryCoin, bigint>>]} isLoading={isPendingCurve} nativeRate={nativeRate} onApprove={infinity => approve(tokenIn, "cMGP", infinity, writeContractCurve)} send={send} tokenIn={tokenIn} tokenOut={tokenOut} />);
  } else buttons.push(<>
    {tokenIn === "ETH" && <Button className="mb-2 w-full" isLoading={isPendingETH} onClick={() => mintWETH(writeContractETH)} type="submit" variant="secondary">Wrap ETH</Button>}
    {tokenIn === "WETH" && <TokenApproval allowance={allowances[`odos_${tokenIn}`]} isLoading={isPendingWETH} onApprove={infinity => approve(tokenIn, "odosRouter", infinity, writeContractWETH)} send={send} tokenSymbol={tokenIn} />}
    <Button className="w-full" onClick={() => swap(contracts[chain][tokenIn === "ETH" ? "WETH" : tokenIn], contracts[chain].MGP, sendTransaction)} type="submit" variant="secondary">Swap to MGP With Odos</Button>
  </>);

  return <div className={`gap-2 grid grid-cols-${buttons.length}`}>{buttons}</div>;
};
