import { readFileSync } from "fs";
import type { UrlEntry } from "./types.ts";

/**
 * Parse a URL list file into entries.
 * Supports two formats per line:
 *   Name: https://example.com   (named)
 *   https://example.com         (URL used as name)
 * Lines starting with # and blank lines are ignored.
 */
export function readUrlFile(filePath: string): UrlEntry[] {
  const lines = readFileSync(filePath, "utf-8").split("\n");
  const entries: UrlEntry[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const sep = line.search(/:\s+https?:\/\//);
    if (sep !== -1) {
      entries.push({
        name: line.slice(0, sep).trim(),
        url: line.slice(sep + 1).trim(),
      });
    } else {
      entries.push({ name: line, url: line });
    }
  }

  return entries;
}
