import { formatNumber, formatEther } from "../utilities";
import { memo, useState, type ReactElement } from "react";
import { useFetch } from "../hooks/useFetch";

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

interface Properties {
  readonly vmgpBalance: bigint;
  readonly vmgpSupply: bigint;
  readonly lvmgpSupply: bigint;
  readonly reefiMgpLocked: bigint;
  readonly vote: (_proposalId: string, _choice: number) => Promise<void>;
}

const getStateClassName = (state: "active" | "closed" | "pending"): string => {
  if (state === "active") return "bg-green-600/20 text-green-400";
  if (state === "closed") return "bg-red-600/20 text-red-400";
  return "bg-yellow-600/20 text-yellow-400";
};

interface MarketData {
  yesTokenSupply: bigint;
  noTokenSupply: bigint;
  lpYesBalance: bigint;
  lpNoBalance: bigint;
  userYesBalance: bigint;
  userNoBalance: bigint;
  totalLiquidity: bigint;
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
  }
};

const getWinningChoice = (marketData: MarketData): "yes" | "no" | "tie" => {
  if (marketData.yesTokenSupply > marketData.noTokenSupply) return "yes";
  if (marketData.noTokenSupply > marketData.yesTokenSupply) return "no";
  return "tie";
};

const completedColors = (winningChoice: string) => {
  if (winningChoice === "yes") return "bg-green-600/20 text-green-400";
  if (winningChoice === "no") return "bg-red-600/20 text-red-400";
  return "bg-yellow-600/20 text-yellow-400";
};

const completedLabel = (winningChoice: string) => {
  if (winningChoice === "yes") return "YES WINS";
  if (winningChoice === "no") return "NO WINS";
  return "TIE";
};

