import { formatEther, formatNumber } from "../utilities";

import type { AllCoin } from "../state/useContracts";

interface AmountOutputProperties {
  readonly label: string;
  readonly balance: bigint;
  readonly token: Readonly<{ symbol: AllCoin }>;
}

export const AmountOutput = ({ label, balance, token }: AmountOutputProperties) => <div className="mb-4">
  <div className="mb-1 flex items-center justify-between">
    <h3 className="font-medium">{label}</h3>
    <div className="text-sm text-gray-400">Balance: {formatNumber(formatEther(balance, 18), 4)} {token.symbol}</div>
  </div>
</div>;
