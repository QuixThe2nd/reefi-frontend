import { memo, ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

export const ConnectWallet = memo((): ReactElement | undefined => {
  const { wallet } = useGlobalContext();
  return wallet.connectRequired ? <div className="absolute z-10 flex size-full items-center justify-center bg-black">
    <div className="rounded-lg bg-gray-700/50 p-10 text-center">
      <p className="mb-4 text-xl">Connect your wallet to use Reefi</p>
      <button className="rounded-lg bg-green-600 px-6 py-3 transition-colors hover:bg-green-700" disabled={wallet.isConnecting} onClick={wallet.connectWallet} type="button">{wallet.isConnecting ? "Connecting..." : "Connect Wallet"}</button>
    </div>
  </div> : undefined;
});
ConnectWallet.displayName = "ConnectWallet";
