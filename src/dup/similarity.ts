import { tokenize } from "./tokenize";

export type SimilarPair = {
  aIndex: number;
  bIndex: number;
  score: number;   // 0..1
};

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const t of small) if (large.has(t)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function findSimilarPairs(bodies: string[], threshold: number): SimilarPair[] {
  const tokens = bodies.map(tokenize);
  const pairs: SimilarPair[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    for (let j = i + 1; j < tokens.length; j += 1) {
      const a = tokens[i] ?? new Set<string>();
      const b = tokens[j] ?? new Set<string>();
      const score = jaccard(a, b);
      if (score >= threshold) {
        pairs.push({ aIndex: i, bIndex: j, score });
      }
    }
  }
  pairs.sort((x, y) => y.score - x.score);
  return pairs;
}
