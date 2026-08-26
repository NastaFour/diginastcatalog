# Tasks — Catálogo Diginast (Fase 4 SDD)

> Artefacto: Task Decomposition (SPEC)
> Metodología: SDD — gentle-ai
> Base: design.md (Fase 3), proposal.md (Fase 2)
> Formato: cada tarea = 2-5 min, archivo(s) exacto(s), prueba de verificación

---

## Estructura de ejecución

Las tareas se agrupan en 7 bloques que mapean a la arquitectura del design.md:

1. **Scaffold + config** (T-001 a T-006)
2. **Schemas + data layer** (T-007 a T-014)
3. **Seguridad** (T-015 a T-024)
4. **API routes** (T-025 a T-040)
5. **Storefront UI** (T-041 a T-055)
6. **Admin UI** (T-056 a T-068)
7. **Seed + deploy** (T-069 a T-073)

---

## Bloque 1 — Scaffold + config

### T-001: Inicializar proyecto Next.js 15
- **Archivos**: `package.json`, `next.config.ts`, `tsconfig.json`
- **Acción**: `pnpm create next-app@latest . --ts --tailwind --app --src-dir --import-alias "@/*" --use-pnpm`
- **Verificación**: `pnpm dev` arranca en localhost:3000 sin errores

### T-002: Instalar dependencias base
- **Archivos**: `package.json`
- **Acción**: `pnpm add zod zustand jose @upstash/redis @upstash/ratelimit isomorphic-dompurify`
- **Verificación**: `pnpm install` completa sin conflictos de versiones

### T-003: Instalar dependencias UI/3D
- **Archivos**: `package.json`
- **Acción**: `pnpm add framer-motion three @react-three/fiber @react-three/drei && pnpm add -D @types/three`
- **Verificación**: `pnpm build` no reporta errores de tipos de three

### T-004: Instalar UploadThing
- **Archivos**: `package.json`
- **Acción**: `pnpm add uploadthing @uploadthing/react`
- **Verificación**: import de `@uploadthing/react` resuelve sin error

### T-005: Crear .env.example
- **Archivos**: `.env.example`, `.gitignore` (verificar que .env local está ignorado)
- **Contenido**:
  ```
  ADMIN_PASSWORD=changeme-min-8-chars
  ADMIN_JWT_SECRET=changeme-min-32-chars-xxxxxxxxxxxxxxxx
  UPSTASH_REDIS_REST_URL=https://example.upstash.io
  UPSTASH_REDIS_REST_TOKEN=xxxxx
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  UPLOADTHING_SECRET=
  NEXT_PUBLIC_UPLOADTHING_APP_ID=
  ```
- **Verificación**: `.env.example` existe, `.env` está en `.gitignore`

### T-006: Configurar globals.css con tokens Diginast
- **Archivos**: `src/app/globals.css`
- **Acción**: Definir `@theme` con las 3 escalas completas 50-950 (base, primary, accent) del design.md §8.1. Importar fuentes Outfit + JetBrains Mono vía `next/font`.
- **Verificación**: `pnpm build` compila CSS sin errores; las variables CSS están disponibles en `:root`

---

## Bloque 2 — Schemas + data layer

### T-007: Crear lib/schemas.ts
- **Archivos**: `src/lib/schemas.ts`
- **Acción**: Implementar los 10 Zod schemas del design.md §1 (ProductSchema, NewProductSchema, CustomSectionSchema, NewCustomSectionSchema, ButtonDefSchema, CategoryDefSchema, AppConfigSchema, MediaItemSchema, AuditEntrySchema, PasswordSchema, PromosConfigSchema, FeaturedSectionSchema, EnvSchema)
- **Verificación**: `npx tsx -e "import { ProductSchema } from './src/lib/schemas'; console.log(ProductSchema.safeParse({id:'x',titulo:'t',descripcion:'d',precio:100}).success)"` → `true`

