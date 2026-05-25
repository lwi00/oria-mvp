"use client";

import { LearnShell } from "../LearnShell";
import { useStreak, useUser } from "@/lib/hooks";

export default function HowItWorksPage() {
  const { data: streak } = useStreak();
  const { data: user } = useUser();
  const streakCount = streak?.currentCount ?? 0;
  const effectiveApy = streak?.effectiveApy ?? 3;
  const targetKm = user?.targetKm ?? 10;
  const sport = user?.goalType === "cycling" ? "ride" : "run";

  return (
    <LearnShell title="How it works" intro="No crypto background needed — start here.">
      <h2>First, what lending on a blockchain even is</h2>
      <p>
        A bank takes your savings, lends it out, and keeps most of the interest. <strong>DeFi</strong> — decentralised finance — does the same job, except the bank is replaced by open software running on a blockchain. Anyone can lend, anyone can borrow, and the rules are public code instead of a back office. When someone borrows the money you've put in, they pay interest — and that interest is your yield.
      </p>

      <h2>Why a borrower can&apos;t walk off with your money</h2>
      <p>
        The obvious worry with lending is simple: what if the borrower never pays back? DeFi answers it with <strong>over-collateralised lending</strong>. To borrow anything, you must first lock up <em>more</em> value than you take out — borrow $100 and you might have to post $150 of crypto as collateral.
      </p>
      <p>
        If a borrower stops repaying, or their collateral starts losing value, the system automatically sells that collateral to pay the lenders back — this is called <strong>liquidation</strong>, and it fires before the loan can ever go underwater. So your loan is always backed by collateral worth more than the loan itself. That&apos;s the core protection, and it runs without anyone having to step in.
      </p>

      <h2>What you actually deposit</h2>
      <p>
        You don&apos;t lend regular dollars — you lend a <strong>stablecoin</strong> called <strong>USDC</strong>: a digital token worth exactly $1, issued by Circle (a regulated US company) and backed one-for-one by real dollars and US Treasury bills. Think of it as the dollar in a form a blockchain can move instantly.
      </p>
      <p>
        You fund your Oria wallet with USDC and tap Invest. It goes into a <strong>Morpho</strong> vault — the lending protocol that matches your USDC with those over-collateralised borrowers (about <strong>$7.4B</strong> sits in Morpho today). The wallet holding your position is <strong>yours</strong> — Privy-issued, no seed phrase — and Oria never signs on your behalf.
      </p>

      <h2>How Oria turns that yield into your rate</h2>
      <p>
        The Morpho vault pays a yield. Oria captures it as a set rate for the week, then splits it between users by how consistent they&apos;ve been with their training. Everyone earns the <strong>3% baseline</strong> no matter what — your activity only decides how the bonus pool on top gets divided.
      </p>
      <p>Your weekly activity score is built from four things:</p>
      <ul>
        <li><strong>Consistency</strong> — your streak: each week in a row you hit your {targetKm} km goal (the biggest factor)</li>
        <li><strong>Regularity</strong> — three or more sessions in the week</li>
        <li><strong>Long {sport}</strong> — hitting your long-session target</li>
        <li><strong>Progression</strong> — {sport === "ride" ? "riding" : "running"} faster than your recent average</li>
      </ul>
      <p>
        Your score moves with how the week actually went. <strong>Every Sunday at 12:00, the scores are recalculated and your rate is locked in for the week ahead</strong> — so a strong week now shows up as a bigger slice of the pool next week.
      </p>
      {streakCount > 0 ? (
        <p>
          You&apos;re on <strong>{streakCount} week{streakCount > 1 ? "s" : ""}</strong> of streak, sitting at <strong>{effectiveApy.toFixed(2)}%</strong>. The consistency factor maxes out at 16 weeks.
        </p>
      ) : (
        <p>
          Hit your first weekly goal and your rate starts climbing above the 3% baseline. The consistency factor maxes out at 16 weeks.
        </p>
      )}

      <h2>You withdraw whenever</h2>
      <p>
        No lock-up. Tap Withdraw in the Wallet tab, sign with your Privy wallet, and your USDC is back in your wallet in seconds. Oria has no switch to flip — there&apos;s nothing to ask permission for.
      </p>

      <h2>What Oria doesn&apos;t do</h2>
      <ul>
        <li>Touch your funds — the wallet is non-custodial</li>
        <li>Use leverage — your deposit is your exposure, full stop</li>
        <li>Promise a permanently fixed return — the market moves, and we set the rate fresh each week</li>
      </ul>
      <p>
        For the harder questions — what happens if Oria shuts down, what if the market crashes — see the <strong>Security FAQ</strong> in the Understand Oria menu.
      </p>
    </LearnShell>
  );
}
