# skills.sgomez.dev — la revista de Claude Skills

Fecha: 2026-09-28 · Estado: pendiente de revisión · Autor: Santiago Gómez de la Torre

## 1. Qué es y para quién

Una web pública para el repo `claude-skills` que presenta **todas** las skills del repo
(327 comandos de `skills/` y 151 skills externas de `external/`, 478 en total) como una
revista: portada, índice, secciones, reportajes y recetas.

- **Público principal: creadores y comunidad.** Mucha gente no ha abierto nunca una
  terminal. La web tiene que funcionar primero como espectáculo y después como catálogo.
- **Conversión: onboarding guiado.** La persona ve una demo, piensa "quiero eso" y llega a
  una ruta que la lleva de cero al primer resultado.
- **Alcance temático: todo el repo**, no solo video. El video es la sección más vistosa,
  pero comparte el índice con legal, ventas, finanzas, IA, código, etc.
- **Idiomas: ES y EN** con el mismo peso.
- **Nivel de acabado:** una web que merezca la pena visitar por sí misma, con craft de
  estudio y no con aspecto de plantilla.

### Criterios de éxito

1. Cualquier skill pública del repo tiene su página en ES y EN, se encuentra en Google y
   un LLM la puede citar.
2. Una persona sin experiencia previa sigue `/empieza` y obtiene su primer resultado sin
   salir de la web para buscar ayuda.
3. Mobile (Moto G Power, 4G lento en Lighthouse) en portada, sección y ficha: LCP < 2,5 s,
   CLS < 0,05, INP < 200 ms, Lighthouse SEO = 100 y Accesibilidad ≥ 95.
4. El catálogo no puede quedar desactualizado: sale del repo en cada build.
5. Ninguna skill de `sources.local.txt` aparece en ningún artefacto publicado.

### Fuera de alcance

Cuentas de usuario, comentarios, CMS, envío de skills por terceros, monetización y
analítica con cookies. La analítica será Cloudflare Web Analytics, que no usa cookies ni
requiere banner.

## 2. Dirección visual: la revista nocturna

Se eligió en el companion visual: la estructura de revista de la opción B con el estilo
creator de la opción C, sobre fondo oscuro. El mockup está en
`.superpowers/brainstorm/*/content/fusion-b-c-v2.html` (variante "noche").

- **Tipografía:** Bricolage Grotesque 800 para titulares (tracking −0,035 em), Instrument
  Serif en itálica solo en palabras de acento ("Letra *pequeña*") y JetBrains Mono para
  metadatos, números de sección y comandos. Todas se autoalojan con `next/font`, en el
  subset latin y latin-ext por los acentos del español. Solo se precarga Bricolage.
- **Color (tokens):** fondo `#0d0d0f`, tinta `#f4eee4`, ácido `#c6ff3d`, rosa `#ff5ea8`,
  cian `#2af5ff`, amarillo `#ffd23d` y el terracota de marca `#D97757` para la firma.
  Cada sección tiene un color de acento. Todo par de texto sobre fondo cumple WCAG AA; un
  test lo verifica sobre los tokens.
- **Recursos de revista:** cabecera con número y fecha, "En este número", índice numerado
  (01, 02…), stickers rotados con sombra dura y titulares de sección con juego de palabras.
- **Claim:** "Nadie lo sabe *todo.* Tu agente, ahora sí." / "Nobody knows *everything.*
  Your agent, now it does." Es la respuesta al tagline actual del README.

## 3. Arquitectura

```
repo/
├── skills/  external/  pipelines/          ← fuente de verdad (ya existe)
└── site/                                   ← nuevo
    ├── scripts/build-catalog.ts            ← repo → catalog.json
    ├── scripts/translations.ts             ← lista de trabajo y validación (sin API)
    ├── content/
    │   ├── sections.ts                     ← 9 secciones y mapeo de categorías
    │   ├── {es,en}/sections/*.mdx          ← titular, entradilla, reportaje
    │   ├── {es,en}/recipes/*.mdx           ← recetas del onboarding
    │   ├── i18n/skills/*.json              ← traducciones cacheadas (hash del original)
    │   └── demos/*.json                    ← metadatos y procedencia de cada demo
    ├── src/app/[lang]/…                    ← rutas (App Router)
    └── src/components/…
```