### T-008: Crear lib/env.ts
- **Archivos**: `src/lib/env.ts`
- **Acción**: `validateEnv()` usando EnvSchema. En production: throw si falta required. En development: console.warn + permitir continuar sin UPSTASH. Hashear ADMIN_PASSWORD con bcrypt(12) al boot y exportar `hashedAdminPassword`.
- **Verificación**: En dev sin UPSTASH: warning en consola pero no crash. En prod sin env: throw al importar.

### T-009: Crear lib/redis.ts
- **Archivos**: `src/lib/redis.ts`
- **Acción**: `getRedis()` singleton con @upstash/redis. Exportar `KEYS = { products, sections, config, media, audit }`. 
- **Verificación**: `getRedis()` retorna instancia o null si no hay env. `KEYS.audit === "catalog:audit"`

### T-010: Crear lib/store.ts (KVStore interface + RedisStore + MemoryStore)
- **Archivos**: `src/lib/store.ts`
- **Acción**: Interface `KVStore { get<T>(key): Promise<T|null>; set<T>(key, val): Promise<boolean>; del(key): Promise<boolean> }`. `RedisStore` implementa con @upstash/redis. `MemoryStore` con Map en memoria. `getStorage()`: si UPSTASH env presente → RedisStore; si no y dev → MemoryStore; si no y prod → null (writes retornan 503).
- **Verificación**: En dev sin Redis, `getStorage()` retorna MemoryStore. En prod sin Redis, `set()` retorna `false`.

### T-011: Crear lib/data.ts (CRUD + audit)
- **Archivos**: `src/lib/data.ts`
- **Acción**: Funciones: `getProducts()`, `getProduct(id)`, `saveProducts()`, `getSections()`, `saveSections()`, `getConfig()`, `saveConfig()`, `getMedia()`, `saveMedia()`, `getAuditLog()`, `appendAudit()`. Cada una usa `getStorage()` y parsea con el schema correspondiente. Si JSON corrupto → retornar `[]` o seed.
- **Verificación**: `getProducts()` con MemoryStore vacío retorna `[]` sin crash.

### T-012: Crear lib/seed.ts
- **Archivos**: `src/lib/seed.ts`
- **Acción**: Exportar `diginastSeed = { products: [...], sections: [...], config: {...}, media: [] }` con 4-6 productos de ejemplo de servicios de programación (web, móvil, sistemas, consultoría, etc.), 1 sección destacada, AppConfig con brandName "Diginast", hero de marca, botones de WhatsApp configurados.
- **Verificación**: `diginastSeed.products.length >= 4`. `diginastSeed.config.brandName === "Diginast"`

### T-013: Crear lib/ensureSeed.ts
- **Archivos**: `src/lib/ensureSeed.ts`
- **Acción**: `ensureSeed()`: si `getProducts()` retorna `[]` y `getConfig()` retorna null, escribir `diginastSeed` en el storage. Idempotente (no sobrescribe si ya hay datos).
- **Verificación**: Llamar `ensureSeed()` en MemoryStore vacío → `getProducts()` retorna los productos seed. Llamar de nuevo → no duplica.

### T-014: Crear lib/cn.ts
- **Archivos**: `src/lib/cn.ts`
- **Acción**: Helper `cn(...classes)` usando `clsx` + `tailwind-merge`.
- **Verificación**: `cn("px-2 px-4")` → `"px-4"` (merge correcto)

---

## Bloque 3 — Seguridad

### T-015: Crear lib/auth.ts
- **Archivos**: `src/lib/auth.ts`
- **Acción**: `createSessionToken()` → JWT firmado con jose HS256 usando `ADMIN_JWT_SECRET`, payload `{ role: "admin", iat, exp }` con expiración 8h. `verifyToken(token)` → retorna payload o null. Usar `hashedAdminPassword` de env.ts para bcrypt.compare en el login (NO plaintext).
- **Verificación**: Token creado → verificado → decodeado correctamente. Token expirado/falso → null.

### T-016: Crear lib/auth-check.ts
- **Archivos**: `src/lib/auth-check.ts`
- **Acción**: `isAuthenticated(request)`: extraer cookie `admin_token`, verificar con `verifyToken()`. Retorna `{ authenticated: boolean, payload?: unknown }`.
- **Verificación**: Request sin cookie → `authenticated: false`. Con cookie válida → `authenticated: true`.

