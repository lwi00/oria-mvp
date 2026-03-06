"use client";

import Link from "next/link";
import { Avatar } from "./Avatar";
import { useUser } from "@/lib/hooks";
import { getInitials } from "@/lib/utils";

export function Header() {
  const { data: user } = useUser();
  const initials = getInitials(user?.displayName ?? null);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 border-b border-oria bg-[rgba(250,249,255,0.8)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="w-[30px] h-[30px] rounded-sm gradient-brand flex items-center justify-center text-sm">
          🚀
        </div>
        <span className="text-xl font-extrabold text-text-primary tracking-tight">
          Oria
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative cursor-pointer w-[44px] h-[44px] flex items-center justify-center bg-transparent border-none -mr-2">
          <span className="text-xl">🔔</span>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error-500 border-2 border-white" />
        </button>
        <Link href="/profile">
          <Avatar initials={initials} size={32} highlight />
        </Link>
      </div>
    </header>
  );
}
