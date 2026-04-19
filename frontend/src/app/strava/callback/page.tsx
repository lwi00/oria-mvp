"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAppAuth } from "@/lib/providers";

function StravaCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ready, authenticated, authVerified } = useAppAuth();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    const code = searchParams.get("code");
    const err = searchParams.get("error");

    if (err || !code) {
      setError(err === "access_denied" ? "Access denied." : "Missing code.");
      setStatus("error");
      return;
    }

    if (!authenticated) {
      setError("Session expired. Please sign in again.");
      setStatus("error");
      return;
    }

    // Wait until the Privy token getter is registered — otherwise apiFetch
    // sends no Authorization header and the backend returns 401.
    if (!authVerified) return;

    apiFetch("/api/strava/exchange", {
      method: "POST",
      body: JSON.stringify({ code }),
    })
      .then(() => router.replace("/profile"))
      .catch((e) => {
        setError(e.message ?? "Connection failed.");
        setStatus("error");
      });
  }, [ready, authenticated, authVerified, searchParams, router]);

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 gap-4">
        <p className="text-error-500 font-semibold text-center">{error}</p>
        <button
          onClick={() => router.replace("/profile")}
          className="text-sm text-purple-600 underline cursor-pointer bg-transparent border-none"
        >
          Back to profile
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      <p className="text-sm text-text-secondary font-medium">Connecting Strava…</p>
    </div>
  );
}

export default function StravaCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-sm text-text-secondary font-medium">Loading…</p>
      </div>
    }>
      <StravaCallbackContent />
    </Suspense>
  );
}
