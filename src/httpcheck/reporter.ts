import type { CheckResult } from "./types.ts";

const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GRAY   = "\x1b[90m";
const BOLD   = "\x1b[1m";
const RESET  = "\x1b[0m";

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

export function printReport(results: CheckResult[]): void {
  const nameW = Math.max(...results.map((r) => r.entry.name.length), 4);

  console.log();
  console.log(`  ${BOLD}${pad("NAME", nameW)}  STATUS  LATENCY${RESET}`);
  console.log(`  ${GRAY}${"─".repeat(nameW + 18)}${RESET}`);

  for (const r of results) {
    const statusStr = r.status != null ? String(r.status) : "ERR";
    const color = r.ok ? GREEN : r.status != null ? YELLOW : RED;
    const err = r.error ? `  ${GRAY}${r.error}${RESET}` : "";
    console.log(
      `  ${color}${pad(r.entry.name, nameW)}  ${pad(statusStr, 6)}  ${r.latencyMs}ms${RESET}${err}`,
    );
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log();
  console.log(
    `  ${GREEN}${passed} passed${RESET}  ${failed > 0 ? RED : GRAY}${failed} failed${RESET}`,
  );
  console.log();
}
