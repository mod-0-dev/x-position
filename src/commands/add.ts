import { JSONStorage } from "../storage";
import { generateId, type Mood } from "../model";
import { c, MOOD_EMOJI, fmtDate } from "../utils/format";

export async function run(args: string[]): Promise<void> {
  // Collect text: everything until the first --flag
  const textParts: string[] = [];
  const tags: string[] = [];
  let mood: Mood | undefined;

  let i = 0;
  while (i < args.length) {
    const a = args[i];
    if (a === "--tag" || a === "-t") {
      tags.push(args[++i]);
    } else if (a === "--mood" || a === "-m") {
      const m = args[++i] as Mood;
      const valid: Mood[] = ["great", "good", "okay", "bad", "rough"];
      if (!valid.includes(m)) {
        console.error(`${c.red}Invalid mood.${c.reset} Choose: ${valid.join(", ")}`);
        process.exit(1);
      }
      mood = m;
    } else {
      textParts.push(a);
    }
    i++;
  }

  const body = textParts.join(" ").trim();
  if (!body) {
    console.error(`${c.red}Usage:${c.reset} jot add "your text" [--tag t] [--mood m]`);
    process.exit(1);
  }

  const storage = new JSONStorage();
  const entry = {
    id: generateId(),
    date: new Date().toISOString(),
    body,
    tags,
    mood,
  };
  storage.add(entry);

  const moodStr = mood ? ` ${MOOD_EMOJI[mood]} ${mood}` : "";
  console.log(`${c.green}✓${c.reset} Entry saved [${c.bold}${entry.id}${c.reset}] ${c.gray}${fmtDate(entry.date)}${c.reset}${moodStr}`);
}
