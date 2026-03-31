/**
 * Age → ANSI truecolor gradient engine.
 *
 * The gradient goes from fresh (green) to ancient (red):
 *   0 days  → #57e389  (vibrant green)
 *   30 days → #f9f06b  (yellow)
 *   90 days → #ffa348  (orange)
 *   1 year  → #ed333b  (red)
 *   3+ yrs  → #813d9c  (deep purple — truly ancient)
 *
 * Intermediate values are linearly interpolated in RGB space between
 * the nearest two stops.
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorStop {
  /** Age in days */
  days: number;
  rgb: RGB;
}

const GRADIENT: ColorStop[] = [
  { days: 0,    rgb: { r: 87,  g: 227, b: 137 } }, // green
  { days: 30,   rgb: { r: 249, g: 240, b: 107 } }, // yellow
  { days: 90,   rgb: { r: 255, g: 163, b: 72  } }, // orange
  { days: 365,  rgb: { r: 237, g: 51,  b: 59  } }, // red
  { days: 1095, rgb: { r: 129, g: 61,  b: 156 } }, // purple (3 yrs)
];

const MS_PER_DAY = 86_400_000;

/** Convert a unix timestamp (seconds) to age in days relative to now. */
export function timestampToAgeDays(authorTimeSeconds: number): number {
  const ageMs = Date.now() - authorTimeSeconds * 1000;
  return Math.max(0, ageMs / MS_PER_DAY);
}

/** Linearly interpolate between two RGB values. t ∈ [0, 1]. */
function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

/** Map an age in days to an RGB color via the gradient stops. */
export function ageDaysToRgb(days: number): RGB {
  // Clamp to gradient range
  if (days <= GRADIENT[0].days) return GRADIENT[0].rgb;
  if (days >= GRADIENT[GRADIENT.length - 1].days) return GRADIENT[GRADIENT.length - 1].rgb;

  // Find the two stops that bracket `days`
  for (let i = 0; i < GRADIENT.length - 1; i++) {
    const lo = GRADIENT[i];
    const hi = GRADIENT[i + 1];
    if (days >= lo.days && days <= hi.days) {
      const t = (days - lo.days) / (hi.days - lo.days);
      return lerpRgb(lo.rgb, hi.rgb, t);
    }
  }

  return GRADIENT[GRADIENT.length - 1].rgb;
}

/** Wrap text in ANSI truecolor foreground escape sequence. */
export function colorize(text: string, rgb: RGB): string {
  return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m${text}\x1b[0m`;
}

/** Wrap text in ANSI dim/gray for secondary info (commit dates, etc.). */
export function dim(text: string): string {
  return `\x1b[2m${text}\x1b[0m`;
}

/** Return a color-coded age label like "3d" or "2y" for display. */
export function ageLabel(days: number): string {
  if (days < 1)   return "today";
  if (days < 7)   return `${Math.floor(days)}d`;
  if (days < 30)  return `${Math.floor(days / 7)}w`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

/**
 * Given a unix author timestamp (seconds), return the ANSI-colorized
 * text wrapped in the gradient color for that age.
 */
export function colorizeByAge(text: string, authorTimeSeconds: number, useColor: boolean): string {
  if (!useColor) return text;
  const days = timestampToAgeDays(authorTimeSeconds);
  const rgb = ageDaysToRgb(days);
  return colorize(text, rgb);
}
