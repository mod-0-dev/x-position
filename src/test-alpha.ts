// alpha: basic env key validator
export function isValidKey(key: string): boolean {
  return /^[A-Z_][A-Z0-9_]*$/.test(key);
}
