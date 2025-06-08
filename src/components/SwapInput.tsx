import { coins, decimals, AllCoinETH } from "../config/contracts";
import { formatEther } from "../utilities";
import { memo, useEffect, useRef, useState, Fragment, type ReactElement } from "react";

import { Button } from "./Button";
import ETH from "../../public/icons/ETH.svg";

interface Properties {
  readonly label: string;
  readonly value: bigint;
  readonly balance: bigint;
  readonly selectedCoin: AllCoinETH;
  readonly excludeCoins: AllCoinETH[];
  readonly onCoinChange: (_coin: AllCoinETH) => void;
  readonly onChange: (_value: bigint) => void;
}

const TokenDropdown = ({ shownCoins, selectedCoin, handleCoinChange }: { shownCoins: AllCoinETH[]; selectedCoin: AllCoinETH; handleCoinChange: (_coin: AllCoinETH) => void }) => <div className="absolute right-0 top-full z-50 mt-1 min-w-32 rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
  {shownCoins.map(coin => <Fragment key={coin}>
    <button className={`flex w-full items-center px-3 py-2 transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-700 ${selectedCoin === coin ? "bg-gray-700" : ""}`} key={coin} onClick={() => handleCoinChange(coin)} type="button">
      <img className="mr-2 size-5" src={coins[coin].icon} />
      <span>{coin}</span>
    </button>
  </Fragment>)}
</div>;

export const SwapInput = memo(({ label, value, balance, selectedCoin, excludeCoins, onCoinChange, onChange }: Properties): ReactElement => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownReference = useRef<HTMLDivElement>(null);
  const availableCoins = (Object.keys(coins) as AllCoinETH[]).filter(coin => !excludeCoins.includes(coin));
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownReference.current && !dropdownReference.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (): void => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCoinChange = (coin: AllCoinETH) => {
    onCoinChange(coin);
    setIsDropdownOpen(false);
  };

  return <div className="mb-4">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="font-medium">{label}</h3>
      <span className="text-sm text-gray-400">Balance: {formatEther(balance, decimals[selectedCoin]).toFixed(4)} {selectedCoin}</span>
    </div>
    <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4">
      <input className="w-3/4 bg-transparent text-xl outline-none" onChange={event => onChange(BigInt(Math.round((Number.isNaN(Number.parseFloat(event.target.value)) ? 0 : Number.parseFloat(event.target.value)) * Number(10n ** BigInt(decimals[selectedCoin])))))} placeholder='0' type="text" value={value === 0n ? undefined : formatEther(value, decimals[selectedCoin])} />
      <div className="flex items-center space-x-2">
        <Button size="xs" variant="ghost" onClick={() => onChange(balance)} type="button">MAX</Button>
        <div className="relative" ref={dropdownReference}>
          <button className={["flex cursor-pointer items-center rounded-md px-3 py-1 transition-opacity hover:opacity-90", coins[selectedCoin === "ETH" ? "WETH" : selectedCoin].bgColor].join(" ")} onClick={() => availableCoins.length > 1 && setIsDropdownOpen(!isDropdownOpen)} type="button">
            <img className="mr-2 size-5" src={selectedCoin === "ETH" ? ETH : coins[selectedCoin].icon} />
            <span className="mr-2">{selectedCoin}</span>
            {availableCoins.length > 1 && <svg className={`size-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>}
          </button>
          {isDropdownOpen && <TokenDropdown shownCoins={availableCoins} selectedCoin={selectedCoin} handleCoinChange={handleCoinChange} />}
        </div>
      </div>
    </div>
  </div>;
});

SwapInput.displayName = "SwapInput";