- **Stack:** Next.js 16 (App Router, React Server Components), TypeScript estricto,
  Tailwind CSS v4, Motion (framer-motion) para UI y transiciones, GSAP + ScrollTrigger con
  `@gsap/react` para la coreografía de scroll.
- **Render:** todas las rutas son estáticas (`generateStaticParams`,
  `dynamicParams = false`), así que crawlers y LLM reciben el HTML completo.
- **Hosting:** Cloudflare Workers con `@opennextjs/cloudflare`. El middleware solo actúa en
  `/`: redirige a `/es` o `/en` según `Accept-Language`, con `/en` por defecto. No redirige
  ninguna otra ruta, para que ningún crawler acabe en un bucle ni en una versión que no
  pidió.
- **Media:** los videos de demo van en el bucket de R2 `skills-media`, servido desde
  `media.skills.sgomez.dev`. Nunca se versionan en git.
- **Dominio:** `skills.sgomez.dev`. Se asume que la zona `sgomez.dev` está en Cloudflare.
- **Mismo repo:** si alguien añade una skill, la web la publica en el siguiente despliegue
  sin tocar `site/`.

### 3.1 Pipeline del catálogo (`build-catalog.ts`)

Entradas y lo que se extrae de cada una:

| Fuente | Qué se extrae |
|---|---|
| `skills/<cat>/<name>.md` | `description`, `permissions` (reads, writes, commands, network, destructive), categoría y nombre de invocación `<cat>--<name>` |
| `external/<name>/SKILL.md` | `name`, `description` (con parser YAML real, porque hay escalares multilínea `>` y `\|`) |
| `external/<name>/UPSTREAM.md` | repo, commit y fecha |
| `external/<name>/LICENSE` | SPDX detectado (MIT, Apache-2.0, CC-BY-4.0…) |
| `external/sources.txt` | agrupación por upstream (los comentarios del bloque dan el autor) |
| `pipelines/*.yaml` | nombre, pasos y skills que encadena |
| `git log` | fecha de la última modificación de cada fichero, para "Actualizado el…" |

Salida: `site/.generated/catalog.json`, validado con un esquema zod. **El build falla**
en estos casos:

- Una skill no tiene `description`.
- Una externa no tiene `LICENSE`.
- Una externa no está asignada a ninguna sección en `sections.ts` (obliga a decidir su
  sección, en vez de dejarla en "otros").
- En la salida aparece cualquier nombre de `external/sources.local.txt`, de `external/.local/`
  o de cualquier ruta bajo `.local`. El script **no lee** esas rutas; esta comprobación es
  un cinturón de seguridad por si lo hiciera.

### 3.2 Traducción: se hace en Claude Code, sin API

**Restricción dura: cero llamadas a la API de Anthropic ni a ningún servicio de pago.**
Ni en el código, ni en scripts, ni en CI. No hay SDK de Anthropic entre las dependencias
ni se usa `ANTHROPIC_API_KEY`.

Las descripciones originales están en inglés. El trabajo se reparte así:

1. `site/scripts/translations.ts plan` compara el catálogo con la caché
   `content/i18n/skills/<slug>.json` y escribe `.generated/translation-worklist.json` con
   las entradas que faltan o cuyo `sourceHash` ya no coincide con la descripción actual.
2. **Una sesión de Claude Code**, o sus subagentes por lotes, lee la lista de trabajo y
   escribe cada JSON con este formato:
   `{ sourceHash, es: { description, howToAsk[3] }, en: { howToAsk[3] } }`.
   Los prompts "cómo pedírselo" se escriben en el mismo paso. Es trabajo de desarrollo
   hecho con la suscripción de Claude Code, no una llamada en runtime.
