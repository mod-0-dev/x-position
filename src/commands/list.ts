import { JSONStorage } from "../storage";
import { c, fmtDate, fmtTags, MOOD_EMOJI, truncate } from "../utils/format";
import type { Entry, Mood } from "../model";

export async function run(args: string[]): Promise<void> {
  const storage = new JSONStorage();
  let entries = storage.all();

  let n = 10;
  let filterTag: string | undefined;
  let filterMood: Mood | undefined;
  let sinceDate: Date | undefined;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if ((a === "--n" || a === "-n") && args[i + 1]) n = parseInt(args[++i]);
    else if ((a === "--tag" || a === "-t") && args[i + 1]) filterTag = args[++i];
    else if ((a === "--mood" || a === "-m") && args[i + 1]) filterMood = args[++i] as Mood;
    else if (a === "--since" && args[i + 1]) sinceDate = new Date(args[++i]);
  }

  if (filterTag) entries = entries.filter((e) => e.tags.includes(filterTag!));
  if (filterMood) entries = entries.filter((e) => e.mood === filterMood);
  if (sinceDate) entries = entries.filter((e) => new Date(e.date) >= sinceDate!);

  const slice = entries.slice(0, n);

  if (!slice.length) {
    console.log(`${c.gray}No entries found.${c.reset}`);
    return;
  }

  for (const e of slice) {
    printRow(e);
  }
  console.log(`\n${c.gray}${slice.length} of ${entries.length} entries${c.reset}`);
}

function printRow(e: Entry): void {
  const moodBit = e.mood ? ` ${MOOD_EMOJI[e.mood]}` : "";
  const tagBit = fmtTags(e.tags);
  const dateBit = `${c.gray}${fmtDate(e.date)}${c.reset}`;
  const idBit = `${c.dim}[${e.id}]${c.reset}`;
  const preview = truncate(e.body, 60);
  console.log(`${dateBit} ${idBit}${moodBit} ${preview} ${tagBit}`);
}
