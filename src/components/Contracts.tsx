import { useChainId, useChains } from "wagmi";
import { useContracts, type Chains } from "../state/useContracts";

import { Card } from "./Card";

import { type ReactElement } from "react";

export const ContractsCard = (): ReactElement => {
  const chains = useChains();
  const chainId = useChainId();
  const contracts = useContracts();
  const chain = chains.find(c => c.id === chainId)!;
  return <Card>
    <h2 className="mb-2 text-lg font-bold">Contract Addresses</h2>
    <div className="grid grid-cols-1 gap-2 text-xs lg:grid-cols-2 xl:grid-cols-3">
      {(Object.keys(contracts[chainId]) as Array<keyof (typeof contracts)[Chains]>).sort((a, b) => {
        const aIsUpper = a === a.toUpperCase();
        const bIsUpper = b === b.toUpperCase();
        if (aIsUpper && !bIsUpper) return 1;
        if (!aIsUpper && bIsUpper) return -1;
        return a.localeCompare(b);
      }).map(contract => <div key={contract}>
        <span className="font-semibold">{contract}:</span>
        <a className="ml-2 break-all text-green-300" href={`${chain.blockExplorers?.default.url}/address/${contracts[chainId][contract]}`}>{contracts[chainId][contract]}</a>
      </div>)}
    </div>
  </Card>;
};