3. `site/scripts/translations.ts check` valida el esquema y el hash de cada fichero. Se
   ejecuta en CI.

La caché se versiona en git. El build **nunca** traduce: si una entrada falta o está
desactualizada, ese bloque cae al inglés con `lang="en"`, y `check` lo lista como aviso,
no como error. Las fichas de las skills del escaparate se revisan a mano.

### 3.3 Secciones

Las 32 categorías y las externas se agrupan en 9 secciones. Las externas se asignan por upstream, con excepciones por skill explícitas en `sections.ts`:

| # | Sección | Categorías de `skills/` | Externas (por upstream) |
|---|---|---|---|
| 01 | Video & Motion | — (más `content--video-script`, `docs--video-spec`, `scaffold--remotion`, `scaffold--create-video`, `utils--ffmpeg`) | hyperframes (heygen), video toolkit (digitalsamba), student kit, `remotion-motion-graphics`, `shorts`, `video-use`, `manim-video`, `higgsfield-video-explainer` |
| 02 | Web & Diseño | web, accessibility | emilkowalski, taste-skill, ui-ux-pro-max, impeccable, design-motion-principles, gsap-skills, scroll-world, webkit (building-components, web-design-guidelines, vercel-react-best-practices, vercel-deploy) |
| 03 | Marca & Contenido | content, i18n | brand, banner-design, slides, brandkit, banana, higgsfield (todas salvo `higgsfield-video-explainer`), humanizer |
| 04 | Ads & Redes | marketing | claude-ads, instagram (ig-*) |
| 05 | Ventas | sales, ecommerce | — |
| 06 | Negocio | legal, finance, product | — |
| 07 | IA & Agentes | ai, ml, meta | agent-reach, deep-research |
| 08 | Datos | data, database | web-reader |
| 09 | Código | api, automation, cloud, code-quality, debugging, devops, docs, fullstack, git, mobile, networking, observability, performance, scaffold, security, testing, utils | agent-browser, playwright-cli, chrome-bridge-automation, seo-audit, write-swift |

La lista de comandos que cambian de sección (fila 01) vive en `sections.ts` como
excepción explícita.

## 4. Páginas

La URL de cada ficha es el nombre de invocación de la skill: se ve la URL y se sabe qué
escribir. Los nombres ya son únicos entre comandos y externas (`utils--ffmpeg` frente a
`ffmpeg`).

| Ruta | Contenido |
|---|---|
| `/{es,en}` | **Portada.** Cabecera de revista, claim y un reel de demos que rota por sección cada 6 s (se pausa en hover, en focus y con reduced-motion). Después: "En este número" con 4 reportajes, índice de las 9 secciones con su recuento, franja de datos (478 skills · permisos declarados al 100 % · 4 plataformas · actualizado el …), CTA a `/empieza` y FAQ. |
| `/{lang}/[seccion]` | **Sección.** Número y titular con juego de palabras, entradilla, reportaje de la skill estrella con su demo y rejilla completa con filtros (categoría, propia o externa, "tiene demo", "usa red") sin recargar la página. |
| `/{lang}/s/[invocacion]` | **Ficha.** Primero la respuesta directa ("`/legal--contract-review` es una skill de Claude Code que…"), luego la demo si existe, "cómo pedírselo" (3 prompts copiables), instalación en una línea (con pestañas Claude Code, Cursor, Windsurf y Codex), el **manifiesto de permisos** como iconografía (lee, escribe, ejecuta, red, destructivo), procedencia en las externas (autor, licencia, repo, commit) y 6 skills relacionadas de la misma sección. |
| `/{lang}/empieza` | **Onboarding.** Ver §5.2. |
| `/{lang}/recetas/[slug]` | **Receta.** Pasos numerados con el output real de cada uno. Los 7 pipelines del repo también se publican como recetas. |
| `/{lang}/creditos` | **Créditos.** Todos los upstream con autor, licencia y skills aportadas. |
| `/{lang}/[…].md` | **Gemela en Markdown** de cada ruta anterior, para LLM. |

