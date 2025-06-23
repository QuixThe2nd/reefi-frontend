import { coins, type AllCoin } from "../state/useContracts";
import { formatEther } from "../utilities";

import type { ReactElement } from "react";

export const TokenBalance = ({ symbol, balance, decimals }: Readonly<{ symbol: AllCoin; balance: bigint; decimals: number }>): ReactElement => <span className="text-xs flex gap-1 items-center" style={{ direction: "ltr", margin: 0 }}><img className="h-4" src={coins[symbol].icon} /> {symbol}: {formatEther(balance, decimals).toFixed(2)}</span>;
