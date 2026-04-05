import type { BlameEntry } from "./blame.ts";
import { colorizeByAge, dim, ageLabel, timestampToAgeDays, ageDaysToRgb, colorize } from "./color.ts";

export interface RenderOptions {
  blame: boolean;   // show commit date column
  color: boolean;
}

/**
 * Render a list of BlameEntry lines to a string ready for stdout.
 *
 * Normal mode:
 *   4 │ export function foo() {
 *
 * Blame mode:
 *   4 │ 2024-03-15  3mo │ export function foo() {
 */
export function renderFile(entries: BlameEntry[], opts: RenderOptions): string {
  if (entries.length === 0) return "";

  const lineNumWidth = String(entries[entries.length - 1].lineNumber).length;
  const out: string[] = [];

  for (const entry of entries) {
    const lineNum = String(entry.lineNumber).padStart(lineNumWidth);
    const coloredNum = opts.color
      ? colorizeByAge(lineNum, entry.authorTime, opts.color)
      : lineNum;

    if (opts.blame) {
      const date = formatDate(entry.authorTime);
      const days = timestampToAgeDays(entry.authorTime);
      const label = ageLabel(days).padStart(4);
      const rgb = ageDaysToRgb(days);
      const datePart = opts.color
        ? dim(date) + "  " + colorize(label, rgb)
        : date + "  " + label;

      const coloredContent = opts.color
        ? colorizeByAge(entry.content, entry.authorTime, true)
        : entry.content;

      out.push(`${coloredNum} │ ${datePart} │ ${coloredContent}`);
    } else {
      const coloredContent = opts.color
        ? colorizeByAge(entry.content, entry.authorTime, true)
        : entry.content;

      out.push(`${coloredNum} │ ${coloredContent}`);
    }
  }

  return out.join("\n") + "\n";
}

function formatDate(authorTimeSeconds: number): string {
  const d = new Date(authorTimeSeconds * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