**Buscador global (⌘K / Ctrl+K, y un botón en móvil):** búsqueda difusa en cliente
(`fuse.js` o similar) sobre un índice ligero con nombre, descripción en el idioma activo,
sección y alias. El índice se carga al abrir el buscador, nunca en la carga inicial.

## 5. Demos y onboarding

### 5.1 Demos: reales, con procedencia visible

**Regla de honestidad:** toda demo es output real de la skill. Cada una declara en
`content/demos/<invocacion>.json` qué skill la generó, el commit de esa skill, el prompt
exacto, la fecha y si hubo retoque a mano (`edited: true` más una línea explicando qué se
tocó). La UI lo muestra como sello: "Hecho con `/short-form-edit` · commit `ec112ff` ·
sin retoques". Nunca se usan skills de `sources.local.txt` para una demo pública.

Hay tres tipos de demo, según la naturaleza de la skill:

1. **Video (Video & Motion).** Render real con las skills de HyperFrames o Remotion. Se
   entrega en MP4 H.264 más WebM AV1, con póster AVIF, alojado en R2 y en 9:16 o 16:9 según
   el caso. Se reproduce en silencio y en bucle solo cuando está en viewport
   (IntersectionObserver) y se descarga con `preload="none"` hasta entonces. Incluye un
   comparador antes/después (material en bruto frente a resultado) con un deslizador.
2. **Viva (Web & Diseño).** Un componente React escrito por la skill, que se ejecuta en la
   propia página, por ejemplo un efecto de `/web--gsap-text-fx`. Se carga con
   `next/dynamic` al entrar en viewport. Si el código se adaptó para encajar en la página,
   `edited: true`.
3. **Replay de sesión (todas las demás: legal, ventas, finanzas, IA, código…).** Una sesión
   real de Claude Code grabada: prompt, pasos clave (herramientas usadas, ficheros leídos) y
   el artefacto final (un informe de contrato, una secuencia de emails, un modelo de
   runway) presentado como "documento" de revista. Se anima como una reproducción con
   barra de progreso que se puede arrastrar y respeta reduced-motion. Los datos se guardan
   como JSON en `content/demos/`, curados desde el transcript real: solo se recortan pasos,
   nunca se añade contenido que la sesión no produjo.

Las skills sin demo no muestran nada falso. Su ficha enseña "cómo pedírselo" y un sello
discreto de "Demo en camino".

**Escaparate de lanzamiento (12 demos):**

| Tipo | Skills |
|---|---|
| Video | `short-form-edit`, `embedded-captions`, `motion-graphics`, `shorts` |
| Viva | `web--gsap-text-fx`, `taste-skill`, `animate` |
| Replay | `legal--contract-review`, `sales--cold-outreach`, `finance--burn-runway`, `security--security-audit`, `ads-audit` |

### 5.2 Onboarding (`/empieza`)

1. **Qué necesitas, sin letra pequeña.** Claude Code requiere una suscripción de Claude
   (Pro o superior) o una clave de API: se dice claramente y se enlaza a los precios
   oficiales. Alternativas: Cursor, Windsurf o Codex.
2. **Instala Claude Code.** Pestañas por sistema operativo, con el tuyo preseleccionado por
   user agent. El comando se copia con un botón y debajo va lo que deberías ver si ha ido
   bien.
3. **Instala las skills.** Un comando (`install.sh` / `install.ps1`) y la comprobación.
4. **Tu primer comando.** Eliges tu camino: *Creo contenido*, *Tengo un negocio* o *Hago
   webs*. Cada camino termina en una receta con un resultado en menos de 10 minutos.