export const VotePage = memo(({ vmgpBalance, vmgpSupply, reefiMgpLocked, vote, lvmgpSupply }: Properties): ReactElement => {
  const [selectedChoices, setSelectedChoices] = useState<Record<string, number>>({});
  const [votingProposal, setVotingProposal] = useState<string | undefined>();
  const proposalScores: Record<string, number[]> = {};

  const handleVote = async (proposalId: string): Promise<void> => {
    const choice = selectedChoices[proposalId];
    if (choice === undefined) return;
    setVotingProposal(proposalId);
    await vote(proposalId, choice);
    setVotingProposal(undefined);
  };

  const votePower = Number(reefiMgpLocked) / Number(vmgpSupply);
  const userVotingPower = formatEther(vmgpBalance) * votePower;

  const { proposals } = useFetch<SnapshotResponse>("https://hub.snapshot.org/graphql?", { data: { proposals: [] } }, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ operationName: "Proposals", query: "query Proposals {proposals (first: 3, skip: 0, where: { space_in: [\"magpiexyz.eth\"] }, orderBy: \"created\", orderDirection: desc) {id title body choices start end snapshot state author space { id name } } }" })
  }).data;

  return <Page info={[<span key="voting power">vMGP holders control all of Reefi&apos;s vlMGP voting power on Magpie governance proposals.</span>, <span key="amplified">Your voting power is amplified by Reefi&apos;s locked MGP position, giving you more influence per token.</span>]} noTopMargin>
    <div className="mb-6 rounded-lg bg-gray-700/50 p-4">
      <h3 className="mb-2 text-lg font-semibold">Your Voting Power</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">vMGP Balance</p>
          <p className="font-medium">{formatNumber(formatEther(vmgpBalance))} vMGP</p>
        </div>
        <div>
          <p className="text-gray-400">Effective Power</p>
          <p className="font-medium">{formatNumber(userVotingPower)} vlMGP</p>
        </div>
      </div>
    </div>
    <h3 className="mb-4 text-lg font-semibold">
      Recent Proposals
    </h3>
    {proposals.length === 0 ? <div className="rounded-lg bg-gray-700/50 p-8 text-center">
      <p className="text-gray-400">No active proposals found</p>
      <p className="mt-2 text-sm text-gray-500">Check back later for new governance proposals</p>
    </div> : <div className="space-y-4">
      {proposals.map(proposal => {
        const marketData = MARKET_DATA[proposal.id];
        const winningChoice = marketData ? getWinningChoice(marketData) : "tie";
        return <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4" key={proposal.id}>
          <div className="mb-3 flex flex-col items-start justify-between">
            <div className="flex justify-between w-full">
              <h4 className="font-semibold text-blue-400 underline">
                <a className="w-full" href={`https://snapshot.box/#/s:magpiexyz.eth/proposal/${proposal.id}`}>{proposal.title}</a>
              </h4>
              <div className="text-right text-xs text-gray-400">
                <div className={`inline-block rounded px-2 py-1 ${getStateClassName(proposal.state)}`}>{proposal.state.toUpperCase()}</div>
                <p className="mt-1">{(100 * (proposalScores[proposal.id]?.reduce((accumulator, score) => accumulator + score) ?? 0) / formatEther(vmgpSupply)).toFixed(2)}% voted</p>
              </div>
            </div>
          </div>
          <div className="mb-3 grid grid-cols-3 gap-4 rounded bg-gray-700/30 p-3 text-xs">
            <div>
              <p className="text-gray-400">vMGP Vote Boost</p>
              <p className="font-medium text-green-300">1 vMGP = {formatNumber(votePower, 2)} vlMGP</p>
            </div>
            <div>
              <p className="text-gray-400">Votes for Sale</p>
              <p className="font-medium text-green-300">{formatNumber(formatEther(lvmgpSupply) * votePower, 2)} - {formatNumber(formatEther(vmgpSupply) * votePower)} vlMGP</p>
            </div>
            <div>
              <p className="text-gray-400">Current Price</p>
              <p className="font-medium text-green-300">1 yMGP = {formatNumber(formatEther(marketData?.lpYesBalance ?? 0n))} vlMGP</p>
            </div>
          </div>
          {marketData ? <div className="mb-4 rounded-lg bg-gray-700/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h5 className="font-medium">Votes Purchased</h5>
              {proposal.state === "closed" && <div className={`rounded px-2 py-1 text-xs font-medium ${completedColors(winningChoice)}`}>{completedLabel(winningChoice)}</div>}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded bg-green-900/30 p-3">
                <div className="flex justify-between">
                  <span className="text-green-400">YES Votes</span>
                  <span className="font-medium">{formatNumber(formatEther(marketData.yesTokenSupply))} yMGP</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">Your Votes: {formatNumber(formatEther(marketData.userYesBalance))} yMGP</div>
              </div>
              <div className="rounded bg-red-900/30 p-3">
                <div className="flex justify-between">
                  <span className="text-red-400">NO Votes</span>
                  <span className="font-medium">{formatNumber(formatEther(marketData.noTokenSupply))} yMGP</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">Your Votes: {formatNumber(formatEther(marketData.userNoBalance))} yMGP</div>
              </div>
            </div>
          </div> : undefined}
          {proposal.state === "active" && vmgpBalance > 0n && <div className="mb-3">
            <p className="mb-2 text-sm font-medium">Choose your vote:</p>
            <div className="grid gap-2">
              {proposal.choices.map((choice, index) => <label className="flex cursor-pointer items-center rounded border border-gray-600 p-2 hover:bg-gray-700/50" key={choice}>
                <input checked={selectedChoices[proposal.id] === index} className="mr-3" name={`proposal-${proposal.id}`} onChange={() => setSelectedChoices(previous => ({ ...previous, [proposal.id]: index }))} type="radio" value={index} />
                <span className="flex-1">{choice}</span>
                <span className="text-sm text-gray-400">{proposalScores[proposal.id]?.[index] ? formatNumber(proposalScores[proposal.id]?.[index] ?? 0) : 0} votes</span>
              </label>)}
            </div>
          </div>}
          {proposal.state === "closed" && <div className="mb-3">
            <p className="mb-2 text-sm font-medium">
              Results:
            </p>
            <div className="space-y-2">
              {proposal.choices.map((choice, index) => {
                const score = proposalScores[proposal.id]?.[index] ?? 0;
                const totalScore = proposalScores[proposal.id]?.reduce((sum, s) => sum + s, 0) ?? 0;
                const percentage = totalScore > 0 ? score / totalScore * 100 : 0;
                return <div className="rounded border border-gray-600 p-2" key={choice}>
                  <div className="flex justify-between">
                    <span>{choice}</span>
                    <span className="text-sm text-gray-400">{formatNumber(score)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="mt-1 h-2 rounded bg-gray-700">
                    <div className="h-full rounded bg-blue-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>;
              })}
            </div>
          </div>}
          {proposal.state === "active" && vmgpBalance > 0n && selectedChoices[proposal.id] !== undefined && <Button className="w-full" disabled={votingProposal !== undefined} isLoading={votingProposal === proposal.id} onClick={() => handleVote(proposal.id)} type="button">{votingProposal === proposal.id ? "Voting..." : `Vote with ${formatNumber(formatEther(vmgpBalance))} vMGP (${formatNumber(formatEther(vmgpBalance) * votePower)} - ${formatNumber(formatEther(vmgpBalance) * votePower)} vlMGP)`}</Button>}
          {proposal.state === "active" && vmgpBalance === 0n && <div className="mt-6 rounded-lg bg-blue-600/20 p-4 text-center">
            <p className="text-blue-300">Get vMGP tokens to control votes</p>
            <p className="mt-2 text-sm text-blue-400">Permanently convert yMGP to vMGP to unlock voting power and control Reefi&apos;s vlMGP position or rent out your vote power to earn yield.</p>
          </div>}
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>Started: {new Date(proposal.start * 1000).toLocaleDateString()}</span>
            <span>Ends: {new Date(proposal.end * 1000).toLocaleDateString()}</span>
          </div>
        </div>;
      })}
    </div>}
  </Page>;
});

VotePage.displayName = "VotePage";
