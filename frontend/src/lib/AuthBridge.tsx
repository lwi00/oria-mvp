"use client";

import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { setAuthTokenGetter } from "@/lib/api";

export function AuthBridge() {
  const { getAccessToken, authenticated, logout } = usePrivy();

  useEffect(() => {
    if (authenticated) {
      setAuthTokenGetter(() => getAccessToken());
    }
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("oria:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("oria:unauthorized", handleUnauthorized);
  }, [logout]);

  return null;
}
