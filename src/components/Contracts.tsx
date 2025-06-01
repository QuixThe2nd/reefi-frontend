import { contracts, publicClients, Chains } from "../config/contracts";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

export const Contracts = memo((): ReactElement => {
  const { wallet } = useGlobalContext();

  return <div className="mb-6 rounded-xl border border-gray-700 bg-gray-800 p-4">
    <h2 className="mb-2 text-lg font-bold">
      Contract Addresses
    </h2>

    <div className="grid grid-cols-1 gap-2 text-xs lg:grid-cols-2 xl:grid-cols-3">
      {(Object.keys(contracts[wallet.chain]) as (keyof typeof contracts[Chains])[]).map(contract => <div key={contract}>
        <span className="font-semibold">
          {contract}
          :
        </span>

        <a
          className="ml-2 break-all text-green-300"
          href={`${publicClients[wallet.chain].chain.blockExplorers.default.url}/address/${contracts[wallet.chain][contract].address}`}
        >
          {contracts[wallet.chain][contract].address}
        </a>
      </div>)}
    </div>
  </div>;
});
Contracts.displayName = "Contracts";
