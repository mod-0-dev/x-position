import { JSONStorage } from "../storage";
import { c, fmtDate, fmtTags, MOOD_EMOJI, truncate } from "../utils/format";
import type { Entry } from "../model";

export async function run(args: string[]): Promise<void> {
  const query = args.filter((a) => !a.startsWith("-")).join(" ").toLowerCase().trim();
  if (!query) {
    console.error(`${c.red}Usage:${c.reset} jot search <query>`);
    process.exit(1);
  }

  const storage = new JSONStorage();
  const results = storage
    .all()
    .filter(
      (e) =>
        e.body.toLowerCase().includes(query) ||
        e.tags.some((t) => t.toLowerCase().includes(query))
    );

  if (!results.length) {
    console.log(`${c.gray}No entries match "${query}".${c.reset}`);
    return;
  }

  console.log(`${c.bold}Search results for "${query}":${c.reset}\n`);
  for (const e of results) {
    printRow(e, query);
  }
  console.log(`\n${c.gray}${results.length} result(s)${c.reset}`);
}

function printRow(e: Entry, query: string): void {
  const moodBit = e.mood ? ` ${MOOD_EMOJI[e.mood]}` : "";
  const tagBit = fmtTags(e.tags);
  const dateBit = `${c.gray}${fmtDate(e.date)}${c.reset}`;
  const idBit = `${c.dim}[${e.id}]${c.reset}`;
  const preview = highlight(truncate(e.body, 70), query);
  console.log(`${dateBit} ${idBit}${moodBit} ${preview} ${tagBit}`);
}

function highlight(text: string, query: string): string {
  const re = new RegExp(`(${escapeRe(query)})`, "gi");
  return text.replace(re, `${c.yellow}$1${c.reset}`);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
