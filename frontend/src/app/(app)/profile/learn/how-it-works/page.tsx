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
    <LearnShell
      title="Comment ça marche ?"
      intro="Le tour complet en 3 minutes. Honnête, sans jargon."
    >
      <h2>1. Tu déposes des USDC</h2>
      <p>
        USDC, c'est un <strong>stablecoin</strong> adossé au dollar US : 1 USDC = 1 $. Émis par Circle, une boîte américaine régulée. Ce n'est pas du Bitcoin ou de l'Ether — la valeur ne bouge pas.
      </p>
      <p>
        Tu fundes ton wallet Oria avec des USDC (depuis un exchange, depuis un autre wallet, n'importe), puis tu cliques sur Invest depuis l'onglet Wallet.
      </p>

      <h2>2. Tes USDC partent dans un coffre Morpho</h2>
      <p>
        On les dépose dans un coffre <strong>Morpho</strong> — un protocole de prêt décentralisé sur Ethereum. Aujourd'hui <strong>~7,4 Mds$</strong> y sont confiés. Des emprunteurs y déposent du collatéral pour emprunter, et ils paient des intérêts. Ces intérêts, c'est ton rendement.
      </p>
      <p>
        Le wallet qui détient ces dépôts, c'est <strong>le tien</strong> — créé automatiquement par Privy, sans seed phrase. Oria ne signe rien à ta place.
      </p>

      <h2>3. Tu bouges chaque semaine, ton APY monte</h2>
      <p>
        Tu as fixé un objectif hebdomadaire ({targetKm} km/semaine). Chaque semaine où tu l'atteins, ta <strong>streak</strong> augmente d'un cran et ta part du <em>bonus pool</em> grossit.
      </p>
      <ul>
        <li><strong>Baseline garantie</strong> : 3 % APY peu importe ton activité</li>
        <li><strong>Bonus pool</strong> : le surplus de rendement que les inactifs n'utilisent pas est redistribué proportionnellement à ta consistance</li>
      </ul>
      {streakCount > 0 ? (
        <p>
          Tu es actuellement à <strong>{streakCount} semaine{streakCount > 1 ? "s" : ""} de streak</strong>, ce qui te place à <strong>{effectiveApy.toFixed(2)} %</strong>. À 16 semaines, ta part du pool est au maximum.
        </p>
      ) : (
        <p>
          Si tu démarres ta première streak cette semaine, ton APY commence à monter au-delà du baseline. À 16 semaines, ta part du pool est au maximum.
        </p>
      )}

      <h2>4. Tu retires quand tu veux</h2>
      <p>
        Pas de période de blocage. Tu peux retirer tout ou partie de tes USDC à tout moment — un tap depuis l'onglet Wallet, signature dans ton wallet Privy, et c'est fait. Pas d'autorisation Oria à demander, parce qu'Oria ne contrôle rien.
      </p>

      <h2>Ce qu'Oria ne fait pas</h2>
      <ul>
        <li>On ne touche pas à ton argent (le wallet est non-custodial)</li>
        <li>On ne prend pas de levier (ton dépôt = ton exposition, point)</li>
        <li>On ne te promet pas un rendement fixe (le marché bouge, on le dit)</li>
      </ul>
      <p>
        Pour les questions de sécurité (que se passe-t-il si Oria ferme, etc.), va sur <strong>FAQ sécurité</strong> dans le menu Comprendre Oria.
      </p>
    </LearnShell>
  );
}
