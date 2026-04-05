export const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

export const MOOD_COLORS: Record<string, string> = {
  great:   c.green,
  good:    c.cyan,
  okay:    c.yellow,
  bad:     c.magenta,
  rough:   c.red,
};

export const MOOD_EMOJI: Record<string, string> = {
  great: "🟢",
  good:  "🔵",
  okay:  "🟡",
  bad:   "🟣",
  rough: "🔴",
};

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function fmtTags(tags: string[]): string {
  if (!tags.length) return "";
  return tags.map((t) => `${c.cyan}#${t}${c.reset}`).join(" ");
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function truncate(text: string, max: number): string {
  const line = text.split("\n")[0];
  return line.length > max ? line.slice(0, max - 1) + "…" : line;
}