### T-017: Crear lib/csrf.ts
- **Archivos**: `src/lib/csrf.ts`
- **Acción**: `generateCsrfToken()` → `crypto.randomUUID()`. `verifyCsrfToken(cookieVal, headerVal)` → comparación timing-safe. Cookie config: `name: "csrf_token", sameSite: "strict", httpOnly: false, secure: process.env.NODE_ENV === "production"`.
- **Verificación**: Token generado → seteado en cookie → verificado con header → `true`. Header ausente → `false`.

### T-018: Crear lib/ratelimit.ts
- **Archivos**: `src/lib/ratelimit.ts`
- **Acción**: Importar `@upstash/ratelimit`. `loginLimit = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(5, "15 m"), prefix: "rl:login" })`. `mutationLimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rl:mut" })`. Si no hay Redis, los limiters son no-ops (permiten todo en dev).
- **Verificación**: En dev sin Redis, `loginLimit.limit("test")` retorna `{ success: true }`.

### T-019: Crear lib/sanitize.ts
- **Archivos**: `src/lib/sanitize.ts`
- **Acción**: `sanitizeHtml(input: string): string` usando `isomorphic-dompurify`. `sanitizeProductFields(product)`: aplica a titulo, descripcion, tag, y cada item de caracteristicas. `sanitizeSectionFields(section)`: aplica a title. `sanitizeConfigFields(config)`: aplica a brandName, heroTitle, heroSubtitle.
- **Verificación**: `sanitizeHtml("<script>alert(1)</script>Hello")` → `"Hello"`. `sanitizeHtml("<b>bold</b>")` → `"bold"` (strips all tags).

### T-020: Crear lib/audit.ts
- **Archivos**: `src/lib/audit.ts`
- **Acción**: `logAudit(action, ip, success, meta?)`: crea `AuditEntry` con id `crypto.randomUUID()`, timestamp ISO, y lo appenda a `catalog:audit` via `appendAudit()`. Si falla el storage, no crashea (fire-and-forget con try/catch).
- **Verificación**: `logAudit("login-success", "127.0.0.1", true)` → `getAuditLog()` incluye la entrada.

### T-021: Crear middleware.ts (security headers + CSRF gate)
- **Archivos**: `src/middleware.ts`
- **Acción**: En cada request: setear headers CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin. Si es POST/PUT/DELETE a `/api/*` (excepto `/api/auth/login`): verificar CSRF token (cookie vs header). Si falla → 403. CSP debe permitir scripts de self + inline styles de Next.js + connect a Upstash.
- **Verificación**: `curl -I http://localhost:3000` muestra los 5 headers. `curl -X POST /api/products` sin CSRF → 403.

### T-022: Crear lib/uploadthing/core.ts
- **Archivos**: `src/lib/uploadthing/core.ts`
- **Acción**: `createRoute` con file router: máximo 4MB, accept `["image/jpeg", "image/png", "image/webp", "image/gif"]`. Middleware verifica auth (cookie admin_token válida).
- **Verificación**: Import de `createRoute` resuelve. Tipos permitidos no incluyen `application/pdf`.

### T-023: Crear app/api/uploadthing/route.ts
- **Archivos**: `src/app/api/uploadthing/route.ts`
- **Acción**: `export const { GET, POST } = createRouteHandler({ router: uploadRouter, config: { logLevel: "Error" } })`.
- **Verificación**: `GET /api/uploadthing` retorna 200 con token (cuando auth OK).

### T-024: Crear lib/constants.ts
- **Archivos**: `src/lib/constants.ts`
- **Acción**: Constantes compartidas: `SESSION_COOKIE = "admin_token"`, `CSRF_COOKIE = "csrf_token"`, `SESSION_MAX_AGE = 8 * 60 * 60` (8h), `MAX_FILE_SIZE = 4 * 1024 * 1024`.
- **Verificación**: Import y uso de constantes sin valores mágicos en el resto del código.

