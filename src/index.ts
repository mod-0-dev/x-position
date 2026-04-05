#!/usr/bin/env bun
import { c } from "./utils/format";

const VERSION = "0.1.0";

const HELP = `
${c.bold}jot${c.reset} — your lightweight personal journal

${c.bold}USAGE${c.reset}
  jot "note text"              quick-add an entry
  jot <command> [options]

${c.bold}COMMANDS${c.reset}
  add <text>                   add entry  [--tag <t>] [--mood <m>]
  list                         list recent entries  [--n <N>] [--tag <t>] [--since <date>] [--mood <m>]
  read <id>                    print full entry
  delete <id>                  delete an entry
  search <query>               full-text search
  stats                        streak, word count, mood chart
  export                       export all entries to markdown

${c.bold}MOODS${c.reset}
  great · good · okay · bad · rough

${c.bold}OPTIONS${c.reset}
  --help, -h                   show this help
  --version, -v                show version
`;

const args = process.argv.slice(2);

if (!args.length || args[0] === "--help" || args[0] === "-h") {
  console.log(HELP);
  process.exit(0);
}

if (args[0] === "--version" || args[0] === "-v") {
  console.log(`jot v${VERSION}`);
  process.exit(0);
}

// Dispatch commands
const command = args[0];

const commands: Record<string, () => Promise<void>> = {
  add:    () => import("./commands/add").then((m) => m.run(args.slice(1))),
  list:   () => import("./commands/list").then((m) => m.run(args.slice(1))),
  read:   () => import("./commands/read").then((m) => m.run(args.slice(1))),
  delete: () => import("./commands/delete").then((m) => m.run(args.slice(1))),
  search: () => import("./commands/search").then((m) => m.run(args.slice(1))),
  stats:  () => import("./commands/stats").then((m) => m.run(args.slice(1))),
  export: () => import("./commands/export").then((m) => m.run(args.slice(1))),
};

// bare "jot <text>" quick-add
if (!commands[command]) {
  import("./commands/add").then((m) => m.run(args));
} else {
  commands[command]().catch((err: Error) => {
    console.error(`${c.red}Error:${c.reset}`, err.message);
    process.exit(1);
  });
}
