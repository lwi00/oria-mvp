"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  /** User context for personalization */
  streakCount: number;
  effectiveApy: number;
  baselineApy: number;
  bonusBps?: number; // optional, derived
}

/**
 * Three swipable screens explaining the yield in plain French — pulled up
 * from the APY chip on the dashboard. Step 3 deliberately closes on a calm,
 * "you stay in control" beat rather than on the risk list.
 */
export function LearnBottomSheet({ open, onClose, streakCount, effectiveApy, baselineApy }: Props) {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setPage(0);
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const goTo = (i: number) => {
    setPage(i);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const bonus = Math.max(0, effectiveApy - baselineApy);
  const bonusFmt = bonus.toFixed(2);
  const apyFmt = effectiveApy.toFixed(2);
  const baseFmt = baselineApy.toFixed(2);

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/55 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="How Oria works"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] bg-[#0F0F16] rounded-t-3xl border-t border-x border-oria sheet-in max-h-[90vh] flex flex-col"
      >
        {/* Drag handle + header */}
        <div className="pt-3 pb-2 flex flex-col items-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-oria-strong mb-3" />
          <div className="w-full px-5 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-purple-bright">
              Comprendre Oria
            </p>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-8 h-8 rounded-full bg-oria-chip border border-oria flex items-center justify-center"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA0AC" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal scroll-snap carousel */}
        <div
          ref={scrollerRef}
          className="overflow-x-auto snap-x snap-mandatory flex-1 scrollbar-none"
          onScroll={(e) => {
            const el = e.currentTarget;
            const idx = Math.round(el.scrollLeft / el.clientWidth);
            if (idx !== page) setPage(idx);
          }}
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex">
            {/* ── Screen 1 — D'où vient mon taux ? ── */}
            <div className="min-w-full snap-start px-6 py-6 flex flex-col gap-4">
              <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
                D'où vient ton <span className="text-accent-purple-bright">{apyFmt}%</span> ?
              </h2>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Ton APY est composé de deux choses :
              </p>
              <div className="flex flex-col gap-2">
                <div className="rounded-2xl border border-accent-purple/25 bg-accent-purple/8 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-purple-bright">Baseline</p>
                  <p className="text-[20px] font-extrabold text-text-primary mt-1 tabular-nums">{baseFmt}%</p>
                  <p className="text-[12px] text-text-muted mt-1 leading-snug">
                    Garantie pour tous, peu importe ton activité.
                  </p>
                </div>
                <div className="rounded-2xl border border-accent-sport/25 bg-accent-sport/8 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-sport">Bonus consistance</p>
                  <p className="text-[20px] font-extrabold text-text-primary mt-1 tabular-nums">+{bonusFmt}%</p>
                  <p className="text-[12px] text-text-muted mt-1 leading-snug">
                    {streakCount > 0
                      ? `Tu es à ${streakCount} semaine${streakCount > 1 ? "s" : ""} de streak — chaque semaine validée augmente ta part du pool partagé.`
                      : `Démarre une streak cette semaine et ton bonus se met à grimper. Plus tu es régulier, plus ta part du pool grossit.`}
                  </p>
                </div>
              </div>
              <p className="text-[12px] text-text-muted leading-relaxed">
                Le pool n'est jamais magique : c'est juste une redistribution. Les utilisateurs inactifs touchent le baseline ; tu récupères leur surplus en restant actif.
              </p>
            </div>

            {/* ── Screen 2 — Et mon argent, il est où ? ── */}
            <div className="min-w-full snap-start px-6 py-6 flex flex-col gap-4">
              <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
                Et ton argent, il est où ?
              </h2>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Tes USDC ne dorment pas sur nos serveurs. Quand tu déposes, on les met dans un <span className="text-text-primary font-semibold">coffre Morpho</span> — un protocole de prêt sur Ethereum.
              </p>
              <div className="rounded-2xl border border-oria bg-oria-section p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Morpho</p>
                <p className="text-[16px] font-bold text-text-primary mt-1">~7,4 Mds$ confiés</p>
                <p className="text-[12px] text-text-muted mt-1.5 leading-snug">
                  Des emprunteurs déposent du collatéral pour emprunter des USDC. Ils paient des intérêts. Ces intérêts, Morpho les reverse aux prêteurs — toi, en l'occurrence.
                </p>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Le wallet qui détient les coffres, c'est <span className="text-text-primary font-semibold">le tien</span> — créé par Privy sans seed phrase. Oria n'a jamais la signature.
              </p>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Tu peux <span className="text-text-primary font-semibold">retirer quand tu veux</span>. Pas de période de blocage, pas d'autorisation à demander.
              </p>
            </div>

            {/* ── Screen 3 — C'est risqué ? ── */}
            <div className="min-w-full snap-start px-6 py-6 flex flex-col gap-4">
              <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
                C'est risqué ?
              </h2>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Honnêtement : oui, comme tout placement. On nomme les trois risques sans les enrober :
              </p>
              <div className="flex flex-col gap-2">
                <RiskRow
                  label="Smart contract"
                  body="Morpho est un code, et un code peut avoir un bug. Les vaults sont audités par Spearbit, Trail of Bits et OpenZeppelin, mais le risque zéro n'existe pas."
                />
                <RiskRow
                  label="USDC peg"
                  body="USDC est adossé au dollar par Circle. En 2023 le peg a brièvement bougé. Probabilité faible, mais réelle."
                />
                <RiskRow
                  label="APY variable"
                  body="Si la demande d'emprunteurs sur Morpho baisse, ton rendement baisse aussi. C'est jamais figé."
                />
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed pt-1 border-t border-oria">
                Ce qu'Oria ne fait pas : on ne touche pas à ton argent, on ne prend pas de levier, on ne te promet pas un rendement fixe. Tu gardes les clés, tu retires quand tu veux, et tu peux suivre ta position sur Morpho en direct.
              </p>
              <div className="mt-auto pt-2 flex flex-col gap-2">
                <Link
                  href="/profile/learn/security"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1 text-[12px] font-semibold text-accent-purple-bright"
                >
                  Voir la FAQ sécurité complète →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="shrink-0 px-5 pt-2 pb-5 flex items-center justify-between">
          <button
            onClick={() => goTo(Math.max(0, page - 1))}
            disabled={page === 0}
            aria-label="Précédent"
            className="w-9 h-9 rounded-full bg-oria-chip border border-oria flex items-center justify-center disabled:opacity-30"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Aller à l'écran ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === page ? "w-6 bg-accent-purple-bright" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
          {page < 2 ? (
            <button
              onClick={() => goTo(Math.min(2, page + 1))}
              aria-label="Suivant"
              className="w-9 h-9 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-[12px] font-bold text-white px-3.5 py-2 rounded-full gradient-brand shadow-button"
            >
              Compris
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function RiskRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-2xl bg-oria-section border border-oria p-3.5">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-accent-purple/15 border border-accent-purple/25 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-text-primary">{label}</p>
          <p className="text-[12px] text-text-muted mt-0.5 leading-snug">{body}</p>
        </div>
      </div>
    </div>
  );
}