---

## Bloque 4 — API routes

### T-025: POST /api/auth/login
- **Archivos**: `src/app/api/auth/login/route.ts`
- **Acción**: Recibe `{ password }`. Rate limit loginLimit. bcrypt.compare contra `hashedAdminPassword`. Si OK: crear JWT, setear cookie httpOnly secure sameSite=strict maxAge=8h, generar CSRF token, setear cookie csrf_token, loguear audit login-success, retornar 200 `{ ok: true, csrfToken }`. Si fail: loguear audit login-failed, retornar 401.
- **Verificación**: Password correcto → 200 + cookie seteada. Password incorrecto → 401. 6º intento → 429.

### T-026: POST /api/auth/logout
- **Archivos**: `src/app/api/auth/logout/route.ts`
- **Acción**: Verificar auth. Eliminar cookie admin_token y csrf_token. Loguear audit logout. Retornar 200.
- **Verificación**: Logout → cookies eliminadas → GET /api/auth/me retorna 401.

### T-027: GET /api/auth/me
- **Archivos**: `src/app/api/auth/me/route.ts`
- **Acción**: `isAuthenticated(request)`. Si OK: retornar 200 `{ authenticated: true }`. Si no: 401.
- **Verificación**: Sin cookie → 401. Con cookie válida → 200.

### T-028: GET /api/products
- **Archivos**: `src/app/api/products/route.ts` (GET handler)
- **Acción**: `getProducts()`. Retornar 200 `{ data: Product[] }`. Si storage caído en prod: retornar seed o `[]` con header `X-Storage-Status: degraded`.
- **Verificación**: GET retorna array. Sin Redis en dev → retorna seed o `[]`.

### T-029: POST /api/products
- **Archivos**: `src/app/api/products/route.ts` (POST handler)
- **Acción**: Verificar auth + CSRF (middleware ya gatea CSRF). Rate limit mutationLimit. Parsear body con `NewProductSchema`. Sanitizar campos. Generar id si no viene. Setear updatedAt. Append a products existentes. Guardar. Loguear audit product-create. Retornar 201 `{ data: Product }`.
- **Verificación**: POST con body válido → 201. Sin auth → 401. Body inválido → 400.

### T-030: PUT /api/products/[id]
- **Archivos**: `src/app/api/products/[id]/route.ts` (PUT handler)
- **Acción**: Auth + rate limit. Parsear body con `NewProductSchema`. Sanitizar. Actualizar producto con ese id. Setear updatedAt. Guardar. Audit product-update. 200.
- **Verificación**: PUT con id existente → 200. Id inexistente → 404.

### T-031: DELETE /api/products/[id]
- **Archivos**: `src/app/api/products/[id]/route.ts` (DELETE handler)
- **Acción**: Auth + rate limit. Filtrar out el producto. Guardar. Audit product-delete. 200.
- **Verificación**: DELETE → producto desaparece de GET. Id inexistente → 404.

### T-032: GET /api/sections
- **Archivos**: `src/app/api/sections/route.ts` (GET handler)
- **Acción**: `getSections()`. Retornar 200 `{ data: CustomSection[] }`.
- **Verificación**: GET retorna array.

### T-033: POST /api/sections
- **Archivos**: `src/app/api/sections/route.ts` (POST handler)
- **Acción**: Auth + rate limit + sanitize. Crear sección. Audit section-create. 201.
- **Verificación**: POST válido → 201. Sin auth → 401.

### T-034: PUT/DELETE /api/sections/[id]
- **Archivos**: `src/app/api/sections/[id]/route.ts`
- **Acción**: Auth + rate limit + sanitize. PUT actualiza, DELETE elimina. Audit. 200.
- **Verificación**: PUT → sección actualizada. DELETE → sección eliminada.

### T-035: GET /api/categories
- **Archivos**: `src/app/api/categories/route.ts` (GET handler)
- **Acción**: `getConfig().categories`. Retornar 200 `{ data: CategoryDef[] }`.
- **Verificación**: GET retorna array de categorías del config.

