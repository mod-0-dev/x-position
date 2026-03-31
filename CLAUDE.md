# codeage — build plan

## What we're building
A Bun/TypeScript CLI that color-codes every line of a source file by how recently it was last changed,
using `git blame` under the hood. Fresh lines = green, ancient lines = red/orange.
Like a thermal camera for your codebase.

```
codeage src/app.ts
codeage src/             # directory mode — per-file age summary
codeage src/app.ts --blame  # show commit date alongside each line
```

## Stack layout
```
main
  └─ feat/init            PR #1  scaffold (package.json+bin, tsconfig, src/index.ts with --version/--help)
       └─ feat/blame-parser   PR #2  git blame --porcelain parser → BlameEntry[]
            └─ feat/age-color    PR #3  age → ANSI truecolor gradient engine
                 └─ feat/render      PR #4  file renderer: print lines with age color + --blame mode
                      └─ feat/dir-mode   PR #5  directory scan + per-file summary + --oldest flag
```

## pramid commands used

```bash
# Wire up the full stack at once
pramid stack create main feat/init feat/blame-parser feat/age-color feat/render feat/dir-mode

# Check status
pramid status

# When ready to merge (squash)
pramid stack merge feat/init --strategy squash
```

## Progress
- [x] main: CLAUDE.md updated
- [ ] feat/init: scaffold
- [ ] feat/blame-parser: blame parser
- [ ] feat/age-color: gradient engine
- [ ] feat/render: line renderer
- [ ] feat/dir-mode: directory mode
- [ ] pramid stack create → show user
- [ ] await user approval → pramid stack merge

## pramid feedback / observations
(notes on tool behavior, missing commands, bugs, UX ideas go here)
