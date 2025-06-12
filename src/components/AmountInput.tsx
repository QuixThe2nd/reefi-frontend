import { coins, type AllCoin } from "../config/contracts";
import { formatEther, parseEther } from "../utilities";
import { memo, type ReactElement } from "react";

import { Button } from "./Button";

interface AmountInputProperties {
  readonly label: string;
  readonly balance: bigint;
  readonly value: bigint;
  readonly onChange: (_value: bigint) => void;
  readonly token: Readonly<{ symbol: AllCoin }>;
  readonly placeholder?: string;
}

export const AmountInput = memo(({ label, balance, value, onChange, token, placeholder = "0" }: AmountInputProperties): ReactElement => <div className="mb-4">
  <div className="mb-1 flex items-center justify-between">
    <h3 className="font-medium">{label}</h3>
    <div className="text-sm text-gray-400">Balance: {formatEther(balance, 18).toFixed(4)} {token.symbol}</div>
  </div>
  <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4">
    <input className="w-3/4 bg-transparent text-xl outline-none" onChange={event => onChange(parseEther(Number.isNaN(Number.parseFloat(event.target.value)) ? 0 : Number.parseFloat(event.target.value)))} placeholder={placeholder} type="text" value={value === 0n ? undefined : formatEther(value)} />
    <div className="flex items-center space-x-2">
      <Button onClick={() => onChange(balance)} size="xs" type="button" variant="ghost">MAX</Button>
      <div className={`flex items-center rounded-md px-3 py-1 ${coins[token.symbol].bgColor}`}>
        <img className="mr-2 size-5" src={coins[token.symbol].icon} />
        <span>{token.symbol}</span>
      </div>
    </div>
  </div>
</div>);
AmountInput.displayName = "AmountInput";
