import { memo, type ReactElement } from "react";

import { Chains } from "../config/contracts";
import { TokenBalances } from "./TokenBalances";

interface Properties {
  ens: string | undefined;
  chain: Chains;
  account: `0x${string}` | undefined;
  isConnecting: boolean;
  setChain: (_chain: Chains) => void;
  connectWallet: () => void;
  mgpBalance: bigint;
  rmgpBalance: bigint;
  ymgpBalance: bigint;
  cmgpBalance: bigint;
}

export const Header = memo(({ ens, chain, account, isConnecting, setChain, connectWallet, mgpBalance, rmgpBalance, ymgpBalance, cmgpBalance }: Properties): ReactElement => <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-gray-800 p-4">
  <div className="flex items-center gap-4">
    <h1 className="text-xl font-bold">REEFI</h1>
    <p className="hidden lg:block">Refinance Magpie Yield and Governance</p>
  </div>
  {account === undefined ? <button className="rounded-lg bg-green-600 px-4 py-2 transition-colors hover:bg-green-700" disabled={isConnecting} onClick={connectWallet} type="button">{isConnecting ? "Connecting..." : "Connect Wallet"}</button> : <div className="flex items-center space-x-4">
    <TokenBalances mgpBalance={mgpBalance} rmgpBalance={rmgpBalance} ymgpBalance={ymgpBalance} cmgpBalance={cmgpBalance} />
    <div className="rounded-lg bg-green-600/20 px-3 py-2 text-sm text-green-400">{ens ?? `${account.slice(0, 6)}...${account.slice(-4)}`}</div>
    <select
      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white" onChange={event => {
        setChain(Number(event.target.value) as 56 | 42_161);
        globalThis.localStorage.setItem("chain", String(event.target.value));
      }} value={chain}
    >
      <option value="56">BNB Chain</option>
      <option value="42161">Arbitrum</option>
    </select>
  </div>}
</div>);
Header.displayName = "Header";
