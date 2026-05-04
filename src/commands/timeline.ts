import { JSONStorage } from "../storage";
import { bucketByDay } from "../timeline/bucket";
import { renderMonth } from "../timeline/render";
import { c } from "../utils/format";

export async function run(_args: string[]): Promise<void> {
  const storage = new JSONStorage();
  const entries = storage.all();

  if (!entries.length) {
    console.log(`${c.gray}No entries yet.${c.reset}`);
    return;
  }

  const buckets = bucketByDay(entries);
  const now = new Date();
  const year = now.getUTCFullYear();
  const monthIndex = now.getUTCMonth();

  console.log("");
  console.log(renderMonth(year, monthIndex, buckets));
  console.log("");
}
