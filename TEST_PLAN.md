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

- [ ] **1.1** Open `localhost:3000` en desktop (≥1024px) → Panel izquierdo + terminal derecho, sin overflow
- [ ] **1.2** Abrir en mobile / DevTools 375px → Solo panel visible, botón de terminal en bottom-right
- [ ] **1.3** Avatar circular con punto verde "online" en esquina inferior derecha
- [ ] **1.4** Hover en avatar → Escala + tilt + glow indigo
- [ ] **1.5** Sacar mouse del avatar → Vuelve a posición original con spring
- [ ] **1.6** Hover en el nombre → Cada letra salta en ola escalonada y se pone indigo
- [ ] **1.7** Sacar mouse del nombre → Letras bajan y vuelven al color oscuro
- [ ] **1.8** Tres botones visibles (Projects, Blog, About this portfolio) con gradientes amber, rose, indigo
- [ ] **1.9** Footer: íconos GitHub, LinkedIn, Mail + botón Download CV + link `/uses`
- [ ] **1.10** Contador de visitas visible en el footer (ej: "1 visit")
- [ ] **1.11** Refrescar la página → El contador NO incrementa (cookie 24h)
- [ ] **1.12** Abrir en incógnito → El contador incrementa en 1

---

## 2. Terminal — Basic Behavior

- [ ] **2.1** Terminal carga en desktop → Panel negro a la derecha con boot message + hint CTF + "Type 'help'"
- [ ] **2.2** Click en cualquier parte del terminal → El input recibe foco
- [ ] **2.3** Escribir `help` + Enter → Lista todos los comandos disponibles
- [ ] **2.4** Verificar que `?` aparece en la salida de `help`
- [ ] **2.5** Escribir `clear` + Enter → Historial se borra, prompt queda
- [ ] **2.6** Escribir comandos, luego presionar `↑` → Cicla por el historial
- [ ] **2.7** Luego de ciclar, presionar `↓` → Vuelve al input vacío
- [ ] **2.8** Escribir `vis` + Tab → Autocompleta a `visualize `
- [ ] **2.9** Presionar `Ctrl+L` → Terminal se borra (igual que `clear`)
- [ ] **2.10** Mobile: tocar el botón de terminal → Drawer sube a 75vh
- [ ] **2.11** Mobile: tocar el botón ✕ → Terminal se cierra

---

## 3. Terminal — CRT Mode Toggle

- [ ] **3.1** Ícono de TV visible en la barra del terminal (top-right)
- [ ] **3.2** Click en CRT toggle → Barra se vuelve casi negra, texto verde, overlay de scanlines horizontal
- [ ] **3.3** En CRT mode, escribir cualquier comando → Output y prompt son verde fosforescente
- [ ] **3.4** En CRT mode, triggerear un error (comando inválido) → Texto de error sigue siendo rojo
- [ ] **3.5** Click en CRT toggle de nuevo → Vuelve al tema oscuro por defecto
- [ ] **3.6** Botón CRT aparece con fondo verde tenue cuando está activo

---

## 4. Terminal — All Commands

### 4a. Comandos client-side

- [ ] **4.1** `about` → Logo ASCII "R" con tabla de info del sistema
- [ ] **4.2** `whoami` → Devuelve el username actual (`guest`)
- [ ] **4.3** `ls projects` → Lista proyectos con nombre, tech stack y año
- [ ] **4.4** `skills` → Bar chart ASCII agrupado por categoría
- [ ] **4.5** `fortune` → Box ASCII con quote de dev + autor
- [ ] **4.6** `fortune` dos veces → Quote diferente cada vez
- [ ] **4.7** `?` → Box con shortcuts: flechas, Tab, Enter, Ctrl+C, Ctrl+L, Konami
- [ ] **4.8** `matrix` → Lluvia de caracteres verde; para solo después de ~5 segundos
- [ ] **4.9** `matrix` + `Ctrl+C` → La lluvia se corta inmediatamente
- [ ] **4.10** `konami` → Banner ASCII que dice "KONAMI" + mensaje del cheat code

### 4b. Konami Easter Egg (teclado)

