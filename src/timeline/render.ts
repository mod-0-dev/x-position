import type { DayBucket } from "./bucket";
import { c, MOOD_EMOJI } from "../utils/format";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_HEADER = "Mo Tu We Th Fr Sa Su";

export function renderMonth(
  year: number,
  monthIndex: number,
  buckets: Map<string, DayBucket>,
): string {
  const lines: string[] = [];
  const title = `${MONTH_NAMES[monthIndex]} ${year}`;
  const pad = Math.max(0, Math.floor((WEEKDAY_HEADER.length - title.length) / 2));

  lines.push(`${" ".repeat(pad)}${c.bold}${title}${c.reset}`);
  lines.push(`${c.dim}${WEEKDAY_HEADER}${c.reset}`);

  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

  // ISO weekday: 1=Mon..7=Sun
  const startWeekday = ((firstDay.getUTCDay() + 6) % 7) + 1;

  let row = " ".repeat((startWeekday - 1) * 3);
  let col = startWeekday;

  for (let day = 1; day <= lastDay; day += 1) {
    const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const bucket = buckets.get(iso);
    row += renderCell(day, bucket);

    if (col === 7 && day < lastDay) {
      lines.push(row);
      row = "";
      col = 1;
    } else {
      col += 1;
    }
  }
  if (row.trim().length > 0) lines.push(row);

  return lines.join("\n");
}

function renderCell(day: number, bucket: DayBucket | undefined): string {
  const num = String(day).padStart(2, " ");
  if (!bucket) return `${c.gray}${num}${c.reset} `;
  if (bucket.dominantMood) return `${MOOD_EMOJI[bucket.dominantMood]}${num.trimStart()}`.padEnd(3, " ");
  return `${c.bold}${num}${c.reset} `;
}
