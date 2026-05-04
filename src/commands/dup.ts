import { JSONStorage } from "../storage";
import { findSimilarPairs } from "../dup/similarity";
import { c, fmtDate, truncate } from "../utils/format";

type Options = {
  threshold: number;
  limit: number;
};

const DEFAULT_THRESHOLD = 0.4;
const DEFAULT_LIMIT = 10;

function parseOptions(args: string[]): Options {
  let threshold = DEFAULT_THRESHOLD;
  let limit = DEFAULT_LIMIT;

  for (let i = 0; i < args.length; i += 1) {
    const flag = args[i];
    const value = args[i + 1];
    if (flag === "--threshold" && value) {
      const t = Number(value);
      if (!Number.isFinite(t) || t < 0 || t > 1) {
        throw new Error(`--threshold must be 0..1 (got "${value}")`);
      }
      threshold = t;
      i += 1;
    } else if (flag === "--limit" && value) {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1) {
        throw new Error(`--limit must be a positive integer (got "${value}")`);
      }
      limit = n;
      i += 1;
    }
  }

  return { threshold, limit };
}

export async function run(args: string[]): Promise<void> {
  const storage = new JSONStorage();
  const entries = storage.all();

  if (entries.length < 2) {
    console.log(`${c.gray}Need at least 2 entries to detect duplicates.${c.reset}`);
    return;
  }

  const { threshold, limit } = parseOptions(args);

  const pairs = findSimilarPairs(
    entries.map((e) => e.body),
    threshold,
  ).slice(0, limit);

  if (!pairs.length) {
    console.log(`${c.gray}No duplicates above ${threshold} similarity.${c.reset}`);
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