- [ ] **4.11** Con foco en la página (no en el input del terminal), presionar `↑ ↑ ↓ ↓ ← → ← → b a` → El terminal inyecta y ejecuta `konami` automáticamente
- [ ] **4.12** Secuencia parcial (ej: solo `↑ ↑ ↓`) y parar → Buffer se resetea, nada pasa

### 4c. Comandos con Docker (requiere server + Docker)

- [ ] **4.13** `ls` → Lista archivos en `/home/guest` del container
- [ ] **4.14** `cat about-me.md` → Imprime el bio
- [ ] **4.15** `python3 -c "print('hello')"` → Devuelve `hello`
- [ ] **4.16** `gcc --version` → Devuelve versión de GCC
- [ ] **4.17** `top` → Streamea stats de CPU/mem en tiempo real; `Ctrl+C` lo detiene
- [ ] **4.18** `visualize bubble` → Lanza visualización de bubble sort en C
- [ ] **4.19** `visualize life` → Conway's Game of Life arranca
- [ ] **4.20** `challenge` → Inicia el CTF coding challenge

---

## 5. Navigation — All Pages

- [ ] **5.1** Click **Projects** → Navega a `/projects`, muestra las cards de proyectos
- [ ] **5.2** Click **Blog** → Navega a `/blog`, muestra las cards de posts
- [ ] **5.3** Click en una card de blog → Navega a `/blog/[slug]`, artículo completo con tiempo de lectura, tags y botón back
- [ ] **5.4** Ir a `/blog/este-slug-no-existe` → Renderiza 404 (no crash)
- [ ] **5.5** Click **About this portfolio** → Navega a `/about`, carga el contenido
- [ ] **5.6** Click `/uses` en el footer del panel → Navega a `/uses`, grilla de herramientas renderizada
- [ ] **5.7** Sección Hardware de `/uses` muestra: ThinkPad T14, Acer KG271U, Ultimate Hacking Keyboard, MX Master 3
- [ ] **5.8** Botón back del browser desde cualquier página → Vuelve al home correctamente

---

## 6. SEO & Metadata

Abrir DevTools → Elements y revisar `<head>` en cada página:

- [ ] **6.1** `/` → Title contiene el nombre de la owner
- [ ] **6.2** `/blog` → Title contiene "Blog"
- [ ] **6.3** `/blog/[slug]` → Title contiene el título del artículo
- [ ] **6.4** `/projects` → Title contiene "Projects"
- [ ] **6.5** `/about` → Title contiene "About"
- [ ] **6.6** `/uses` → Title es "Uses — Luna Lancuba"

---

## 7. Animations & Transitions

- [ ] **7.1** Primer carga de página → Panel y terminal hacen fade-in desde abajo (opacity 0→1, y 20→0)
- [ ] **7.2** Click en botón de nav (Projects, Blog, About) → Animación de scale en tap/click
- [ ] **7.3** Hover en íconos sociales del footer → Fondo se aclara levemente
- [ ] **7.4** Hover en botón Download CV → Leve scale + shimmer blanco
- [ ] **7.5** Hover en link `/uses` → Texto se oscurece de zinc-400 a zinc-700

---

## 8. Quick-Action Buttons

- [ ] **8.1** Click en cualquier quick-action button debajo del terminal → Comando aparece en el terminal estilo typewriter y se ejecuta
- [ ] **8.2** Colores de botones coinciden con los botones de nav (Projects = amber, Blog = rose, About = indigo)

---

## 9. Edge Cases & Robustness

- [ ] **9.1** Comando desconocido (ej: `foobar`) → Backend devuelve error o "command not found"
- [ ] **9.2** Spam de Enter rapidamente → No hay comandos duplicados ni estado roto
- [ ] **9.3** Escribir string muy largo (200+ chars) → Input no rompe el layout
- [ ] **9.4** Navegar a página inexistente (`/xyz`) → Renderiza 404, no crash
- [ ] **9.5** Abrir con el server DOWN (Docker no corriendo) → Terminal muestra "Connection Error: ..." gracefully
- [ ] **9.6** Correr `matrix` y navegar a `/projects` y volver → Sin animación residual
- [ ] **9.7** Llamar `/api/visitors` directo → Devuelve JSON `{ count: N }`

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
