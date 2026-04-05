import { JSONStorage } from "../storage";
import { c } from "../utils/format";

export async function run(args: string[]): Promise<void> {
  const id = args[0];
  if (!id) {
    console.error(`${c.red}Usage:${c.reset} jot delete <id>`);
    process.exit(1);
  }

  const storage = new JSONStorage();
  const ok = storage.remove(id);

  if (ok) {
    console.log(`${c.green}✓${c.reset} Deleted entry ${c.bold}${id}${c.reset}`);
  } else {
    console.error(`${c.red}Not found:${c.reset} ${id}`);
    process.exit(1);
  }
}
