import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { ApproveFunction } from "../actions/approve";
import type { BuyOnCurve } from "../actions/buyOnCurve";
import type { BuyOnOdos } from "../actions/buyOnOdos";
import type { CoreCoin } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
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
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveBuy: BuyOnCurve;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly odosBuy: BuyOnOdos;
}

export const SellYMGP = ({ balances, setSend, send, allowances, approve, mintWETH, curveAmounts, supplies, curveBuy, nativeSwap, odosBuy }: Properties) => <Page info={[<span key="redeem_options">yMGP can be redeemed for 75% of it&apos;s underlying wstMGP instantly or swapped at market rate via Curve.</span>, <span key="withdraw_fee">60% of the withdraw fee (15% of withdraw) is distributed to yMGP lockers with 40% of the fee (10% total) sent to the treasury.</span>]}>
  <SwapToken allowances={allowances} approve={approve} balances={balances} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH", "ETH", "cMGP", "vMGP", "vlMGP", "stMGP", "MGP", "wstMGP", "syMGP", "rMGP", "bMGP"]} label="Redeem" mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} originalTokenIn="yMGP" send={send} setSend={setSend} supplies={supplies} tokenOut="wstMGP" />
</Page>;
