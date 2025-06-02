import { memo, ReactElement } from "react";

export const ConnectWallet = memo(({ connectRequired, isConnecting, connectWallet }: { connectRequired: boolean; isConnecting: boolean; connectWallet: () => void }): ReactElement | undefined => connectRequired ? <div className="absolute z-10 flex size-full items-center justify-center bg-black">
  <div className="rounded-lg bg-gray-700/50 p-10 text-center">
    <p className="mb-4 text-xl">Connect your wallet to use Reefi</p>
    <button className="rounded-lg bg-green-600 px-6 py-3 transition-colors hover:bg-green-700" disabled={isConnecting} onClick={connectWallet} type="button">{isConnecting ? "Connecting..." : "Connect Wallet"}</button>
  </div>
</div> : undefined);
ConnectWallet.displayName = "ConnectWallet";
