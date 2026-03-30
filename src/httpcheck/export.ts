import { writeFileSync } from "fs";
import type { CheckResult } from "./types.ts";

export function exportJson(results: CheckResult[], outPath: string): void {
  const data = results.map((r) => ({
    name: r.entry.name,
    url: r.entry.url,
    status: r.status,
    latencyMs: r.latencyMs,
    ok: r.ok,
    ...(r.error ? { error: r.error } : {}),
  }));
  writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`Exported ${data.length} results → ${outPath}`);
}
