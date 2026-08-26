# PRD — Catálogo Diginast (Fase 2 SDD)

> Artefacto: Product Requirements Document
> Metodología: SDD (Spec-Driven Development) — gentle-ai
> Estado: Pendiente de aprobación (Gate F2)
> Engine origen: Multipc catalogo v2 (réplica blindada)

---

## 1. Objetivo

Construir un catálogo web de la marca de programación **Diginast** que replica y mejora el engine
del Multipc catalogo v2. El catálogo servirá para exponer de forma segura y profesional lo que
Diginast es capaz de hacer, demostrando competencia técnica mediante:

- Un **backend seguro** que tapa los 10 puntos huecos detectados en el original.
- Un **diseño non-AI-slop** con identidad propia Diginast, animaciones 3D (Three.js) y 2D
  (Framer Motion).
- Metodología **SDD** con artefactos versionados y gates de aprobación.

No se reutiliza el catálogo de Multipc directamente porque debe servir como declaración de
seguridad de la marca; se construye una versión propia, mejorada y blindada.

---

## 2. Alcance

### Incluye
- Storefront (catálogo público): home, vista detalle, categorías.
- Admin: gate de password mejorado + tabs Productos / Secciones / Botones / Categorías / Backup / Media.
- Persistencia en Upstash Redis (mejorada) con validación de env al arranque.
- Capa de seguridad: rate limiting, CSRF, sanitización XSS, headers CSP/HSTS, auditoría.
- Diseño con nueva paleta Diginast + animaciones 3D/2D con accesibilidad (reduced-motion).
- Seed inicial con datos de ejemplo de la marca Diginast.

### No incluye (out of scope, Fase 1)
- Multi-usuario / roles en el admin (se mantiene password único mejorado).
- Pasarela de pago (es un catálogo de exposición, no e-commerce transaccional).
- App móvil nativa (es web responsive mobile-first).

---

## 3. User Stories

### US-1: Visitante del catálogo
> Como visitante, quiero ver un catálogo visual y fluido de los productos/servicios de Diginast,
> para entender de un vistazo lo que la marca es capaz de hacer.

**Criterios de aceptación**
- AC-1.1: La home carga en < 2.5s (LCP) en mobile 4G.
- AC-1.2: El Hero muestra un elemento 3D interactivo (Three.js) que respeta `prefers-reduced-motion`.
- AC-1.3: El grid de productos entra con animación escalonada (Framer Motion `staggerChildren`).
- AC-1.4: Al hacer hover/tap en una tarjeta, hay micro-interacción (lift + shadow).
- AC-1.5: La navegación a `/producto/[id]` usa transición de página (AnimatePresence).
- AC-1.6: Si Upstash está caído, el storefront renderiza con seed data (degradación elegante).

### US-2: Visitante en vista detalle
> Como visitante, quiero ver el detalle de un producto con imagen grande, características, precio
> y botones de acción, para evaluarlo a fondo.

**Criterios de aceptación**
- AC-2.1: La vista `/producto/[id]` muestra foto, título, pills de características, precio (+ oldPrice tachado si existe), descripción, tag y botones configurables.
- AC-2.2: Existe un sidebar "Más Productos" que muestra productos relacionados.
- AC-2.3: Si el id no existe, se muestra not-found (404) claro, no un crash.
- AC-2.4: Los botones de WhatsApp usan la plantilla configurada y el phone de AppConfig.

### US-3: Admin — autenticación
> Como admin, quiero entrar al panel con un password, de forma segura contra fuerza bruta.

**Criterios de aceptación**
- AC-3.1: El login valida el password contra `ADMIN_PASSWORD` (env, nunca al cliente).
- AC-3.2: Al éxito, se setea cookie httpOnly firmada (jose HMAC) con `secure` en prod, `sameSite: strict`, expiración 24h.
- AC-3.3: Rate limiting en `/api/auth/login`: máx 5 intentos / 15 min por IP (Upstash Ratelimit `fixedWindow`). Tras el límite, retorna 429.
- AC-3.4: Cada intento de login (ok/fail) se registra en `catalog:audit` con timestamp e IP.
- AC-3.5: El logout invalida la cookie.

