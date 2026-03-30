// beta: env value sanitizer — strips surrounding quotes
export function sanitizeValue(raw: string): string {
  return raw.replace(/^["']|["']$/g, "").trim();
}
