import { decimals } from "../config/contracts";
import { formatEther, formatNumber } from "../utilities";
import { memo, type ReactElement } from "react";
import { useWriteContract, type UseWriteContractReturnType } from "wagmi";

import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { wagmiConfig } from "..";

interface Properties {
  readonly claimYMGPRewards: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly unclaimedUserYield: bigint;
  readonly uncompoundedMGPYield: number;
  readonly lockedYMGP: bigint;
  readonly userLockedYMGP: bigint;
  readonly ymgpHoldings: bigint;
  readonly ymgpSupply: bigint;
}

export const ClaimYield = memo(({ claimYMGPRewards, unclaimedUserYield, uncompoundedMGPYield, lockedYMGP, userLockedYMGP, ymgpHoldings, ymgpSupply }: Properties): ReactElement => {
  const { writeContract, isPending } = useWriteContract();
  return <Page info={[<span key="yield">Locked yMGP earns additional yield from the underlying vlMGP and from 5% of wstMGP withdrawal.</span>, <span key="claim">To claim pending MGP yield, compound wstMGP yield.</span>]} noTopMargin>
    <h3 className="mt-2 mb-1 text-base font-medium">Unclaimed Rewards</h3>
    <div className="flex justify-between rounded-lg bg-gray-700/50 p-4">
      <div className="flex flex-col">
        <p className="text-lg font-medium">You: {formatNumber(formatEther(unclaimedUserYield, decimals.yMGP), 4)} wstMGP</p>
        <p className="text-sm text-gray-400">+{formatNumber(0.05 * uncompoundedMGPYield * (Number(userLockedYMGP) / Number(lockedYMGP)), 4)} MGP</p>
      </div>
      <div className="flex flex-col text-right">
        <p className="text-lg font-medium">Total: {formatNumber(formatEther(ymgpHoldings - ymgpSupply - lockedYMGP, decimals.yMGP), 4)} wstMGP</p>
        <p className="text-sm text-gray-400">+{formatNumber(uncompoundedMGPYield * 0.05, 4)} MGP</p>
      </div>
    </div>
    <Button className="mt-4 w-full" isLoading={isPending} onClick={() => claimYMGPRewards(writeContract)} type="button">Claim Rewards</Button>
  </Page>;
});
ClaimYield.displayName = "ClaimYield";
