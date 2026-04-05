import { JSONStorage } from "../storage";
import { c, fmtDate, fmtTags, MOOD_EMOJI, MOOD_COLORS, wordCount } from "../utils/format";

export async function run(args: string[]): Promise<void> {
  const id = args[0];
  if (!id) {
    console.error(`${c.red}Usage:${c.reset} jot read <id>`);
    process.exit(1);
  }

  const storage = new JSONStorage();
  const entry = storage.get(id);

  if (!entry) {
    console.error(`${c.red}Not found:${c.reset} ${id}`);
    process.exit(1);
  }

  const moodStr = entry.mood
    ? ` ${MOOD_COLORS[entry.mood]}${MOOD_EMOJI[entry.mood]} ${entry.mood}${c.reset}`
    : "";
  const tags = fmtTags(entry.tags);

  console.log(`${c.bold}${c.blue}── Entry ──────────────────────────────${c.reset}`);
  console.log(`${c.gray}Date:${c.reset}  ${fmtDate(entry.date)}`);
  console.log(`${c.gray}ID:${c.reset}    ${entry.id}${moodStr}`);
  if (tags) console.log(`${c.gray}Tags:${c.reset}  ${tags}`);
  console.log(`${c.gray}Words:${c.reset} ${wordCount(entry.body)}`);
  console.log(`${c.blue}────────────────────────────────────────${c.reset}`);
  console.log(entry.body);
  console.log(`${c.blue}────────────────────────────────────────${c.reset}`);
}
