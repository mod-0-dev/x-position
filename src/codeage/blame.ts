import { spawnSync } from "child_process";

export interface BlameEntry {
  lineNumber: number;       // 1-based line number in the file
  content: string;          // raw line content (no trailing newline)
  commitHash: string;       // 40-char SHA
  authorTime: number;       // unix timestamp of the author date
  summary: string;          // commit subject line
}

interface CommitMeta {
  authorTime: number;
  summary: string;
}

/**
 * Run `git blame --porcelain` on a file and parse the output into BlameEntry[].
 * Throws if git is not available or the file is not tracked.
 */
export function blameFile(filePath: string, cwd?: string): BlameEntry[] {
  const result = spawnSync("git", ["blame", "--porcelain", filePath], {
    cwd: cwd ?? process.cwd(),
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  });

  if (result.status !== 0) {
    const msg = result.stderr?.trim() ?? "unknown error";
    throw new Error(`git blame failed for "${filePath}": ${msg}`);
  }

  return parsePorcelain(result.stdout);
}

/**
 * Parse the raw output of `git blame --porcelain`.
 *
 * Porcelain format repeats for each line:
 *   <40-char-sha> <orig-line> <final-line> <group-count>   ← header
 *   [author <name>]
 *   [author-mail <email>]
 *   [author-time <unix>]
 *   [author-tz ±HHMM]
 *   [committer ...]
 *   [summary <subject>]
 *   [filename <path>]
 *   \t<line content>                                         ← content line (always last)
 *
 * Commit metadata is emitted only the first time a SHA appears; subsequent
 * lines with the same SHA reuse the cached metadata.
 */
export function parsePorcelain(raw: string): BlameEntry[] {
  const lines = raw.split("\n");
  const entries: BlameEntry[] = [];
  const commitCache = new Map<string, CommitMeta>();

  let i = 0;
  while (i < lines.length) {
    const headerLine = lines[i];
    if (!headerLine || headerLine.length === 0) { i++; continue; }

    // Header: "<sha> <orig> <final> [<count>]"
    const headerMatch = headerLine.match(/^([0-9a-f]{40}) \d+ (\d+)/);
    if (!headerMatch) { i++; continue; }

    const sha = headerMatch[1];
    const finalLine = parseInt(headerMatch[2], 10);
    i++;

    // Consume metadata lines until we hit the \t content line
    let authorTime = 0;
    let summary = "";

    while (i < lines.length && !lines[i].startsWith("\t")) {
      const metaLine = lines[i];
      if (metaLine.startsWith("author-time ")) {
        authorTime = parseInt(metaLine.slice("author-time ".length), 10);
      } else if (metaLine.startsWith("summary ")) {
        summary = metaLine.slice("summary ".length);
      }
      i++;
    }

    // Content line always starts with \t
    const contentLine = lines[i] ?? "";
    const content = contentLine.startsWith("\t") ? contentLine.slice(1) : contentLine;
    i++;

    // Cache or reuse commit metadata
    if (authorTime !== 0 || summary !== "") {
      commitCache.set(sha, { authorTime, summary });
    }
    const meta = commitCache.get(sha) ?? { authorTime: 0, summary: "" };

    entries.push({
      lineNumber: finalLine,
      content,
      commitHash: sha,
      authorTime: meta.authorTime,
      summary: meta.summary,
    });
  }

  // Sort by final line number (porcelain output is not always in order)
  entries.sort((a, b) => a.lineNumber - b.lineNumber);
  return entries;
}
