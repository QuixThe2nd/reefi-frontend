import { formatNumber, formatEther } from "../utilities";
import { memo, useState, type ReactElement } from "react";
import { useCachedUpdateable } from "../hooks/useUpdateable";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

interface Space {
  id: string;
  name: string;
}

interface Proposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: number;
  state: "active" | "closed" | "pending";
  author: string;
  space: Space;
}

interface SnapshotResponse {
  data: {
    proposals: Proposal[];
  };
}

interface MarketData {
  yesTokenSupply: bigint;
  noTokenSupply: bigint;
  lpYesBalance: bigint;
  lpNoBalance: bigint;
  userYesBalance: bigint;
  userNoBalance: bigint;
  totalLiquidity: bigint;
}

interface Properties {
  readonly yMGPBalance: bigint;
  readonly lockedYMGPBalance: bigint;
  readonly totalLockedYMGP: bigint;
  readonly reefiMgpLocked: bigint;
  readonly onSellYesTokens: (_proposalId: string, _amount: bigint) => Promise<void>;
  readonly onSellNoTokens: (_proposalId: string, _amount: bigint) => Promise<void>;
  readonly onRedeemWinningTokens: (_proposalId: string) => Promise<void>;
}

const MARKET_DATA: Record<string, MarketData> = {
  "0x6a380e2a13923c01d5a59044d5562e0101a821a0ad8046fcd679718db58ffa83": {
    yesTokenSupply: BigInt("50000000000000000000"),
    noTokenSupply: BigInt("50000000000000000000"),
    lpYesBalance: BigInt("30000000000000000000"),
    lpNoBalance: BigInt("20000000000000000000"),
    userYesBalance: BigInt("5000000000000000000"),
    userNoBalance: BigInt("3000000000000000000"),
    totalLiquidity: BigInt("100000000000000000000")
  },
  "0x456": {
    yesTokenSupply: BigInt("80000000000000000000"),
    noTokenSupply: BigInt("80000000000000000000"),
    lpYesBalance: BigInt("60000000000000000000"),
    lpNoBalance: BigInt("20000000000000000000"),
    userYesBalance: BigInt("2000000000000000000"),
    userNoBalance: BigInt("8000000000000000000"),
    totalLiquidity: BigInt("160000000000000000000")
  }
};

const getStateClassName = (state: "active" | "closed" | "pending"): string => {
  if (state === "active") return "bg-green-600/20 text-green-400";
  if (state === "closed") return "bg-red-600/20 text-red-400";
  return "bg-yellow-600/20 text-yellow-400";
};

const getWinningChoice = (marketData: MarketData): "yes" | "no" | "tie" => {
  if (marketData.yesTokenSupply > marketData.noTokenSupply) return "yes";
  if (marketData.noTokenSupply > marketData.yesTokenSupply) return "no";
  return "tie";
};

