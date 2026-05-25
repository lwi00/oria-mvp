"use client";

import { useState } from "react";
import { LearnShell } from "../LearnShell";

interface QA {
  q: string;
  a: React.ReactNode;
}

const QUESTIONS: QA[] = [
  {
    q: "Can Oria access my money?",
    a: (
      <>
        <p>No.</p>
        <p>
          Your wallet is created by <strong>Privy</strong> and is <strong>non-custodial</strong>:
          only your own signatures (validated from your Privy account) can move funds. Oria doesn't
          have a key. We can't withdraw on your behalf, can't freeze your balance, can't transfer it
          elsewhere.
        </p>
        <p>
          All Oria does is show you your balance and surface the available actions (deposit,
          withdraw, invest into vault X). You tap, your Privy wallet signs, the transaction goes
          straight on-chain.
        </p>
      </>
    ),
  },
  {
    q: "What happens if Oria shuts down?",
    a: (
      <>
        <p>Your USDC stays exactly where it is — in your wallet and in the Morpho vault.</p>
        <p>
          Even if Oria disappears tomorrow, your Privy wallet still exists. You can log in at{" "}
          <strong>app.morpho.org</strong> with the same address and withdraw your positions directly
          from Morpho's UI. No middleman to ask.
        </p>
        <p>
          The "withdraw without Oria" path is documented in the public repo's technical FAQ. By
          design — if we go away, your funds shouldn't go with us.
        </p>
      </>
    ),
  },
  {
    q: "Can I withdraw whenever I want?",
    a: (
      <>
        <p>Yes. No lock-up, no notice.</p>
        <p>
          Tap Withdraw in the Wallet tab, pick the amount, your Privy wallet signs, and the USDC is
          back in your wallet in seconds. The Morpho vaults we use are liquid at all times.
        </p>
        <p>
          One catch: you pay the network <em>gas fees</em> (Base or Ethereum) — usually a few cents
          on Base, a few euros on Ethereum mainnet when it's congested. Those go to network
          validators, not Oria.
        </p>
      </>
    ),
  },
  {
    q: "What if the market crashes?",
    a: (
      <>
        <p>Two scenarios worth separating.</p>
        <p>
          <strong>General crypto crash</strong> (BTC, ETH tank): your{" "}
          <strong>USDC doesn't move</strong> — it's pegged to the dollar, not to crypto. The Morpho
          vault keeps running.
        </p>
        <p>
          <strong>DeFi credit crunch</strong> (borrowers stop repaying): Morpho automatically
          liquidates their collateral to repay lenders. As long as the collateral is worth more than
          the loan, you're covered. The real risk shows up only if collateral value drops faster
          than the liquidation engine can act — that happened once or twice in 2022, never at scale
          on Morpho.
        </p>
        <p>
          <strong>USDC depeg</strong> (rare but possible — happened briefly in March 2023): 1 USDC
          can trade at $0.97 or $0.98 for a few hours before reverting. No structural risk to date,
          but a risk to be aware of.
        </p>
      </>
    ),
  },
  {
    q: "What if I lose access to my Privy account?",
    a: (
      <>
        <p>
          Privy supports several recovery paths: email, Google, Apple. As long as you can sign in
          through one of those, you get your wallet — and your USDC — back.
        </p>
        <p>
          If you lose all of those (rare but possible), Privy offers a <em>backup key</em> recovery
          mechanism in their app. Worth setting up if you're depositing meaningful amounts.
        </p>
      </>
    ),
  },
  {
    q: "Is the baseline a fixed rate?",
    a: (
      <>
        <p>
          No. The baseline isn&apos;t a fixed, permanently-locked rate — it tracks what the Morpho
          vault is actually paying. Today the vault generates comfortably above it, so the baseline
          holds. If the market dropped far enough, the baseline would move with it.
        </p>
        <p>
          So treat it as a <strong>market-conditional floor</strong>, not a guaranteed number. We
          hold it as long as the vault allows, and we&apos;ll say so clearly if it ever needs to
          move.
        </p>
      </>
    ),
  },
];

export default function SecurityFaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <LearnShell
      title="Security FAQ"
      intro="The hard questions you'd ask a friend in finance before moving money. Short answers."
    >
      <div className="flex flex-col gap-2 mt-2">
        {QUESTIONS.map((qa, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="rounded-2xl border border-oria bg-oria-section overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-[14px] font-bold text-text-primary">{qa.q}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-oria text-[13px] text-text-secondary leading-relaxed [&_p+p]:mt-2.5 [&_strong]:text-text-primary">
                  {qa.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </LearnShell>
  );
}
