"use client";

interface DayData {
  date: string; // ISO date
  distanceKm: number;
}

interface Props {
  data: DayData[];
}

function getColor(km: number): string {
  if (km === 0) return "rgba(255,255,255,0.03)";
  if (km < 3) return "rgba(139,92,246,0.2)";
  if (km < 6) return "rgba(139,92,246,0.4)";
  if (km < 10) return "rgba(139,92,246,0.6)";
  return "rgba(139,92,246,0.85)";
}

export function ActivityHeatmap({ data }: Props) {
  // Build 12 weeks of data, Mon=0 to Sun=6
  const today = new Date();
  const dataMap = new Map(data.map(d => [d.date.slice(0, 10), d.distanceKm]));

  // Go back 12 weeks from current week's Monday
  const dayOfWeek = today.getUTCDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const currentMonday = new Date(today);
  currentMonday.setUTCDate(currentMonday.getUTCDate() - daysToMonday);
  currentMonday.setUTCHours(0, 0, 0, 0);

  const startDate = new Date(currentMonday);
  startDate.setUTCDate(startDate.getUTCDate() - 11 * 7); // 12 weeks back

  const weeks: { date: Date; km: number }[][] = [];
  const d = new Date(startDate);

  for (let w = 0; w < 12; w++) {
    const week: { date: Date; km: number }[] = [];
    for (let day = 0; day < 7; day++) {
      const key = d.toISOString().slice(0, 10);
      week.push({ date: new Date(d), km: dataMap.get(key) ?? 0 });
      d.setUTCDate(d.getUTCDate() + 1);
    }
    weeks.push(week);
  }

  const dayLabels = ["M", "", "W", "", "F", "", "S"];

  return (
    <div className="flex gap-1">
      {/* Day labels */}
      <div className="flex flex-col gap-[3px] mr-1 pt-[2px]">
        {dayLabels.map((label, i) => (
          <div key={i} className="h-[14px] flex items-center">
            <span className="text-[9px] text-text-muted leading-none">{label}</span>
          </div>
        ))}
      </div>
      {/* Weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((day, di) => {
            const isFuture = day.date > today;
            return (
              <div
                key={di}
                className="w-[14px] h-[14px] rounded-[3px] transition-colors"
                style={{ background: isFuture ? "transparent" : getColor(day.km) }}
                title={isFuture ? "" : `${day.date.toLocaleDateString()}: ${day.km.toFixed(1)}km`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
