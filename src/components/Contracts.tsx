import { contracts, publicClients, Chains } from "../config/contracts";
import { memo, type ReactElement } from "react";

export const Contracts = memo(({ chain }: { chain: Chains }): ReactElement => <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl transition-all duration-700 hover:scale-[1.02] hover:shadow-purple-500/10">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 opacity-50 transition-opacity duration-700 hover:opacity-80"></div>
  <div className="absolute right-4 top-4 size-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-60 blur-3xl transition-opacity duration-700 hover:opacity-90"></div>
  <div className="absolute bottom-4 left-4 size-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-40 blur-2xl transition-opacity duration-700 hover:opacity-70"></div>
  <h2 className="mb-2 text-lg font-bold">Contract Addresses</h2>
  <div className="grid grid-cols-1 gap-2 text-xs lg:grid-cols-2 xl:grid-cols-3">
    {(Object.keys(contracts[chain]) as (keyof typeof contracts[Chains])[]).map(contract => <div key={contract}>
      <span className="font-semibold">{contract}:</span>
      <a className="ml-2 break-all text-green-300" href={`${publicClients[chain].chain.blockExplorers.default.url}/address/${contracts[chain][contract].address}`}>{contracts[chain][contract].address}</a>
    </div>)}
  </div>
</div>);
Contracts.displayName = "Contracts";