### US-4: Admin — gestión de productos
> Como admin, quiero crear, editar y eliminar productos del catálogo.

**Criterios de aceptación**
- AC-4.1: POST/PUT/DELETE `/api/products` requieren cookie válida + token CSRF.
- AC-4.2: Todo input de texto (título, descripción, tag, características) se sanitiza con `isomorphic-dompurify` antes de guardar.
- AC-4.3: Las URLs de foto se validan con zod (`z.string().url()`).
- AC-4.4: `precio` y `oldPrice` son `z.number().nonnegative()`.
- AC-4.5: Mutaciones con rate limiting `slidingWindow` (p.ej. 30/min por admin).
- AC-4.6: Tras crear/editar, el cambio se refleja en el storefront al recargar.

### US-5: Admin — secciones y categorías
> Como admin, quiero crear secciones especiales (ej. "Servicios Destacados") y categorías, para
> organizar el catálogo.

**Criterios de aceptación**
- AC-5.1: POST/PUT/DELETE `/api/sections` y `/api/categories` con las mismas protecciones (auth + CSRF + rate limit + sanitize).
- AC-5.2: Las secciones se apilan above/below de Destacados según `position`.
- AC-5.3: Las categorías aparecen en el CategoryStrip con icono derivado del nombre.

### US-6: Admin — configuración y botones
> Como admin, quiero editar la marca, el hero, el phone de WhatsApp y todos los botones del
> storefront, sin que ningún botón quede hardcodeado.

**Criterios de aceptación**
- AC-6.1: PUT `/api/config` actualiza AppConfig (brandName, hero, whatsapp, buttons, promos, featuredSection).
- AC-6.2: Ningún botón del storefront es hardcodeado; todos renderizan desde el registry de `appConfig.buttons`.
- AC-6.3: El cambio de configuración se registra en `catalog:audit`.

### US-7: Admin — backup y reset
> Como admin, quiero exportar los datos y resetear a fábrica de forma segura.

**Criterios de aceptación**
- AC-7.1: GET `/api/backup/export` devuelve un JSON con products + sections + config + media.
- AC-7.2: POST `/api/backup/reset` requiere confirmación doble (campo `confirm: "RESET"`) y registro de auditoría antes de borrar claves.
- AC-7.3: Tras reset, se ejecuta `ensureSeed()` para restaurar datos de ejemplo Diginast.

### US-8: Seguridad transversal
> Como desarrollador de Diginast, quiero que el catálogo sea blindado para poder declarar que es
> seguro.

**Criterios de aceptación**
- AC-8.1: `lib/env.ts` valida con zod al arranque que `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL` estén presentes; falla rápido si falta en producción.
- AC-8.2: `middleware.ts` setea headers: CSP estricto, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin.
- AC-8.3: CSRF token same-origin (cookie + header `x-csrf-token`) verificado en todas las mutaciones.
- AC-8.4: En producción, nunca se cae a MemoryStore para writes; si Upstash falta, las mutaciones retornan 503 explícito.
- AC-8.5: No hay secrets con prefijo `NEXT_PUBLIC_` excepto `NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_UPLOADTHING_APP_ID`.
- AC-8.6: UploadThing restringe file-types (imagen) y tamaño máximo.

---

## 4. Casos borde (edge cases)

| # | Escenario | Comportamiento esperado |
|---|-----------|------------------------|
| E1 | Upstash caído en producción | Storefront renderiza con seed data (read degradado); mutaciones retornan 503 con mensaje claro; se loguea el error |
| E2 | Token JWT expirado (24h) | `/api/auth/me` retorna 401; el admin se redirige al login; no hay redirect loop en páginas públicas |
| E3 | Fuerza bruta al password | Tras 5 intentos fallidos en 15 min, 429 con `Retry-After` header |
| E4 | CSRF token ausente en mutación | 403 Forbidden, sin ejecutar la mutación |
| E5 | Input con HTML malicioso (XSS) | `isomorphic-dompurify` limpia antes de guardar; el storefront renderiza texto plano |
| E6 | Producto con id inexistente | `/producto/[id]` muestra not-found (404), no crash |
| E7 | JSON corrupto en Redis | `try/catch` en data layer retorna [] o seed, no crash del proceso |
| E8 | UploadThing sin configurar | El botón "Subir foto" muestra error claro; el path de URL pegada sigue funcionando como fallback |
| E9 | Reset a fábrica sin confirmación | Se rechaza con 400; requiere `confirm: "RESET"` exacto |
| E10 | `prefers-reduced-motion: reduce` | Las animaciones 3D/2D se desactivan o reducen a estático |
| E11 | Rate limit en mutaciones | Admin que excede 30 mutaciones/min recibe 429 |
| E12 | Cookie sin secure en dev | En dev (`NODE_ENV != production`) se permite `secure: false`; en prod es obligatorio `secure: true` |

