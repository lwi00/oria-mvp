"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { CardSkeleton } from "@/components/Skeleton";
import { useEarnings, useWalletBalance, useDeposits } from "@/lib/hooks";
import { useOnChainDeposit } from "@/lib/useOnChainDeposit";
import { useOnChainBalances } from "@/lib/useOnChainBalance";
import { useToast } from "@/components/Toast";
import { timeAgo } from "@/lib/utils";

export default function WalletPage() {
  const { data: earnings, isLoading: earningsLoading } = useEarnings();
  const { data: wallet } = useWalletBalance();
  const { data: deposits } = useDeposits();
  const onChainDeposit = useOnChainDeposit();
  const { data: onChainBalances } = useOnChainBalances();

  const { toast } = useToast();
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositToken, setDepositToken] = useState("USDC");

  if (earningsLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="pt-[2px] pb-2">
          <div className="h-7 w-24 animate-pulse bg-purple-100/60 rounded" />
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const totalBalance = (earnings?.totalDeposited ?? 0) + (earnings?.totalEarned ?? 0);
  const earned = earnings?.totalEarned ?? 0;
  const deposited = earnings?.totalDeposited ?? 0;
  const apy = earnings?.currentApy ?? 4.0;

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-[2px] pb-2">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Wallet</h1>
      </div>

      {/* Balance Hero */}
      <Card className="gradient-surface !py-7 !px-6 text-center">
        <p className="text-[13px] font-medium text-text-secondary">Total Balance</p>
        <p className="text-[44px] font-extrabold text-text-primary mt-1 tracking-tight tabular-nums leading-none">
          ${Math.floor(totalBalance).toLocaleString()}
          <span className="text-xl text-text-muted">
            .{String(Math.round((totalBalance % 1) * 100)).padStart(2, "0")}
          </span>
        </p>
        <p className="text-sm text-success-500 mt-2 font-semibold tabular-nums">
          +${earned.toFixed(2)} earned from yield
        </p>
        <div className="flex gap-3 justify-center mt-5">
          <button
            onClick={() => setShowDeposit(true)}
            className="text-sm font-semibold py-[11px] px-7 rounded-md border-none gradient-brand text-white cursor-pointer shadow-[0_4px_16px_rgba(124,58,237,0.25)] min-h-[44px]"
          >
            Deposit
          </button>
        </div>
      </Card>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-[340px] shadow-card-hover">
            <h3 className="text-lg font-bold text-text-primary mb-4">Deposit</h3>
            <label className="text-sm text-text-secondary mb-1 block">Amount</label>
            <input
              type="number"
              step="1"
              min="1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="e.g. 500"
              className="w-full px-4 py-3 rounded-md border border-oria bg-white/80 text-[15px] focus:border-purple-600 outline-none mb-3 tabular-nums"
            />
            <label className="text-sm text-text-secondary mb-1 block">Token</label>
            <div className="flex gap-2 mb-4">
              {["USDC", "WAVAX"].map((t) => (
                <button
                  key={t}
                  onClick={() => setDepositToken(t)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    depositToken === t
                      ? "gradient-brand text-white"
                      : "bg-purple-50 text-purple-600 border border-oria"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {onChainDeposit.error && (
              <div className="mb-3 p-2 rounded-md bg-red-50 border border-red-200">
                <p className="text-xs text-red-600">{onChainDeposit.error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeposit(false);
                  onChainDeposit.reset();
                }}
                disabled={onChainDeposit.isPending}
                className="flex-1 py-3 rounded-md border border-oria text-text-secondary font-medium text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={!depositAmount || onChainDeposit.isPending}
                onClick={async () => {
                  try {
                    await onChainDeposit.deposit(
                      parseFloat(depositAmount),
                      depositToken,
                    );
                    setShowDeposit(false);
                    setDepositAmount("");
                    onChainDeposit.reset();
                    toast(`Deposited ${depositAmount} ${depositToken}`);
                  } catch {
                    // Error shown inline via onChainDeposit.error
                  }
                }}
                className="flex-1 py-3 rounded-md gradient-brand text-white font-semibold text-sm shadow-button disabled:opacity-50"
              >
                {onChainDeposit.buttonText("Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Earning Status */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-text-primary tracking-tight">Earning Status</p>
            <p className="text-[13px] text-text-muted mt-0.5">via Morpho lending on Avalanche</p>
          </div>
          <div className="px-4 py-1.5 rounded-xl bg-success-100 text-xs font-semibold text-success-500">
            {deposited > 0 ? "Active" : "Inactive"}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-[18px]">
          {[
            { label: "Deposited", value: `$${deposited.toLocaleString()}`, color: "text-text-primary" },
            { label: "Earned", value: `$${earned.toFixed(2)}`, color: "text-success-500" },
            { label: "APY", value: `${apy.toFixed(2)}%`, color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="text-center py-3 rounded-md bg-oria-section">
              <p className="text-[11px] font-medium text-text-muted">{s.label}</p>
              <p className={`text-[17px] font-extrabold ${s.color} mt-0.5 tabular-nums`}>{s.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Transaction History */}
      <Card>
        <p className="text-sm font-bold text-text-primary mb-3 tracking-tight">Recent Transactions</p>
        {deposits && deposits.length > 0 ? (
          deposits.map((d, i) => (
            <div
              key={d.id}
              className={`flex items-center justify-between py-3 ${i < deposits.length - 1 ? "border-b border-purple-100/50" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm">
                  💰
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Deposit</p>
                  <p className="text-xs text-text-muted">{timeAgo(d.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary tabular-nums">
                  +{d.amount.toLocaleString()} {d.token}
                </p>
                <p className={`text-[11px] font-medium ${d.status === "earning" ? "text-success-500" : "text-warning-500"}`}>
                  {d.status === "earning" ? "Earning" : "Confirmed"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm text-text-muted">No transactions yet. Make your first deposit!</p>
          </div>
        )}
      </Card>

      {/* On-chain Balances */}
      {wallet && (
        <Card>
          <p className="text-sm font-bold text-text-primary mb-3 tracking-tight">On-chain Balances</p>
          <div className="flex justify-between py-2 border-b border-purple-100/50">
            <span className="text-sm text-text-secondary">USDC</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">
              {(onChainBalances?.USDC ?? wallet.balances.USDC).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-text-secondary">AVAX</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">
              {(onChainBalances?.AVAX ?? wallet.balances.AVAX).toFixed(4)}
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-2">
            {wallet.chain} · {wallet.walletAddr ? `${wallet.walletAddr.slice(0, 6)}...${wallet.walletAddr.slice(-4)}` : "No wallet"}
          </p>
        </Card>
      )}
    </div>
  );
}
