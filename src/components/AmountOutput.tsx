import { coins, type AllCoin } from "../state/useContracts";
import { formatEther, formatNumber } from "../utilities";

interface AmountOutputProperties {
  readonly label: string;
  readonly balance: bigint;
  readonly value: bigint;
  readonly token: Readonly<{ symbol: AllCoin }>;
  readonly placeholder?: string;
}

export const AmountOutput = ({ label, balance, value, token, placeholder = "0" }: AmountOutputProperties) => <div className="mb-4">
  <div className="mb-1 flex items-center justify-between">
    <h3 className="font-medium">{label}</h3>
    <div className="text-sm text-gray-400">Balance: {formatNumber(formatEther(balance, 18), 4)} {token.symbol}</div>
  </div>
  <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4">
    <input className="w-3/4 bg-transparent text-xl outline-none" disabled max={formatEther(balance)} placeholder={placeholder} type="text" value={value === 0n ? undefined : formatEther(value)} />
    <div className="flex items-center space-x-2">
      <div className={`flex items-center rounded-md px-3 py-1 ${coins[token.symbol].bgColor}`}>
        <img className="mr-2 size-5" src={coins[token.symbol].icon} />
        <span>{token.symbol}</span>
      </div>
    </div>
  </div>
</div>;
