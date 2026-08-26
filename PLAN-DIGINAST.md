# PLAN MAESTRO — Catálogo Diginast (Replica segura del engine Multipc)

> Generado siguiendo la metodología **SDD (Spec-Driven Development)** de gentle ai.
> Workspace: `/mnt/c/Users/j1347/Desktop/programacion/exponer/catalogodiginast`
> Engine origen: `Multipc catalogo v2` (Next.js 15 + React 19 + Tailwind 4 + Upstash Redis)

---

## 0. Resumen ejecutivo

Replicar el engine del catálogo Multipc v2 para exponer la marca de programación **Diginast**, con tres objetivos:

1. **Backend seguro**: tapar todos los puntos huecos de seguridad del original.
2. **Diseño non-AI-slop**: nueva identidad visual de Diginast con animaciones **3D** (Three.js) y **2D** (Framer Motion).
3. **Metodología SDD**: 6 fases con gates de aprobación, artefactos versionados en `openspec/`.

El original no puede usarse para "declarar lo seguro que soy", por eso se construye una versión propia, mejorada y blindada.

---

## 1. Decisiones de alcance (aprobadas en Fase 1 — engrambasico.txt)

| # | Decisión | Elección |
|---|----------|----------|
| 1 | Base de datos del backend seguro | **Upstash Redis mejorado** (mantenerlo; el JSON ayuda a cambiar grandes volúmenes de productos) |
| 2 | Librería de animaciones 3D + 2D | **Framer Motion + Three.js** |
| 3 | Nivel de auth del admin | **Password único mejorado** (sin multi-usuario por ahora) |
| 4 | Identidad visual de Diginast | **Nueva paleta Diginast** (no heredar cyan/slate del original) |

---

## 2. Stack tecnológico

### Heredado del original (probado)
- **Next.js 15** (App Router) + **React 19** + **TypeScript** estricto
- **Tailwind CSS 4** (config `@theme` en `globals.css`)
- **Upstash Redis** (persistencia server-side) — *mejorado, ver §4*
- **zod v3** (validación de requests/responses)
- **zustand v5** (estado del admin, slices + `useShallow`)
- **jose** (JWT HMAC, cookie httpOnly firmada)
- **UploadThing** + **@uploadthing/react** (subida de imágenes)

### Añadido para blindaje y diseño
- **Framer Motion** (`motion`) — animaciones 2D (entrada escalonada, hover lift, transiciones de página)
- **Three.js + @react-three/fiber + @react-three/drei** — efectos 3D (hero, producto destacado, fondo inmersivo)
- **Upstash Ratelimit** — rate limiting en auth y mutaciones
- **DomPurify** / `isomorphic-dompurify` — sanitización anti-XSS de descripciones y títulos
- **Headers de seguridad** vía `next.config.ts` + middleware (CSP, HSTS, X-Frame-Options, Referrer-Policy)
- **CSRF** — token same-origin para mutaciones del admin

---

## 3. Arquitectura de carpetas (réplica + mejoras)

```
catalogodiginast/
├── app/
│   ├── (storefront)/
│   │   ├── page.tsx                 # Home: Hero 3D → Categories → Grid → Promos → Secciones
│   │   ├── producto/[id]/page.tsx  # Vista detalle
│   │   └── catalogo/page.tsx
│   ├── admin/
│   │   └── page.tsx                 # Gate password → tabs
│   ├── api/
│   │   ├── auth/                    # login, logout, me + rate limit
│   │   ├── products/                # CRUD products
│   │   ├── sections/                # CRUD custom sections
│   │   ├── categories/              # CRUD categories
│   │   ├── config/                  # app config
│   │   ├── media/                   # uploadthing proxy
│   │   └── backup/                  # export / reset factory
│   ├── globals.css                  # @theme con paleta Diginast
│   └── layout.tsx
├── components/
│   ├── storefront/                  # Header, Hero3D, CategoryStrip, ProductGrid, ProductCard, Footer, MobileBottomBar
│   ├── detail/                      # DetailView
│   ├── admin/                       # ProductForm, SectionForm, CategoryEditor, BackupPanel
│   └── three/                       # Hero3D, Product3DScene (R3F)
├── lib/
│   ├── auth.ts                      # jose JWT + firma + verificación
│   ├── auth-check.ts                # middleware helper
│   ├── ratelimit.ts                 # Upstash Ratelimit (NUEVO)
│   ├── sanitize.ts                  # DomPurify (NUEVO)
│   ├── csrf.ts                      # token CSRF (NUEVO)
│   ├── env.ts                       # validación de env al boot con zod (NUEVO)
│   ├── redis.ts                     # cliente Upstash + fallback MemoryStore
│   ├── data.ts                      # capa de datos (products/sections/config/media)
│   ├── schemas.ts                   # zod schemas
│   ├── seed.ts                      # seed inicial
│   ├── stock.ts
│   ├── store.ts                     # zustand admin store
│   ├── cn.ts
│   └── color.ts
├── middleware.ts                    # CSP, security headers, CSRF (NUEVO)
├── openspec/changes/diginast-catalog/
│   ├── proposal.md                  # PRD (Fase 2 SDD)
│   └── tasks.md                     # SPEC tasks (Fase 4 SDD)
└── PLAN-DIGINAST.md                 # este archivo
```