### T-036: POST /api/categories
- **Archivos**: `src/app/api/categories/route.ts` (POST handler)
- **Acción**: Auth + rate limit. Parsear CategoryDefSchema. Append a config.categories. Guardar config. Audit category-create. 201.
- **Verificación**: POST válido → categoría aparece en GET /api/categories.

### T-037: PUT/DELETE /api/categories/[id]
- **Archivos**: `src/app/api/categories/[id]/route.ts`
- **Acción**: Auth + rate limit. PUT actualiza categoría por id. DELETE elimina. Guardar config. Audit. 200.
- **Verificación**: PUT → categoría actualizada. DELETE → categoría eliminada.

### T-038: GET /api/config
- **Archivos**: `src/app/api/config/route.ts` (GET handler)
- **Acción**: `getConfig()`. Retornar 200 `{ data: AppConfig }`. Si no hay config → retornar seed.
- **Verificación**: GET retorna AppConfig con brandName "Diginast" (seed).

### T-039: PUT /api/config
- **Archivos**: `src/app/api/config/route.ts` (PUT handler)
- **Acción**: Auth + rate limit + sanitize. Parsear AppConfigSchema. Guardar. Audit config-update. 200.
- **Verificación**: PUT → GET refleja los cambios. Sin auth → 401.

### T-040: GET /api/media
- **Archivos**: `src/app/api/media/route.ts` (GET handler)
- **Acción**: Auth. `getMedia()`. Retornar 200 `{ data: MediaItem[] }`.
- **Verificación**: GET con auth → 200. Sin auth → 401.

### T-041: DELETE /api/media/[id]
- **Archivos**: `src/app/api/media/[id]/route.ts`
- **Acción**: Auth + rate limit. Si el MediaItem tiene `utKey`, eliminar de UploadThing (UTApi). Filtrar de media. Guardar. Audit media-delete. 200.
- **Verificación**: DELETE → media desaparece. Sin auth → 401.

### T-042: GET /api/backup/export
- **Archivos**: `src/app/api/backup/export/route.ts`
- **Acción**: Auth. Recopilar products + sections + config + media. Retornar 200 con JSON descargable (`Content-Disposition: attachment`).
- **Verificación**: GET con auth → JSON con las 4 claves. Sin auth → 401.

### T-043: POST /api/backup/reset
- **Archivos**: `src/app/api/backup/reset/route.ts`
- **Acción**: Auth + CSRF. Verificar body `{ confirm: "RESET" }`. Si no coincide → 400. Si coincide: eliminar todas las claves (products, sections, config, media), ejecutar `ensureSeed()`, loguear audit backup-reset. 200.
- **Verificación**: POST con `confirm: "RESET"` → datos reseteados a seed. Sin confirm → 400.

---

## Bloque 5 — Storefront UI

### T-044: Crear layout root + providers
- **Archivos**: `src/app/layout.tsx`
- **Acción**: Configurar `next/font` con Outfit (body+display) y JetBrains Mono (mono). Metadata base con pageTitle de config. Renderizar children. Sin providers de estado global (cada página fetcha su data).
- **Verificación**: `pnpm build` incluye las fuentes en el bundle. HTML tiene las clases de font.

### T-045: Crear lib/api-client.ts (fetch helpers)
- **Archivos**: `src/lib/api-client.ts`
- **Acción**: Funciones: `fetchProducts()`, `fetchProduct(id)`, `fetchSections()`, `fetchConfig()`, `fetchCategories()`. Cada una hace `fetch()` a la API correspondiente con cache `no-store`. Retornan data tipada.
- **Verificación**: En runtime contra dev server, `fetchProducts()` retorna array de productos.

### T-046: Crear app/page.tsx (home storefront)
- **Archivos**: `src/app/page.tsx`
- **Acción**: Server component. Fetchar config + products + sections. Renderizar: Hero, CategoryStrip, FeaturedSection, CustomSections (above/below), ProductGrid, Footer. Pasar data como props a componentes client.
- **Verificación**: Home carga con productos seed visibles. LCP < 2.5s.

