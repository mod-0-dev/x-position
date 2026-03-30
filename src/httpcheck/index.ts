#!/usr/bin/env bun
import { readUrlFile } from "./reader.ts";
import { checkUrl } from "./checker.ts";
import { runConcurrent } from "./parallel.ts";
import { printReport } from "./reporter.ts";

const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith("-"));
const concurrency = Number(
  args.find((a) => a.startsWith("--concurrency="))?.split("=")[1] ?? 10,
);
const timeout = Number(
  args.find((a) => a.startsWith("--timeout="))?.split("=")[1] ?? 5000,
);

if (files.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`
httpcheck — check HTTP endpoints from a URL list

Usage:
  httpcheck <urls-file> [options]

Options:
  --concurrency=N   Max parallel requests (default: 10)
  --timeout=N       Per-request timeout in ms (default: 5000)
  --help, -h        Show this help
  `);
  process.exit(files.length === 0 ? 1 : 0);
}

const entries = readUrlFile(files[0]!);
if (entries.length === 0) {
  console.error("No URLs found in file.");
  process.exit(1);
}

const results = await runConcurrent(entries, (e) => checkUrl(e, timeout), concurrency);
printReport(results);
process.exit(results.every((r) => r.ok) ? 0 : 1);
