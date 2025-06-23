import { approve } from "../actions/approve";
import { buyOnCurve } from "../actions/buyOnCurve";
import { buyWETH } from "../actions/buyOnOdos";
import { compoundSTMGP } from "../actions/compoundSTMGP";
import { mintWETH } from "../actions/mintWETH";
import { nativeSwap } from "../actions/nativeSwap";
import { supplyLiquidity } from "../actions/supplyLiquidity";
import { useAccount, useChainId } from "wagmi";
import { useContracts } from "./useContracts";

import type { useAllowances } from "./useAllowances";
import type { useAmounts } from "./useAmounts";

interface Props {
  amounts: ReturnType<typeof useAmounts>[0];
  allowances: ReturnType<typeof useAllowances>;
  setError: (_message: string) => void;
  setNotification: (_message: string) => void;
  startBMGPUnlock: boolean;
  bondAddress: `0x${string}`;
}

export const useActions = ({ amounts, allowances, setError, setNotification, startBMGPUnlock, bondAddress }: Props) => {
  const chain = useChainId();
  const { address } = useAccount();
  const contracts = useContracts();

  return {
    approve: approve({ send: amounts.send, chain, contracts }),

    // Swaps
    nativeSwap: nativeSwap({ send: amounts.send, stmgpMGPAllowance: allowances.stMGP_MGP, setError, startBMGPUnlock, bondAddress, chain, address, contracts }),
    curveBuy: buyOnCurve({ allowances: allowances.curve, send: amounts.send, setError, chain, contracts }),
    mintWETH: mintWETH({ send: amounts.send, chain, contracts }),
    buyWETH: buyWETH({ allowances: allowances.odos, send: amounts.send, setError, setNotification, chain, address }),

    // Yield
    compoundRMGP: compoundSTMGP({ chain, contracts }),
    supplyLiquidity: supplyLiquidity({ ...amounts.lp, chain, contracts })
  };
};
