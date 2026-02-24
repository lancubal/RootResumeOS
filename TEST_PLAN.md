# ✅ RootResume OS — Test Plan

> **Branch**: `experimental`  
> **Date**: February 2026  
> **How to run**: `cd client && npm run dev` (port 3000) + `cd server && node index.js` (port 3001, requires Docker)

---

## 0. Setup Checklist

Before testing, confirm:

- [ ] `npm run dev` starts without build errors in the client
- [ ] Server starts at port 3001 (requires Docker daemon running)
- [ ] Open `http://localhost:3000` in a browser — page loads within 2 seconds
- [ ] No red console errors on first load (yellow pre-existing lint warnings are OK)

---

## 1. Home Page — Layout & Panel

| # | Test | Expected | Pass? |
|---|------|----------|-------|
| 1.1 | Open `localhost:3000` on a desktop (≥1024px wide) | Left panel + right terminal side by side, no overflow | |
| 1.2 | Open on mobile (or DevTools 375px) | Only panel visible; terminal icon button visible in bottom-right | |
| 1.3 | Panel avatar is visible and circular | Circular image with green "online" dot in bottom-right corner | |
| 1.4 | Hover over avatar | Photo should scale up + tilt slightly + indigo glow ring appears | |
| 1.5 | Move mouse away from avatar | Smoothly springs back to original position | |
| 1.6 | Hover over the name heading | Each letter should jump up one by one (staggered wave) and turn indigo | |
| 1.7 | Move mouse away from name | Letters drop back to original position + color returns to dark | |
| 1.8 | Three nav buttons are visible (Projects, Blog, About this portfolio) | Correct gradient colors: amber, rose, indigo | |
| 1.9 | Footer row: GitHub, LinkedIn, Mail icons + Download CV button + `/uses` link | All visible and in one row | |
| 1.10 | The visitor counter appears in the footer | e.g. "1 visit" text visible next to `/uses` | |
| 1.11 | Refresh the page | Counter should NOT increment a second time (cookie-deduplicated for 24h) | |
| 1.12 | Open in incognito window | Counter increments by 1 | |

---

## 2. Terminal — Basic Behavior

| # | Test | Expected | Pass? |
|---|------|----------|-------|
| 2.1 | Terminal loads on desktop | Black terminal panel on the right; shows boot message + CTF hint + "Type 'help'" | |
| 2.2 | Click anywhere on the terminal | Input field gets focus | |
| 2.3 | Type `help` and press Enter | Lists all available commands in a categorized block | |
| 2.4 | Check that `?` appears in the help output | Should see `  ?  - Show keyboard shortcuts` | |
| 2.5 | Type `clear` and press Enter | Terminal history clears, prompt remains | |
| 2.6 | Type commands, then press `↑` | Cycles through previous commands | |
| 2.7 | After cycling history, press `↓` | Returns to empty input | |
| 2.8 | Start typing `vis`, press `Tab` | Autocompletes to `visualize ` | |
| 2.9 | Type `Ctrl+L` | Terminal clears (same as `clear`) | |
| 2.10 | On mobile: tap the terminal button (bottom-right) | Terminal drawer slides up to 75vh | |
| 2.11 | On mobile: tap the ✕ button | Terminal closes | |

---

## 3. Terminal — CRT Mode Toggle

| # | Test | Expected | Pass? |
|---|------|----------|-------|
| 3.1 | Locate the TV icon button in the terminal title bar (top-right) | Small monitor icon visible | |
| 3.2 | Click the CRT toggle button | Title bar turns near-black; all terminal text turns green; horizontal scanlines overlay appears | |
| 3.3 | In CRT mode, type any command | Output text and prompt are phosphor green | |
| 3.4 | In CRT mode, trigger an error (e.g. type a bad command) | Error text stays red (intentional exception) | |
| 3.5 | Click the CRT toggle again | Terminal returns to default dark theme | |
| 3.6 | CRT toggle button is highlighted/green when active | Button background is dark green tinted when on | |

---

## 4. Terminal — All Commands

### 4a. Client-side commands

| # | Command | Expected output | Pass? |
|---|---------|----------------|-------|
| 4.1 | `about` | ASCII "R" logo with system info table (OS, shell, memory, etc.) | |
| 4.2 | `whoami` | Returns current username (e.g. `guest`) | |
| 4.3 | `ls projects` | Lists all projects with name, tech stack, year | |
| 4.4 | `skills` | ASCII bar chart grouped by category (Languages, Backend, Frontend, DevOps) | |
| 4.5 | `fortune` | ASCII box with a random developer quote and author | |
| 4.6 | `fortune` (run twice) | Different quote each time (random) | |
| 4.7 | `?` | Box with 5 keyboard shortcuts listed (arrows, Tab, Enter, Ctrl+C, Ctrl+L, Konami) | |
| 4.8 | `matrix` | Green character rain animation starts; stops after ~5 seconds | |
| 4.9 | `matrix`, then `Ctrl+C` | Rain stops immediately | |
| 4.10 | `konami` | ASCII "DUFELL" art banner + cheat code message | |

### 4b. Konami Easter Egg (keyboard)

