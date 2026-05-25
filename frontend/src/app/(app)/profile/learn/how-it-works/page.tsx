"use client";

import { LearnShell } from "../LearnShell";
import { useStreak, useUser } from "@/lib/hooks";

export default function HowItWorksPage() {
  const { data: streak } = useStreak();
  const { data: user } = useUser();
  const streakCount = streak?.currentCount ?? 0;
  const effectiveApy = streak?.effectiveApy ?? 3;
  const targetKm = user?.targetKm ?? 10;

  return (
    <LearnShell title="How it works" intro="Four stages, three minutes.">
      <h2>1. You deposit USDC</h2>
      <p>
        USDC is a <strong>stablecoin</strong> pegged to the US dollar: 1 USDC = $1. Issued by Circle, a regulated US company. Each USDC in circulation is backed by an actual dollar (or a US Treasury bill) held in a bank.
      </p>
      <p>
        You fund your Oria wallet with USDC — from an exchange, from another wallet, anywhere — and tap Invest in the Wallet tab.
      </p>

      <h2>2. Your USDC goes into a Morpho vault</h2>
      <p>
        We deposit it into a <strong>Morpho</strong> vault — a decentralised lending protocol on Ethereum. About <strong>$7.4B</strong> sits in Morpho today. Borrowers post collateral and pay interest to borrow USDC; that interest is your yield.
      </p>
      <p>
        The wallet that holds the vault shares is <strong>yours</strong> — Privy-issued, no seed phrase. Oria doesn't sign on your behalf.
      </p>

      <h2>3. You hit your weekly goal, your APY climbs</h2>
      <p>
        You picked a weekly target ({targetKm} km/week). Every week you hit it, your <strong>streak</strong> ticks up and your share of the bonus pool grows.
      </p>
      <ul>
        <li><strong>Guaranteed baseline</strong>: 3% APY whatever you do</li>
        <li><strong>Bonus pool</strong>: yield the inactive users don't claim is redistributed by activity score</li>
      </ul>
      {streakCount > 0 ? (
        <p>
          You're on <strong>{streakCount} week{streakCount > 1 ? "s" : ""} of streak</strong>, sitting at <strong>{effectiveApy.toFixed(2)}%</strong> today. At 16 weeks, your slice of the pool maxes out.
        </p>
      ) : (
        <p>
          Hit your first weekly goal and your APY starts climbing above the baseline. The streak component caps at 16 weeks.
        </p>
      )}

      <h2>4. You withdraw whenever</h2>
      <p>
        No lock-up. Tap Withdraw in the Wallet tab, sign with your Privy wallet, and your USDC is back in your wallet in seconds. Oria doesn't have a switch to flip — there's nothing to ask permission for.
      </p>

      <h2>What Oria doesn't do</h2>
      <ul>
        <li>Touch your funds (the wallet is non-custodial)</li>
        <li>Use leverage (your deposit = your exposure, full stop)</li>
        <li>Promise a fixed return (the market moves, we say so)</li>
      </ul>
      <p>
        For security questions (what happens if Oria shuts down, etc.), see <strong>Security FAQ</strong> in the Understand Oria menu.
      </p>
    </LearnShell>
  );
}
