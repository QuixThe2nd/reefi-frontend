import { formatEther } from "../utilities";
import { isPrimaryCoin, type PrimaryCoin, type CoreCoin, type CurveCoin, type SecondaryCoin, isCurveCoin, isSecondaryCoin } from "../state/useContracts";
import { useSendTransaction, type UseWriteContractReturnType } from "wagmi";
import { useWriteSaveContract } from "../hooks/useWriteSaveContract";

import { Button } from "./Button";
import { CurveBuy } from "./CurveBuy";
import { TokenApproval } from "./TokenApproval";

import type { ApproveFunction } from "../actions/approve";
import type { BuyOnCurve } from "../actions/buyOnCurve";
import type { BuyOnOdos } from "../actions/buyOnOdos";
import type { FlattenRecord, useAmounts } from "../state/useAmounts";
import type { JSX, ReactElement } from "react";
import type { useAllowances } from "../state/useAllowances";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { wagmiConfig } from "..";

interface Properties {
  readonly label: string;
  readonly tokenIn: CurveCoin | SecondaryCoin | "wstMGP";
  readonly tokenOut: "wstMGP" | "WETH" | "ETH" | "bMGP" | CurveCoin;
  readonly send: bigint;
  readonly balances: ReturnType<typeof useBalances>;
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly curveBuy: BuyOnCurve;
  readonly odosBuy: BuyOnOdos;
  readonly nativeSwap: ((_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void);
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
}

const exchangeRates = (tokenIn: CoreCoin, tokenOut: CoreCoin, balances: ReturnType<typeof useBalances>, supplies: ReturnType<typeof useSupplies>): number => {
  if (tokenIn === "MGP" || tokenIn === "vlMGP" || tokenIn === "stMGP") {
    if (tokenOut === "MGP" || tokenOut === "vlMGP" || tokenOut === "stMGP" || tokenOut === "bMGP") return 1;
    if (tokenOut === "yMGP" || tokenOut === "vMGP") return supplies.wstMGP === 0n ? 1 : Number(supplies.wstMGP) / Number(balances.wstMGP.stMGP);
    if (tokenOut === "wstMGP") return Number(supplies.stMGP_shares) / Number(supplies.stMGP);
  } else if (tokenIn === "wstMGP" || tokenIn === "yMGP" || tokenIn === "syMGP" || tokenIn === "vMGP") {
    if (tokenOut === "MGP" || tokenOut === "vlMGP") return balances.wstMGP.stMGP === 0n ? 1 : Number(balances.wstMGP.stMGP) / Number(supplies.wstMGP);
    if (tokenOut === "wstMGP" || tokenOut === "yMGP" || tokenOut === "syMGP" || tokenOut === "vMGP") return 1;
    if (tokenOut === "stMGP") return Number(supplies.stMGP) / Number(supplies.stMGP_shares);
  }
  return 0;
};

export const SwapButton = ({ curveBuy, odosBuy, nativeSwap, tokenIn, tokenOut, label, curveAmounts, allowances, send, approve, mintWETH, balances, supplies }: Properties): ReactElement => {
  const { writeContract: writeContractApprove, isPending: isPendingApprove } = useWriteSaveContract("Token Approval");
  const { writeContract: writeContractCurve, isPending: isPendingCurve } = useWriteSaveContract("Curve Swap");
  const { writeContract: writeContractETH, isPending: isPendingETH } = useWriteSaveContract("WETH Minted");
  const { writeContract: writeContractWETH, isPending: isPendingWETH } = useWriteSaveContract("MGP Purchased");
  const { writeContract: writeContractNative, isPending: isPendingNative } = useWriteSaveContract("Native Swap");
  const { sendTransaction, isPending: isPendingTransaction } = useSendTransaction();
  const buttons = [] as JSX.Element[];

  if (isPrimaryCoin(tokenIn) && isPrimaryCoin(tokenOut)) {
    const nativeRate = exchangeRates(tokenIn, tokenOut, balances, supplies);
    if (tokenIn === "MGP" && tokenOut === "stMGP" || tokenIn === "stMGP" && tokenOut === "wstMGP" || tokenIn === "wstMGP" && tokenOut === "yMGP" || tokenIn === "yMGP" && tokenOut === "vMGP" || tokenIn === "yMGP" && tokenOut === "wstMGP" || tokenIn === "wstMGP" && tokenOut === "stMGP" || tokenIn === "stMGP" && tokenOut === "bMGP") buttons.push(<div>
      {tokenIn === "MGP" && tokenOut === "stMGP" && <TokenApproval allowance={allowances.stMGP_MGP} isLoading={isPendingApprove} onApprove={infinity => approve(tokenIn, tokenOut, infinity, writeContractApprove)} send={send} tokenSymbol={tokenIn} />}
      <Button className="w-full" disabled={send > balances.user[tokenIn]} isLoading={isPendingNative} onClick={() => nativeSwap(tokenIn, tokenOut, writeContractNative)} type="submit">{label} ({formatEther(BigInt(Math.round(Number(send) * (Number.isFinite(nativeRate) ? nativeRate : 1)))).toFixed(4)} {tokenOut})</Button>
    </div>);

    if (isCurveCoin(tokenOut) || tokenOut === "wstMGP") buttons.push(<CurveBuy allowanceCurve={allowances.curve[tokenIn]} buy={curveBuy} curveAmount={curveAmounts[`${tokenIn}_${tokenOut}` as keyof FlattenRecord<Record<PrimaryCoin, bigint>>]} isLoading={isPendingCurve} nativeRate={nativeRate} onApprove={infinity => approve(tokenIn, "cMGP", infinity, writeContractCurve)} send={send} tokenIn={tokenIn} tokenOut={tokenOut} />);
  } else buttons.push(<>
    {tokenIn === "ETH" && <Button className="mb-2 w-full" isLoading={isPendingETH} onClick={() => mintWETH(writeContractETH)} type="submit" variant="secondary">Wrap ETH</Button>}
    {isSecondaryCoin(tokenIn) && <>
      <TokenApproval allowance={allowances.odos[tokenIn === "ETH" ? "WETH" : tokenIn]} isLoading={isPendingWETH} onApprove={infinity => approve(tokenIn === "ETH" ? "WETH" : tokenIn, "odosRouter", infinity, writeContractWETH)} send={send} tokenSymbol={tokenIn} />
      <Button className="w-full" disabled={send > balances.user[tokenIn]} isLoading={isPendingTransaction} onClick={() => odosBuy({ tokenIn: tokenIn === "ETH" ? "WETH" : tokenIn, sendTransaction })} type="submit" variant="secondary">Swap to MGP With Odos</Button>
    </>}
  </>);
  return <div className={`gap-2 grid grid-cols-${buttons.length}`}>{buttons}</div>;
};