---

## 4. Puntos huecos de seguridad detectados en el original → cómo se tapan

| # | Hueco en el original | Solución en Diginast |
|---|----------------------|---------------------|
| 1 | Sin rate limiting en ningún endpoint (auth incluido) → fuerza bruta al password | **Upstash Ratelimit**: `fixedWindow` 5 intentos/15min en `/api/auth/login`, `slidingWindow` en mutaciones |
| 2 | MemoryStore pierde datos al reiniciar (writes descartados silenciosamente) | Detectar env faltante → rechazar writes con `503` explícito, nunca caer a MemoryStore en producción |
| 3 | Sin CSRF protection en mutaciones | Token CSRF same-origin en cookie + header `x-csrf-token` verificado en `middleware.ts` |
| 4 | Auth de password único sin log de auditoría | Log de eventos de auth (login ok/fail, config change) en `catalog:audit` |
| 5 | Secrets sin validación de presencia (Redis null silencioso) | Validación de env al boot (`lib/env.ts`) con `zod` — fallar rápido si falta `UPSTASH_*` |
| 6 | Sin sanitización de HTML (XSS en títulos/descripciones) | `isomorphic-dompurify` en todo input de texto libre antes de guardar |
| 7 | Sin headers de seguridad (CSP, HSTS, X-Frame-Options) | `next.config.ts` headers + `middleware.ts` CSP estricto |
| 8 | Cookie sin `secure` en dev / sin expiración clara | `secure: true` en prod, `sameSite: strict`, expiración 24h documentada |
| 9 | Sin validación de origen en UploadThing callbacks | Verificar `UPLOADTHING_SECRET` y restringir file-types/tamaño |
| 10 | Reset "fábrica" sin confirmación ni log | Confirmación doble + entrada de auditoría antes de borrar claves |

---

## 5. Diseño non-AI-slop (identidad Diginast)

### Principios anti-slop (skill `frontend-design`)
- **Signature element** único, no plantilla genérica
- Movimiento con **propósito** (guiar atención), no animación decorativa
- Tipografía con jerarquía real, no centrado degradado genérico
- Contraste y rhythm de espaciado basados en tokens de design system

### Paleta Diginast (definir en Fase 2/3 con tokens)
- Banda a proponer: tono oscuro premium con acento distintivo de marca (no cyan del original)
- Se materializa con **design-system-tokens** (color scales 50–950 HSL, tipografía, 8pt spacing)

### Animaciones
- **3D (Three.js / R3F)**: Hero inmersivo, producto destacado interactivo, fondo reactivo al scroll
- **2D (Framer Motion)**: entrada escalonada del grid (`staggerChildren`), hover lift, transiciones de página con `AnimatePresence`, reveal on scroll (`whileInView`)
- **Accesibilidad**: `prefers-reduced-motion` respetado (skill `motion-accessibility`)

---

## 6. Metodología SDD — 6 fases con gates

```
F1 Briefing ──► F2 PRD ──► F3 Tipos/Diseño ──► F4 Tasks ──► F5 Implementación ──► F6 DoD
  [aprobar]      [aprobar]    [aprobar]         [aprobar]    [tests pass]       [DoD PASS]
```

| Fase | Artefacto | Ubicación | Estado |
|------|-----------|-----------|--------|
| F1 Briefing | Resumen de alcance | `engrambasico.txt` + este plan | ✅ Aprobado |
| F2 PRD | `proposal.md` | `openspec/changes/diginast-catalog/proposal.md` | ⬜ Pendiente |
| F3 Diseño técnico | Type contracts (TS + Zod) | `lib/schemas.ts` + `types/` | ⬜ Pendiente |
| F4 SPEC Tasks | `tasks.md` | `openspec/changes/diginast-catalog/tasks.md` | ⬜ Pendiente |
| F5 Implementación | Código (TDD) | `app/`, `components/`, `lib/` | ⬜ Pendiente |
| F6 Verificación | DoD PASS | `project-tracker` | ⬜ Pendiente |

**Regla dura**: no se escribe código de implementación hasta aprobar Fase 4. Cada gate requiere aprobación explícita.

---

## 7. Próximos pasos inmediatos

1. **Crear** `openspec/changes/diginast-catalog/` (directorio de artefactos SDD)
2. **Fase 2 — PRD**: redactar `proposal.md` con historias de usuario, criterios de aceptación funcionales + de seguridad, y casos límite (pérdida de red, Upstash caído, token JWT expirado)
3. **Gate F2**: presentar PRD para tu aprobación
4. Tras aprobación → **Fase 3**: definir contratos de tipo (Zod schemas, interfaces, flujos Mermaid)

---

## 8. Notas operativas

- Las skills de gentle ai (129) ya están en `.opencode/skills/` y son accesibles vía fx — no requieren reinstalación.
- Persistencia Upstash con claves: `catalog:products`, `catalog:sections`, `catalog:config`, `catalog:media`, `catalog:audit` (nueva).
- Fallback a seed data solo en modo dev sin Upstash; en producción se valida env al arranque.
