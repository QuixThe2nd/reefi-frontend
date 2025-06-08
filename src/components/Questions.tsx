import { useState, type ReactElement } from "react";

import { Card } from "./Card";
import Diagram from "../../public/diagram.svg";

interface QAItem {
  readonly question: string;
  readonly answer: string | readonly string[];
}

const qaData: readonly QAItem[] = [
  {
    answer: ["Reefi is a protocol that refinances Magpie yield and governance by creating liquid derivatives of vlMGP (vote-locked MGP).", "It allows users to earn auto-compounding yield while maintaining liquidity and boosted yields, as well as boosted governance power."],
    question: "What is Reefi and how does it work?"
  },
  {
    answer: ["<strong>MGP</strong>: The base token from Magpie protocol", "<strong>wstMGP</strong>: Liquid token representing locked MGP that earns auto-compounding yield (90% of vlMGP yield)", "<strong>yMGP</strong>: Token backed 1:1 by wstMGP that can be locked to earn 5% of vlMGP yield and 25% on redemptions", "<strong>vMGP</strong>: Governance token backed by yMGP that controls Reefi's vlMGP voting power", "<strong>cMGP</strong>: Curve LP token for the MGP/wstMGP/yMGP/vMGP pool that earns swap fees + underlying yield"],
    question: "What are the different tokens in the Reefi ecosystem?"
  },
  {
    answer: ["1. <strong>Deposit MGP</strong>: Convert MGP to wstMGP to earn 90% of vlMGP yield with auto-compounding", "2. <strong>Lock yMGP</strong>: Convert wstMGP to yMGP and lock it to earn additional yield from protocol fees and redemptions", "3. <strong>Provide Liquidity</strong>: Supply tokens to the Curve pool to earn swap fees plus underlying yield", "4. <strong>Compound Rewards</strong>: Anyone can compound pending yield and receive 1% as a reward", "5. <strong>Fixed Yield</strong>: Buy wstMGP and instantly withdraw to earn fixed yield"],
    question: "How do I earn yield with Reefi?"
  },
  {
    answer: ["wstMGP can be redeemed for MGP in two ways:", "1. <strong>Instant Market Rate</strong>: Swap on Curve at current market price", "2. <strong>Native Redemption</strong>: Use the withdrawal queue with a 60-120 day wait time"],
    question: "What are the withdrawal mechanics for wstMGP?"
  },
  {
    answer: ["The withdrawal mechanics are inherited from Magpie's vlMGP:", "• vlMGP has a minimum 60-day unlock period", "• Only 6 withdrawal slots are available at once, potentially extending wait time to 120 days in rare cases", "• This creates arbitrage opportunities for those willing to wait for withdrawals"],
    question: "Why does wstMGP have a withdrawal delay?"
  },
  {
    answer: ["<strong>vMGP Governance</strong>: vMGP holders control all of Reefi's vlMGP voting power on Magpie proposals", "<strong>Reefi DAO</strong>: Locked yMGP holders vote on Reefi protocol decisions", "<strong>Treasury</strong>: Receives 4% of compounded yield", "The core team has no initial token allocation as all tokens are backed by underlying MGP"],
    question: "How does governance work in Reefi?"
  },
  {
    answer: ["<strong>Smart Contract Risk</strong>: Reefi is in early beta and may contain bugs", "<strong>Depeg Risk</strong>: wstMGP and yMGP may trade below the MGP value, though arbitrage mechanisms exist", "<strong>Liquidity Risk</strong>: Withdrawal queues may be full, extending redemption time", "<strong>Protocol Risk</strong>: Dependency on Magpie protocol and vlMGP mechanics"],
    question: "What are the risks of using Reefi?"
  },
  {
    answer: ["Anyone can compound pending vlMGP yield by clicking 'Compound Yield' when it's profitable.", "The compounder receives 1% of all pending yield as yMGP tokens.", "This can be automated using scripts that monitor gas costs vs. rewards.", "Compounding benefits the entire protocol by reinvesting yield and maintaining peg stability."],
    question: "How do I compound rewards and earn the 1% fee?"
  },
  {
    answer: ["<strong>Minting</strong>: Native protocol rate - wstMGP minted at current backing ratio, yMGP always 1:1 with wstMGP", "<strong>Curve Trading</strong>: Market-determined rates with potential premium/discount", "The UI shows percentage differences to help you choose the better option.", "Arbitrage opportunities exist when market rates deviate significantly from mint/burn rates."],
    question: "What is the difference between minting and buying on Curve?"
  },
  {
    answer: ["Reefi is deployed on:", "• <strong>BNB Chain</strong>: BnB Smart Chain", "• <strong>Arbitrum</strong>: Arbitrum One"],
    question: "Which chains does Reefi support?"
  }
] as const;

export const QASection = (): ReactElement => {
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set());
  const toggleItem = (index: number): void => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) newOpenItems.delete(index);
    else newOpenItems.add(index);
    setOpenItems(newOpenItems);
  };

  return <Card>
    <div className="max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {qaData.map((item, index) => <div className="rounded-lg border border-gray-700" key={item.question}>
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-700/30" onClick={() => {
            toggleItem(index);
          }} type="button">
            <span className="font-medium text-gray-200">{item.question}</span>
            <svg className={`size-5 text-gray-400 transition-transform${openItems.has(index) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/></svg>
          </button>
          {openItems.has(index) && <div className="px-4 pb-4">
            <div className="border-t border-gray-700 pt-2">
              {Array.isArray(item.answer) ? (item.answer as string[]).map(paragraph => <p className="mb-2 text-sm text-gray-300 last:mb-0" dangerouslySetInnerHTML={{ __html: paragraph }} key={paragraph} />) : <p className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: item.answer as string }} />}
            </div>
          </div>}
        </div>)}
      </div>
      <div className="my-4 flex justify-center">
        <img alt="Diagram" className="w-full" src={Diagram} />
      </div>
    </div>
  </Card>;
};
