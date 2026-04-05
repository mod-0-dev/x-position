import { JSONStorage } from "../storage";
import { writeFileSync } from "fs";
import { join } from "path";
import { c, fmtDate, MOOD_EMOJI } from "../utils/format";

export async function run(args: string[]): Promise<void> {
  const storage = new JSONStorage();
  const entries = storage.all();

  if (!entries.length) {
    console.log(`${c.gray}Nothing to export.${c.reset}`);
    return;
  }

  const outFile = args[0] ?? join(process.cwd(), "jot-export.md");
  const lines: string[] = [`# jot export\n`, `> ${entries.length} entries\n`];

  for (const e of entries) {
    const moodStr = e.mood ? ` · ${MOOD_EMOJI[e.mood]} ${e.mood}` : "";
    const tagStr = e.tags.length ? ` · ${e.tags.map((t) => `#${t}`).join(" ")}` : "";
    lines.push(`## ${fmtDate(e.date)}${moodStr}${tagStr}`);
    lines.push(`\`${e.id}\`\n`);
    lines.push(e.body);
    lines.push("");
  }

  writeFileSync(outFile, lines.join("\n"), "utf-8");
  console.log(`${c.green}✓${c.reset} Exported ${entries.length} entries → ${outFile}`);
}
