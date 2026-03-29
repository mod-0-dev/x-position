import type { EnvMap } from "./parser.ts";

export interface DiffResult {
  added: Map<string, string>;
  removed: Map<string, string>;
  changed: Map<string, { from: string; to: string }>;
}

export function diffEnv(a: EnvMap, b: EnvMap): DiffResult {
  const added = new Map<string, string>();
  const removed = new Map<string, string>();
  const changed = new Map<string, { from: string; to: string }>();

  for (const [key, valA] of a) {
    if (!b.has(key)) {
      removed.set(key, valA);
    } else {
      const valB = b.get(key)!;
      if (valA !== valB) changed.set(key, { from: valA, to: valB });
    }
  }

  for (const [key, valB] of b) {
    if (!a.has(key)) added.set(key, valB);
  }

  return { added, removed, changed };
}
