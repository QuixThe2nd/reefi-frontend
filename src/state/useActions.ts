import { approve } from "../hooks/actions/approve";
import { claimVMGPRewards } from "../hooks/actions/claimVMGPRewards";
import { claimYMGPRewards } from "../hooks/actions/claimYMGPRewards";
import { compoundRMGP } from "../hooks/actions/compoundRMGP";
import { curveBuy } from "../hooks/actions/curveBuy";
import { depositMGP } from "../hooks/actions/depositMGP";
import { depositRMGP } from "../hooks/actions/depositRMGP";
import { lockYMGP } from "../hooks/actions/lockYMGP";
import { mintWETH } from "../hooks/actions/mintWETH";
import { nativeSwap } from "../hooks/actions/nativeSwap";
import { redeemRMGP } from "../hooks/actions/redeemRMGP";
import { supplyLiquidity } from "../hooks/actions/supplyLiquidity";
import { swap } from "../hooks/actions/swap";
import { unlockVLMGP } from "../hooks/actions/unlockVLMGP";
import { unlockYMGP } from "../hooks/actions/unlockYMGP";
import { useAccount, useChainId } from "wagmi";
import { withdrawMGP } from "../hooks/actions/withdrawMGP";

import type { useAllowances } from "./useAllowances";
import type { useAmounts } from "./useAmounts";

interface Props {
  amounts: ReturnType<typeof useAmounts>[0];
  allowances: ReturnType<typeof useAllowances>;
  setError: (_message: string) => void;
  setNotification: (_message: string) => void;
}

export const useActions = ({ amounts, allowances, setError, setNotification }: Props) => {
  const chain = useChainId();
  const { address } = useAccount();

  const depositMGPAction = depositMGP({ allowances, send: amounts.send, setError, chain });
  const redeemRMGPAction = redeemRMGP({ send: amounts.send, chain });
  const depositRMGPAction = depositRMGP({ allowances, send: amounts.send, setError, chain });
  const lockYMGPAction = lockYMGP({ send: amounts.send, chain });
  const unlockYMGPAction = unlockYMGP({ send: amounts.send, chain });

  return {
    approve: approve({ send: amounts.send, chain }),
    curveBuy: curveBuy({ allowances, send: amounts.send, setError, chain }),
    withdrawMGP: withdrawMGP({ chain }),
    compoundRMGP: compoundRMGP({ chain }),
    claimYMGPRewards: claimYMGPRewards({ chain }),
    claimVMGPRewards: claimVMGPRewards({ chain }),
    supplyLiquidity: supplyLiquidity({ mgpLPAmount: amounts.lp.MGP, rmgpLPAmount: amounts.lp.wstMGP, ymgpLPAmount: amounts.lp.yMGP, chain }),
    swap: swap({ allowances, send: amounts.send, setError, setNotification, chain, address }),
    mintWETH: mintWETH({ allowances, send: amounts.send, setError, chain }),
    unlockVLMGP: unlockVLMGP({ send: amounts.send, chain }),
    nativeSwap: nativeSwap({ depositMGPAction, redeemRMGPAction, depositRMGPAction, lockYMGPAction, unlockYMGPAction }),
    vote: async (_proposalId: string, _choice: number) => {},
    lockVMGP: () => {},
    buyAndWithdrawMGP: () => {},
    wrapSTMGP: () => {},
    unlockVMGP: () => {},
    unwrapWSTMGP: () => {},
    mintVMGP: () => {}
  };
};
