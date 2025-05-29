import { memo, ReactElement } from 'react'
import { useGlobalContext } from '../contexts/GlobalContext'

export const ConnectWallet = memo((): ReactElement => {
  const { wallet } = useGlobalContext()
  return wallet.connectRequired ? <div className="absolute w-full h-full bg-black z-1 flex items-center justify-center">
    <div className="bg-gray-700/50 p-10 rounded-lg text-center">
      <p className="text-xl mb-4">Connect your wallet to use Reefi</p>
      <button type="button" className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors" onClick={wallet.connectWallet} disabled={wallet.isConnecting}>{wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}</button>
    </div>
  </div> : <></>
})
ConnectWallet.displayName = 'ConnectWallet'
