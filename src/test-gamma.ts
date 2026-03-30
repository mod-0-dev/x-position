// gamma: env line counter — counts non-blank, non-comment lines
export function countEntries(lines: string[]): number {
  return lines.filter(l => l.trim() && !l.trim().startsWith("#")).length;
}
