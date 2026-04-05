# 🗒️ jot

A lightweight personal journal for the command line. No accounts, no cloud, no bloat — just your thoughts in a JSON file in your home directory.

```
jot "Finally fixed that nasty storage bug 🎉" --tag dev --mood great
```

---

## Installation

Requires [Bun](https://bun.sh).

```bash
git clone https://github.com/mod-0-dev/x-position.git
cd x-position
bun install
bun link        # makes `jot` available globally
```

---

## Usage

### Quick add

The fastest way to jot something down:

```bash
jot "Rainy afternoon, good coffee, productive day"
```

### `add` — add an entry

```bash
jot add "your text here" [--tag <tag>] [--mood <mood>]
```

```bash
jot add "Shipped the new auth flow" --tag work --mood great
jot add "Tired but got through it" --mood okay
jot add "Two tags work too" --tag dev --tag personal
```

**Moods:** `great` · `good` · `okay` · `bad` · `rough`

---

### `list` — browse entries

```bash
jot list [--n <N>] [--tag <tag>] [--since <date>] [--mood <mood>]
```

```bash
jot list              # last 10 entries
jot list --n 25       # last 25 entries
jot list --tag dev    # only entries tagged "dev"
jot list --mood great # only great-mood entries
jot list --since 2026-04-01
```

**Example output:**
```
Apr 5, 2026 [mnm40jhzypuv] 🟢 Just started building jot today — feels… #dev
Apr 5, 2026 [mnm41ashue7w] 🟢 Coffee and rain — perfect coding weather #life

2 of 4 entries
```

---

### `read` — read a full entry

```bash
jot read <id>
```

```bash
jot read mnm40jhzypuv
```

Shows the full body, date, tags, mood, and word count.

---

### `delete` — remove an entry

```bash
jot delete <id>
```

---

### `search` — full-text search

```bash
jot search <query>
```

```bash
jot search coffee
jot search "design decision"
```

Matches against entry body and tags. Highlights the matching term in results.

---

### `stats` — journal insights

```bash
jot stats
```

```
── jot stats ────────────────────────
  Entries:   12
  Words:     847 total · 70 avg per entry
  Streak:    3 days 🔥
  Top tags:  #dev (7)  #life (3)  #work (2)

  Mood chart
  🟢 great  ████ 4
  🔵 good   ███ 3
  🟡 okay   ██ 2
  🟣 bad    █ 1
─────────────────────────────────────
```

---

### `export` — export to markdown

```bash
jot export [output-file]
```

```bash
jot export                      # writes jot-export.md in cwd
jot export ~/notes/journal.md   # custom path
```

Produces a clean markdown file with all entries, dates, moods, and tags.

---

## Data

All entries are stored in `~/.jot/entries.json` — a plain JSON file you own. Back it up, sync it, read it directly; no lock-in.

```json
[
  {
    "id": "mnm40jhzypuv",
    "date": "2026-04-05T18:30:00.000Z",
    "body": "Just started building jot today — feels promising!",
    "tags": ["dev"],
    "mood": "great"
  }
]
```

---

## Project structure

```
src/
├── index.ts          # entry point + command dispatch
├── model.ts          # Entry type + ID generator
├── storage.ts        # JSONStorage (reads/writes ~/.jot/entries.json)
├── commands/
│   ├── add.ts
│   ├── list.ts
│   ├── read.ts
│   ├── delete.ts
│   ├── search.ts
│   ├── stats.ts
│   └── export.ts
└── utils/
    └── format.ts     # ANSI colors, date helpers, word count
```

---

## License

MIT
