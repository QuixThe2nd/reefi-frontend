import { decimals } from "../config/contracts";
import { formatEther, formatNumber } from "../utilities";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { Page } from "../components/Page";

interface Properties {
  readonly claimYMGPRewards: () => void;
  readonly unclaimedUserYield: bigint;
  readonly uncompoundedMGPYield: number;
  readonly lockedYMGP: bigint;
  readonly userLockedYMGP: bigint;
  readonly ymgpHoldings: bigint;
  readonly ymgpSupply: bigint;
}

export const ClaimYieldComponent = ({ claimYMGPRewards, unclaimedUserYield, uncompoundedMGPYield, lockedYMGP, userLockedYMGP, ymgpHoldings, ymgpSupply }: Properties): ReactElement => <Page info={["Locked yMGP earns additional yield from the underlying vlMGP and from 5% of rMGP withdrawal.", "To claim pending MGP yield, compound rMGP yield."]}>
  <h3 className="mb-1 text-base font-medium">Unclaimed Rewards</h3>
  <div className="flex justify-between rounded-lg bg-gray-700/50 p-4">
    <div className="flex flex-col">
      <p className="text-lg font-medium">You: {formatNumber(formatEther(unclaimedUserYield, decimals.yMGP), 4)} rMGP</p>
      <p className="text-sm text-gray-400">+{formatNumber(0.05 * uncompoundedMGPYield * (Number(userLockedYMGP) / Number(lockedYMGP)), 4)} MGP</p>
    </div>
    <div className="flex flex-col text-right">
      <p className="text-lg font-medium">Total: {formatNumber(formatEther(ymgpHoldings - ymgpSupply - lockedYMGP, decimals.yMGP), 4)} rMGP</p>
      <p className="text-sm text-gray-400">+{formatNumber(uncompoundedMGPYield * 0.05, 4)} MGP</p>
    </div>
  </div>
  <button className="mt-4 w-full rounded-lg bg-green-600 py-3 transition-colors hover:bg-green-700" onClick={claimYMGPRewards} type="button">Claim Rewards</button>
</Page>;

export const ClaimYield = memo((): ReactElement => {
  const { actions, balances, locked, supplies, rewards } = useGlobalContext();

  return <ClaimYieldComponent claimYMGPRewards={actions.claimYMGPRewards} lockedYMGP={locked.ymgp} unclaimedUserYield={rewards.unclaimedUserYield} uncompoundedMGPYield={rewards.uncompoundedMGPYield} userLockedYMGP={locked.userYMGP} ymgpHoldings={balances.ymgpHoldings} ymgpSupply={supplies.ymgp} />;
});
ClaimYield.displayName = "ClaimYield";
