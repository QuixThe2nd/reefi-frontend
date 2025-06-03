import { coins, decimals, type Coins } from "../config/contracts";
import { formatEther } from "../utilities";
import { memo, useEffect, useRef, useState, Fragment, type ReactElement } from "react";

import { Button } from "./Button";
import ETH from "../../public/icons/ETH.svg";
import { UsePrices } from "../hooks/usePrices";

interface Properties {
  readonly label: string;
  readonly selectedCoin: Coins | "ETH";
  readonly onCoinChange: (_coin: Coins | "ETH") => void;
  readonly balance: bigint;
  readonly value: bigint;
  readonly onChange: (_value: bigint) => void;
  readonly outputCoin: Coins;
  readonly excludeCoins: Coins[];
  readonly prices: UsePrices;
  readonly ymgpMgpCurveRate: number;
  readonly mgpRmgpCurveRate: number;
}

export const SwapInput = memo(({ label, selectedCoin, onCoinChange, balance, value, onChange, outputCoin, excludeCoins, prices, ymgpMgpCurveRate, mgpRmgpCurveRate }: Properties): ReactElement => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownReference = useRef<HTMLDivElement>(null);
  excludeCoins.push(outputCoin, "cMGP");
  const availableCoins = (Object.keys(coins) as Coins[]).filter(coin => !excludeCoins.includes(coin));
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownReference.current && !dropdownReference.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const estimatedOutput = (): string | undefined => {
    if (value === 0n) return undefined;
    const inputAmount = formatEther(value, decimals[selectedCoin]);
    if (selectedCoin === "rMGP" && outputCoin === "yMGP") return undefined;
    if (selectedCoin === "MGP" && outputCoin === "rMGP") return undefined;
    if (selectedCoin === "yMGP" && outputCoin === "rMGP") return undefined;
    else if (selectedCoin === "yMGP" && outputCoin === "MGP") return `${(inputAmount / ymgpMgpCurveRate).toFixed(6)} ${outputCoin}`;
    else if (outputCoin === "rMGP") {
      const priceKey = selectedCoin === "ETH" ? "WETH" : selectedCoin;
      return `${(inputAmount * prices[priceKey] / prices.MGP / mgpRmgpCurveRate).toFixed(6)} ${outputCoin}`;
    }
    return undefined;
  };

  const handleCoinChange = (coin: Coins | "ETH") => {
    onCoinChange(coin);
    setIsDropdownOpen(false);
  };

  return <div className="mb-4">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="font-medium">{label}</h3>
      <span className="text-sm text-gray-400">Balance: {formatEther(balance, decimals[selectedCoin]).toFixed(4)} {selectedCoin}</span>
    </div>
    <div className="flex items-center justify-between rounded-lg bg-gray-900 p-4">
      <input className="w-3/4 bg-transparent text-xl outline-none" onChange={event => {
        onChange(BigInt(Math.round((Number.isNaN(Number.parseFloat(event.target.value)) ? 0 : Number.parseFloat(event.target.value)) * Number(10n ** BigInt(decimals[selectedCoin])))));
      }} placeholder='0' type="text" value={value === 0n ? undefined : formatEther(value, decimals[selectedCoin])} />
      <div className="flex items-center space-x-2">
        <Button size="xs" variant="ghost" onClick={() => {
          onChange(balance);
        }} type="button">MAX</Button>
        <div className="relative" ref={dropdownReference}>
          <button className={["flex cursor-pointer items-center rounded-md px-3 py-1 transition-opacity hover:opacity-90", coins[selectedCoin === "ETH" ? "WETH" : selectedCoin].bgColor].join(" ")} onClick={() => {
            setIsDropdownOpen(!isDropdownOpen);
          }} type="button">
            <img className="mr-2 size-5" src={selectedCoin === "ETH" ? ETH : coins[selectedCoin].icon} />
            <span className="mr-2">{selectedCoin}</span>
            <svg className={`size-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
          </button>
          {isDropdownOpen ? <div className="absolute right-0 top-full z-50 mt-1 min-w-32 rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
            {availableCoins.map(coin => <Fragment key={coin}>
              <button className={`flex w-full items-center px-3 py-2 transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-700 ${selectedCoin === coin ? "bg-gray-700" : ""}`} key={coin} onClick={() => handleCoinChange(coin)} type="button">
                <img className="mr-2 size-5" src={coins[coin].icon} />
                <span>{coin}</span>
              </button>
              {coin === "WETH" && <button className={`flex w-full items-center px-3 py-2 transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-700 ${selectedCoin === coin.replace("W", "") ? "bg-gray-700" : ""}`} key={coin} onClick={() => handleCoinChange(coin.replace("W", "") as "ETH")} type="button">
                <img className="mr-2 size-5" src={ETH} />
                <span>{coin.replace("W", "")}</span>
              </button>}
            </Fragment>)}
          </div> : undefined}
        </div>
      </div>
    </div>
    {estimatedOutput() !== undefined && <div className="mt-2 text-center text-sm text-gray-400">≈{estimatedOutput()}</div>}
  </div>;
});

SwapInput.displayName = "SwapInput";
