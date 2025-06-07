import { useState } from "react";

interface Withdraws {
  user: {
    pending: bigint;
    ready: bigint;
  };
  reefi: {
    unsubmitted: bigint;
    unlockSchedule: { startTime: bigint; endTime: bigint; amountInCoolDown: bigint }[];
  };
}

export const useWithdraws = () => {
  const [withdraws] = useState<Withdraws>({
    user: {
      pending: 0n,
      ready: 0n
    },
    reefi: {
      unsubmitted: 0n,
      unlockSchedule: []
    }
  });

  return [withdraws] as const;
};

/*
import { contracts } from "../config/contracts";
import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";
import { useWallet } from "../state/useWallet";

interface Withdraws {
  userPending: bigint;
  unsubmitted: bigint;
  userWithdrawable: bigint;
  unlockSchedule: readonly { startTime: bigint; endTime: bigint; amountInCoolDown: bigint }[];
}

interface UpdateWithdraws {
  userPending: () => void;
  unsubmitted: () => void;
  userWithdrawable: () => void;
  unlockSchedule: () => void;
}

export interface UseWithdraws {
  withdraws: Withdraws;
  updateWithdraws: UpdateWithdraws;
}

export const useWithdraws = ({ wallet }: Readonly<{ wallet: ReturnType<typeof useWallet>[0] }>): UseWithdraws => {
  const [withdraws, setWithdraws] = useStoredObject<Withdraws>("withdraws", { unlockSchedule: [], unsubmitted: 0n, userPending: 0n, userWithdrawable: 0n });

  const updateWithdraws = {
    unlockSchedule: () => contracts[wallet.chain].vlMGP.read.getUserUnlockingSchedule([contracts[wallet.chain].rMGP.address]).then(unlockSchedule => {
      setWithdraws({ unlockSchedule });
    }),
    unsubmitted: () => contracts[wallet.chain].rMGP.read.unsubmittedWithdraws().then(unsubmitted => {
      setWithdraws({ unsubmitted });
    }),
    userPending: () => wallet.account === undefined ? 0n : contracts[wallet.chain].rMGP.read.getUserPendingWithdraws([wallet.account]).then(userPending => {
      setWithdraws({ userPending });
    }),
    userWithdrawable: () => contracts[wallet.chain].rMGP.read.getUserWithdrawable().then(userWithdrawable => {
      setWithdraws({ userWithdrawable });
    })
  };

  useEffect(() => {
    updateWithdraws.unlockSchedule();
    updateWithdraws.unsubmitted();
    updateWithdraws.userWithdrawable();
  }, [wallet.chain]);

  useEffect(() => {
    updateWithdraws.userPending();
  }, [wallet.chain, wallet.account]);

  return { updateWithdraws, withdraws };
};
*/
