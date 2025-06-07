import { arbitrum, bsc } from "viem/chains";
import { createWalletClient, custom, PublicActions, publicActions, WalletClient } from "viem";
import { useAsyncReducer } from "./useAsyncReducer";
import { useEffect, useState } from "react";

import { AllCoin, Chains, contracts, CoreCoin, LockedCoinReefi, PrimaryCoin, publicClients, SecondaryCoin } from "../config/contracts";

interface TokenState {
  prices: Record<SecondaryCoin, number>;
  supplies: Record<CoreCoin, bigint>;
  allowances: {
    rMGP: { MGP: bigint };
    yMGP: { rMGP: bigint };
    lyMGP: { yMGP: bigint };
    vMGP: { yMGP: bigint };
    lvMGP: { vMGP: bigint };
    cMGP: Record<PrimaryCoin, bigint>;
    odos: Record<SecondaryCoin, bigint>;
  };
}

interface ProtocolState {
  yield: {
    vlmgpAPR: number;
    cmgpPoolAPY: number;
    user: Record<LockedCoinReefi, bigint>;
    reefi: {
      vlMGP: {
        MGP: Record<"MGP" | "estimatedRMGP" | "estimatedGas", { address: `0x${string}`; rewards: bigint }>;
        estimatedMGP: bigint;
        estimatedGas: bigint;
      };
    };
  };
  withdraws: {
    user: {
      pending: bigint;
      ready: bigint;
    };
    reefi: {
      unsubmitted: bigint;
      unlockSchedule: { startTime: bigint; endTime: bigint; amountInCoolDown: bigint }[];
    };
  };
  exchangeRates: {
    mgpRMGP: number;
    rmgpYMGP: number;
    ymgpVMGP: number;
    mgpYMGP: number;
    ymgpRMGP: number;
    rmgpMGP: number;
    ymgpMGP: number;
  };
}

type CurveRates<T extends PropertyKey> = {
  [K in T]: {
    [_P in Exclude<T, K>]: bigint;
  }
};

interface Amounts {
  send: bigint | undefined;
  curve: CurveRates<PrimaryCoin>;
  lp: Record<PrimaryCoin, bigint>;
}

interface WalletState {
  clients: Record<Chains, WalletClient & PublicActions> | undefined;
  chain: Chains;
  account: `0x${string}` | undefined;
  isConnecting: boolean;
  connectRequired: boolean;
  ens: string | undefined;
}

