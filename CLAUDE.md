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

### Session 5 (2026-05-04) — `jot timeline` stack alongside codeage stack

Built a 4-branch stack (feat/timeline-bucket → render → cmd → options, PRs #34–#37) on top of `main` while the codeage stack (PRs #29–#33) was still open. Used 16 distinct pramid commands/flags. Highlights:

- `pramid auth status` now exists and works cleanly (regression from session 3 fixed) — shows `authenticated as <user> (credential helper, user: <user>)` plus GitLab token state.
- `pramid status` lists multiple stacks separated by a blank line — read clearly even with two unrelated stacks open. Good multi-stack UX.
- `pramid stack log <branch>` only prints **descendants** of `<branch>`, not the full stack that contains it. README phrasing "scope to one stack" sets the wrong expectation: `stack log feat/timeline-options` showed only `feat/timeline-cmd` as the root. Suggest either renaming the flag (`--from`) or making the default behaviour show the full owning stack.
- `pramid stack checkout 37` (by PR number) and `pramid stack checkout bucket` (partial name) both worked. Mixed-mode is great.
- `pramid stack restack --dry-run` and `pramid stack sync --dry-run` print clean step-by-step plans (`[dry-run] rebase X onto Y`). Sync correctly shows the `git fetch origin main` step first.
- `pramid stack submit --dry-run` lists every push/PR as separate lines — useful even for a 4-deep stack already pushed.
- `pramid stack update-nav feat/timeline-bucket` succeeded silently (`Updated stack navigation in PR descriptions.`). No before/after detail though — would be nice to see "updated PR #34, #35, #36, #37".
- `pramid stack gc --remote --dry-run` printed `Checking 13 entries against remote...` but only emitted progress for 4 (`feat/jot-*... active`) before declaring "clean". The rest of the count is invisible — unclear whether they were skipped or batched. Progress output should match the announced count.
- `.claude/settings.local.json` still gets auto-dirtied across navigation; didn't bite this session because no real restack/sync was run, but the latent risk from session 3 is unchanged.

### What was NOT exercised this session (and why)
- `pramid stack create` — used incremental `branch new` + `push --draft` instead.
- `pramid stack restack` (real, non-dry) — no divergence to fix; would have been a no-op.
- `pramid stack sync` (real, non-dry) — same.
- `pramid stack reorder` / `pramid stack split` — semantically destructive on a working stack (render imports from bucket); skipped.
- `pramid stack close` — would close a real PR.
- `pramid stack merge` — **paused before this** so the user can review the stack picture first.
- `pramid gui` — opens a browser, would derail the session.

