#!/usr/bin/env bun
import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    help: { type: "boolean", short: "h" },
    version: { type: "boolean", short: "v" },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`logfmt — parse and pretty-print logfmt log lines

Usage:
  logfmt [options] [file]

Options:
  -h, --help     Show this help message
  -v, --version  Show version
`);
  process.exit(0);
}

if (values.version) {
  console.log("0.1.0");
  process.exit(0);
}

console.log("logfmt: no input (pass a file or pipe stdin)");
