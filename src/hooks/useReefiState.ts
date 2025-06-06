import { useState } from "react";

import { AllCoin, CoreCoin, LockedCoinReefi, PrimaryCoin, SecondaryCoin } from "../config/contracts";

interface TokenState {
  balances: {
    user: Record<AllCoin, bigint>;
    rMGP: { MGP: bigint };
    yMGP: { rMGP: bigint };
    vMGP: { yMGP: bigint };
    curve: Record<PrimaryCoin, bigint>;
  };
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

export const useReefiState = () => {
  const [tokenState, setTokenState] = useState<TokenState>({
    balances: {
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
      curve: {
        MGP: 0n,
        rMGP: 0n,
        yMGP: 0n,
        vMGP: 0n
      }
    },
    supplies: {
      MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n,
      vlMGP: 0n, lyMGP: 0n, lvMGP: 0n
    },
    prices: {
      MGP: 0,
      CKP: 0,
      PNP: 0,
      EGP: 0,
      LTP: 0,
      WETH: 0
    },
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
      user: {
        lyMGP: 0n,
        lvMGP: 0n
      },
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

  const [wallet, setWallet] = useState<{ chain: 56 | 42_161; connectionRequired: boolean; isConnecting: boolean; ens: string | undefined; account: `0x${string}` | undefined }>({
    chain: 42_161,
    connectionRequired: false,
    isConnecting: false,
    ens: undefined,
    account: undefined
  });

  return {
    token: [tokenState, setTokenState],
    protocol: [protocolState, setProtocolState],
    amounts: [amounts, setAmounts],
    wallet: [wallet, setWallet]
  } as const;
};
