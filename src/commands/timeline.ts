import { JSONStorage } from "../storage";
import { bucketByDay } from "../timeline/bucket";
import { renderMonth } from "../timeline/render";
import { c } from "../utils/format";

type Options = {
  year: number;
  monthIndex: number; // 0-11
};

function parseOptions(args: string[]): Options {
  const now = new Date();
  let year = now.getUTCFullYear();
  let monthIndex = now.getUTCMonth();

  for (let i = 0; i < args.length; i += 1) {
    const flag = args[i];
    const value = args[i + 1];
    if (flag === "--month" && value) {
      const m = Number(value);
      if (!Number.isInteger(m) || m < 1 || m > 12) {
        throw new Error(`--month must be 1-12 (got "${value}")`);
      }
      monthIndex = m - 1;
      i += 1;
    } else if (flag === "--year" && value) {
      const y = Number(value);
      if (!Number.isInteger(y) || y < 1970 || y > 9999) {
        throw new Error(`--year must be a 4-digit year (got "${value}")`);
      }
      year = y;
      i += 1;
    }
  }

  return { year, monthIndex };
}

export async function run(args: string[]): Promise<void> {
  const storage = new JSONStorage();
  const entries = storage.all();

  if (!entries.length) {
    console.log(`${c.gray}No entries yet.${c.reset}`);
    return;
  }

  const { year, monthIndex } = parseOptions(args);
  const buckets = bucketByDay(entries);

  console.log("");
  console.log(renderMonth(year, monthIndex, buckets));
  console.log("");
}
