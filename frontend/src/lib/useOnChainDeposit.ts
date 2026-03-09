"use client";

import { useState, useCallback } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useQueryClient } from "@tanstack/react-query";
import { sendErc20Deposit } from "./deposit";
import { apiFetch } from "./api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export type DepositStatus =
  | "idle"
  | "switching-chain"
  | "awaiting-approval"
  | "confirming"
  | "success"
  | "error";

export function useOnChainDeposit() {
  const { wallets } = useWallets();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<DepositStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
  }, []);

  const deposit = useCallback(
    async (amount: number, token: string): Promise<string | null> => {
      setError(null);
      setTxHash(null);

      // Mock mode: skip on-chain tx, use existing mock API
      if (USE_MOCK) {
        setStatus("confirming");
        try {
          await apiFetch("/api/wallet/deposit", {
            method: "POST",
            body: JSON.stringify({ amount, token }),
          });
          setStatus("success");
          queryClient.invalidateQueries({ queryKey: ["wallet"] });
          queryClient.invalidateQueries({ queryKey: ["feed"] });
          return null;
        } catch (err) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Deposit failed");
          throw err;
        }
      }

      // Real on-chain flow
      const wallet = wallets[0];
      if (!wallet) {
        setStatus("error");
        setError("No wallet connected. Please connect your wallet first.");
        throw new Error("No wallet connected");
      }

      try {
        setStatus("switching-chain");

        setStatus("awaiting-approval");
        const hash = await sendErc20Deposit(wallet, token, amount);

        setStatus("confirming");
        setTxHash(hash);

        // Record in backend
        await apiFetch("/api/wallet/deposit", {
          method: "POST",
          body: JSON.stringify({ amount, token, txHash: hash }),
        });

        setStatus("success");
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["onchain-balances"] });
        return hash;
      } catch (err: unknown) {
        setStatus("error");
        // User rejected the transaction
        const code = (err as { code?: number })?.code;
        if (code === 4001) {
          setError("Transaction cancelled");
        } else {
          setError(
            err instanceof Error ? err.message : "Transaction failed",
          );
        }
        throw err;
      }
    },
    [wallets, queryClient],
  );

  const isPending =
    status === "switching-chain" ||
    status === "awaiting-approval" ||
    status === "confirming";

  const buttonText = (defaultText: string) => {
    switch (status) {
      case "switching-chain":
        return "Switching to Avalanche...";
      case "awaiting-approval":
        return "Confirm in wallet...";
      case "confirming":
        return "Confirming...";
      default:
        return defaultText;
    }
  };

  return { deposit, status, txHash, error, isPending, buttonText, reset };
}