export const useReefiState = ({ setError }: { setError: (_message: string) => void }) => {
  const [wallet, setWallet] = useState<WalletState>({
    clients: undefined,
    chain: 42_161,
    account: undefined,
    isConnecting: false,
    connectRequired: false,
    ens: undefined
  });

  const connectWallet = (): void => {
    if (window.ethereum === undefined) return setError("No wallet found. Please install MetaMask to use Reefi.");
    setWallet(previous => ({ ...previous, isConnecting: true }));

    const walletClients = {
      42_161: createWalletClient({ chain: arbitrum, transport: custom(window.ethereum) }).extend(publicActions),
      56: createWalletClient({ chain: bsc, transport: custom(window.ethereum) }).extend(publicActions)
    } as const;

    setWallet(previous => ({ ...previous, clients: walletClients, isConnecting: false, connectRequired: false }));
  };

  const setChain = (newChain: Chains): void => {
    setWallet(previous => ({ ...previous, chain: newChain }));
    window.localStorage.setItem("chain", String(newChain));
  };

  const setConnectRequired = (required: boolean): void => setWallet(previous => ({ ...previous, connectRequired: required }));

  useEffect(() => {
    (async () => {
      if (!wallet.clients) return;
      const addresses = await wallet.clients[wallet.chain].requestAddresses();
      setWallet(previous => ({ ...previous, account: addresses[0] }));
    })();
  }, [wallet.clients, wallet.chain]);

  useEffect(() => {
    (async () => {
      if (!wallet.account) return;
      const ensName = await publicClients[1].getEnsName({ address: wallet.account });
      setWallet(previous => ({ ...previous, ens: ensName ?? undefined }));
    })();
  }, [wallet.account]);

  useEffect(() => {
    if (wallet.clients) {
      wallet.clients[wallet.chain].switchChain({ id: wallet.chain }).catch(() => setError("Failed to switch chains"));
      connectWallet();
    }
  }, [wallet.chain]);

  useEffect(() => {
    if (window.ethereum) connectWallet();
    const savedChain = window.localStorage.getItem("chain");
    if (savedChain !== null) setChain(Number(savedChain) as 56 | 42_161);
  }, []);

  const [balances, updateBalances] = useAsyncReducer<{ user: Record<AllCoin, bigint>; rMGP: { MGP: bigint }; yMGP: { rMGP: bigint }; vMGP: { yMGP: bigint }; curve: Record<PrimaryCoin, bigint> }>(async () => {
    const safeBalance = async (fn: () => Promise<bigint>) => {
      try {
        return await fn();
      } catch {
        return 0n;
      }
    };

    const [userCKP, userEGP, userLTP, userMGP, userPNP, userWETH, userCMGP, userRMGP, userYMGP, userLyMGP, userWrMGP, userVlMGP, userLvMGP, userETH, userVMGP, curveMGP, curveRMGP, curveYMGP, curveVMGP, rMGPMGP, yMGPRMGP, vMGPYMGP] = await Promise.all([
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].CKP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].EGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].LTP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].MGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].PNP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].WETH.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].cMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].rMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].yMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].yMGP.read.lockedBalances([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].wrMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].vlMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].yMGP.read.lockedBalances([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : publicClients[wallet.chain].getBalance({ address: wallet.account })),
      safeBalance(() => contracts[wallet.chain].vMGP.read.balanceOf([contracts[wallet.chain].yMGP.address])),
      safeBalance(() => contracts[wallet.chain].MGP.read.balanceOf([contracts[wallet.chain].cMGP.address])),
      safeBalance(() => contracts[wallet.chain].rMGP.read.balanceOf([contracts[wallet.chain].cMGP.address])),
      safeBalance(() => contracts[wallet.chain].yMGP.read.balanceOf([contracts[wallet.chain].cMGP.address])),
      safeBalance(() => contracts[wallet.chain].vMGP.read.balanceOf([contracts[wallet.chain].cMGP.address])),
      safeBalance(() => contracts[wallet.chain].vlMGP.read.getUserTotalLocked([contracts[wallet.chain].rMGP.address])),
      safeBalance(() => contracts[wallet.chain].rMGP.read.balanceOf([contracts[wallet.chain].yMGP.address])),
      safeBalance(() => contracts[wallet.chain].yMGP.read.balanceOf([contracts[wallet.chain].vMGP.address]))
    ]);

    return {
      user: {
        CKP: userCKP,
        EGP: userEGP,
        LTP: userLTP,
        MGP: userMGP,
        PNP: userPNP,
        WETH: userWETH,
        cMGP: userCMGP,
        rMGP: userRMGP,
        yMGP: userYMGP,
        lyMGP: userLyMGP,
        wrMGP: userWrMGP,
        vlMGP: userVlMGP,
        lvMGP: userLvMGP,
        ETH: userETH,
        vMGP: userVMGP
      },
      curve: {
        MGP: curveMGP,
        rMGP: curveRMGP,
        yMGP: curveYMGP,
        vMGP: curveVMGP
      },
      rMGP: { MGP: rMGPMGP },
      yMGP: { rMGP: yMGPRMGP },
      vMGP: { yMGP: vMGPYMGP }
    };
  }, {
    user: {
      MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n,
      vlMGP: 0n, lyMGP: 0n, lvMGP: 0n,
      wrMGP: 0n, cMGP: 0n,
      CKP: 0n, EGP: 0n, LTP: 0n, PNP: 0n,
      WETH: 0n, ETH: 0n
    },
    rMGP: { MGP: 0n },
    yMGP: { rMGP: 0n },
    vMGP: { yMGP: 0n },
    curve: { MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n }
  });

  useEffect(() => {
    updateBalances();
  }, [wallet.account, wallet.chain]);

  const [tokenState, setTokenState] = useState<TokenState>({
    supplies: {
      MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n,
      vlMGP: 0n, lyMGP: 0n, lvMGP: 0n
    },
    prices: { MGP: 0, CKP: 0, PNP: 0, EGP: 0, LTP: 0, WETH: 0 },
    allowances: {
      rMGP: { MGP: 0n },
      yMGP: { rMGP: 0n },
      lyMGP: { yMGP: 0n },
      vMGP: { yMGP: 0n },
      lvMGP: { vMGP: 0n },
      cMGP: { MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n },
      odos: { CKP: 0n, EGP: 0n, LTP: 0n, MGP: 0n, PNP: 0n, WETH: 0n }
    }
  });

  const [protocolState, setProtocolState] = useState<ProtocolState>({
    yield: {
      vlmgpAPR: 0,
      cmgpPoolAPY: 0,
      user: { lyMGP: 0n, lvMGP: 0n },
      reefi: {
        vlMGP: {
          MGP: {} as Record<string, { address: `0x${string}`; rewards: bigint }>,
          estimatedMGP: 0n,
          estimatedGas: 0n
        }
      }
    },
    withdraws: {
      user: {
        pending: 0n,
        ready: 0n
      },
      reefi: {
        unsubmitted: 0n,
        unlockSchedule: []
      }
    },
    exchangeRates: {
      mgpRMGP: 0, rmgpYMGP: 0, ymgpVMGP: 0, mgpYMGP: 0, ymgpRMGP: 0, rmgpMGP: 0, ymgpMGP: 0
    }
  });

  const [amounts, setAmounts] = useState<Amounts>({
    send: undefined,
    curve: {
      MGP: { rMGP: 0n, yMGP: 0n, vMGP: 0n },
      rMGP: { MGP: 0n, yMGP: 0n, vMGP: 0n },
      yMGP: { MGP: 0n, rMGP: 0n, vMGP: 0n },
      vMGP: { MGP: 0n, rMGP: 0n, yMGP: 0n }
    },
    lp: { MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n }
  });

  return {
    balances, updateBalances,
    token: [tokenState, setTokenState],
    protocol: [protocolState, setProtocolState],
    amounts: [amounts, setAmounts],
    wallet: [wallet, setWallet]
  } as const;
};
