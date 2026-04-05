export type Mood = "great" | "good" | "okay" | "bad" | "rough";

export interface Entry {
  id: string;
  date: string;   // ISO-8601
  body: string;
  tags: string[];
  mood?: Mood;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
