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
