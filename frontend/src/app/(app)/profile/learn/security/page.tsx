"use client";

import { useState } from "react";
import { LearnShell } from "../LearnShell";

interface QA { q: string; a: React.ReactNode; }

const QUESTIONS: QA[] = [
  {
    q: "Est-ce qu'Oria peut accéder à mon argent ?",
    a: (
      <>
        <p>Non.</p>
        <p>
          Ton wallet est créé par <strong>Privy</strong> et il est <strong>non-custodial</strong> : seules tes propres signatures (validées depuis ton compte Privy) peuvent bouger des fonds. Oria n'a pas de clé. On ne peut pas retirer à ta place, on ne peut pas geler ton solde, on ne peut pas le transférer ailleurs.
        </p>
        <p>
          La seule chose qu'Oria fait, c'est te montrer ton solde et te proposer les actions (déposer, retirer, investir dans tel ou tel coffre Morpho). Tu cliques, ton wallet Privy signe, la transaction part directement sur la chaîne.
        </p>
      </>
    ),
  },
  {
    q: "Que se passe-t-il si Oria ferme ?",
    a: (
      <>
        <p>Tes USDC restent là où ils sont — c'est-à-dire dans ton wallet et dans le coffre Morpho.</p>
        <p>
          Même si l'app Oria disparaît demain, ton wallet Privy continue d'exister. Tu peux te connecter à <strong>app.morpho.org</strong> avec la même adresse et retirer tes positions directement depuis l'interface de Morpho. Pas d'intermédiaire à demander la permission.
        </p>
        <p>
          On a documenté la procédure de retrait "sans Oria" dans la FAQ technique du repo public. C'est volontaire : si on disparaît, on ne veut pas que tes fonds disparaissent avec.
        </p>
      </>
    ),
  },
  {
    q: "Est-ce que je peux retirer quand je veux ?",
    a: (
      <>
        <p>Oui. Pas de période de blocage, pas de préavis.</p>
        <p>
          Un tap sur Withdraw depuis l'onglet Wallet, tu choisis le montant, ton wallet Privy signe, et les USDC reviennent sur ton wallet en quelques secondes. Les coffres Morpho qu'on utilise sont liquides en permanence.
        </p>
        <p>
          Seule subtilité : tu paies les <em>gas fees</em> du réseau (Base ou Ethereum) — généralement entre quelques centimes sur Base et quelques euros sur Ethereum mainnet en période d'engorgement. Ces frais vont aux validateurs du réseau, pas à Oria.
        </p>
      </>
    ),
  },
  {
    q: "Qu'est-ce qui se passe si le marché s'effondre ?",
    a: (
      <>
        <p>Deux scénarios à distinguer.</p>
        <p>
          <strong>Crash crypto général</strong> (BTC, ETH s'effondrent) : tes <strong>USDC ne bougent pas</strong> parce qu'ils sont adossés au dollar, pas à du crypto. Le coffre Morpho continue de tourner.
        </p>
        <p>
          <strong>Crise sur le crédit DeFi</strong> (les emprunteurs ne remboursent plus) : Morpho liquide automatiquement leur collatéral pour rembourser les prêteurs. Tant que le collatéral vaut plus que le prêt, tu es couvert. Le risque réel apparaît seulement si la valeur du collatéral baisse plus vite que la liquidation — c'est arrivé une fois ou deux en 2022, jamais sur des montants significatifs chez Morpho.
        </p>
        <p>
          <strong>Dépeg de l'USDC</strong> (rare mais possible — c'est arrivé brièvement en mars 2023) : le 1 USDC peut temporairement valoir 0,97 $ ou 0,98 $ pendant quelques heures avant de retrouver le peg. Pas de risque structurel à ce jour, mais un risque à connaître.
        </p>
      </>
    ),
  },
  {
    q: "Si je perds l'accès à mon compte Privy ?",
    a: (
      <>
        <p>
          Privy propose plusieurs façons de récupérer un compte : par email, par compte Google, par compte Apple. Tant que tu peux te reconnecter par l'un de ces canaux, tu retrouves ton wallet et tes USDC.
        </p>
        <p>
          Si tu perds tous tes accès (mail, Google, Apple) — c'est rare mais possible — Privy propose un mécanisme de récupération par <em>backup key</em> que tu peux configurer dans leur app. On recommande de le faire si tu déposes des montants significatifs.
        </p>
      </>
    ),
  },
  {
    q: "Pourquoi vous me garantissez 3 % alors que le marché peut baisser plus bas ?",
    a: (
      <>
        <p>
          Honnêtement : on ne peut pas garantir le 3 % sur la durée. Aujourd'hui le rendement du coffre Morpho est bien au-dessus de 3 % + notre marge, donc on peut tenir cette baseline. Si demain le marché tombait à 2 %, le baseline tomberait à ce niveau aussi.
        </p>
        <p>
          Le 3 % est donc une <strong>promesse conditionnelle</strong> au marché. On la maintient tant qu'on peut, et on le dira clairement si jamais il fallait l'ajuster.
        </p>
      </>
    ),
  },
];

export default function SecurityFaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <LearnShell
      title="FAQ sécurité"
      intro="Les questions qu'on pose normalement à un ami qui bosse dans la finance avant de bouger 100 €. Réponses courtes, factuelles, sans sur-promettre."
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
