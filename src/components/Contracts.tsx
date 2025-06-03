import { contracts, publicClients, Chains } from "../config/contracts";
import { memo, type ReactElement } from "react";

import { Card } from "./Card";

export const Contracts = memo(({ chain }: { chain: Chains }): ReactElement => <Card>
  <h2 className="mb-2 text-lg font-bold">Contract Addresses</h2>
  <div className="grid grid-cols-1 gap-2 text-xs lg:grid-cols-2 xl:grid-cols-3">
    {(Object.keys(contracts[chain]) as (keyof typeof contracts[Chains])[]).sort((a, b) => {
      const aIsUpper = a === a.toUpperCase();
      const bIsUpper = b === b.toUpperCase();
      if (aIsUpper && !bIsUpper) return 1;
      if (!aIsUpper && bIsUpper) return -1;
      return a.localeCompare(b);
    }).map(contract => <div key={contract}>
      <span className="font-semibold">{contract}:</span>
      <a className="ml-2 break-all text-green-300" href={`${publicClients[chain].chain.blockExplorers.default.url}/address/${contracts[chain][contract].address}`}>{contracts[chain][contract].address}</a>
    </div>)}
  </div>
</Card>);
Contracts.displayName = "Contracts";
