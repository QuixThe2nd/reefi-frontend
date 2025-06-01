import { formatEther, parseEther } from "../utilities";
import { memo, ReactElement } from "react";

interface AmountInputProperties {
  readonly label: string;
  readonly balance: bigint;
  readonly value: bigint;
  readonly onChange: (_value: bigint) => void;
  readonly token: Readonly<{
    symbol: string;
    color: string;
    bgColor: string;
  }>;
  readonly placeholder?: string;
}

export const AmountInput = memo(({ label, balance, value, onChange, token, placeholder }: AmountInputProperties): ReactElement => <div className="mb-4">
  <div className="mb-1 flex items-center justify-between">
    <h3 className="font-medium">{label}</h3>
    <div className="text-sm text-gray-400">Balance: {formatEther(balance, 18).toFixed(4)} {token.symbol}</div>
  </div>
  <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4">
    <input className="w-3/4 bg-transparent text-xl outline-none" onChange={event => onChange(parseEther(Number.isNaN(Number.parseFloat(event.target.value)) ? 0 : Number.parseFloat(event.target.value)))} placeholder={placeholder ?? "0"} type="text" value={value === 0n ? undefined : formatEther(value)} />
    <div className="flex items-center space-x-2">
      <button className="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onClick={() => onChange(balance)} type="button">MAX</button>
      <div className={`flex items-center rounded-md px-3 py-1 ${token.bgColor}`}>
        <div className={`mr-2 flex size-5 items-center justify-center rounded-full ${token.color}`}>{token.symbol[0]?.toUpperCase()}</div>
        <span>{token.symbol}</span>
      </div>
    </div>
  </div>
</div>);
AmountInput.displayName = "AmountInput";
