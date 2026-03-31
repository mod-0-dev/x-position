import { readdirSync, statSync } from "fs";
import { join, relative } from "path";
import type { BlameEntry } from "./blame.ts";
import { blameFile } from "./blame.ts";
import { timestampToAgeDays, ageDaysToRgb, colorize, ageLabel, dim } from "./color.ts";

export interface FileAgeSummary {
  filePath: string;
  lineCount: number;
  medianAge: number;    // days
  oldestAge: number;    // days
  newestAge: number;    // days
  oldestEntry: BlameEntry;
}

export interface OldestLine {
  filePath: string;
  entry: BlameEntry;
  ageDays: number;
}

// Extensions to include in directory scan
const CODE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".rb", ".go", ".rs", ".java", ".c", ".cpp", ".h",
  ".swift", ".kt", ".cs", ".php", ".sh", ".bash", ".zsh",
  ".css", ".scss", ".html", ".vue", ".svelte",
  ".json", ".yaml", ".yml", ".toml",
]);

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", "coverage"]);

/** Recursively collect source files from a directory. */
export function collectFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".env") continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (entry.isFile()) {
      const ext = entry.name.includes(".") ? "." + entry.name.split(".").pop()! : "";
      if (CODE_EXTENSIONS.has(ext)) results.push(full);
    }
  }
  return results;
}

function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Run blame on a file and compute age stats. Returns null if blame fails (untracked). */
export function summarizeFile(filePath: string, cwd: string): FileAgeSummary | null {
  let entries: BlameEntry[];
  try {
    entries = blameFile(filePath, cwd);
  } catch {
    return null;
  }
  if (entries.length === 0) return null;

  const ages = entries.map(e => timestampToAgeDays(e.authorTime));
  const oldestIdx = ages.indexOf(Math.max(...ages));

  return {
    filePath,
    lineCount: entries.length,
    medianAge: median(ages),
    oldestAge: Math.max(...ages),
    newestAge: Math.min(...ages),
    oldestEntry: entries[oldestIdx],
  };
}

/** Render a directory age report. */
export function renderDirReport(
  summaries: FileAgeSummary[],
  oldestLines: OldestLine[],
  cwd: string,
  opts: { oldest: number; color: boolean }
): string {
  const out: string[] = [];

  // Sort files by median age descending (oldest first)
  const sorted = [...summaries].sort((a, b) => b.medianAge - a.medianAge);

  out.push(opts.color ? dim("── file age summary ──") : "── file age summary ──");
  out.push("");

  for (const s of sorted) {
    const rel = relative(cwd, s.filePath).replace(/\\/g, "/");
    const medRgb = ageDaysToRgb(s.medianAge);
    const bar = buildAgeBar(s.newestAge, s.medianAge, s.oldestAge, opts.color);

    const label = opts.color
      ? colorize(ageLabel(s.medianAge).padStart(5), medRgb)
      : ageLabel(s.medianAge).padStart(5);

    const path = opts.color ? dim(rel) : rel;
    out.push(`  ${bar}  ${label}  ${path}  (${s.lineCount} lines)`);
  }

  out.push("");
  out.push(opts.color ? dim(`── oldest ${opts.oldest} lines ──`) : `── oldest ${opts.oldest} lines ──`);
  out.push("");

  const topOldest = oldestLines.slice(0, opts.oldest);
  for (const ol of topOldest) {
    const rel = relative(cwd, ol.filePath).replace(/\\/g, "/");
    const rgb = ageDaysToRgb(ol.ageDays);
    const age = opts.color ? colorize(ageLabel(ol.ageDays).padStart(5), rgb) : ageLabel(ol.ageDays).padStart(5);
    const loc = `${rel}:${ol.entry.lineNumber}`;
    const snippet = ol.entry.content.trim().slice(0, 60);
    const locStr = opts.color ? dim(loc) : loc;
    out.push(`  ${age}  ${locStr}  ${snippet}`);
  }

  out.push("");
  return out.join("\n") + "\n";
}

/** Build a small sparkline bar showing newest→median→oldest age gradient. */
function buildAgeBar(newest: number, median: number, oldest: number, color: boolean): string {
  const steps = [newest, (newest + median) / 2, median, (median + oldest) / 2, oldest];
  const blocks = steps.map(d => {
    const rgb = ageDaysToRgb(d);
    return color ? colorize("█", rgb) : "█";
  });
  return blocks.join("");
}
