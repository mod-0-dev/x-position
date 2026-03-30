#!/usr/bin/env bun
import { parseArgs } from "util";
import { parseLines } from "./parser.js";
import { filterEntries, projectKeys } from "./filter.js";

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    help: { type: "boolean", short: "h" },
    version: { type: "boolean", short: "v" },
    key: { type: "string", short: "k" },
    value: { type: "string", short: "V" },
    select: { type: "string", short: "s" },
    json: { type: "boolean", short: "j" },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`logfmt — parse and pretty-print logfmt log lines

Usage:
  logfmt [options] [file]
  cat app.log | logfmt [options]

Options:
  -h, --help            Show this help message
  -v, --version         Show version
  -k, --key <key>       Filter: only show lines that have this key
  -V, --value <val>     Filter: only show lines where --key equals val
  -s, --select <keys>   Comma-separated list of keys to include in output
  -j, --json            Output each entry as JSON

Examples:
  logfmt app.log
  logfmt --key level --value error app.log
  logfmt --select time,level,msg app.log
  cat app.log | logfmt --json
`);
  process.exit(0);
}

if (values.version) {
  console.log("0.1.0");
  process.exit(0);
}

async function run() {
  let text: string;

  if (positionals.length > 0) {
    text = await Bun.file(positionals[0]).text();
  } else {
    // read from stdin
    const chunks: Uint8Array[] = [];
    for await (const chunk of Bun.stdin.stream()) {
      chunks.push(chunk);
    }
    text = Buffer.concat(chunks).toString("utf8");
  }

  let entries = parseLines(text);

  // filter
  entries = filterEntries(entries, {
    key: values.key,
    value: values.value,
  });

  // project keys
  const selectKeys = values.select ? values.select.split(",").map((k) => k.trim()) : [];
  entries = projectKeys(entries, selectKeys);

  if (values.json) {
    for (const e of entries) {
      console.log(JSON.stringify(e.fields));
    }
    return;
  }

  // pretty-print
  for (const e of entries) {
    const parts = Object.entries(e.fields).map(([k, v]) => {
      const needsQuotes = v.includes(" ");
      return `${k}=${needsQuotes ? `"${v}"` : v}`;
    });
    console.log(parts.join(" "));
  }
}

run().catch((err) => {
  console.error(`error: ${err.message}`);
  process.exit(1);
});
