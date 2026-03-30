import type { LogfmtEntry, FilterOptions } from "./types.js";

/**
 * Filter a list of parsed logfmt entries by key presence, key=value match,
 * or a set of keys to include.
 */
export function filterEntries(
  entries: LogfmtEntry[],
  opts: FilterOptions
): LogfmtEntry[] {
  return entries.filter((entry) => {
    if (opts.key !== undefined) {
      if (!(opts.key in entry.fields)) return false;
      if (opts.value !== undefined && entry.fields[opts.key] !== opts.value)
        return false;
    }
    return true;
  });
}

/**
 * Project entries to only include specified keys.
 */
export function projectKeys(
  entries: LogfmtEntry[],
  keys: string[]
): LogfmtEntry[] {
  if (!keys.length) return entries;
  return entries.map((entry) => {
    const fields: Record<string, string> = {};
    for (const k of keys) {
      if (k in entry.fields) fields[k] = entry.fields[k];
    }
    return { raw: entry.raw, fields };
  });
}
