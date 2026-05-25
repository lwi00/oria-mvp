"use client";

import { LearnShell } from "../LearnShell";
import { useStreak } from "@/lib/hooks";

export default function YieldPage() {
  const { data: streak } = useStreak();
  const streakCount = streak?.currentCount ?? 0;

  return (
    <LearnShell title="Where the yield comes from" intro="Three layers: Morpho generates the yield, everyone earns a baseline slice, and the rest redistributes by consistency.">
      <h2>Layer 1 — Morpho generates the yield</h2>
      <p>
        Your USDC sits in a <strong>Morpho vault</strong> on Base or Ethereum (you pick in Wallet → Invest). The vault lends those USDC to borrowers who&apos;ve posted collateral. Borrowers pay interest, the vault collects it, and it flows back to you.
      </p>
      <p>
        That rate is <strong>not fixed</strong> — it moves with supply and demand for credit, up when borrowing demand rises, down when it cools.
      </p>

      <h2>Layer 2 — The baseline everyone earns</h2>
      <p>
        Whatever the vault is paying, a <strong>baseline slice</strong> of it goes to everyone, regardless of activity. Sit still, and you still earn that share.
      </p>
      <p>
        We do this deliberately — the product should stay reassuring for someone discovering DeFi, not a zero-sum game where you have to grind to get anything back.
      </p>

      <h2>Layer 3 — The bonus pool, redistributed by consistency</h2>
      <p>
        The rest of the yield sits in a shared <strong>bonus pool</strong>, <strong>redistributed weekly</strong> based on each user&apos;s activity score. The more consistent you are, the bigger your slice.
      </p>
      <p>
        The activity score is made of four ingredients: streak (60% weight), weekly regularity (15%), long run (15%), pace progression (10%). Your score is recalculated every <strong>Sunday at 12:00</strong>, which sets your rate for the week ahead.
      </p>
      {streakCount > 0 ? (
        <p>
          With {streakCount} week{streakCount > 1 ? "s" : ""} of streak, you&apos;re already pulling a bonus on top of the baseline. The streak ingredient keeps growing your slice until it caps at 16 weeks.
        </p>
      ) : (
        <p>
          Until you complete a week, you stay on the baseline. Once you do, your bonus grows with every validated week until the streak component caps at 16.
        </p>
      )}

      <h2>The ceiling: never above what Morpho pays</h2>
      <p>
        Your effective rate can <strong>never exceed what the Morpho vault generates</strong>. The bonus pool only redistributes what inactive users leave on the table — it doesn&apos;t create yield out of thin air.
      </p>
    </LearnShell>
  );
}
