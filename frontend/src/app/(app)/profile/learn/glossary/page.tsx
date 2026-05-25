"use client";

import { LearnShell } from "../LearnShell";

interface Entry { term: string; def: React.ReactNode; }

const ENTRIES: Entry[] = [
  {
    term: "USDC",
    def: <>Stablecoin émis par <strong>Circle</strong>, calé sur le dollar US (1 USDC = 1 $). Adossé à des dollars et bons du Trésor US en banque. C'est ce que tu déposes sur Oria.</>,
  },
  {
    term: "Stablecoin",
    def: <>Crypto dont la valeur est calée sur une monnaie classique. Utilisé pour garder du pouvoir d'achat stable dans l'écosystème crypto sans être exposé à la volatilité.</>,
  },
  {
    term: "APY",
    def: <>Annual Percentage Yield — le rendement annualisé. Si tu touches 0,4 % sur un mois, l'APY équivalent est ~5 %. C'est le chiffre affiché à côté de ton solde.</>,
  },
  {
    term: "Baseline",
    def: <>Le rendement garanti à <strong>tout le monde</strong> sur Oria (3 % aujourd'hui). Tu le touches même sans activité.</>,
  },
  {
    term: "Bonus pool",
    def: <>L'excédent du rendement Morpho au-delà de la baseline, redistribué chaque semaine entre les utilisateurs actifs proportionnellement à leur score d'activité. Pas de magie : ce sont les inactifs qui financent les actifs.</>,
  },
  {
    term: "Streak",
    def: <>Le nombre de semaines consécutives où tu as atteint ton objectif km. C'est l'ingrédient principal de ton score d'activité (60 % du poids). Une semaine ratée la remet à zéro.</>,
  },
  {
    term: "Morpho",
    def: <>Protocole de prêt décentralisé sur Ethereum (~7,4 Mds$ confiés). Met en relation prêteurs et emprunteurs via des <em>smart contracts</em>. Tes USDC dorment dans un coffre Morpho géré par un curateur (Steakhouse, Gauntlet…).</>,
  },
  {
    term: "Vault (coffre)",
    def: <>Un compartiment Morpho géré par un curateur professionnel qui choisit où prêter pour optimiser le rendement et la sécurité. Oria utilise trois vaults USDC : Steakhouse Prime, Gauntlet Prime (sur Base) et Gauntlet Frontier (sur Ethereum mainnet).</>,
  },
  {
    term: "Privy",
    def: <>Le service qui crée et gère ton wallet sans seed phrase. Tu te connectes par email, Google ou Apple ; Privy garde le contrôle d'une partie de ta clé via MPC. Non-custodial : Oria n'a pas la clé.</>,
  },
  {
    term: "Wallet",
    def: <>Ton adresse sur la blockchain. C'est elle qui détient tes USDC et tes parts de vault. Format <code>0x…</code>. Tu peux la voir dans Wallet → Receive.</>,
  },
  {
    term: "Non-custodial",
    def: <>Personne d'autre que toi ne peut bouger tes fonds. Par opposition à <em>custodial</em> où un intermédiaire (exchange, app) détient les clés et peut bloquer / refuser un retrait.</>,
  },
  {
    term: "Smart contract",
    def: <>Un programme qui tourne sur la blockchain et exécute automatiquement les règles qu'il décrit. Morpho est un ensemble de smart contracts. Auditable publiquement, immuable une fois déployé.</>,
  },
  {
    term: "Gas fees",
    def: <>Les frais de transaction du réseau blockchain. Payés en ETH (sur Base ou Ethereum mainnet) aux validateurs qui sécurisent la chaîne. Quelques centimes sur Base, parfois plus sur Ethereum mainnet en période d'engorgement.</>,
  },
  {
    term: "Base",
    def: <>Une blockchain "layer 2" construite sur Ethereum par Coinbase. Beaucoup moins de gas fees qu'Ethereum mainnet, même sécurité de fond. C'est le réseau par défaut sur Oria.</>,
  },
  {
    term: "Liquidation",
    def: <>Quand un emprunteur sur Morpho n'a plus assez de collatéral pour couvrir son prêt, son collatéral est vendu automatiquement pour rembourser les prêteurs. C'est le mécanisme qui protège ton dépôt.</>,
  },
  {
    term: "Peg",
    def: <>Le mécanisme qui maintient un stablecoin à sa parité (1 USDC = 1 $). Un <em>dépeg</em> arrive quand la parité décroche temporairement, généralement à cause d'un choc de liquidité. Rare mais possible.</>,
  },
  {
    term: "Spread",
    def: <>La marge qu'Oria prend sur le rendement Morpho pour faire tourner le produit. On préfère parler de ce que tu reçois plutôt que de ce qu'on prend.</>,
  },
];

export default function GlossaryPage() {
  return (
    <LearnShell title="Glossaire" intro="Tous les mots qu'on utilise dans l'app, expliqués à la suite.">
      <div className="flex flex-col gap-3 mt-2">
        {ENTRIES.map((e) => (
          <div key={e.term} className="rounded-2xl border border-oria bg-oria-section p-4">
            <p className="text-[13px] font-extrabold text-accent-purple-bright uppercase tracking-wide mb-1">
              {e.term}
            </p>
            <p className="text-[13px] text-text-secondary leading-relaxed [&_strong]:text-text-primary [&_code]:bg-accent-purple/15 [&_code]:text-accent-purple-bright [&_code]:px-1 [&_code]:rounded">
              {e.def}
            </p>
          </div>
        ))}
      </div>
    </LearnShell>
  );
}
