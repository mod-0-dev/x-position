export type CodeAgeMode = "file" | "directory";

export type CodeAgeFeature = {
  name: string;
  implemented: boolean;
};

export const codeAgePlan: CodeAgeFeature[] = [
  { name: "init", implemented: true },
  { name: "blame-parser", implemented: true },
  { name: "age-color", implemented: true },
  { name: "render", implemented: false },
  { name: "dir-mode", implemented: false },
];

export type BlameEntry = {
  lineNumber: number;
  authorTimeUnix: number;
};

export function parsePorcelainBlame(input: string): BlameEntry[] {
  const entries: BlameEntry[] = [];
  const lines = input.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].startsWith("\t")) {
      continue;
    }

    entries.push({ lineNumber: entries.length + 1, authorTimeUnix: 0 });
  }

  return entries;
}

export function ageToRgb(elapsedDays: number, maxDays: number): [number, number, number] {
  if (maxDays <= 0) {
    return [0, 255, 0];
  }

  const ratio = Math.min(Math.max(elapsedDays / maxDays, 0), 1);
  const red = Math.round(255 * ratio);
  const green = Math.round(255 * (1 - ratio));

  return [red, green, 0];
}