| # | Test | Expected | Pass? |
|---|------|----------|-------|
| 4.11 | With focus on the page (not in terminal input), press: `↑ ↑ ↓ ↓ ← → ← → b a` | Terminal injects and runs the `konami` command automatically | |
| 4.12 | Partial sequence (e.g. only `↑ ↑ ↓`), then pause | Buffer resets gracefully; nothing happens | |

### 4c. Docker-backed commands (requires server + Docker)

| # | Command | Expected | Pass? |
|---|---------|----------|-------|
| 4.13 | `ls` | Docker container lists `/home/guest` files | |
| 4.14 | `cat about-me.md` | Prints bio content | |
| 4.15 | `python3 -c "print('hello')"` | Returns `hello` | |
| 4.16 | `gcc --version` | Returns GCC version string | |
| 4.17 | `top` | Streams real-time CPU/mem stats; `Ctrl+C` stops it | |
| 4.18 | `visualize bubble` | Launches bubble sort visualization in C | |
| 4.19 | `visualize life` | Conway's Game of Life starts | |
| 4.20 | `challenge` | Starts the CTF coding challenge | |

---

## 5. Navigation — All Pages

| # | Route | Expected | Pass? |
|---|-------|----------|-------|
| 5.1 | Click **Projects** button | Navigates to `/projects`; shows project cards | |
| 5.2 | Click **Blog** button | Navigates to `/blog`; shows post cards | |
| 5.3 | Click a blog card | Navigates to `/blog/[slug]`; full article renders with reading time, tags, back button | |
| 5.4 | `/blog/this-slug-does-not-exist` | Returns 404 page (not a crash) | |
| 5.5 | Click **About this portfolio** | Navigates to `/about`; content loads | |
| 5.6 | Click `/uses` link in panel footer | Navigates to `/uses`; tools/hardware grid renders | |
| 5.7 | Check `/uses` hardware section | Should show: ThinkPad T14, Acer KG271U, Ultimate Hacking Keyboard, MX Master 3 | |
| 5.8 | Browser back button from any page | Returns to home correctly | |

---

## 6. SEO & Metadata

Open DevTools → Elements and check `<head>` on each page:

| # | Page | Expected `<title>` | Pass? |
|---|------|--------------------|-------|
| 6.1 | `/` | Contains owner name | |
| 6.2 | `/blog` | Contains "Blog" | |
| 6.3 | `/blog/[slug]` | Contains article title | |
| 6.4 | `/projects` | Contains "Projects" | |
| 6.5 | `/about` | Contains "About" | |
| 6.6 | `/uses` | "Uses — Luna Lancuba" | |

---

## 7. Animations & Transitions

| # | Test | Expected | Pass? |
|---|------|----------|-------|
| 7.1 | Page first load | Panel and terminal fade in from below (staggered `opacity: 0 → 1, y: 20 → 0`) | |
| 7.2 | Click any nav button (Projects, Blog, About) | Scale-up animation on tap/click | |
| 7.3 | Hover over footer social icons (GitHub, LinkedIn, Mail) | Background lightens slightly | |
| 7.4 | Hover over Download CV button | Slight scale + white overlay shimmer | |
| 7.5 | Hover over `/uses` link | Text darkens from zinc-400 to zinc-700 | |

---

## 8. Quick-Action Buttons (GUI Terminal Injection)

| # | Test | Expected | Pass? |
|---|------|----------|-------|
| 8.1 | Click any quick-action button below the terminal | Command appears in terminal typewriter-style, then executes | |
| 8.2 | Verify button colors match nav buttons (Projects = amber, Blog = rose, About = indigo) | Colors match | |

---

## 9. Edge Cases & Robustness

| # | Test | Expected | Pass? |
|---|------|----------|-------|
| 9.1 | Type a completely unknown command (e.g. `foobar`) | Backend returns error or "command not found" | |
| 9.2 | Spam Enter rapidly | No duplicate commands or broken state | |
| 9.3 | Type a very long string (200+ chars) | Input doesn't break layout; wraps or scrolls | |
| 9.4 | Navigate to a non-existent page (`/xyz`) | 404 page renders (no crash) | |
| 9.5 | Open with server DOWN (Docker not running) | Terminal shows "Connection Error: ..." gracefully | |
| 9.6 | Run `matrix` and navigate to `/projects` and back | No memory leak / stale animation on return | |
| 9.7 | `/api/visitors` endpoint directly via `fetch` | Returns `{ count: N }` JSON | |

---

## 10. Known Non-Issues (ignore these)

These are pre-existing lint warnings in `RootResumeTerminal.tsx` — not new bugs:

- `useEffect` missing `API_URL` dependency (line ~266)
- Unused `err`, `e`, `error` catch variables
- `any` type on challenge command list

---

## Summary Checklist

After running all sections, confirm:

- [ ] All section 1 tests pass (panel, hover animations, visitor counter)
- [ ] All section 3 tests pass (CRT mode)
- [ ] All client-side terminal commands work (section 4a–4b)
- [ ] All pages load and link correctly (section 5)
- [ ] `/uses` shows correct hardware (T14, Acer KG271U, UHK, MX Master 3)
- [ ] No new crash or console error introduced in this branch
