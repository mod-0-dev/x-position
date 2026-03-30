import type { LogfmtEntry, ParseOptions } from "./types.js";

/**
 * Parse a single logfmt line into key/value fields.
 * Handles quoted values: key="hello world" and bare values: key=hello
 */
export function parseLine(line: string, _opts?: ParseOptions): LogfmtEntry {
  const fields: Record<string, string> = {};
  const raw = line;
  let i = 0;

  while (i < line.length) {
    // skip whitespace
    while (i < line.length && line[i] === " ") i++;
    if (i >= line.length) break;

    // read key
    const keyStart = i;
    while (i < line.length && line[i] !== "=" && line[i] !== " ") i++;
    const key = line.slice(keyStart, i);
    if (!key) break;

    if (line[i] !== "=") {
      // bare key with no value — treat as boolean true
      fields[key] = "true";
      continue;
    }
    i++; // skip '='

    // read value
    let value = "";
    if (line[i] === '"') {
      i++; // skip opening quote
      while (i < line.length && line[i] !== '"') {
        if (line[i] === "\\" && i + 1 < line.length) {
          i++; // skip backslash
          value += line[i];
        } else {
          value += line[i];
        }
        i++;
      }
      i++; // skip closing quote
    } else {
      const valStart = i;
      while (i < line.length && line[i] !== " ") i++;
      value = line.slice(valStart, i);
    }

    fields[key] = value;
  }

  return { raw, fields };
}

/**
 * Parse multiple logfmt lines, skipping blanks and comments.
 */
export function parseLines(text: string, opts?: ParseOptions): LogfmtEntry[] {
  return text
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#"))
    .map((l) => parseLine(l, opts));
}
