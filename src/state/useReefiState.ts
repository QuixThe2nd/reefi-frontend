import { useBalances } from "./useBalances";
import { useExchangeRates } from "./useExchangeRates";
import { usePrices } from "./usePrices";
import { useRewards } from "./useRewards";
import { useState } from "react";
import { useSupplies } from "./useSupplies";
import { useWallet } from "./useWallet";

import { PrimaryCoin, SecondaryCoin } from "../config/contracts";

interface TokenState {
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

export const useReefiState = ({ setError }: { setError: (_message: string) => void }) => {
  const [wallet, walletActions] = useWallet({ setError });
  const [balances] = useBalances({ wallet });
  const [rewards] = useRewards({ wallet });
  const [supplies] = useSupplies({ wallet });
  const [exchangeRates] = useExchangeRates({ wallet });
  const [prices] = usePrices();

  const [tokenState, setTokenState] = useState<TokenState>({
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
    withdraws: {
      user: {
        pending: 0n,
        ready: 0n
      },
      reefi: {
        unsubmitted: 0n,
        unlockSchedule: []
      }
    }
  });

  const [amounts] = useState<Amounts>({
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
    balances,
    rewards,
    supplies,
    exchangeRates,
    prices,
    token: [tokenState],
    protocol: [protocolState],
    amounts,
    wallet, walletActions
  } as const;
};
