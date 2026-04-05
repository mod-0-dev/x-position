import { JSONStorage } from "../storage";
import { c, MOOD_EMOJI, wordCount } from "../utils/format";
import type { Mood } from "../model";

const MOODS: Mood[] = ["great", "good", "okay", "bad", "rough"];

export async function run(_args: string[]): Promise<void> {
  const storage = new JSONStorage();
  const entries = storage.all();

  if (!entries.length) {
    console.log(`${c.gray}No entries yet.${c.reset}`);
    return;
  }

  const totalWords = entries.reduce((s, e) => s + wordCount(e.body), 0);
  const avgWords = Math.round(totalWords / entries.length);

  // streak
  const streak = calcStreak(entries.map((e) => e.date));

  // mood distribution
  const moodCounts: Record<string, number> = {};
  for (const e of entries) {
    if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] ?? 0) + 1;
  }

  // tag cloud (top 5)
  const tagCounts: Record<string, number> = {};
  for (const e of entries) {
    for (const t of e.tags) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  }
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  console.log(`\n${c.bold}${c.blue}── jot stats ────────────────────────${c.reset}`);
  console.log(`  ${c.bold}Entries:${c.reset}   ${entries.length}`);
  console.log(`  ${c.bold}Words:${c.reset}     ${totalWords} total · ${avgWords} avg per entry`);
  console.log(`  ${c.bold}Streak:${c.reset}    ${streak} day${streak !== 1 ? "s" : ""} 🔥`);

  if (topTags.length) {
    const tagStr = topTags.map(([t, n]) => `${c.cyan}#${t}${c.reset} (${n})`).join("  ");
    console.log(`  ${c.bold}Top tags:${c.reset}  ${tagStr}`);
  }

  if (Object.keys(moodCounts).length) {
    console.log(`\n  ${c.bold}Mood chart${c.reset}`);
    for (const mood of MOODS) {
      const count = moodCounts[mood] ?? 0;
      if (!count) continue;
      const bar = "█".repeat(count);
      console.log(`  ${MOOD_EMOJI[mood]} ${mood.padEnd(6)} ${c.dim}${bar}${c.reset} ${count}`);
    }
  }

  console.log(`${c.blue}─────────────────────────────────────${c.reset}\n`);
}

function calcStreak(dates: string[]): number {
  const days = [...new Set(dates.map((d) => d.slice(0, 10)))].sort().reverse();
  if (!days.length) return 0;

  const today = new Date().toISOString().slice(0, 10);
  if (days[0] !== today) {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    if (days[0] !== yesterday) return 0;
  }

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86_400_000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
