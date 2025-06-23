import { decimals, PrimaryCoinSchema, type PrimaryCoin } from "../state/useContracts";

import { TokenBalance } from "./TokenBalance";

import type { ReactElement } from "react";

interface Properties {
  readonly balances: Record<Exclude<PrimaryCoin, "bMGP">, bigint>;
}

export const TokenBalances = ({ balances }: Properties): ReactElement => <div className="hidden rounded-xl space-x-1 md:grid md:grid-flow-col md:grid-rows-1 md:auto-cols-max bg-[#1A1B1F] px-4 gap-x-2" style={{ direction: "rtl" }}>
  {PrimaryCoinSchema.options.filter(coin => coin !== "bMGP").map(coin => balances[coin] ? <TokenBalance balance={balances[coin]} decimals={decimals[coin]} key={coin} symbol={coin} /> : undefined)}
</div>;
