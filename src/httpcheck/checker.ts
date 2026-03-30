import type { UrlEntry, CheckResult } from "./types.ts";

const DEFAULT_TIMEOUT_MS = 5_000;

export async function checkUrl(
  entry: UrlEntry,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch(entry.url, {
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow",
    });
    return {
      entry,
      status: res.status,
      latencyMs: Date.now() - start,
      ok: res.ok,
    };
  } catch (e: any) {
    return {
      entry,
      status: null,
      latencyMs: Date.now() - start,
      ok: false,
      error: e.name === "TimeoutError" ? `timeout (${timeoutMs}ms)` : e.message,
    };
  }
}
