import { type ReactElement } from 'react'

export const Governance = (): ReactElement => {
  return <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
    <h2 className="text-lg font-bold mb-2">Magpie Governance</h2>
    <p className="text-gray-400 text-xs mt-2">vMGP controls the entirety of Reefi&apos;s vlMGP voting power on Magpie votes. vMGP votes are cast to Reefi&apos;s DAO. Once Reefi voting is complete, the vote will be forwarded to Magpie.</p>
    <h2 className="text-lg font-bold mt-4 mb-2">Reefi Governance & Treasury</h2>
    <p className="text-gray-400 text-xs mt-2">
      Locked yMGP holders are able to vote on Reefi DAO proposals. The treasury receives 4% of compounded rMGP yield and 5% of rMGP withdrawals.
      <br />
      The core team has no initial token allocations as all assets are backed by underlying MGP, instead incentives by protocol usage. This means the core team doesn&apos;t have artificial/unearned voting power.
    </p>
  </div>
}
