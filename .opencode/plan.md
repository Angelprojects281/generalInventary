# Plan: selector de temas con variantes de color (10 temas)

## Objetivo
Sustituir el alterna claro/oscuro por un selector de **10 temas** (claro, oscuro, y verde/morado/naranja/rosa en versión clara y oscura), persistido en `localStorage` y aplicado con `data-theme` en `<html>`. Solo frontend, sin dependencias nuevas.

## Contexto (hallazgos)
- El tema vive en `document.documentElement.dataset.theme` (hoy `light`/`dark`).
- `frontend/index.html` lee `localStorage["inventario-theme"]` y solo aplica si es `"dark"` → migrar `light`→`claro`, `dark`→`oscuro` y validar contra la lista nueva.
- `frontend/src/styles/styles.css`: `:root` = paleta base clara (1-28), `:root[data-theme="dark"]` = paleta base oscura (30-54). Acento actual: `--color-accent`, `--color-accent-hover`, `--color-accent-soft`, `--color-accent-fade` (+ `--color-action`, `--color-button`). `.themeToggle` en 361-398; media query responsive ~918 (las media queries van al final del bloque).
- `frontend/src/App.tsx` (112-153): `type Theme = "light" | "dark"`, botón fijo `.themeToggle` en `.appToggles`.
- `frontend/src/visual/vantaBackground.tsx`: lee `dataset.theme`, se repinta con `MutationObserver` sobre `data-theme`; paletas `THEME_LIGHT`/`THEME_DARK`.
- `frontend/src/i18n.tsx`: `Record<string,string>` es→en; claves `"Cambiar a tema"`, `claro`, `oscuro` (61-63).
- ESLint `react-hooks`: efectos con todas las dependencias en el array.

## Decisiones abiertas
1. **Ids de tema (recomendado)**: sufijo `-oscuro` en español, coherente con `oscuro` y legible en `localStorage`/`data-theme`:
   `claro`, `oscuro`, `verde`, `verde-oscuro`, `morado`, `morado-oscuro`, `naranja`, `naranja-oscuro`, `rosa`, `rosa-oscuro`.
   Alternativas descartadas: `verde-dark` (mezcla idiomas), `oscuro-verde` (ordena al revés que el concepto "color + fondo").
2. **UI**: popover con botones-círculo bajo el `.themeToggle` (confirmado). Opcional: agrupar en dos filas (claros / oscuros); si no, lista plana de 10. *Recomiendo lista plana por brevedad.*
3. **Estructura CSS sin duplicar paletas**: la paleta base se define una sola vez por modo y se reutiliza con selectores compuestos (ver Pasos).

## Dependencias
Ninguna.

## Pasos de implementación
1. **`frontend/index.html`** — validar y migrar el valor guardado:
   - Si es `light`→`claro` o `dark`→`oscuro`, reescribir el storage; si está en la lista de 10, aplicar `dataset.theme`; cualquier otro valor → no aplicar (default claro).
2. **`frontend/src/styles/styles.css`** — reestructurar sin duplicar:
   - **Paleta base oscura una sola vez**: cambiar el selector del bloque existente a `:root[data-theme="dark"], :root[data-theme="oscuro"], :root[data-theme$="-oscuro"]` (selector list + un bloque; el segundo término cubre el id `oscuro`, que el sufijo `$="-oscuro"` solo no alcanza). Así `oscuro` y `verde-oscuro`, etc., heredan la base oscura y su `color-scheme`.
   - **Paleta base clara**: sin cambios; `:root` ya se aplica cuando `data-theme` es `claro` u otro id claro (los bloques de acento solo pisan variables de acento).
   - **8 bloques de variante color** (uno por variante), tras el bloque oscuro, cada uno solo con las variables de acento, `--color-action` coherente y `--color-button`/`--color-button-hover` en la familia de su acento:
     `:root[data-theme="verde"]`, `:root[data-theme="verde-oscuro"]`, `:root[data-theme="morado"]`, `:root[data-theme="morado-oscuro"]`, `:root[data-theme="naranja"]`, `:root[data-theme="naranja-oscuro"]`, `:root[data-theme="rosa"]`, `:root[data-theme="rosa-oscuro"]`.
     - Valores propuestos (acento claro = tono medio; oscuro = tono claro para contraste sobre fondo oscuro):
       | color | claro (`accent` / `hover`) | oscuro (`accent` / `hover`) |
       |---|---|---|
       | verde | `#2f8f5b` / `#25734a` | `#5fd39a` / `#7fe0b1` |
       | morado | `#7c4dcc` / `#653cae` | `#a982f0` / `#bd9df6` |
       | naranja | `#d4712f` / `#b35d25` | `#f5a05f` / `#ffb680` |
       | rosa | `#d44f86` / `#b23f70` | `#ff8fb5` / `#ffa8c6` |
     - Cada bloque: `--color-accent`, `--color-accent-hover`, `--color-accent-soft` (`rgb(... / 10%)` claro, `/ 14%` oscuro, como los actuales), `--color-accent-fade` (`rgb(... / 0%)`) y `--color-action` (misma familia que el acento), **más `--color-button` y `--color-button-hover`** en la familia del acento de esa variante.
      - Hoy las variantes heredan de la base los valores `--color-button`: claro `#1f2733` / `#11151c` (neutro oscuro) y oscuro `#2c4d9e` / `#3860bf` (azul) — este último es el azul discordante en botones primarios y en los degradados `heroArtCore` y `accountMonogram` que hay que armonizar.
      - **Regla por modo** (misma relación que los valores azules actuales):
        - *Claro*: `--color-button` = tono **más oscuro y saturado** que el acento (por debajo de `--color-accent-hover`, lo bastante oscuro para que `--color-button-text: #ffffff` siga siendo legible); `--color-button-hover` = **un paso más oscuro** que `--color-button` (igual relación que `accent-hover` respecto a `accent`).
        - *Oscuro*: `--color-button` = versión **más profunda/saturada (más oscura)** que el acento claro (como `#2c4d9e` lo es de `#6f9bff`); `--color-button-hover` = **más intenso/claro** que `--color-button` pero aún más oscuro que el acento (como `#3860bf` entre `#2c4d9e` y `#6f9bff`).
      - Valores propuestos de botón (a afinar visualmente si hace falta):
        | color | claro (`button` / `hover`) | oscuro (`button` / `hover`) |
        |---|---|---|
        | verde | `#1e6b44` / `#155333` | `#1f7a4d` / `#2a9a64` |
        | morado | `#4d2d8e` / `#3d2473` | `#5636ad` / `#6a48c9` |
        | naranja | `#8f4a1b` / `#733b15` | `#b05f1e` / `#cc7433` |
        | rosa | `#8c3159` / `#6f2747` | `#b83a6f` / `#d4508a` |
      - `--color-button-text` **no se toca** (queda `#ffffff` de la base y los tonos propuestos lo mantienen legible). Los bloques claros al cambiarán del neutro `#1f2733` al tono de su acento; los oscuros, del azul `#2c4d9e` al tono de su acento.
   - **CSS del popover** `.themeMenu`: panel absoluto bajo `.themeToggle`, `background: var(--color-surface)`, borde `--color-border`, `border-radius: var(--radius-card)`, fila de botones-círculo de 26-28px con `background: <accent del tema>` (var local por elemento, p. ej. clases `.swatch--verde`...) o `aria-pressed` marcado. Estado abierto del botón (`.themeToggle[aria-expanded="true"]`). **Media queries al final del bloque** existente (~918) si hace falta ajuste móvil.