### T-047: Crear components/Hero.tsx
- **Archivos**: `src/components/hero/Hero.tsx`, `src/components/hero/Terminal3D.tsx`
- **Acción**: Hero con título/subtítulo de config. Terminal3D: escena R3F con geometría de terminal flotante, reactiva al mouse (useFrame + pointer). Texto de código Diginast en la terminal. `useReducedMotion()` → si reduced: renderizar screenshot/estático. Lazy load con `next/dynamic` (ssr: false).
- **Verificación**: Hero renderiza con terminal 3D. En reduced-motion, muestra versión estática.

### T-048: Crear components/ProductGrid.tsx
- **Archivos**: `src/components/product/ProductGrid.tsx`, `src/components/product/ProductCard.tsx`
- **Acción**: Grid responsive con `grid-cols-1 sm:2 lg:3`. ProductCard: foto, título, precio (+oldPrice tachado), tag pill (JetBrains Mono). Framer Motion `variants` con `staggerChildren: 0.05`. ProductCard `whileHover: { scale: 1.03 }` con `type: "spring"`. `useReducedMotion()` → sin stagger, sin hover scale.
- **Verificación**: Grid renderiza productos. Hover escala la tarjeta. Reduced-motion: sin animación.

### T-049: Crear components/CategoryStrip.tsx
- **Archivos**: `src/components/category/CategoryStrip.tsx`
- **Acción**: Strip horizontal scrollable con drag (Framer Motion). Cada categoría: icono derivado del nombre + nombre. Click filtra productos por categoría (navegación a `/?cat=id`).
- **Verificación**: Strip muestra categorías seed. Drag funciona en mobile.

### T-050: Crear components/FeaturedSection.tsx
- **Archivos**: `src/components/section/FeaturedSection.tsx`
- **Acción**: Sección con background opcional, overlay con `overlayOpacity`, título, y grid de productos featured. Respeta accentColor, titleColor, buttonColor del config.
- **Verificación**: Sección renderiza productos con `featured: true`.

### T-051: Crear components/CustomSection.tsx
- **Archivos**: `src/components/section/CustomSection.tsx`
- **Acción**: Renderiza una CustomSection con su background, productos asociados (productIds), y botón de acción. Soporta position above/below.
- **Verificación**: Sección renderiza productos asociados.

### T-052: Crear app/producto/[id]/page.tsx
- **Archivos**: `src/app/producto/[id]/page.tsx`, `src/app/producto/[id]/not-found.tsx`
- **Acción**: Server component. `fetchProduct(id)`. Si no existe → notFound(). Renderizar: foto grande, título, pills de características, precio (+oldPrice), descripción, tag, botones configurables. Sidebar "Más Productos" con productos relacionados (misma categoría). AnimatePresence para transición.
- **Verificación**: `/producto/[id-valido]` carga detalle. `/producto/[id-inexistente]` → 404.

### T-053: Crear components/ButtonRenderer.tsx
- **Archivos**: `src/components/ui/ButtonRenderer.tsx`
- **Acción**: Recibe `ButtonDef`. Renderiza botón según `action`: link (a href), whatsapp-order (window.open wa.me con template), whatsapp-info, back (router.back), scroll (scrollIntoView). Variante visual según `variant` (solid-primary, outline-primary, solid-accent, ghost). Respeta `visible`.
- **Verificación**: Botón con action whatsapp-order genera URL wa.me correcta.

### T-054: Crear components/Footer.tsx
- **Archivos**: `src/components/layout/Footer.tsx`
- **Acción**: Footer con brandName, links de navegación, botón de WhatsApp, copyright.
- **Verificación**: Footer muestra brandName "Diginast".

### T-055: Crear app/not-found.tsx
- **Archivos**: `src/app/not-found.tsx`
- **Acción**: Página 404 global con estilo Diginast. Botón de volver al home.
- **Verificación**: URL inexistente → 404 con estilo Diginast.

---

## Bloque 6 — Admin UI

