import { readUrlFile } from "./reader.ts";
import { checkUrl } from "./checker.ts";
import { runConcurrent } from "./parallel.ts";
import { printReport } from "./reporter.ts";

export async function watchUrls(
  filePath: string,
  intervalMs = 30_000,
  timeoutMs = 5_000,
): Promise<void> {
  const run = async () => {
    console.clear();
    console.log(`\x1b[90mhttpcheck watch — every ${intervalMs / 1000}s  Ctrl+C to stop\x1b[0m`);
    const entries = readUrlFile(filePath);
    const results = await runConcurrent(entries, (e) => checkUrl(e, timeoutMs), 10);
    printReport(results);
  };

  await run();
  setInterval(run, intervalMs);
}
