import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import type { Entry } from "./model";

const JOT_DIR = join(homedir(), ".jot");
const STORE_FILE = join(JOT_DIR, "entries.json");

export class JSONStorage {
  private entries: Entry[];

  constructor() {
    if (!existsSync(JOT_DIR)) mkdirSync(JOT_DIR, { recursive: true });
    if (!existsSync(STORE_FILE)) {
      writeFileSync(STORE_FILE, "[]", "utf-8");
    }
    this.entries = JSON.parse(readFileSync(STORE_FILE, "utf-8")) as Entry[];
  }

  all(): Entry[] {
    return this.entries;
  }

  get(id: string): Entry | undefined {
    return this.entries.find((e) => e.id === id);
  }

  add(entry: Entry): void {
    this.entries.unshift(entry);
    this.save();
  }

  remove(id: string): boolean {
    const before = this.entries.length;
    this.entries = this.entries.filter((e) => e.id !== id);
    if (this.entries.length < before) {
      this.save();
      return true;
    }
    return false;
  }

  private save(): void {
    writeFileSync(STORE_FILE, JSON.stringify(this.entries, null, 2), "utf-8");
  }
}
