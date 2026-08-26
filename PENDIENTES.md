# 📋 PENDIENTES — Catálogo Diginast

> Estado tras mejora UI/UX (iconos oficiales + animaciones 2D/3D + video + responsive).
> Fecha: 2026-08-21

---

## ✅ COMPLETADO — Implementación Fase 6

### 1. ✅ Instalar dependencias
- pnpm install completa con node-linker=hoisted en .npmrc (fix Windows EPERM).

### 2. ✅ Compilar el proyecto
- pnpm build compila sin errores de tipos TypeScript (28/28 páginas generadas).
- Fix: eliminado output: standalone de next.config.ts (causa EPERM symlinks en Windows sin Developer Mode).

### 3. ✅ Hero.tsx / Terminal3D — use client añadido
- Resuelto error de next/dynamic({ ssr: false }) en server component.

### 4. ✅ UploadThing — actualizado a API v7
- src/lib/uploadthing/core.ts usa createUploadthing() y satisfies FileRouter.
- src/components/admin/MediaManager.tsx integra UploadButton real.

### 5. ✅ POST /api/media creado
- src/app/api/media/route.ts — auth + rate limit + MediaItemSchema validation + audit log.

### 6. ✅ Header component del storefront
- src/components/layout/Header.tsx — sticky blur navbar con logo, nav links y WhatsApp.

### 7. ✅ MobileBottomBar component
- src/components/layout/MobileBottomBar.tsx — nav inferior móvil (Inicio, Catálogo, WhatsApp, Admin).

### 8. ✅ PromosSection component
- src/components/section/PromosSection.tsx — renderiza promos Flash y Special desde AppConfig.

### 9. ✅ page.tsx integrado
- src/app/page.tsx incluye Header, PromosSection, MobileBottomBar.

### 10. ✅ Sitemap y robots.txt
- src/app/sitemap.ts — sitemap dinámico con productos y root.
- src/app/robots.ts — disallow admin/api, referencia al sitemap.

### 11. ✅ Seguridad — CSRF y sanitize
- src/lib/csrf.ts — verifyCsrfToken acepta string | null | undefined.
- src/lib/sanitize.ts — regex anti-XSS puro (sin jsdom) para server components.

### 12. ✅ env.ts / schemas.ts — build-safe
- UPSTASH_REDIS_REST_URL acepta string vacío en desarrollo/build.
- validateEnv() con fallback gracioso sin crashear SSG en prerendering.

