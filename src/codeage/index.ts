#!/usr/bin/env bun
import { parseArgs } from "util";
import { statSync } from "fs";
import { resolve } from "path";
import { blameFile } from "./blame.ts";
import { renderFile } from "./render.ts";
import { collectFiles, summarizeFile, renderDirReport } from "./dir.ts";
import type { OldestLine } from "./dir.ts";
import { timestampToAgeDays } from "./color.ts";

const VERSION = "0.1.0";

const HELP = `\
codeage v${VERSION}
Color-code every line of a source file by how recently it was last changed.
Fresh lines are green; ancient lines are red.

Usage:
  codeage <file>              Show file with age-colored lines
  codeage <directory>         Show per-file age summary for all files
  codeage <file> --blame      Also show commit date for each line

Options:
  --blame          Show commit date alongside each line
  --oldest <n>     (directory mode) List the N oldest lines across all files [default: 10]
  --no-color       Disable ANSI output
  --version        Print version
  --help           Print this help

Examples:
  codeage src/app.ts
  codeage src/ --oldest 20
  codeage src/auth.ts --blame
`;

export interface CliOptions {
  target: string;
  blame: boolean;
  oldest: number;
  color: boolean;
}

export function parseCliArgs(argv: string[]): CliOptions {
  const { values, positionals } = parseArgs({
    args: argv,
    options: {
      blame: { type: "boolean", default: false },
      oldest: { type: "string", default: "10" },
      "no-color": { type: "boolean", default: false },
      version: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  if (values.version) {
    console.log(`codeage v${VERSION}`);
    process.exit(0);
  }

  if (values.help) {
    process.stdout.write(HELP);
    process.exit(0);
  }

  if (positionals.length === 0) {
    process.stderr.write("error: no file or directory specified\n\n" + HELP);
    process.exit(1);
  }

  const oldest = parseInt(values.oldest ?? "10", 10);
  if (isNaN(oldest) || oldest < 1) {
    process.stderr.write("error: --oldest must be a positive integer\n");
    process.exit(1);
  }

  return {
    target: positionals[0],
    blame: values.blame ?? false,
    oldest,
    color: !(values["no-color"] ?? false),
  };
}

// --- main ---
const opts = parseCliArgs(process.argv.slice(2));
const target = resolve(opts.target);

let stat: ReturnType<typeof statSync>;
try {
  stat = statSync(target);
} catch {
  process.stderr.write(`error: cannot access "${opts.target}"\n`);
  process.exit(1);
}

if (stat.isDirectory()) {
  const cwd = process.cwd();
  const files = collectFiles(target);

  if (files.length === 0) {
    process.stderr.write(`no source files found in "${opts.target}"\n`);
    process.exit(1);
  }

  const summaries = files.flatMap(f => {
    const s = summarizeFile(f, cwd);
    return s ? [s] : [];
  });

  if (summaries.length === 0) {
    process.stderr.write("no tracked files found (are these committed?)\n");
    process.exit(1);
  }

  // Collect all lines across all files, sorted by age descending
  const allOldest: OldestLine[] = summaries.map(s => ({
    filePath: s.filePath,
    entry: s.oldestEntry,
    ageDays: s.oldestAge,
  })).sort((a, b) => b.ageDays - a.ageDays);

  process.stdout.write(renderDirReport(summaries, allOldest, cwd, {
    oldest: opts.oldest,
    color: opts.color,
  }));
} else {
  try {
    const entries = blameFile(target);
    process.stdout.write(renderFile(entries, { blame: opts.blame, color: opts.color }));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`error: ${msg}\n`);
    process.exit(1);
  }
}
