#!/usr/bin/env bun
<<<<<<< HEAD
console.log("envdiff v0.1.0 — coming soon");
=======
import { readFileSync } from "fs";
import { parseEnv } from "./parser.ts";
import { diffEnv } from "./differ.ts";

const args = process.argv.slice(2);
const keysOnly = args.includes("--keys-only");
const files = args.filter((a) => !a.startsWith("-"));

if (files.length < 2 || args.includes("--help") || args.includes("-h")) {
  console.log(`
envdiff — diff two .env files

Usage:
  envdiff <file-a> <file-b> [options]

Options:
  --keys-only   Show key names only, hide values
  --help, -h    Show this help
  `);
  process.exit(files.length < 2 ? 1 : 0);
}

const [fileA, fileB] = files;

let contentA: string, contentB: string;
try {
  contentA = readFileSync(fileA, "utf-8");
  contentB = readFileSync(fileB, "utf-8");
} catch (e: any) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}

const diff = diffEnv(parseEnv(contentA), parseEnv(contentB));
const { added, removed, changed } = diff;

for (const [key, val] of removed) {
  console.log(`- ${key}${keysOnly ? "" : `=${val}`}`);
}
for (const [key, val] of added) {
  console.log(`+ ${key}${keysOnly ? "" : `=${val}`}`);
}
for (const [key, { from, to }] of changed) {
  console.log(`~ ${key}${keysOnly ? "" : `: ${from} → ${to}`}`);
}

const total = removed.size + added.size + changed.size;
if (total === 0) {
  console.log("No differences.");
} else {
  console.log(`\n${removed.size} removed, ${added.size} added, ${changed.size} changed`);
}
>>>>>>> 665a1f4 (feat: wire up CLI (args, --keys-only, --help, error handling))
