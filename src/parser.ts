export type EnvMap = Map<string, string>;

/**
 * Parse a .env file into a key→value map.
 * Handles: comments (#), quoted values ("" and ''), empty lines, KEY= (empty value).
 */
export function parseEnv(content: string): EnvMap {
  const map: EnvMap = new Map();

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    if (!key) continue;

    let value = line.slice(eq + 1).trim();

    // Strip matching surrounding quotes
    if (value.length >= 2) {
      const first = value[0];
      const last = value[value.length - 1];
      if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
        value = value.slice(1, -1);
      }
    }

    map.set(key, value);
  }

  return map;
}
