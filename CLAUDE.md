# envdiff — build plan

## What we're building
A small Bun/TypeScript CLI that diffs two `.env` files and shows added, removed, and changed keys with colorized output.

```
envdiff .env.staging .env.production
```

## Stack layout
```
main
  └─ feat/init      PR #1  project scaffold (package.json, tsconfig, entry point)
       └─ feat/parser    PR #2  .env parser (comments, quotes, empty lines)
            └─ feat/differ   PR #3  diff engine (added / removed / changed)
                 └─ feat/cli      PR #4  full CLI wiring + --help + --keys-only flag
                      └─ feat/output   PR #5  colorized ANSI output + summary footer
```

## pramid commands used

```bash
# Create the full stack at once
pramid stack create main feat/init feat/parser feat/differ feat/cli feat/output

# Check status (run any time)
pramid status

# When ready to merge (squash)
pramid stack merge feat/init --strategy squash
```

## Progress
- [ ] main: initial commit + CLAUDE.md
- [ ] feat/init: project scaffold
- [ ] feat/parser: .env parser
- [ ] feat/differ: diff engine
- [ ] feat/cli: CLI wiring
- [ ] feat/output: colorized output
- [ ] pramid stack create → show user
- [ ] await user approval → pramid stack merge

## pramid feedback / observations
(notes on tool behavior, missing commands, bugs, UX ideas go here)
