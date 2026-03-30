export interface LogfmtEntry {
  raw: string;
  fields: Record<string, string>;
}

export interface ParseOptions {
  strict?: boolean;
}

export interface FilterOptions {
  key?: string;
  value?: string;
  keys?: string[];
}
