"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/components/Toast";
import { PrivyProvider } from "@privy-io/react-auth";
import { AuthBridge } from "@/lib/AuthBridge";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const usePrivy = !!PRIVY_APP_ID && !USE_MOCK;

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const inner = (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );

  if (!usePrivy) {
    return inner;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "google", "apple"],
        appearance: { theme: "light" },
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
        externalWallets: {
          disableAllExternalWallets: true,
        },
      }}
    >
      <AuthBridge />
      {inner}
    </PrivyProvider>
  );
}