### 13. ✅ Tests automatizados — Vitest (8/8 passing)
- vitest.config.ts configurado con alias @/*.
- src/lib/__tests__/schemas.test.ts — 8 tests: schemas, XSS, CSRF, env validation.

---

## ✅ COMPLETADO — Mejora UI/UX (2026-08-21)

### 14. ✅ Emojis reemplazados por iconos oficiales (lucide-react)
- `lucide-react@^0.460.0` añadido a package.json.
- **Header**: Menu, X, Home, LayoutGrid, MessageCircle — menu móvil desplegable.
- **MobileBottomBar**: Home, Package, MessageCircle — reemplaza emojis 🏠📦💬.
- **Footer**: Code2 — reemplaza texto plano.
- **Hero**: Wrench, Zap, PaintBucket, Ruler, ArrowRight, MessageCircle — reemplaza emojis 🔧⚡🪣📏.
- **CategoryStrip**: Wrench, Zap, Cable, Ruler, PaintBucket, Package, ArrowRight — reemplaza emojis 🌐📱⚙️🔧🎨💡📦.
- **PromosSection**: Zap, Rocket, ArrowRight — reemplaza emojis ⚡🚀→↗.
- **ButtonRenderer**: ArrowLeft, ExternalLink, MessageCircle, ShoppingCart, Info — iconos por acción.
- **ProductCard**: Tag, Code2 — reemplaza placeholder `</>`.
- **ProductGrid**: Package — título de sección con icono.
- **FeaturedSection**: Sparkles — reemplaza emoji ✨.
- **CustomSection**: Layers — icono de sección.
- **producto/[id]/page**: ArrowLeft, Tag, Code2, Check, X, PlayCircle — reemplaza ← y placeholder.
- **not-found.tsx**: Home, Compass — reemplaza 404 plano.
- **admin/layout**: LayoutDashboard, Package, Layers, ToggleLeft, Tag, Image, Download, Settings, ScrollText, LogOut, Menu, X — reemplaza 9 emojis 📊📦🗂️🔘🏷️🖼️💾⚙️📜.
- **admin/dashboard**: Package, Layers, Tag, Image, Plus, FolderPlus, Download, ExternalLink — hover effects.
- **VERIFICACIÓN**: grep de emojis en src/ retorna 0 resultados.

### 15. ✅ Animaciones 2D vistosas (15 animaciones CSS)
- Inspiradas en freefrontend.com/css-animations (MIT).
- Añadidas a `src/app/globals.css`:
  1. `dgn-float` — levitar (hero, badges)
  2. `dgn-glow-pulse` — pulso de brillo (badges, CTAs)
  3. `dgn-gradient-shift` — gradiente animado (promos, backgrounds)
  4. `dgn-shimmer` — brillo deslizante (loading, highlights)
  5. `dgn-text-flow` — gradiente de texto animado (headlines, brand)
  6. `dgn-fade-up-in` — entrada con fade up (secciones)
  7. `dgn-scale-in` — entrada con escala (cards)
  8. `dgn-slide-in-left/right` — entrada lateral (category strip, mobile bar)
  9. `dgn-border-glow` — borde brillante on hover (cards)
  10. `dgn-blink` — cursor parpadeante (terminal)
  11. `dgn-rotate-slow` — rotación lenta (decorativos)
  12. `dgn-marquee` — scroll horizontal (logos strip)
  13. `dgn-bounce-subtle` — rebote sutil (notifications, badges)
  14. `dgn-ripple` — ripple on click (botones)
  15. `dgn-aurora` — movimiento de mesh gradient (hero bg)
- Utility classes: `dgn-delay-1` a `dgn-delay-5` para stagger.
- **`@media (prefers-reduced-motion: reduce)`** desactiva TODAS las animaciones.

### 16. ✅ Animaciones 3D mejoradas (Three.js / R3F)
- **HardwareShowcase3D**:
  - Añadido `<Sparkles>` (40 partículas doradas) reemplazando partículas manuales.
  - Añadido `<Environment preset="warehouse">` para reflections realistas.
  - Grupo padre rotando lentamente para efecto cinemático.
  - Responsive: altura adaptable 380px/420px/480px por breakpoint.
- **Terminal3D**: mount guard para evitar hydration mismatch.
- **Hero**: HardwareShowcase3D con motion.div (fade+scale entrance).

### 17. ✅ Video en el Hero
- `<video autoPlay muted loop playsInline>` con video de Pixabay CDN (construccion/herramientas).
- Poster de fallback (Unsplash) mientras carga.
- Overlay gradient para legibilidad del texto.
- CSP actualizado: `media-src 'self' https: data:` permite video externo.

### 18. ✅ Fotos y videos en productos (seed.ts)
- 3 productos con `videoUrl` (Pixabay CDN): Taladro, Amoladora, Sierra.
- Fotos actualizadas a 800px de ancho (mayor resolución para LCP).
- Detalle de producto soporta `<video controls>` con poster.

### 19. ✅ Layout responsive mejorado
- **Header**: menu hamburguesa desplegable en móvil (overlay), nav desktop horizontal.
- **Admin sidebar**: fija en desktop, overlay deslizable en móvil con backdrop.
- **ProductGrid**: 1/2/3/4 columnas responsive (móvil/tablet/desktop/XL).
- **FeaturedSection/CustomSection**: grid 1/2/3/4 columnas responsive.
- **Hero**: grid 1 columna móvil, 2 columnas desktop, padding adaptativo.
- **MobileBottomBar**: safe-area-inset-bottom para móviles con notch.
- **producto/[id]**: grid 1 columna móvil, 2 columnas desktop, gap adaptativo.

### 20. ✅ Accesibilidad
- `aria-label` en botones de menú.
- `loading="lazy"` en imágenes de ProductCard.
- `prefers-reduced-motion` respetado en TODAS las animaciones.
- Focus ring visible (outline accent).

---

## ⚠️ PENDIENTES MENORES (no bloqueantes)

### 21. Fonts de drei Text component
Archivo: src/components/hero/HardwareShowcase3D.tsx, Terminal3D.tsx
Prioridad: Baja (visual, no funcional).

### 22. Next.js Image component
Usar next/image en vez de img en ProductCard, producto/[id], CategoryStrip, MediaManager.
Prioridad: Media (performance y LCP).

### 23. pnpm audit
pnpm audit --prod
Verificacion: 0 vulnerabilidades criticas/altas.

### 24. Instalar lucide-react
En Antigravity ejecutar: `pnpm install` (lucide-react ya está en package.json).

---

## 📦 DEPLOY

Variables de entorno en produccion (Vercel, Railway, VPS):
ADMIN_PASSWORD, ADMIN_JWT_SECRET, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN,
NEXT_PUBLIC_SITE_URL, UPLOADTHING_SECRET, NEXT_PUBLIC_UPLOADTHING_APP_ID

NOTA: output standalone fue eliminado de next.config.ts para evitar EPERM en Windows.
Si deployar con Docker en Linux, volver a añadir output: standalone.

---

## ✅ CHECKLIST FINAL FASE 6 (DoD) — ESTADO

- [x] pnpm install completa sin errores
- [x] pnpm build compila sin errores de tipos (28/28 páginas)
- [x] pnpm test — 8/8 tests passing
- [x] Hero 3D renderiza (Terminal3D con use client)
- [x] UploadThing UploadButton integrado
- [x] POST /api/media creado
- [x] Header, MobileBottomBar, PromosSection creados
- [x] Sitemap y robots.txt implementados
- [x] CSRF acepta nullable string
- [x] Sanitize regex anti-XSS puro (sin jsdom)
- [x] env.ts build-safe sin crashear SSG
- [x] Emojis reemplazados por iconos oficiales lucide-react (0 emojis en src/)
- [x] 15 animaciones 2D CSS añadidas (con prefers-reduced-motion)
- [x] Animaciones 3D mejoradas (Sparkles + Environment)
- [x] Video en el Hero (Pixabay CDN)
- [x] Fotos + videos en productos del seed
- [x] Layout responsive mejorado (4 breakpoints)
- [ ] pnpm dev arranca en localhost:3000 (verificacion manual en Antigravity)
- [ ] Login admin funciona
- [ ] CRUD productos funciona
- [ ] CSRF bloquea mutaciones sin token (403)
- [ ] Rate limit bloquea tras 5 intentos (429)
- [ ] Security headers presentes
- [ ] pnpm audit --prod = 0 vulnerabilidades criticas
