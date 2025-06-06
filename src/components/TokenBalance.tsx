import { formatEther } from "../utilities";
import { memo, ReactElement } from "react";

import { AllCoin } from "../config/contracts";

export const TokenBalance = memo(({ symbol, balance, decimals }: Readonly<{ symbol: AllCoin; balance: bigint; decimals: number }>): ReactElement => <div className="rounded-lg bg-gray-700 px-3 py-2 text-sm">{symbol}: {formatEther(balance, decimals).toFixed(2)}</div>);
TokenBalance.displayName = "TokenBalance";
