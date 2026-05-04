import type { Entry, Mood } from "../model";

export type DayBucket = {
  date: string;            // YYYY-MM-DD
  count: number;
  dominantMood?: Mood;
};

const MOOD_RANK: Record<Mood, number> = {
  great: 5,
  good: 4,
  okay: 3,
  bad: 2,
  rough: 1,
};

export function bucketByDay(entries: Entry[]): Map<string, DayBucket> {
  const buckets = new Map<string, DayBucket>();
  const moodTallies = new Map<string, Map<Mood, number>>();

  for (const e of entries) {
    const day = e.date.slice(0, 10);
    const bucket = buckets.get(day) ?? { date: day, count: 0 };
    bucket.count += 1;
    buckets.set(day, bucket);

    if (e.mood) {
      const tally = moodTallies.get(day) ?? new Map<Mood, number>();
      tally.set(e.mood, (tally.get(e.mood) ?? 0) + 1);
      moodTallies.set(day, tally);
    }
  }

  for (const [day, tally] of moodTallies) {
    const bucket = buckets.get(day);
    if (!bucket) continue;
    let best: Mood | undefined;
    let bestScore = -1;
    for (const [mood, count] of tally) {
      const score = count * 10 + MOOD_RANK[mood];
      if (score > bestScore) {
        bestScore = score;
        best = mood;
      }
    }
    bucket.dominantMood = best;
  }

  return buckets;
}

export function monthRange(year: number, monthIndex: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0));
  return { start, end };
}
