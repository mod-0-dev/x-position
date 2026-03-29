const R = "\x1b[0m";

const fg = (code: number, s: string) => `\x1b[${code}m${s}${R}`;

export const red    = (s: string) => fg(31, s);
export const green  = (s: string) => fg(32, s);
export const yellow = (s: string) => fg(33, s);
export const gray   = (s: string) => fg(90, s);
export const bold   = (s: string) => fg(1,  s);
