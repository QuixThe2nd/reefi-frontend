import { ReactElement } from 'react'

export const ConnectWallet = ({ connectRequired, connectWallet, isConnecting }: { readonly connectRequired: boolean, readonly connectWallet: () => void, readonly isConnecting: boolean }): ReactElement => {
  return connectRequired ? <div className="absolute w-full h-full bg-black z-1 flex items-center justify-center">
    <div className="bg-gray-700/50 p-10 rounded-lg text-center">
      <p className="text-xl mb-4">Connect your wallet to use Reefi</p>
      <button type="button" className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors" onClick={() => connectWallet()} disabled={isConnecting}>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</button>
    </div>
  </div> : <></>
}
