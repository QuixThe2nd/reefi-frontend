/* eslint functional/no-try-statements: 0 */
import { contracts, type PrimaryCoin } from "../config/contracts";
import { useChainId, useReadContract } from "wagmi";
import { useState } from "react";

import { ABIs } from "../config/ABIs/abis";

export type FlattenRecord<T extends Record<string, bigint>> = {
  [K1 in keyof T as K1 extends string ?
    K1 extends keyof T ?
      { [K2 in keyof T]: K2 extends string ?
        K1 extends K2 ? never : `${K1}_${K2}`
        : never }[keyof T]
      : never
    : never]: bigint
};

export const useAmounts = () => {
  const [lp, setLP] = useState<Record<PrimaryCoin, bigint>>({ MGP: 0n, wstMGP: 0n, yMGP: 0n, vMGP: 0n });
  const [send, setSend] = useState(0n);
  const chain = useChainId();

  const curve: FlattenRecord<Record<PrimaryCoin, bigint>> = {
    MGP_wstMGP: useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [0n, 1n, send] }).data ?? 0n,
    MGP_yMGP: useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [0n, 2n, send] }).data ?? 0n,
    MGP_vMGP: send,
    wstMGP_MGP: useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [1n, 0n, send] }).data ?? 0n,
    wstMGP_yMGP: useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [1n, 2n, send] }).data ?? 0n,
    wstMGP_vMGP: send,
    yMGP_MGP: useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [2n, 0n, send] }).data ?? 0n,
    yMGP_wstMGP: useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [2n, 1n, send] }).data ?? 0n,
    yMGP_vMGP: send,
    vMGP_MGP: send,
    vMGP_wstMGP: send,
    vMGP_yMGP: send
  };

  return [
    { lp, curve, send },
    { setSend, setLP }
  ] as const;
};