export const BuyVotesPage = memo(({ yMGPBalance, lockedYMGPBalance, totalLockedYMGP, reefiMgpLocked, onSellYesTokens, onSellNoTokens, onRedeemWinningTokens }: Properties): ReactElement => {
  const [sellYesAmounts, setSellYesAmounts] = useState<Record<string, bigint>>({});
  const [sellNoAmounts, setSellNoAmounts] = useState<Record<string, bigint>>({});
  const [activeAction, setActiveAction] = useState<string | undefined>();

  const handleSellYesTokens = async (proposalId: string): Promise<void> => {
    const amount = sellYesAmounts[proposalId];
    if (!amount || amount === 0n) return;
    setActiveAction(`sell-yes-${proposalId}`);
    await onSellYesTokens(proposalId, amount);
    setActiveAction(undefined);
  };

  const handleSellNoTokens = async (proposalId: string): Promise<void> => {
    const amount = sellNoAmounts[proposalId];
    if (!amount || amount === 0n) return;
    setActiveAction(`sell-no-${proposalId}`);
    await onSellNoTokens(proposalId, amount);
    setActiveAction(undefined);
  };

  const handleRedeemWinningTokens = async (proposalId: string): Promise<void> => {
    setActiveAction(`redeem-${proposalId}`);
    await onRedeemWinningTokens(proposalId);
    setActiveAction(undefined);
  };

  const [proposals] = useCachedUpdateable(async () => {
    const headers = new Headers();
    headers.append("content-type", "application/json");
    const raw = JSON.stringify({
      query: "query Proposals {proposals (first: 3, skip: 0, where: { space_in: [\"magpiexyz.eth\"] }, orderBy: \"created\", orderDirection: desc) {id title body choices start end snapshot state author space { id name } } }",
      operationName: "Proposals"
    });
    const response = await fetch("https://hub.snapshot.org/graphql?", { method: "POST", headers, body: raw });
    const result = await response.json() as SnapshotResponse;
    return result.data.proposals;
  }, [], "active-proposals", []);

  const userVotingShare = totalLockedYMGP > 0n ? Number(lockedYMGPBalance) / Number(totalLockedYMGP) : 0;
  const userBaseVotingPower = userVotingShare * Number(formatEther(reefiMgpLocked));

  return <Page info={[
    "Buy votes on Magpie governance proposals using yMGP.",
    "Whichever choice has had the most yMGP deposited controls the entire voting power of all unvoted and locked vMGP.",
    "All yMGP deposited goes to to locked vMGP holders."
  ]} noTopMargin={true}>
    <div className="mb-6 rounded-lg bg-gray-700/50 p-4">
      <h3 className="mb-2 text-lg font-semibold">Your Position</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">yMGP Balance</p>
          <p className="font-medium">{formatNumber(formatEther(yMGPBalance))} yMGP</p>
        </div>
        <div>
          <p className="text-gray-400">Base Voting Power</p>
          <p className="font-medium">{formatNumber(userBaseVotingPower)} vlMGP</p>
        </div>
      </div>
    </div>

    <h3 className="mb-4 text-lg font-semibold">Active Proposals</h3>

    {proposals.length === 0 ? <div className="rounded-lg bg-gray-700/50 p-8 text-center">
      <p className="text-gray-400">No active proposals found</p>
      <p className="mt-2 text-sm text-gray-500">Check back later for new governance proposals</p>
    </div> : <div className="space-y-6">
      {proposals.map(proposal => {
        const marketData = MARKET_DATA[proposal.id];
        const winningChoice = marketData ? getWinningChoice(marketData) : "tie";
        const isCompleted = proposal.state === "closed";

        const sellYesAmount = sellYesAmounts[proposal.id] ?? 0n;
        const sellNoAmount = sellNoAmounts[proposal.id] ?? 0n;

        return <div key={proposal.id} className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <div className="mb-4 flex flex-col items-start justify-between">
            <div className="flex w-full items-start justify-between">
              <h4 className="font-semibold text-blue-400">{proposal.title}</h4>
              <div className={`rounded px-2 py-1 text-xs ${getStateClassName(proposal.state)}`}>
                {proposal.state.toUpperCase()}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-300">{proposal.body.slice(0, 200)}... <a className="text-blue-400 hover:text-blue-300" href={`https://snapshot.box/#/s:magpiexyz.eth/proposal/${proposal.id}`} target="_blank" rel="noopener noreferrer">View Full</a></p>
          </div>

          {marketData && <div className="mb-4 rounded-lg bg-gray-700/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h5 className="font-medium">Votes Purchased</h5>
              {isCompleted && <div className={`rounded px-2 py-1 text-xs font-medium ${winningChoice === "yes" ? "bg-green-600/20 text-green-400" : (winningChoice === "no" ? "bg-red-600/20 text-red-400" : "bg-yellow-600/20 text-yellow-400")}`}>
                {winningChoice === "yes" ? "YES WINS" : (winningChoice === "no" ? "NO WINS" : "TIE")}
              </div>}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded bg-green-900/30 p-3">
                <div className="flex justify-between">
                  <span className="text-green-400">YES Votes</span>
                  <span className="font-medium">{formatNumber(formatEther(marketData.yesTokenSupply))} yMGP</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Your Votes: {formatNumber(formatEther(marketData.userYesBalance))} yMGP
                </div>
              </div>
              <div className="rounded bg-red-900/30 p-3">
                <div className="flex justify-between">
                  <span className="text-red-400">NO Votes</span>
                  <span className="font-medium">{formatNumber(formatEther(marketData.noTokenSupply))} yMGP</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Your Votes: {formatNumber(formatEther(marketData.userNoBalance))} yMGP
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">Current Rate: 1 yMGP = {formatNumber(formatEther(marketData.lpYesBalance))} vlMGP Votes</div>
          </div>}

          {!isCompleted && marketData && <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-green-900/20 p-4">
                <h6 className="mb-4 font-medium text-green-300">Vote YES</h6>
                <AmountInput balance={yMGPBalance} label="Deposit yMGP" onChange={value => setSellNoAmounts(previous => ({ ...previous, [proposal.id]: value }))} token={{ symbol: "yMGP" }} value={sellNoAmount} placeholder="0" />
                <Button className="mt-3 w-full bg-red-600 hover:bg-red-700" onClick={() => handleSellNoTokens(proposal.id)} isLoading={activeAction === `sell-no-${proposal.id}`} disabled={activeAction !== undefined || marketData.userNoBalance < sellNoAmount || sellNoAmount === 0n} type="button">{activeAction === `sell-no-${proposal.id}` ? "Swapping..." : "Buy Yes Votes"}</Button>
              </div>
              <div className="rounded-lg bg-red-900/20 p-4">
                <h6 className="mb-4 font-medium text-red-300">Vote NO</h6>
                <AmountInput balance={yMGPBalance} label="Deposit yMGP" onChange={value => setSellYesAmounts(previous => ({ ...previous, [proposal.id]: value }))} token={{ symbol: "yMGP" }} value={sellYesAmount} placeholder="0" />
                <Button className="mt-3 w-full bg-green-600 hover:bg-green-700" onClick={() => handleSellYesTokens(proposal.id)} isLoading={activeAction === `sell-yes-${proposal.id}`} disabled={activeAction !== undefined || marketData.userYesBalance < sellYesAmount || sellYesAmount === 0n} type="button">{activeAction === `sell-yes-${proposal.id}` ? "Swapping..." : "Buy No Votes"}</Button>
              </div>
            </div>
          </div>}

          {isCompleted && marketData && (winningChoice === "yes" && marketData.userYesBalance > 0n || winningChoice === "no" && marketData.userNoBalance > 0n) && <div className="rounded-lg bg-yellow-900/20 p-4">
            <h6 className="mb-2 font-medium text-yellow-300">Redeem Winning Tokens</h6>
            <p className="mb-3 text-xs text-gray-400">You have {formatNumber(formatEther(winningChoice === "yes" ? marketData.userYesBalance : marketData.userNoBalance))} winning {winningChoice.toUpperCase()} tokens that can be redeemed for MGP</p>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700" onClick={() => handleRedeemWinningTokens(proposal.id)} isLoading={activeAction === `redeem-${proposal.id}`} disabled={activeAction !== undefined} type="button">{activeAction === `redeem-${proposal.id}` ? "Redeeming..." : `Redeem ${formatNumber(formatEther(winningChoice === "yes" ? marketData.userYesBalance : marketData.userNoBalance))} MGP`}</Button>
          </div>}

          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Started: {new Date(proposal.start * 1000).toLocaleDateString()}</span>
            <span>Ends: {new Date(proposal.end * 1000).toLocaleDateString()}</span>
          </div>
        </div>;
      })}
    </div>}

    {yMGPBalance === 0n && <div className="mt-6 rounded-lg bg-yellow-600/20 p-4 text-center"><p className="text-yellow-300">You need yMGP tokens to buy votes</p></div>}
  </Page>;
});

BuyVotesPage.displayName = "BuyVotesPage";
