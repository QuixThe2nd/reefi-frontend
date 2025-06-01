import { decimals } from "../config/contracts";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { TokenBalance } from "./TokenBalance";

export const TokenBalances = memo((): ReactElement => {
  const { balances } = useGlobalContext();
  return <div className='hidden items-center space-x-2 md:flex'>
    <TokenBalance balance={balances.MGP[0]} decimals={decimals.MGP} symbol="MGP" />
    <TokenBalance balance={balances.rMGP[0]} decimals={decimals.rMGP} symbol="rMGP" />
    <TokenBalance balance={balances.yMGP[0]} decimals={decimals.yMGP} symbol="yMGP" />
    {/* <TokenBalance symbol="VMGP" balance={vmgpBalance} decimals={decimals.VMGP} /> */}
    <TokenBalance balance={balances.cMGP[0]} decimals={decimals.cMGP} symbol="cMGP" />
    {/* <TokenBalance symbol="Locked yMGP" balance={userLockedYMGP} decimals={decimals.YMGP} /> */}
  </div>;
});
TokenBalances.displayName = "TokenBalance";
