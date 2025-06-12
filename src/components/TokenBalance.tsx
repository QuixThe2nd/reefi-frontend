import { formatEther } from "../utilities";
import { memo, type ReactElement } from "react";

import type { AllCoin } from "../config/contracts";

export const TokenBalance = memo(({ symbol, balance, decimals }: Readonly<{ symbol: AllCoin; balance: bigint; decimals: number }>): ReactElement => <div className="rounded-lg bg-[#1A1B1F] px-3 py-2 text-sm">{symbol}: {formatEther(balance, decimals).toFixed(2)}</div>);
TokenBalance.displayName = "TokenBalance";