5. **Si algo falla.** Acordeón con los 6 errores más probables y su solución.

El progreso se guarda en `localStorage` (con try/catch) para retomar el paso. Todo el
contenido está en HTML, así que la página se lee y se indexa sin JavaScript.

## 6. Motion y rendimiento

- **Sistema de motion:** tokens de duración (120 / 200 / 320 / 600 ms) y curvas (entrada
  `cubic-bezier(.2,.8,.2,1)`, énfasis con spring), en un solo fichero `motion.ts`. Motion
  se usa para UI, layout y transiciones entre páginas (View Transitions API cuando esté
  disponible, con Motion como respaldo). GSAP con ScrollTrigger se reserva para la
  coreografía de la portada y de las cabeceras de sección.
- **Lo que se anima:** entrada de titulares por línea, stickers que "se pegan" con un
  rebote, contadores del índice, reel de portada y paso entre ficha y sección con el
  titular compartido. **Lo que no se anima:** el texto de lectura, la navegación y
  cualquier cosa que retrase el LCP.
- **`prefers-reduced-motion`:** todas las animaciones pasan a fundidos de opacidad o se
  anulan. El reel se detiene en el primer fotograma y los videos no se reproducen solos.
- **Presupuestos:** JS de primera carga ≤ 120 KB gzip en la portada. GSAP se importa de
  forma dinámica solo donde se usa. El LCP de la portada es el titular en texto, nunca una
  imagen ni un video. Las fuentes llevan `size-adjust` para CLS ≈ 0. Las imágenes son
  AVIF/WebP con tamaño declarado.
- **Scroll nativo.** Nada de smooth-scroll secuestrado, porque rompe la accesibilidad y el
  INP.

## 7. SEO y GEO

**SEO:**
- `generateMetadata` por ruta: título, descripción, canonical y `alternates.languages`
  (`es`, `en`, `x-default` → `en`).
- `sitemap.xml` con `lastmod` sacado de git, más `robots.txt`.
- OG image por ficha, sección y receta (1200×630, portada de revista con el titular),
  generada **en build** con `next/og`.
- JSON-LD (tipado con `schema-dts`):
  - `WebSite` con `SearchAction`
  - `Person`: **Santiago Gómez de la Torre**, `url` `https://sgomez.dev`
  - `SoftwareApplication` en cada ficha
  - `HowTo` en cada receta y en `/empieza`
  - `FAQPage` en la portada
  - `ItemList` en portada y secciones
  - `BreadcrumbList` en todas las páginas
- HTML semántico: un solo `h1` por página, jerarquía de encabezados correcta, `lang` por
  bloque y enlazado interno (relacionadas, sección y receta).

**GEO (citabilidad en LLM):**
- `/llms.txt` (índice por sección con enlaces a las gemelas `.md`) y `/llms-full.txt`
  (catálogo completo en texto), uno por idioma y enlazados entre sí.
- La gemela `.md` de cada página se genera desde el mismo dato que el HTML, así que no
  puede divergir.
- Cada ficha abre respondiendo directamente qué es la skill, con datos concretos y
  fechados ("Actualizada el 21 sep 2026", "lee `**/*`, no usa red").
- `robots.txt` permite explícitamente GPTBot, ClaudeBot, PerplexityBot, Google-Extended y
  similares. **La zona de Cloudflare debe tener desactivado el bloqueo de bots de IA (AI
  Crawl Control)**; si no, se anula todo el GEO sin que nadie se entere. Este punto va en
  el checklist de despliegue y se comprueba con un `curl` usando esos user agents.

## 8. Idiomas

- Rutas `/es/…` y `/en/…`, con los textos de UI en diccionarios `dictionaries/{es,en}.ts`
  tipados, de modo que falta una clave y el build falla.