3. **`frontend/src/App.tsx`** — selector de 10 temas:
   - `type Theme = "claro" | "oscuro" | "verde" | "verde-oscuro" | ... | "rosa-oscuro"` y constante `THEMES: { id: Theme; swatch: string; labelKey: string }[]` (10 entradas; `swatch` = color hex para el círculo de la UI).
   - Estado inicial: leer `dataset.theme`, normalizar (`light`→`claro`, `dark`→`oscuro`, desconocido→`claro`).
   - `selectTheme(id)`: fija `dataset.theme`, `setTheme(id)` y `localStorage.setItem("inventario-theme", id)` dentro del `try/catch` actual (quita `toggleTheme`).
   - El botón `.themeToggle` pasa a `aria-expanded`/`aria-controls` y alterna el popover; el menú lista los 10 temas como botones-círculo con `aria-pressed`/`aria-current`, cierra al elegir y al pulsar fuera (`useEffect` con listener `pointerdown` y limpieza en el return — reglas `react-hooks`).
4. **`frontend/src/i18n.tsx`** — claves nuevas junto a las existentes: `"Tema"`, `"Elegir tema"` (en: "Choose theme"), `verde`→green, `morado`→purple, `naranja`→orange, `rosa`→pink. Para los oscuros: usar la misma clave de color (el nombre del tema puede repetirse en el menú agrupado) **o** clave nueva `"verde oscuro"`→"dark green" (y análogos); recomiendo `"X oscuro"` para distinguir en el menú.
5. **`frontend/src/visual/vantaBackground.tsx`** — mapa de paletas por id:
   - `readTheme()` devuelve `dataset.theme` normalizado a los 10 ids.
   - `PALETTAS: Record<Theme, { color: number; backgroundColor: number }>`:
     - `claro` → `THEME_LIGHT` actual; `oscuro` → `THEME_DARK` actual.
     - variantes claras → `backgroundColor: 0xf3f5f9` + `color` = acento hex del tema (`verde` 0x2f8f5b, `morado` 0x7c4dcc, `naranja` 0xd4712f, `rosa` 0xd44f86).
     - variantes oscuras → `backgroundColor: 0x12161d` + acento claro (0x5fd39a, 0xa982f0, 0xf5a05f, 0xff8fb5).
   - El `MutationObserver` existente ya repinta al cambiar `data-theme`; `useState` ampliado al nuevo tipo.

## Criterios de aceptación y pruebas
- En `frontend/`: `npm run lint` y `npm run build` sin errores.
- Manual: al cargar aplica el default claro; los 10 temas cambian acento/fondo al instante y la malla Vanta se reconstruye con la paleta correcta; recargar conserva el tema; migración: valor guardado `dark`→`oscuro`, `light`→`claro`; valores desconocidos no rompen; el popover muestra 10 botones, marca el activo, cierra al elegir y al pulsar fuera; es/en traduce nombres; contraste legible en cada variante; **en cada variante color, los botones primarios y los degradados `heroArtCore`/`accountMonogram` usan el tono del acento de esa variante (sin azul discordante) y el texto blanco del botón sigue legible, incluido el hover**; responsive sin desbordes.

## Fuera de alcance
Backend, base de datos, dependencias nuevas, rutas/paneles, variantes oscuras adicionales fuera de los 4 colores, tests automatizados.
