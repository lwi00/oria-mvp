"use client";

import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-oria-bg flex flex-col relative shadow-[0_0_60px_rgba(124,58,237,0.06)] border-x border-oria">
      {/* Background blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[420px] h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] -right-[20%] w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.2)_0%,transparent_70%)] blur-[30px]" />
        <div className="absolute bottom-[20%] -left-[15%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(221,214,254,0.2)_0%,transparent_70%)] blur-[30px]" />
      </div>

      <Header />

      {/* Content */}
      <main className="flex-1 px-4 py-3 pb-5 relative z-[1]">
        {children}
      </main>

      <TabBar />
    </div>
  );
}