- El selector de idioma lleva a la misma página en el otro idioma.
- El contenido editorial (secciones, reportajes, recetas) se escribe en los dos idiomas.
  Las descripciones de skills en ES salen de la caché de traducción, escrita en Claude Code (§3.2).

## 9. Verificación

La verificación distingue entre "está bien escrito" y "funciona". Lint, tipos y review no
cuentan como lo segundo.

- **Unitarios (Vitest):** el constructor del catálogo cubre las 478 entradas (con
  recuento exacto frente al repo), que ningún nombre privado se filtre, que cada externa
  tenga licencia, el mapeo de secciones completo, los escalares YAML multilínea y el
  contraste AA de los tokens.
- **E2E (Playwright), desktop y móvil:** cada tipo de ruta renderiza, el cambio de idioma
  conserva la página, ⌘K encuentra `contract-review` escribiendo "contrato", se respeta
  reduced-motion, cada gemela `.md` responde y el middleware redirige `/` según
  `Accept-Language`.
- **Lighthouse CI** en portada, una sección y una ficha, en mobile, con los umbrales de
  §1 (criterio 3). Si no se cumplen, el PR falla.
- **Enlaces y datos estructurados:** comprobador de enlaces internos y validación del
  JSON-LD de una muestra de páginas.
- **Pasada real antes de dar nada por terminado:** se abre la preview desplegada en el
  navegador y se recorre portada → sección → ficha → `/empieza` en móvil y desktop, con
  capturas. Si algo no se puede comprobar así, se dice.

## 10. CI y despliegue

- `.github/workflows/site.yml`:
  - En PR que toque `site/`, `skills/`, `external/` o `pipelines/`: build, tests y
    `wrangler versions upload`, que da una URL de preview comentada en el PR.
  - En `main`: despliegue a producción.
- Secretos: `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`. La subida de medios a R2 es
  un script local (`site/scripts/upload-media.ts`), no parte de CI.
- `scripts/test-runner.sh` solo escanea `skills/`, así que `site/` no le afecta.

## 11. Fases

Cada fase tiene su propio plan de implementación y termina en algo desplegable.

1. **Fundación:** catálogo y traducciones, sistema visual, todas las rutas con contenido
   del catálogo (fichas sin demo), buscador, SEO/GEO completo, i18n, CI y despliegue en
   `skills.sgomez.dev`. Al terminar ya es una web lanzable y útil.
2. **Editorial:** titulares y reportajes de las 9 secciones, portada con reel, `/empieza`,
   las 3 recetas de caminos y los 7 pipelines como recetas.
3. **Demos:** producción de las 12 demos del escaparate (ejecuciones reales, renders,
   grabaciones de sesión), componentes de replay y comparador, y subida a R2.

## 12. Riesgos

| Riesgo | Mitigación |
|---|---|
| Compatibilidad de OpenNext con Next 16 | Se verifica en la primera tarea del plan de la fase 1, con un "hello world" desplegado. Si falla, se baja a la última versión de Next que OpenNext soporte. |
| Calidad de 478 traducciones hechas en Claude Code | Revisión manual del escaparate; el resto lleva un sistema de reporte en la ficha ("¿mejorar traducción?" → issue de GitHub). |
| Peso de video | R2 más `preload="none"`, AV1 y ninguna reproducción fuera de viewport. |
| Claude Code no es gratis | Se dice al principio de `/empieza`. Ocultarlo rompería la confianza, que es el activo de la web. |
| Licencias de las demos | Solo con skills publicables. El sello de procedencia hace el origen auditable. |
| Bloqueo de bots de IA en Cloudflare | Checklist de despliegue con comprobación por `curl` (§7). |
| Costes inesperados | Cero APIs de pago (§3.2). Cloudflare en su plan gratuito: Workers con 100k peticiones/día y R2 con 10 GB y sin coste de salida. La cuenta de Cloudflare es la personal de `sgomez.dev`, no una de empresa. |
