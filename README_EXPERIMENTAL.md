# 🧪 Experimental Branch — RootResume OS

This branch is a free-development sandbox. Everything here is exploratory — features get built,
documented, and refined before being considered for `master`.

---

## 💡 Ideas & Roadmap

### ✅ Completed (in this branch)

| Feature | Description | Files |
|---------|-------------|-------|
| **`skills` terminal command** | ASCII horizontal bar chart of skill levels, rendered inline in the terminal | `RootResumeTerminal.tsx`, `config.ts` |
| **`matrix` easter egg** | Hidden `matrix` command that spawns a green digital rain animation in the terminal (crash fixed: bounds guards added) | `RootResumeTerminal.tsx` |
| **`fortune` command** | Prints a random dev quote in an ASCII box — 18 quotes from `config.ts` | `RootResumeTerminal.tsx`, `config.ts` |
| **`konami` command + easter egg** | Type `konami` in terminal OR press ↑↑↓↓←→←→BA anywhere on the page | `RootResumeTerminal.tsx`, `page.tsx` |
| **Avatar hover animation** | Spring-physics scale + tilt on the profile photo, zinc ring on hover | `PresentationPanel.tsx` |
| **Name hover animation** | Per-character wave with stagger + subtle indigo color shift on the name heading | `PresentationPanel.tsx` |
| **`/uses` page** | Static page listing editor, terminal, hardware, services and fonts used — linked from panel footer | `app/uses/page.tsx`, `config.ts` |
| **`/blog/[slug]` pages** | Full article content for each blog post — no more "coming soon" placeholder | `app/blog/[slug]/page.tsx`, `config.ts` |
| **Blog cards link to articles** | PostCard on `/blog` now navigates to the individual article page | `app/blog/page.tsx` |
| **SEO metadata** | Proper `metadata` export on `/`, `/projects`, `/blog`, `/about`, `/uses` | all page files |

---

## 🛠️ Feature Notes

### Skills pills in panel *(removed — too noisy)*
- Removed from PresentationPanel in a later iteration; the `skills` terminal command remains

### `skills` command
- Purely client-side, no container exec needed
- Renders an ASCII horizontal bar chart (e.g. `█████████░  90% TypeScript`)
- Data comes from `SKILLS` in `config.ts` — easy to update

### `matrix` easter egg (crash fixed)
- Bounds guards added: `row - 1 < ROWS` and `row - 3 < ROWS` prevent out-of-bounds grid access
  that caused `grid[(row-1)] is undefined` when drop values exceeded grid height
- Type `matrix` in the terminal
- Spawns a character rain using random katakana + latin mixed characters
- Rendered frame-by-frame as terminal output updates (like the viz engine but client-side)
- Auto-stops after ~5 seconds or on `Ctrl+C`

### `fortune` command
- Picks a random quote from `FORTUNE_QUOTES` (18 dev/hacker quotes in `config.ts`)
- Wraps long text to 56 characters and renders it in a `+───+` ASCII box
- Author appears on the last line right-aligned inside the box

### Konami easter egg
- Type `konami` in the terminal → ASCII "DUFELL" banner with the cheat code string
- OR press ↑↑↓↓←→←→BA anywhere on the page → same effect via global `keydown` listener in `page.tsx`
- Uses a rolling buffer of the last 10 keys; resets automatically on mismatch

### Hover animations
- **Avatar**: `motion.div` with `whileHover={{ scale: 1.07, rotate: 4 }}` + spring physics; inner div gets a zinc ring + shadow on hover
- **Name heading**: `<motion.h1 whileHover="hover">` — each character is a `motion.span` with a `hover` variant that lifts it `y: -6` and shifts color through an indigo gradient, staggered by index × 30ms

### `/uses` page
- Accessible at `/uses` and linked with a subtle `/uses` text in the panel footer
- Server component, static — no client JS needed
- Data lives in `USES` array in `config.ts` (5 categories: Editor & IDE, Terminal, Services & DevOps, Hardware, Fonts & Design)
- Inspired by uses.tech

---

## 🔬 Ideas Pending (not yet built)

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
  uses/page.tsx          ← NEW (this branch)

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
| 2026-02-23 | Removed skills pills (too noisy); fixed matrix crash; hover animations on avatar + name; `fortune` + `konami` commands; Konami code easter egg; `/uses` page |
