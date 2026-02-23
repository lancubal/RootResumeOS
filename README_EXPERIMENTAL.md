# 🧪 Experimental Branch — RootResume OS

This branch is a free-development sandbox. Everything here is exploratory — features get built,
documented, and refined before being considered for `master`.

---

## 💡 Ideas & Roadmap

### ✅ Completed (in this branch)

| Feature | Description | Files |
|---------|-------------|-------|
| **Skills pills in panel** | Animated tech pill tags below the description in PresentationPanel | `PresentationPanel.tsx`, `config.ts` |
| **`skills` terminal command** | ASCII horizontal bar chart of skill levels, rendered inline in the terminal | `RootResumeTerminal.tsx`, `config.ts` |
| **`matrix` easter egg** | Hidden `matrix` command that spawns a green digital rain animation in the terminal | `RootResumeTerminal.tsx` |
| **`/blog/[slug]` pages** | Full article content for each blog post — no more "coming soon" placeholder | `app/blog/[slug]/page.tsx`, `config.ts` |
| **Blog cards link to articles** | PostCard on `/blog` now navigates to the individual article page | `app/blog/page.tsx` |
| **SEO metadata** | Proper `metadata` export on `/`, `/projects`, `/blog`, `/about` | all page files |

---

## 🛠️ Feature Notes

### Skills pills in panel
- Added a `SKILLS` array to `config.ts` grouping technologies by category (Languages, Backend, Frontend, DevOps)
- PresentationPanel renders them as small animated pills between the description and the nav buttons
- Pills use a subtle stagger animation on load

### `skills` command
- Purely client-side, no container exec needed
- Renders an ASCII horizontal bar chart (e.g. `█████████░  90% TypeScript`)
- Data comes from `SKILLS` in `config.ts` — easy to update

### `matrix` easter egg
- Type `matrix` in the terminal
- Spawns a character rain using random katakana + latin mixed characters
- Rendered frame-by-frame as terminal output updates (like the viz engine but client-side)
- Auto-stops after ~5 seconds or on `Ctrl+C`

### `/blog/[slug]` pages
- Each post in `BLOG_POSTS` now has a `content` field (plain sections with headings + paragraphs)
- Dynamic route `app/blog/[slug]/page.tsx` renders the article
- Includes estimated reading time, date, tags, and a back button
- 404 fallback for unknown slugs

### SEO metadata
- Each page exports a `metadata` object with `title`, `description`, and `openGraph` fields
- Uses `OWNER` from `config.ts` so names are always in sync

---

## 🔬 Ideas Pending (not yet built)

- **CRT scanline toggle** — A button to switch the terminal to a retro "green phosphor on black" CRT mode
  with a scanline CSS overlay. Would be a fun personality touch for visitors who want the full hacker aesthetic.

- **`/blog/[slug]` MDX support** — Right now articles are plain data objects. Could migrate to `.mdx` files
  in `content/blog/` and use `next-mdx-remote` for full Markdown + component embedding.

- **Visitor counter** — Small real-time counter showing how many active sessions are running.
  Already have the `/api/stats` endpoint — just need to wire it to the UI.

- **Terminal themes** — Dropdown to switch between color themes (Dracula, Nord, Gruvbox, Default).
  CSS variables make this straightforward.

- **`ls skills` command variant** — Alternative rendering as a JSON tree like the existing `ls projects`.

- **Contact form** — Replace email link with an inline animated form in PresentationPanel that
  POSTs to a serverless function (Resend API or Nodemailer).

- **Keyboard shortcut map** — Show a `?` tooltip on the terminal listing all keyboard shortcuts
  (Ctrl+C, Arrow Up/Down, Tab).

- **Mobile quick-action drawer snap points** — The current drawer snaps to 75vh. Adding snap points
  at 40vh and 90vh would make it more ergonomic on phone.

---

## 🧩 Architecture Reminders

```
client/src/app/
  config.ts              ← single source of truth for ALL content
  page.tsx               ← home layout (split panel + terminal)
  RootResumeTerminal.tsx ← 842-line terminal emulator
  components/
    PresentationPanel.tsx
  about/page.tsx
  projects/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx   ← NEW (this branch)

server/
  index.js               ← Express + SSE + Docker socket
  visualizationManager.js← 9 viz scripts as code strings
  sessionManager.js
```

---

## 📅 Branch log

| Date | What was done |
|------|---------------|
| 2026-02-23 | Branch created from master after layout restructure commit |
| 2026-02-23 | Skills pills, `skills` command, `matrix` easter egg, blog post pages, SEO metadata |
