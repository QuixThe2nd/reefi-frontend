import { formatNumber, formatEther } from "../utilities";
import { memo, useState, type ReactElement } from "react";
import { useCachedUpdateable } from "../hooks/useUpdateable";

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
  readonly reefiMgpLocked: bigint;
  readonly onVote: (_proposalId: string, _choice: number) => Promise<void>;
}

const getStateClassName = (state: "active" | "closed" | "pending"): string => {
  if (state === "active") return "bg-green-600/20 text-green-400";
  if (state === "closed") return "bg-red-600/20 text-red-400";
  return "bg-yellow-600/20 text-yellow-400";
};

export const VotePage = memo(({ vmgpBalance, vmgpSupply, reefiMgpLocked, onVote }: Properties): ReactElement => {
  const [selectedChoices, setSelectedChoices] = useState<Record<string, number>>({});
  const [votingProposal, setVotingProposal] = useState<string | undefined>();
  const proposalScores: Record<string, number[]> = {};

  const handleVote = async (proposalId: string): Promise<void> => {
    const choice = selectedChoices[proposalId];
    if (choice === undefined) return;
    setVotingProposal(proposalId);
    await onVote(proposalId, choice);
    setVotingProposal(undefined);
  };

  const votePower = Number(reefiMgpLocked) / Number(vmgpSupply);
  const userVotingPower = formatEther(vmgpBalance) * votePower;

  const getProposalMultipliers = (proposal: Proposal) => {
    const totalVlMgpVotes = proposalScores[proposal.id]?.reduce((sum, score) => sum + score, 0) ?? 0;
    const minimumMultiplier = votePower;
    const currentMultiplier = totalVlMgpVotes > 0 ? formatEther(reefiMgpLocked) / totalVlMgpVotes : votePower;
    return { minimumMultiplier, currentMultiplier };
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
  }, [], "proposals", []);

  return <Page info={[
    "vMGP holders control all of Reefi's vlMGP voting power on Magpie governance proposals.",
    "Your voting power is amplified by Reefi's locked MGP position, giving you more influence per token.",
    "Vote multipliers are displayed as a minimum vote assuming all vMGP votes. If 50% of vMGP votes on a proposal, your vote multiplier doubles."
  ]}>
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
    <h3 className="mb-4 text-lg font-semibold">Recent Proposals</h3>
    {proposals.length === 0 ? <div className="rounded-lg bg-gray-700/50 p-8 text-center">
      <p className="text-gray-400">No active proposals found</p>
      <p className="mt-2 text-sm text-gray-500">Check back later for new governance proposals</p>
    </div> : <div className="space-y-4">
      {proposals.map(proposal => {
        const { minimumMultiplier, currentMultiplier } = getProposalMultipliers(proposal);
        return <div key={proposal.id} className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <div className="mb-3 flex flex-col items-start justify-between">
            <div className="flex w-full">
              <h4 className="font-semibold text-blue-400">{proposal.title}</h4>
              <div className="text-right text-xs text-gray-400 w-full">
                <div className={`inline-block rounded px-2 py-1 ${getStateClassName(proposal.state)}`}>{proposal.state.toUpperCase()}</div>
                <p className="mt-1">{(100 * (proposalScores[proposal.id]?.reduce((accumulator, score) => accumulator + score) ?? 0) / formatEther(vmgpSupply)).toFixed(2)}% voted</p>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-300 w-full">{proposal.body.slice(0, 500)}... <a className="text-blue-400" href={`https://snapshot.box/#/s:magpiexyz.eth/proposal/${proposal.id}`}>View Proposal</a></p>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-4 rounded bg-gray-700/30 p-3 text-xs">
            <div>
              <p className="text-gray-400">Vote Power</p>
              <p className="font-medium text-green-300">1 vMGP = {formatNumber(minimumMultiplier, 2)} vlMGP</p>
            </div>
          </div>

          {proposal.state === "active" && vmgpBalance > 0n &&
            <div className="mb-3">
              <p className="mb-2 text-sm font-medium">Choose your vote:</p>
              <div className="grid gap-2">
                {proposal.choices.map((choice, index) => <label key={choice} className="flex cursor-pointer items-center rounded border border-gray-600 p-2 hover:bg-gray-700/50">
                  <input type="radio" name={`proposal-${proposal.id}`} value={index} checked={selectedChoices[proposal.id] === index} onChange={() => setSelectedChoices(previous => ({ ...previous, [proposal.id]: index }))} className="mr-3" />
                  <span className="flex-1">{choice}</span>
                  <span className="text-sm text-gray-400">{proposalScores[proposal.id]?.[index] ? formatNumber(proposalScores[proposal.id]?.[index] ?? 0) : 0} votes</span>
                </label>)}
              </div>
            </div>
          }
          {proposal.state === "closed" && <div className="mb-3">
            <p className="mb-2 text-sm font-medium">Results:</p>
            <div className="space-y-2">
              {proposal.choices.map((choice, index) => {
                const score = proposalScores[proposal.id]?.[index] ?? 0;
                const totalScore = proposalScores[proposal.id]?.reduce((sum, s) => sum + s, 0) ?? 0;
                const percentage = totalScore > 0 ? score / totalScore * 100 : 0;
                return (
                  <div key={choice} className="rounded border border-gray-600 p-2">
                    <div className="flex justify-between">
                      <span>{choice}</span>
                      <span className="text-sm text-gray-400">{formatNumber(score)} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="mt-1 h-2 rounded bg-gray-700">
                      <div className="h-full rounded bg-blue-500" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>}
          {proposal.state === "active" && vmgpBalance > 0n && selectedChoices[proposal.id] !== undefined && <Button className="w-full" onClick={() => handleVote(proposal.id)} isLoading={votingProposal === proposal.id} disabled={votingProposal !== undefined} type="button">{votingProposal === proposal.id ? "Voting..." : `Vote with ${formatNumber(formatEther(vmgpBalance))} vMGP (${formatNumber(formatEther(vmgpBalance) * votePower)} - ${formatNumber(formatEther(vmgpBalance) * currentMultiplier)} vlMGP)`}</Button>}
          {proposal.state === "active" && vmgpBalance === 0n && <div className="rounded bg-yellow-600/20 p-3 text-center text-sm text-yellow-300">You need vMGP tokens to vote on this proposal</div>}
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>Started: {new Date(proposal.start * 1000).toLocaleDateString()}</span>
            <span>Ends: {new Date(proposal.end * 1000).toLocaleDateString()}</span>
          </div>
        </div>;
      })}
    </div>
    }

    {vmgpBalance === 0n && <div className="mt-6 rounded-lg bg-blue-600/20 p-4 text-center">
      <p className="text-blue-300">Get vMGP tokens to participate in governance</p>
      <p className="mt-2 text-sm text-blue-400">Convert yMGP to vMGP to unlock voting power and control Reefi's vlMGP position</p>
    </div>}
  </Page>;
});

VotePage.displayName = "VotePage";
