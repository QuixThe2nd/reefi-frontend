import "@rainbow-me/rainbowkit/styles.css";

import { mainnet } from "viem/chains";
import { useAccount, useEnsName, useEnsAvatar, createConfig, webSocket } from "wagmi";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { TokenBalances } from "./TokenBalances";

import type { Pages } from "../App";
import { type ReactElement } from "react";

interface Properties {
  readonly page: Pages | undefined;
  readonly setPage: (_page: Pages | undefined) => void;
  readonly mgpBalance: bigint;
  readonly rmgpBalance: bigint;
  readonly ymgpBalance: bigint;
  readonly cmgpBalance: bigint;
}

const getHeaderContent = (page: Pages | undefined, setPage: (_page: Pages | undefined) => void) => {
  if (page === "claim") return <>
    <button className="text-blue-400 hover:text-blue-300" onClick={() => setPage(undefined)} type="button">← Back</button>
    <h1 className="text-xl font-bold text-green-400">💰 Claim Yield</h1>
  </>;
  if (page === "vote") return <>
    <button className="text-blue-400 hover:text-blue-300" onClick={() => setPage(undefined)} type="button">← Back</button>
    <h1 className="text-xl font-bold text-red-400">🗳️ Vote on Proposals</h1>
  </>;
  if (page === "bridge") return <>
    <button className="text-blue-400 hover:text-blue-300" onClick={() => setPage(undefined)} type="button">← Back</button>
    <h1 className="text-xl font-bold text-blue-400">🗳️ Bridge stMGP</h1>
  </>;
  if (page === "documentation") return <>
    <button className="text-blue-400 hover:text-blue-300" onClick={() => setPage(undefined)} type="button">← Back</button>
    <h1 className="text-xl font-bold text-blue-400">📖 Documentation</h1>
  </>;
  return <>
    <h1 className="text-xl font-bold text-blue-500">REEFI</h1>
    <p className="hidden lg:block">Refinance Magpie Yield and Governance</p>
  </>;
};

const config = createConfig({ chains: [mainnet], transports: { [mainnet.id]: webSocket("wss://eth.drpc.org") } });

export const Header = ({ page, setPage, mgpBalance, rmgpBalance, ymgpBalance, cmgpBalance }: Properties): ReactElement => {
  const { address } = useAccount();
  const { data: ens } = useEnsName({ address, config });
  const { data: ensAvatar } = useEnsAvatar({ name: ens! });

  return <div className="sticky top-0 z-10 flex w-full items-center justify-between p-4 bg-gray-800">
    <div className="flex items-center gap-4">
      {getHeaderContent(page, setPage)}
      <button className="rounded-lg bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 hover:from-green-500 hover:via-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 hover:shadow-green-400/40 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105" onClick={() => setPage("claim")} type="button">💰 Claim</button>
      <button className="rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-500 hover:via-red-400 hover:to-orange-500 text-white shadow-lg shadow-green-500/25 hover:shadow-green-400/40 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105" onClick={() => setPage("vote")} type="button">🗳️ Vote</button>
      <button className="rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-teal-600 hover:from-blue-500 hover:via-blue-400 hover:to-teal-500 text-white shadow-lg shadow-green-500/25 hover:shadow-blue-400/40 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105" onClick={() => setPage("bridge")} type="button">🌐 Bridge</button>
      <button className="rounded-lg bg-gradient-to-r from-yellow-950 via-yellow-800 to-yellow-700 hover:from-yellow-900 hover:via-yellow-700 hover:to-grey-500 text-white shadow-lg shadow-yellow-700/25 hover:shadow-blue-400/40 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105" onClick={() => setPage("documentation")} type="button">📖 Docs</button>
    </div>
    {ensAvatar ? <img alt="ENS Avatar" src={ensAvatar} /> : undefined}
    <div className="flex gap-4">
      {address ? <TokenBalances cmgpBalance={cmgpBalance} mgpBalance={mgpBalance} rmgpBalance={rmgpBalance} ymgpBalance={ymgpBalance} /> : undefined}
      <ConnectButton />
    </div>
  </div>;
};
