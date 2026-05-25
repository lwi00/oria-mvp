"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { useFeed, useChallenges, useUser, useJoinChallenge } from "@/lib/hooks";
import { timeAgo, getInitials, formatFeedEvent, userColor } from "@/lib/utils";
import { useToast } from "@/components/Toast";

/* ──────────────────────────── helpers ──────────────────────────── */

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type Tone = "gold" | "sport" | "purple" | "green";

const TONE: Record<Tone, { border: string; bg: string; banner: string; text: string; chipIcon: string }> = {
  gold: { border: "border-accent-gold/40", bg: "bg-accent-gold/[0.07]", banner: "bg-accent-gold/15", text: "text-accent-gold", chipIcon: "#F59E0B" },
  sport: { border: "border-accent-sport/40", bg: "bg-accent-sport/[0.07]", banner: "bg-accent-sport/15", text: "text-accent-sport", chipIcon: "#FC4C02" },
  purple: { border: "border-accent-purple/40", bg: "bg-accent-purple/[0.07]", banner: "bg-accent-purple/15", text: "text-accent-purple-bright", chipIcon: "#A78BFA" },
  green: { border: "border-success-500/40", bg: "bg-success-500/[0.07]", banner: "bg-success-500/15", text: "text-success-500", chipIcon: "#22C55E" },
};

interface FeedEvent {
  id: string;
  userId: string;
  eventType: string;
  payload: Record<string, unknown>;
  likes: number;
  likedBy: string[];
  createdAt: string;
  user: { id: string; displayName: string | null; avatarUrl: string | null; streakCount: number };
}

type MilestoneKind = "apy_tier" | "record" | "first_week" | "challenge" | null;

function milestoneKind(f: FeedEvent): MilestoneKind {
  const p = f.payload;
  if (f.eventType === "streak_milestone") return "apy_tier";
  if (f.eventType === "challenge_completed") return "challenge";
  if (p.isRecord === true || typeof p.recordKind === "string") return "record";
  if (p.firstStreakWeek === true || (f.eventType === "goal_met" && f.user.streakCount === 1)) return "first_week";
  return null;
}

function num(p: Record<string, unknown>, key: string): number | null {
  const v = p[key];
  return typeof v === "number" ? v : null;
}

/* ──────────────────────────── icons ──────────────────────────── */

