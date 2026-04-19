"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/Card";
import { QuickAction } from "@/components/QuickAction";
import { CardSkeleton, ErrorCard } from "@/components/Skeleton";
import { useEarnings, useWalletBalance, useDeposits } from "@/lib/hooks";
import { AVAX_PRICE_USD } from "@/lib/mock-data";
import { useOnChainDeposit } from "@/lib/useOnChainDeposit";
import { useToast } from "@/components/Toast";
import { timeAgo } from "@/lib/utils";

interface Deposit {
  id: string;
  amount: number;
  token: string;
  status: string;
  createdAt: string;
}

function groupByDate(deposits: Deposit[]) {
  const now = Date.now();
  const day = 86400_000;
  const groups: Record<string, Deposit[]> = { Today: [], "This week": [], Earlier: [] };
  for (const d of deposits) {
    const age = now - new Date(d.createdAt).getTime();
    if (age < day) groups["Today"].push(d);
    else if (age < 7 * day) groups["This week"].push(d);
    else groups["Earlier"].push(d);
  }
  return groups;
}

export default function WalletPage() {
  const { data: earnings, isLoading, isError, refetch } = useEarnings();
  const { data: wallet } = useWalletBalance();
  const { data: deposits } = useDeposits();
  const onChainDeposit = useOnChainDeposit();
  const { toast } = useToast();

  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositToken, setDepositToken] = useState("USDC");
  const [copied, setCopied] = useState(false);

  const grouped = useMemo(() => groupByDate(deposits ?? []), [deposits]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="pt-1 pb-2">
          <div className="h-7 w-24 skeleton-shimmer rounded" />
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <div className="pt-1 pb-2">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Wallet</h1>
        </div>
        <ErrorCard onRetry={refetch} />
      </div>
    );
  }

  const totalBalance = (earnings?.totalDeposited ?? 0) + (earnings?.totalEarned ?? 0);
  const earned = earnings?.totalEarned ?? 0;
  const deposited = earnings?.totalDeposited ?? 0;
  const apy = earnings?.currentApy ?? 4.0;

  const [intPart, decPart] = totalBalance.toFixed(2).split(".");
  const intWithCommas = Number(intPart).toLocaleString();

  return (
    <div className="flex flex-col gap-5">
      {/* Balance Hero — glassmorphism */}
      <section
        className="pt-5 pb-5 text-center rounded-2xl border border-white/[0.06] relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(139,92,246,0.10) 0%, rgba(255,255,255,0.03) 50%, rgba(245,158,11,0.06) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <p className="text-[12px] font-semibold uppercase tracking-wider text-text-muted">
          Total balance
        </p>
        <div className="mt-3 flex items-baseline justify-center">
          <span className="text-[18px] text-text-muted font-medium mr-1 mt-2">$</span>
          <span className="text-[52px] font-extrabold text-text-primary leading-none tracking-tight tabular-nums">
            {intWithCommas}
          </span>
          <span className="text-[22px] text-text-muted font-bold tabular-nums ml-0.5">
            .{decPart}
          </span>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-100/80 border border-success-500/20 backdrop-blur-sm">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span className="text-[13px] text-success-500 font-semibold tabular-nums">
            +${earned.toFixed(2)} earned · {apy.toFixed(2)}% APY
          </span>
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-4 gap-2">
        <QuickAction
          label="Deposit"
          tint="gold"
          onClick={() => setShowDeposit(true)}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
        />
        <QuickAction
          label="Withdraw"
          tint="neutral"
          disabled
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          }
        />
        <QuickAction
          label="Activity"
          tint="purple"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          }
          onClick={() => {
            const el = document.getElementById("wallet-tx");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
        <QuickAction
          label="Info"
          tint="neutral"
          disabled
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          }
        />
      </section>

      {/* Deposit bottom-sheet — glassmorphism */}
      {showDeposit && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => { if (!onChainDeposit.isPending) { setShowDeposit(false); onChainDeposit.reset(); } }}
        >
          <div
            className="w-full max-w-[420px] max-h-[85vh] overflow-y-auto rounded-t-3xl p-6 sheet-in border-t border-x border-white/[0.08] relative"
            style={{
              background: "linear-gradient(160deg, rgba(139,92,246,0.12) 0%, rgba(15,15,22,0.95) 40%, rgba(15,15,22,0.98) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              paddingBottom: "calc(24px + env(safe-area-inset-bottom, 16px))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass shimmer accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/40 to-transparent" />

            <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-text-primary">Deposit</h3>
              <button
                onClick={() => { setShowDeposit(false); onChainDeposit.reset(); }}
                disabled={onChainDeposit.isPending}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center cursor-pointer disabled:opacity-50 hover:bg-white/[0.1] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA0AC" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Wallet address — tap to copy */}
            {wallet?.walletAddr && (
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(wallet.walletAddr!);
                    setCopied(true);
                    toast("Address copied!");
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    toast("Failed to copy", "error");
                  }
                }}
                className="w-full mb-4 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.07] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-accent-purple/15 border border-accent-purple/25 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Your wallet</p>
                    <p className="text-[13px] font-mono text-text-primary truncate">
                      {wallet.walletAddr}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-accent-purple/15 transition-colors">
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA0AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </div>
              </button>
            )}

            <label className="text-[12px] font-medium text-text-secondary mb-1.5 block">Amount</label>
            <input
              type="number"
              inputMode="numeric"
              step="1"
              min="1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[22px] font-bold text-text-primary placeholder:text-text-muted focus:border-accent-purple outline-none mb-4 tabular-nums"
            />
            <label className="text-[12px] font-medium text-text-secondary mb-1.5 block">Token</label>
            <div className="flex gap-2 mb-5">
              {["USDC", "WAVAX"].map((t) => (
                <button
                  key={t}
                  onClick={() => setDepositToken(t)}
                  className={`flex-1 py-3 rounded-xl text-[13px] font-semibold transition-colors border cursor-pointer ${
                    depositToken === t
                      ? "gradient-brand text-white border-transparent shadow-button"
                      : "bg-white/[0.05] text-text-secondary border-white/[0.08] hover:bg-white/[0.08]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {onChainDeposit.error && (
              <div className="mb-3 p-2.5 rounded-xl bg-error-100 border border-error-500/25">
                <p className="text-xs text-error-500">{onChainDeposit.error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeposit(false); onChainDeposit.reset(); }}
                disabled={onChainDeposit.isPending}
                className="flex-1 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.05] text-text-secondary font-semibold text-sm disabled:opacity-50 cursor-pointer hover:bg-white/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!depositAmount || onChainDeposit.isPending}
                onClick={async () => {
                  try {
                    await onChainDeposit.deposit(parseFloat(depositAmount), depositToken);
                    setShowDeposit(false);
                    setDepositAmount("");
                    onChainDeposit.reset();
                    toast(`Deposited ${depositAmount} ${depositToken}`);
                  } catch {
                    /* shown inline */
                  }
                }}
                className="flex-1 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-button disabled:opacity-50 cursor-pointer"
              >
                {onChainDeposit.buttonText("Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Earning status */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-text-primary tracking-tight">Earning status</p>
            <p className="text-[12px] text-text-muted mt-0.5">via Morpho on Avalanche</p>
          </div>
          <div
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
              deposited > 0
                ? "bg-success-100 text-success-500 border-success-500/25"
                : "bg-oria-chip text-text-muted border-oria"
            }`}
          >
            {deposited > 0 ? "Active" : "Inactive"}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5 mt-5">
          {[
            { label: "Deposited", value: `$${deposited.toLocaleString()}`, color: "text-text-primary" },
            { label: "Earned",    value: `$${earned.toFixed(2)}`,           color: "text-success-500" },
            { label: "APY",       value: `${apy.toFixed(2)}%`,              color: "text-accent-purple-bright" },
          ].map((s) => (
            <div key={s.label} className="text-center py-3 rounded-xl bg-oria-section border border-oria">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{s.label}</p>
              <p className={`text-[17px] font-extrabold ${s.color} mt-1 tabular-nums`}>{s.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Transactions (grouped) */}
      <Card id="wallet-tx" className="!p-0 overflow-hidden">
        <div className="p-5 pb-3">
          <p className="text-sm font-bold text-text-primary tracking-tight">Recent transactions</p>
        </div>
        {deposits && deposits.length > 0 ? (
          <div className="px-5 pb-4">
            {(["Today", "This week", "Earlier"] as const).map((group) =>
              grouped[group].length > 0 ? (
                <div key={group} className="mb-2 last:mb-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted py-2">
                    {group}
                  </p>
                  {grouped[group].map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between py-2.5 border-t border-oria first:border-t-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19 12 12 19 5 12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary">Deposit</p>
                          <p className="text-[11px] text-text-muted">{timeAgo(d.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-text-primary tabular-nums">
                          +{d.amount.toLocaleString()} {d.token}
                        </p>
                        <p className={`text-[11px] font-medium ${d.status === "earning" ? "text-success-500" : "text-warning-500"}`}>
                          {d.status === "earning" ? "Earning" : "Confirmed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null
            )}
          </div>
        ) : (
          <div className="text-center py-10 px-5">
            <div className="w-12 h-12 rounded-2xl bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-primary mb-1">No transactions yet</p>
            <p className="text-[12px] text-text-muted">Make your first deposit to start earning</p>
          </div>
        )}
      </Card>

      {/* On-chain balances */}
      {wallet && (
        <Card>
          <p className="text-sm font-bold text-text-primary mb-3 tracking-tight">On-chain balances</p>
          <div className="flex justify-between py-2.5 border-b border-oria">
            <span className="text-sm text-text-secondary">USDC</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">
              {wallet.balances.USDC.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-sm text-text-secondary">AVAX</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">
              {wallet.balances.AVAX.toFixed(4)}
              <span className="text-text-muted font-medium ml-1">
                (${(wallet.balances.AVAX * AVAX_PRICE_USD).toFixed(2)})
              </span>
            </span>
          </div>
          {wallet.walletAddr && (
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(wallet.walletAddr!);
                  setCopied(true);
                  toast("Address copied!");
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  toast("Failed to copy", "error");
                }
              }}
              className="mt-3 w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.06] transition-colors group"
            >
              <span className="text-[12px] text-text-muted font-mono truncate mr-2">
                {wallet.chain} · {wallet.walletAddr}
              </span>
              <span className="flex-shrink-0">
                {copied ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64697A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-accent-purple-bright transition-colors">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </span>
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
