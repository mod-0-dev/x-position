import { JSONStorage } from "../storage";
import { findSimilarPairs } from "../dup/similarity";
import { c, fmtDate, truncate } from "../utils/format";

const DEFAULT_THRESHOLD = 0.4;

export async function run(_args: string[]): Promise<void> {
  const storage = new JSONStorage();
  const entries = storage.all();

  if (entries.length < 2) {
    console.log(`${c.gray}Need at least 2 entries to detect duplicates.${c.reset}`);
    return;
  }

  const pairs = findSimilarPairs(
    entries.map((e) => e.body),
    DEFAULT_THRESHOLD,
  );

  if (!pairs.length) {
    console.log(`${c.gray}No duplicates above ${DEFAULT_THRESHOLD} similarity.${c.reset}`);
    return;
  }

  console.log("");
  for (const p of pairs) {
    const a = entries[p.aIndex];
    const b = entries[p.bIndex];
    if (!a || !b) continue;
    const pct = `${Math.round(p.score * 100)}%`;
    console.log(`  ${c.bold}${pct}${c.reset}  ${c.dim}${fmtDate(a.date)}${c.reset}  ${truncate(a.body, 60)}`);
    console.log(`        ${c.dim}${fmtDate(b.date)}${c.reset}  ${truncate(b.body, 60)}`);
    console.log("");
  }
}
