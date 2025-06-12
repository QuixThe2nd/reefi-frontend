import { decimals } from "../config/contracts";
import { memo, type ReactElement } from "react";

import { TokenBalance } from "./TokenBalance";

interface Properties {
  readonly mgpBalance: bigint;
  readonly rmgpBalance: bigint;
  readonly ymgpBalance: bigint;
  readonly cmgpBalance: bigint;
}

export const TokenBalances = memo(({ mgpBalance, rmgpBalance, ymgpBalance, cmgpBalance }: Properties): ReactElement => <div className="hidden items-center space-x-2 md:flex">
  <TokenBalance balance={mgpBalance} decimals={decimals.MGP} symbol="MGP" />
  <TokenBalance balance={rmgpBalance} decimals={decimals.wstMGP} symbol="wstMGP" />
  <TokenBalance balance={ymgpBalance} decimals={decimals.yMGP} symbol="yMGP" />
  {/* <TokenBalance symbol="VMGP" balance={vmgpBalance} decimals={decimals.VMGP} /> */}
  <TokenBalance balance={cmgpBalance} decimals={decimals.cMGP} symbol="cMGP" />
  {/* <TokenBalance symbol="Locked yMGP" balance={userLockedYMGP} decimals={decimals.YMGP} /> */}
</div>);
TokenBalances.displayName = "TokenBalance";