function IconFlame({ size = 16, fill = "currentColor" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden>
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14a8 8 0 0016 0C20 9.9 18.02 6.24 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
    </svg>
  );
}
function IconTrophy({ size = 16, stroke = "currentColor" }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  );
}
function IconBolt({ size = 16, fill = "currentColor" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden>
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}
function IconChatDots({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

function milestoneIcon(kind: MilestoneKind, color: string) {
  switch (kind) {
    case "apy_tier": return <IconTrophy size={26} stroke={color} />;
    case "record": return <IconBolt size={26} fill={color} />;
    case "first_week": return <IconFlame size={26} fill={color} />;
    case "challenge": return <IconTrophy size={26} stroke={color} />;
    default: return <IconFlame size={26} fill={color} />;
  }
}

/* ──────────────────── reactions + comments zone ──────────────────── */

const COMMENT_POOL = [
  { author: "Sarah Chen", text: "Let's gooo 🔥" },
  { author: "Marcus Lee", text: "Beast mode. Respect." },
  { author: "Priya Patel", text: "So inspiring 👏" },
  { author: "James Wilson", text: "Catching you next week 😤" },
  { author: "Lea Martin", text: "Consistency king 👑" },
];

interface Comment { id: string; author: string; authorId: string; text: string; mine: boolean; }

function InteractionZone({ event, myId }: { event: FeedEvent; myId: string }) {
  const seed = hashStr(event.id);

  const [counts, setCounts] = useState<{ flame: number; trophy: number; bolt: number }>({
    flame: event.likes,
    trophy: seed % 5,
    bolt: (seed >> 3) % 4,
  });
  const [mine, setMine] = useState<{ flame: boolean; trophy: boolean; bolt: boolean }>({
    flame: !!myId && event.likedBy.includes(myId),
    trophy: false,
    bolt: false,
  });

  const seededComments = useMemo<Comment[]>(() => {
    const n = seed % 3; // 0, 1 or 2 existing comments
    const out: Comment[] = [];
    for (let i = 0; i < n; i++) {
      const c = COMMENT_POOL[(seed >> (i * 2)) % COMMENT_POOL.length];
      out.push({ id: `${event.id}-c${i}`, author: c.author, authorId: `seed-${c.author}`, text: c.text, mine: false });
    }
    return out;
  }, [event.id, seed]);

  const [comments, setComments] = useState<Comment[]>(seededComments);
  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = (key: "flame" | "trophy" | "bolt") => {
    const on = mine[key];
    setMine((m) => ({ ...m, [key]: !on }));
    setCounts((c) => ({ ...c, [key]: Math.max(0, c[key] + (on ? -1 : 1)) }));
  };

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((cs) => [...cs, { id: `${event.id}-me-${cs.length}`, author: "You", authorId: myId || "me", text, mine: true }]);
    setDraft("");
  };

  const openInput = () => {
    setShowInput(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const reactions: { key: "flame" | "trophy" | "bolt"; node: React.ReactNode; activeClass: string }[] = [
    { key: "flame", node: <IconFlame size={14} />, activeClass: "bg-accent-sport/15 border-accent-sport/40 text-accent-sport" },
    { key: "trophy", node: <IconTrophy size={14} stroke="currentColor" />, activeClass: "bg-accent-gold/15 border-accent-gold/40 text-accent-gold" },
    { key: "bolt", node: <IconBolt size={14} />, activeClass: "bg-accent-purple/15 border-accent-purple/40 text-accent-purple-bright" },
  ];

  return (
    <div className="mt-3 pt-3 border-t border-oria">
      {/* Existing + new comments thread */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-2.5">
          {comments.map((c) => {
            const col = userColor(c.authorId);
            return (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar initials={getInitials(c.author)} size={22} colorSeed={c.authorId} highlight={c.mine} />
                <div className="rounded-2xl rounded-tl-sm bg-oria-chip px-2.5 py-1.5 max-w-full">
                  <span className="text-[11px] font-bold" style={{ color: c.mine ? "#C4B5FD" : col.text }}>{c.author}</span>
                  <span className="text-[12px] text-text-secondary ml-1.5 break-words">{c.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reactions row + comment trigger */}
      <div className="flex items-center gap-2">
        {reactions.map((r) => {
          const active = mine[r.key];
          return (
            <button
              key={r.key}
              onClick={() => toggle(r.key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold tabular-nums transition-colors cursor-pointer active:scale-95 ${
                active ? r.activeClass : "bg-oria-chip border-oria text-text-secondary hover:text-text-primary"
              }`}
              aria-pressed={active}
              aria-label={r.key}
            >
              {r.node}
              {counts[r.key] > 0 && <span>{counts[r.key]}</span>}
            </button>
          );
        })}
        <button
          onClick={openInput}
          className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-oria bg-oria-chip text-text-secondary text-[11px] font-semibold tabular-nums hover:text-text-primary transition-colors cursor-pointer active:scale-95"
          aria-label="Comment"
        >
          <IconChatDots size={14} />
          {comments.length > 0 && <span>{comments.length}</span>}
        </button>
      </div>

      {/* Comment input */}
      {showInput && (
        <div className="flex items-center gap-2 mt-2.5">
          <Avatar initials={getInitials("You")} size={22} highlight />
          <div className="flex-1 flex items-center gap-1.5 rounded-full bg-oria-section border border-oria pl-3 pr-1 py-1 focus-within:border-accent-purple transition-colors">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none min-w-0"
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              aria-label="Send"
              className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer active:scale-95"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── stat chips ──────────────────────── */

function StatChip({ icon, value, unit }: { icon: React.ReactNode; value: string; unit: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-oria-chip border border-oria">
      <span className="text-text-muted">{icon}</span>
      <span className="text-[13px] font-extrabold text-text-primary tabular-nums leading-none">{value}</span>
      <span className="text-[11px] text-text-muted">{unit}</span>
    </div>
  );
}

function statChips(f: FeedEvent) {
  const p = f.payload;
  const chips: React.ReactNode[] = [];
  const dist = num(p, "distanceKm");
  if (dist != null) chips.push(<StatChip key="d" icon={<IconBolt size={12} />} value={dist.toFixed(dist % 1 === 0 ? 0 : 1)} unit="km" />);
  const durMin = num(p, "durationMin") ?? (num(p, "movingTimeSec") != null ? Math.round((num(p, "movingTimeSec") as number) / 60) : null);
  if (durMin != null) chips.push(<StatChip key="t" icon={<IconChatDots size={12} />} value={String(durMin)} unit="min" />);
  if (f.user.streakCount > 0) chips.push(<StatChip key="s" icon={<IconFlame size={12} />} value={String(f.user.streakCount)} unit="wk streak" />);
  return chips;
}

/* ──────────────────────── milestone card ──────────────────────── */

function MilestoneCard({ f, kind, myId }: { f: FeedEvent; kind: MilestoneKind; myId: string }) {
  const tone: Tone = kind === "apy_tier" ? "gold" : kind === "record" ? "sport" : "purple";
  const t = TONE[tone];
  const isMine = f.userId === myId;
  const name = isMine ? "You" : f.user.displayName ?? "User";

  const title =
    kind === "apy_tier" ? "APY tier up" :
    kind === "record" ? "New personal record" :
    kind === "challenge" ? "Challenge completed" :
    "First streak week";

  const p = f.payload;
  const subtitle =
    kind === "apy_tier" ? `${f.user.streakCount}-week streak — bigger slice of the pool` :
    kind === "record" ? (() => {
      const rk = typeof p.recordKind === "string" ? p.recordKind : "distance";
      const d = num(p, "distanceKm");
      if (rk === "duration" && num(p, "durationMin") != null) return `${num(p, "durationMin")} min — your longest session yet`;
      if (rk === "speed" && num(p, "paceMinKm") != null) return `${num(p, "paceMinKm")} /km — your fastest pace yet`;
      return d != null ? `${d} km — your longest run yet` : "A new best — keep it rolling";
    })() :
    kind === "challenge" ? `"${typeof p.title === "string" ? p.title : "Challenge"}" — done and dusted` :
    "First week locked in — the streak begins";

  const chips = statChips(f);

  return (
    <div className={`rounded-2xl border-[1.5px] ${t.border} ${t.bg} p-3.5`}>
      {/* internal banner */}
      <div className={`rounded-xl ${t.banner} px-3.5 py-3 flex items-center gap-3`}>
        <div className="w-11 h-11 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
          {milestoneIcon(kind, t.chipIcon)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className={`text-[15px] font-extrabold ${t.text} leading-tight`}>{title}</p>
          </div>
          <p className="text-[12px] text-text-secondary leading-snug mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* who + when */}
      <div className="flex items-center gap-2.5 mt-3">
        <Avatar initials={getInitials(f.user.displayName)} size={28} src={f.user.avatarUrl} colorSeed={f.userId} highlight={isMine} />
        <p className="text-[12px] text-text-secondary flex-1 min-w-0 truncate">
          {isMine ? (
            <span className="font-bold text-text-primary">You</span>
          ) : (
            <Link href={`/friend/${f.userId}`} className="font-bold text-text-primary hover:text-accent-purple-bright transition-colors">{name}</Link>
          )}
        </p>
        <span className="text-[11px] text-text-muted shrink-0">{timeAgo(f.createdAt)}</span>
      </div>

      {/* stat chips */}
      {chips.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{chips}</div>}

      <InteractionZone event={f} myId={myId} />
    </div>
  );
}

/* ──────────────────────── standard card ──────────────────────── */

function FlameSeries({ streak }: { streak: number }) {
  const total = 8;
  const lit = Math.min(streak, total);
  return (
    <div className="flex items-center gap-1.5 mt-2.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={i < lit ? "text-accent-sport" : "text-text-muted opacity-25"}>
            <IconFlame size={13} />
          </span>
        ))}
      </div>
      <span className="text-[11px] text-text-muted tabular-nums ml-1">
        {streak > total ? `${streak} wk streak` : `${lit}/${total} wks`}
      </span>
    </div>
  );
}

function ChallengeBlock({ userId, myId }: { userId: string; myId: string }) {
  const { data: challenges } = useChallenges();
  const joinChallenge = useJoinChallenge();
  const { toast } = useToast();
  const [joined, setJoined] = useState(false);

  const match = useMemo(() => {
    if (!challenges) return null;
    return challenges.find((c) => c.status === "active" && c.members.some((m) => m.userId === userId)) ?? null;
  }, [challenges, userId]);

  if (!match) return null;
  const mine = match.members.find((m) => m.userId === userId);
  const iAmMember = match.members.some((m) => m.userId === myId);
  const full = match.maxMembers != null && match._count.members >= match.maxMembers;
  const weeksMet = mine?.weeksMet ?? 0;
  const weeksTotal = Math.max(1, mine?.weeksTotal ?? 1);
  const pct = Math.min(100, Math.round((weeksMet / weeksTotal) * 100));

  const join = () => {
    setJoined(true);
    joinChallenge.mutate(match.id, {
      onSuccess: () => toast(`Joined "${match.title}"`),
      onError: () => { setJoined(false); toast("Couldn't join", "error"); },
    });
  };

  return (
    <div className="mt-3 rounded-xl border border-accent-purple/25 bg-accent-purple/[0.06] p-3">
      <div className="flex items-center gap-2 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M18 2H6v7a6 6 0 0012 0V2z" />
        </svg>
        <p className="text-[12px] font-bold text-text-primary truncate flex-1">{match.title}</p>
        <span className="text-[11px] font-semibold text-text-muted tabular-nums shrink-0">{weeksMet}/{weeksTotal} wks</span>
      </div>
      <div className="h-1.5 rounded-full bg-oria-chip overflow-hidden mb-2.5">
        <div className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-purple-bright" style={{ width: `${pct}%` }} />
      </div>
      {iAmMember || joined ? (
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-success-500 py-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          You&apos;re in this challenge
        </div>
      ) : (
        <button
          onClick={join}
          disabled={full}
          className="w-full py-2 rounded-lg gradient-brand text-white text-[12px] font-bold shadow-button active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
        >
          {full ? "Challenge full" : "Rejoindre"}
        </button>
      )}
    </div>
  );
}

function StandardCard({ f, myId }: { f: FeedEvent; myId: string }) {
  const isMine = f.userId === myId;
  const { text } = formatFeedEvent(f.eventType, f.payload);
  const streak = f.user.streakCount ?? 0;

  return (
    <div className="rounded-2xl border border-oria bg-oria-section p-3.5">
      {/* header */}
      <div className="flex items-center gap-2.5">
        <Avatar initials={getInitials(f.user.displayName)} size={36} src={f.user.avatarUrl} colorSeed={f.userId} highlight={isMine} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {isMine ? (
              <span className="text-[13px] font-bold text-text-primary truncate">You</span>
            ) : (
              <Link href={`/friend/${f.userId}`} className="text-[13px] font-bold text-text-primary truncate hover:text-accent-purple-bright transition-colors">{f.user.displayName ?? "User"}</Link>
            )}
            {streak > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-accent-gold bg-accent-gold/15 border border-accent-gold/25 px-1.5 py-0.5 rounded-full tabular-nums shrink-0">
                <IconFlame size={9} />{streak}
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-muted">Running · {timeAgo(f.createdAt)}</p>
        </div>
      </div>

      {/* one-line body */}
      <p className="text-[13px] text-text-secondary leading-snug mt-2.5">
        <span className="font-semibold text-text-primary">{isMine ? "You" : f.user.displayName ?? "User"}</span> {text}
      </p>

      {/* streak flame series */}
      {streak > 0 && <FlameSeries streak={streak} />}

      {/* embedded challenge (friends only) */}
      {!isMine && <ChallengeBlock userId={f.userId} myId={myId} />}

      <InteractionZone event={f} myId={myId} />
    </div>
  );
}

/* ──────────────────────── time grouping ──────────────────────── */

function bucketOf(dateStr: string): "today" | "week" | "earlier" {
  const d = new Date(dateStr).getTime();
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (d >= startToday) return "today";
  if (d >= now.getTime() - 7 * 86400_000) return "week";
  return "earlier";
}

const BUCKET_LABEL: Record<string, string> = { today: "Today", week: "This week", earlier: "Earlier" };

/* ──────────────────────── main feed ──────────────────────── */

export function ActivityFeed() {
  const { data: feed } = useFeed(15);
  const { data: user } = useUser();
  const myId = user?.id ?? "";

  const events = (feed ?? []).slice(0, 12) as FeedEvent[];

  return (
    <Card className="!p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm font-bold text-text-primary tracking-tight">Activity feed</p>
          <p className="text-[11px] text-text-muted mt-0.5">React, comment, keep the energy alive</p>
        </div>
        <Link href="/social" className="text-[12px] text-accent-purple-bright font-semibold hover:text-accent-purple">
          Friends →
        </Link>
      </div>

      {events.length > 0 ? (
        <div className="flex flex-col gap-3">
          {events.map((f, i) => {
            const bucket = bucketOf(f.createdAt);
            const prevBucket = i > 0 ? bucketOf(events[i - 1].createdAt) : null;
            const kind = milestoneKind(f);
            return (
              <div key={f.id} className="flex flex-col gap-3">
                {bucket !== prevBucket && (
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted text-center mt-1">
                    {BUCKET_LABEL[bucket]}
                  </p>
                )}
                {kind ? <MilestoneCard f={f} kind={kind} myId={myId} /> : <StandardCard f={f} myId={myId} />}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 px-4">
          <div className="w-12 h-12 rounded-full bg-oria-chip border border-oria flex items-center justify-center mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA0AC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 11l-3 3-3-3M19 14V4" />
            </svg>
          </div>
          <p className="text-[13px] text-text-secondary text-center">Nothing in the feed yet.</p>
          <Link href="/social" className="text-[11px] text-accent-purple-bright font-semibold mt-1">
            Invite friends →
          </Link>
        </div>
      )}
    </Card>
  );
}
