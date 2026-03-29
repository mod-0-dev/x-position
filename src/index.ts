#!/usr/bin/env bun
<<<<<<< HEAD
<<<<<<< HEAD
console.log("envdiff v0.1.0 — coming soon");
=======
=======
<<<<<<< HEAD
console.log("envdiff v0.1.0 — coming soon");
=======
=======
>>>>>>> 665a1f4 (feat: wire up CLI (args, --keys-only, --help, error handling))
>>>>>>> d7a798f (feat: wire up CLI (args, --keys-only, --help, error handling))
import { readFileSync } from "fs";
import { parseEnv } from "./parser.ts";
import { diffEnv } from "./differ.ts";
import { red, green, yellow, gray, bold } from "./output.ts";

const args = process.argv.slice(2);
const keysOnly = args.includes("--keys-only");
const files = args.filter((a) => !a.startsWith("-"));

if (files.length < 2 || args.includes("--help") || args.includes("-h")) {
  console.log(`
${bold("envdiff")} — diff two .env files

${bold("Usage:")}
  envdiff <file-a> <file-b> [options]

${bold("Options:")}
  ${bold("--keys-only")}   Show key names only, hide values
  ${bold("--help")}, -h    Show this help
  `);
  process.exit(files.length < 2 ? 1 : 0);
}

const [fileA, fileB] = files;

let contentA: string, contentB: string;
try {
  contentA = readFileSync(fileA, "utf-8");
  contentB = readFileSync(fileB, "utf-8");
} catch (e: any) {
  console.error(red(`Error: ${e.message}`));
  process.exit(1);
}

const diff = diffEnv(parseEnv(contentA), parseEnv(contentB));
const { added, removed, changed } = diff;

console.log(`\n${bold(fileA)} → ${bold(fileB)}\n`);

for (const [key, val] of removed) {
  console.log(red(`  - ${key}${keysOnly ? "" : `=${val}`}`));
}
for (const [key, val] of added) {
  console.log(green(`  + ${key}${keysOnly ? "" : `=${val}`}`));
}
for (const [key, { from, to }] of changed) {
  const detail = keysOnly ? "" : gray(` (${from} → ${to})`);
  console.log(yellow(`  ~ ${key}`) + detail);
}

const total = removed.size + added.size + changed.size;
console.log();
if (total === 0) {
  console.log(gray("  No differences."));
} else {
  const parts = [
    removed.size ? red(`${removed.size} removed`) : "",
    added.size   ? green(`${added.size} added`)   : "",
    changed.size ? yellow(`${changed.size} changed`) : "",
  ].filter(Boolean).join(gray("  ·  "));
  console.log("  " + parts);
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 521bbec (feat: colorized ANSI output with summary footer)
<<<<<<< HEAD
>>>>>>> 665a1f4 (feat: wire up CLI (args, --keys-only, --help, error handling))
=======
>>>>>>> d7a798f (feat: wire up CLI (args, --keys-only, --help, error handling))
>>>>>>> 665a1f4 (feat: wire up CLI (args, --keys-only, --help, error handling))
=======
console.log();
>>>>>>> d7e2780 (feat: colorized ANSI output with summary footer)