### T-056: Crear app/admin/page.tsx (login)
- **Archivos**: `src/app/admin/page.tsx`, `src/components/admin/LoginForm.tsx`
- **Acción**: Página de login. Si ya autenticado (check /api/auth/me) → redirect a /admin/dashboard. Formulario password → POST /api/auth/login. Al éxito: guardar csrfToken en memoria, redirect a dashboard. Error: mostrar mensaje. Rate limit: si 429, mostrar countdown.
- **Verificación**: Password correcto → redirect a dashboard. Incorrecto → mensaje de error.

### T-057: Crear lib/admin-fetch.ts (fetch con CSRF)
- **Archivos**: `src/lib/admin-fetch.ts`
- **Acción**: Wrapper de `fetch` para mutaciones admin: inyecta header `x-csrf-token` desde la variable en memoria. Maneja 401 (redirect a login) y 429 (mensaje de rate limit).
- **Verificación**: Mutación incluye header CSRF. 401 → redirect.

### T-058: Crear app/admin/layout.tsx
- **Archivos**: `src/app/admin/layout.tsx`
- **Acción**: Layout con guard de auth (client-side check /api/auth/me). Si no autenticado → redirect a /admin. Sidebar con tabs: Productos, Secciones, Botones, Categorías, Backup, Media, Auditoría. Header con botón logout.
- **Verificación**: Sin auth → redirect a /admin. Con auth → muestra sidebar.

### T-059: Crear app/admin/dashboard/page.tsx
- **Acciones**: Dashboard con resumen: total productos, total secciones, categorías, últimos eventos de auditoría. Botones de acción rápida.
- **Verificación**: Dashboard muestra datos del seed.

### T-060: Crear admin tab Productos
- **Archivos**: `src/app/admin/dashboard/productos/page.tsx`, `src/components/admin/ProductManager.tsx`
- **Acción**: Lista de productos en tabla. Botón "Nuevo producto" → formulario (modal o página). Editar/Eliminar por fila. Formulario usa NewProductSchema para validación cliente. Preview de foto.
- **Verificación**: Crear producto → aparece en la lista y en el storefront.

### T-061: Crear admin tab Secciones
- **Archivos**: `src/app/admin/dashboard/secciones/page.tsx`, `src/components/admin/SectionManager.tsx`
- **Acción**: Lista de secciones. Crear/editar/eliminar. Selector de productos para incluir. Selector de position (above/below). Color pickers para accentColor, titleColor, buttonColor. Slider para overlayOpacity.
- **Verificación**: Crear sección → aparece en el storefront.

### T-062: Crear admin tab Botones
- **Archivos**: `src/app/admin/dashboard/botones/page.tsx`, `src/components/admin/ButtonManager.tsx`
- **Acción**: Editor de buttons registry. Cada botón: label, action, href, variant, visible, whatsappTemplate. Preview en vivo del botón.
- **Verificación**: Editar botón → cambio visible en storefront al recargar.

### T-063: Crear admin tab Categorías
- **Archivos**: `src/app/admin/dashboard/categorias/page.tsx`, `src/components/admin/CategoryManager.tsx`
- **Acción**: Lista de categorías. Crear/editar/eliminar. Campo name, imageUrl (opcional), order.
- **Verificación**: Crear categoría → aparece en CategoryStrip del storefront.

### T-064: Crear admin tab Media
- **Archivos**: `src/app/admin/dashboard/media/page.tsx`, `src/components/admin/MediaManager.tsx`
- **Acción**: Galería de media. Upload via UploadThing (UploadButton component). Mostrar URL para copiar. Eliminar media (con delete de UploadThing si tiene utKey).
- **Verificación**: Subir imagen → aparece en galería. Eliminar → desaparece.

### T-065: Crear admin tab Backup
- **Archivos**: `src/app/admin/dashboard/backup/page.tsx`, `src/components/admin/BackupManager.tsx`
- **Acción**: Botón "Exportar" → GET /api/backup/export (descarga JSON). Botón "Reset a fábrica" → confirmación doble (modal con input `confirm: "RESET"`) → POST /api/backup/reset.
- **Verificación**: Exportar → descarga JSON. Reset con confirm → datos vuelven a seed.

