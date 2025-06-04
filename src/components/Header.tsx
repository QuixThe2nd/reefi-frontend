import { memo, type ReactElement } from "react";

import { Chains } from "../config/contracts";
import { Pages } from "../App";
import { TokenBalances } from "./TokenBalances";

interface Properties {
  ens: string | undefined;
  chain: Chains;
  page: Pages | undefined;
  account: `0x${string}` | undefined;
  isConnecting: boolean;
  setPage: (_page: Pages | undefined) => void;
  setChain: (_chain: Chains) => void;
  connectWallet: () => void;
  mgpBalance: bigint;
  rmgpBalance: bigint;
  ymgpBalance: bigint;
  cmgpBalance: bigint;
}

const getHeaderContent = (page: Pages | undefined, setPage: (_page: Pages | undefined) => void) => {
  if (page === "claim") return (
    <>
      <button onClick={() => setPage(undefined)} className="text-blue-400 hover:text-blue-300" type="button">← Back</button>
      <h1 className="text-xl font-bold text-green-400">💰 Claim Yield</h1>
    </>
  );

  if (page === "vote") return (
    <>
      <button onClick={() => setPage(undefined)} className="text-blue-400 hover:text-blue-300" type="button">← Back</button>
      <h1 className="text-xl font-bold text-red-400">🗳️ Vote on Proposals</h1>
    </>
  );

  if (page === "bridge") return (
    <>
      <button onClick={() => setPage(undefined)} className="text-blue-400 hover:text-blue-300" type="button">← Back</button>
      <h1 className="text-xl font-bold text-blue-400">🗳️ Bridge rMGP</h1>
    </>
  );

  return (
    <>
      <h1 className="text-xl font-bold text-blue-500">REEFI</h1>
      <p className="hidden lg:block">Refinance Magpie Yield and Governance</p>
    </>
  );
};

export const Header = memo(({ ens, chain, page, setPage, account, isConnecting, setChain, connectWallet, mgpBalance, rmgpBalance, ymgpBalance, cmgpBalance }: Properties): ReactElement => <div className="sticky top-0 z-10 flex w-full items-center justify-between p-4 bg-gray-800">
  <div className="flex items-center gap-4">
    {getHeaderContent(page, setPage)}
    <button onClick={() => setPage("claim")} className="rounded-lg bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 hover:from-green-500 hover:via-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 hover:shadow-green-400/40 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105" type="button">💰 Claim</button>
    <button onClick={() => setPage("vote")} className="rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-500 hover:via-red-400 hover:to-orange-500 text-white shadow-lg shadow-green-500/25 hover:shadow-green-400/40 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105" type="button">🗳️ Vote</button>
    <button onClick={() => setPage("bridge")} className="rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-teal-600 hover:from-blue-500 hover:via-blue-400 hover:to-teal-500 text-white shadow-lg shadow-green-500/25 hover:shadow-blue-400/40 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105" type="button">🌐 Bridge</button>
  </div>
  {account === undefined ? <button className="rounded-lg bg-green-600 px-4 py-2 transition-colors hover:bg-green-700" disabled={isConnecting} onClick={connectWallet} type="button">
    {isConnecting ? "Connecting..." : "Connect Wallet"}
  </button> : <div className="flex items-center space-x-4">
    <TokenBalances mgpBalance={mgpBalance} rmgpBalance={rmgpBalance} ymgpBalance={ymgpBalance} cmgpBalance={cmgpBalance} />
    <div className="rounded-lg bg-blue-600/20 px-3 py-2 text-sm text-blue-400">{ens ?? `${account.slice(0, 6)}...${account.slice(-4)}`}</div>
    <select
      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
      onChange={event => {
        setChain(Number(event.target.value) as 56 | 42_161);
        globalThis.localStorage.setItem("chain", String(event.target.value));
      }}
      value={chain}
    >
      <option value="56">BNB Chain</option>
      <option value="42161">Arbitrum</option>
    </select>
  </div>
  }
</div>);
Header.displayName = "Header";
