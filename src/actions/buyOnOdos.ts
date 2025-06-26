import { z } from "zod";

import type { SecondaryCoin, useContracts } from "../state/useContracts";
import type { UseSendTransactionReturnType } from "wagmi";
import type { useAllowances } from "../state/useAllowances";
import type { wagmiConfig } from "..";

const QuoteRequestSchema = z.object({
  chainId: z.number(),
  compact: z.boolean(),
  disableRFQs: z.boolean(),
  inputTokens: z.array(z.object({
    amount: z.string().regex(/^-?\d+(?:\.\d+)?$/u, "Must be a number string"),
    tokenAddress: z.string()
  })),
  outputTokens: z.array(z.object({
    proportion: z.number(),
    tokenAddress: z.string()
  })),
  referralCode: z.number(),
  slippageLimitPercent: z.number(),
  userAddr: z.string()
});

const QuoteResponseSchema = z.object({
  pathId: z.string()
});

const AssembleRequestSchema = z.object({
  pathId: z.string(),
  simulate: z.boolean(),
  userAddr: z.string()
});

const AssembleResponseSchema = z.object({
  transaction: z.object({
    gas: z.number()
  })
});

interface Properties {
  allowances: ReturnType<typeof useAllowances>["odos"];
  contracts: ReturnType<typeof useContracts>;
  send: bigint;
  setError: (_value: string) => void;
  setNotification: (_value: string) => void;
  chain: typeof wagmiConfig["chains"][number]["id"];
  address: `0x${string}` | undefined;
}

type BuyOnOdosProps = {
  tokenIn: Exclude<SecondaryCoin, "ETH">;
  sendTransaction: UseSendTransactionReturnType<typeof wagmiConfig>["sendTransaction"];
};

export type BuyOnOdos = (_props: BuyOnOdosProps) => Promise<void>;

export const buyOnOdos = ({ allowances, send, setError, setNotification, chain, address, contracts }: Properties): BuyOnOdos => async ({ tokenIn, sendTransaction }: BuyOnOdosProps) => {
  if (allowances[tokenIn] < send) return setError("Allowance too low");

  setNotification("Fetching swap route");
  const quoteRequestBody = QuoteRequestSchema.parse({
    chainId: chain,
    compact: true,
    disableRFQs: true,
    inputTokens: [{ amount: Number(send).toString(), tokenAddress: contracts[chain][tokenIn] }],
    outputTokens: [{ proportion: 1, tokenAddress: contracts[chain].MGP }],
    referralCode: 0,
    slippageLimitPercent: 5,
    userAddr: address
  });
  const response = await fetch("https://api.odos.xyz/sor/quote/v2", { body: JSON.stringify(quoteRequestBody), headers: { "Content-Type": "application/json" }, method: "POST" });
  const quoteResponse = QuoteResponseSchema.parse(await response.json());
  if (!response.ok) return setError("Failed to find route");

  setNotification("Assembling transaction");
  const assembleRequestBody = AssembleRequestSchema.parse({ pathId: quoteResponse.pathId, simulate: false, userAddr: address });
  const response2 = await fetch("https://api.odos.xyz/sor/assemble", { body: JSON.stringify(assembleRequestBody), headers: { "Content-Type": "application/json" }, method: "POST" });
  const assembleResponse = AssembleResponseSchema.parse(await response2.json());
  sendTransaction({ ...assembleResponse.transaction, gas: BigInt(Math.max(assembleResponse.transaction.gas, 0)) });
};
