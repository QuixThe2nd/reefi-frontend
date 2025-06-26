import "@rainbow-me/rainbowkit/styles.css";

import { useAccount } from "wagmi";

import { Button } from "./Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { TokenBalances } from "./TokenBalances";

import type { AllCoin } from "../state/useContracts";
import type { Pages } from "../App";
import type { ReactElement } from "react";

interface Properties {
  readonly page: Pages | "";
  readonly setPage: (_page: Pages | "") => void;
  readonly balances: Record<Exclude<AllCoin, "bMGP">, bigint>;
}

const getHeaderContent = (page: Pages | "", setPage: (_page: Pages | "") => void) => {
  if (page === "claim") return <>
    <button className="text-blue-400 hover:text-blue-300" onClick={() => setPage("")} type="button">← Back</button>
    <h1 className="text-xl font-bold text-green-400">💰 Claim Yield</h1>
  </>;
  if (page === "bridge") return <>
    <button className="text-blue-400 hover:text-blue-300" onClick={() => setPage("")} type="button">← Back</button>
    <h1 className="text-xl font-bold text-blue-400">🗳️ Bridge stMGP</h1>
  </>;
  if (page === "documentation") return <>
    <button className="text-blue-400 hover:text-blue-300" onClick={() => setPage("")} type="button">← Back</button>
    <h1 className="text-xl font-bold text-blue-400">📖 Documentation</h1>
  </>;
  return <>
    <h1 className="text-xl font-bold text-blue-500">REEFI</h1>
    <p className="hidden lg:block">Refinance Magpie Yield and Governance</p>
  </>;
};

export const Header = ({ page, setPage, balances }: Properties): ReactElement => {
  const { address } = useAccount();

  return <div className="sticky top-0 z-10 flex w-full items-center justify-between p-4 bg-gray-800">
    <div className="flex items-center gap-2">
      {getHeaderContent(page, setPage)}
      <Button onClick={() => setPage("claim")} size="sm" type="button" variant="secondary">💰 Claim</Button>
      <Button onClick={() => setPage("bridge")} size="sm" type="button" variant="secondary">🌐 Bridge</Button>
      <Button onClick={() => setPage("documentation")} size="sm" type="button" variant="secondary">📖 Docs</Button>
    </div>
    <div className="flex gap-2">
      {address ? <TokenBalances balances={balances} /> : undefined}
      <ConnectButton />
    </div>
  </div>;
};