### T-066: Crear admin tab Configuración
- **Archivos**: `src/app/admin/dashboard/configuracion/page.tsx`, `src/components/admin/ConfigManager.tsx`
- **Acción**: Editor de AppConfig: brandName, pageTitle, heroTitle, heroSubtitle, heroBackgroundUrl, whatsapp.phone, promos, featuredSection.
- **Verificación**: Editar brandName → cambio visible en storefront.

### T-067: Crear admin tab Auditoría
- **Archivos**: `src/app/admin/dashboard/auditoria/page.tsx`, `src/components/admin/AuditLog.tsx`
- **Acción**: Tabla con los últimos AuditEntry. Columnas: timestamp, action, ip, success. Filtro por action. Paginación simple.
- **Verificación**: Hacer login → aparece entrada "login-success" en el log.

### T-068: Crear lib/admin-store.ts (zustand)
- **Archivos**: `src/lib/admin-store.ts`
- **Acción**: Store zustand con: `csrfToken`, `setCsrfToken()`, `isAuthed`, `setAuthed()`. No persistir en localStorage (seguridad).
- **Verificación**: `setCsrfToken("x")` → `csrfToken === "x"`. Refresh de página → token undefined (no persistido).

---

## Bloque 7 — Seed + deploy

### T-069: Integrar ensureSeed() en el boot
- **Archivos**: `src/app/layout.tsx` (o `src/lib/bootstrap.ts` llamado desde layout)
- **Acción**: En el server, al renderizar el layout raíz por primera vez, llamar `ensureSeed()` si el storage está vacío. Solo en server-side.
- **Verificación**: Primera carga en dev con Redis vacío → productos seed aparecen.

### T-070: Crear next.config.ts con security hardening
- **Archivos**: `next.config.ts`
- **Acción**: Configurar `poweredByHeader: false`, `compress: true`. Headers adicionales si no los cubre middleware. Images remotePatterns para dominios de imágenes externas.
- **Verificación**: `curl -I` no muestra `X-Powered-By`.

### T-071: Crear Dockerfile (opcional, para VPS deploy)
- **Archivos**: `Dockerfile`
- **Acción**: Multi-stage build: deps → build → runner. Node 20-alpine. `pnpm install --frozen-lockfile`. Standalone output de Next.js.
- **Verificación**: `docker build .` completa sin errores.

### T-072: Crear vercel.json / deploy config
- **Archivos**: `vercel.json`
- **Acción**: Configurar frameworks: nextjs. Si se usa VPS, crear `docker-compose.yml` en su lugar.
- **Verificación**: Deploy a Vercel funciona (si se conecta el repo).

### T-073: Crear README.md con instrucciones
- **Archivos**: `README.md`
- **Acción**: Instrucciones: setup env, `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm start`. Descripción del proyecto. Enlace a openspec/.
- **Verificación**: Nuevo dev puede clonar y correr el proyecto siguiendo el README.

---

## Resumen

| Bloque | Tareas | Archivos | Tiempo est. |
|--------|--------|----------|-------------|
| 1. Scaffold + config | T-001 a T-006 | 6 | ~25 min |
| 2. Schemas + data | T-007 a T-014 | 8 | ~30 min |
| 3. Seguridad | T-015 a T-024 | 10 | ~40 min |
| 4. API routes | T-025 a T-043 | 19 | ~60 min |
| 5. Storefront UI | T-044 a T-055 | 12 | ~50 min |
| 6. Admin UI | T-056 a T-068 | 13 | ~55 min |
| 7. Seed + deploy | T-069 a T-073 | 5 | ~20 min |
| **TOTAL** | **73 tareas** | **73 archivos** | **~280 min** |

---

## Gate F4

Esta descomposición de tareas requiere aprobación explícita del usuario antes de avanzar a
Fase 5 (Implementación: ejecutar las tareas secuencialmente, cargando skills por bloque).