---

## 5. Modelo de datos (heredado + mejoras)

Claves Upstash Redis:
- `catalog:products` — JSON `Product[]`
- `catalog:sections` — JSON `CustomSection[]`
- `catalog:config` — JSON `AppConfig`
- `catalog:media` — JSON `MediaItem[]`
- `catalog:audit` — JSON `AuditEntry[]` (NUEVO)

Entidades (definición formal en Fase 3):
- **Product**: id, foto, titulo, caracteristicas[], descripcion, precio, oldPrice?, tag, featured, category, inStock, stockCount?, videoUrl?, updatedAt
- **CustomSection**: id, title, background?, position, productIds[], active, order, accentColor?, overlayOpacity, titleColor?, autoComplementary, buttonColor?
- **ButtonDef**: label, action, href, variant, visible, whatsappTemplate
- **CategoryDef**: id, name, imageUrl?, order
- **AppConfig**: brandName, pageTitle, hero*, whatsapp, buttons{}, categories[], promos, featuredSection
- **MediaItem**: id, url, name, uploadedAt, utKey?
- **AuditEntry** (NUEVO): id, action, ip, timestamp, success, meta?

---

## 6. Identidad visual Diginast (definición inicial)

- Estética: tono oscuro premium, acento distintivo de marca (NO cyan del original).
- Paleta: se define con tokens HSL 50–950 en `globals.css` (Fase 3).
- Tipografía: jerarquía real (Outfit para headings/body, JetBrains Mono para tags/código) —
  alineado con el carácter de "marca de programación".
- Signature element: a definir en Fase 3/5 (elemento único que identifica a Diginast, no plantilla).
- Animaciones: 3D (Three.js/R3F) en hero y producto destacado; 2D (Framer Motion) en grid, hover,
  transiciones y reveal on scroll.

---

## 7. Criterios de aceptación de seguridad (resumen)

1. Rate limiting en auth (5/15min) y mutaciones (30/min).
2. CSRF token en todas las mutaciones.
3. Sanitización XSS (DomPurify) en todo texto libre.
4. Headers de seguridad (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy).
5. Cookie httpOnly firmada, secure en prod, sameSite strict, 24h.
6. Validación de env al boot (zod), fail-fast en producción.
7. Log de auditoría en `catalog:audit` (login, config change, reset).
8. No MemoryStore para writes en producción (503 explícito).
9. Sin secrets al cliente (salvo NEXT_PUBLIC_ permitidos).
10. UploadThing con restricción de tipos/tamaño.

---

## 8. Fuera de alcance (explícito)

- Multi-usuario / roles / permisos granulares.
- Pagos online.
- App móvil nativa (PWA podría evaluarse después).
- i18n multi-idioma (se mantiene español por ahora).
- Búsqueda full-text avanzada (el original no la tiene; se evalúa post-MVP).

---

## 9. Dependencias y supuestos

- Node 20+ y pnpm 9+ disponibles.
- Cuenta Upstash Redis configurada (URL + token).
- Cuenta UploadThing configurada (secret + app id) — opcional, fallback URL funciona.
- Las 129 skills de gentle-ai ya instaladas en `.opencode/skills/`.

---

## Gate F2

Este PRD requiere aprobación explícita del usuario antes de avanzar a Fase 3 (Diseño técnico:
contratos de tipo TS + Zod + diagramas Mermaid).
