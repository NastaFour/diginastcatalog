# Diginast Catalog

Catálogo de servicios de desarrollo de la marca **Diginast**, construido replicando y
blindando el engine de Multipc catalogo v2.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** estricto
- **Tailwind CSS 4** (tokens `@theme` en `globals.css`)
- **Upstash Redis** (persistencia server-side)
- **Three.js / R3F** (3D) + **Framer Motion** (2D)
- **zod v4** (validación) · **zustand v5** (admin state)
- **jose** (JWT) · **bcryptjs** (password hash) · **isomorphic-dompurify** (XSS)

## Seguridad

- Rate limiting (login 5/15min, mutaciones 30/min)
- JWT httpOnly cookie, sameSite=strict, 8h
- CSRF token same-origin en mutaciones
- CSP estricto + HSTS + X-Frame-Options
- Sanitización HTML en todos los inputs de texto
- Auditoría de eventos
- Password hasheado con bcrypt(12)

## Setup

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar env
cp .env.example .env
# Edita .env con tus valores reales

# 3. Desarrollo
pnpm dev

# 4. Producción
pnpm build && pnpm start
```

## Variables de entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `ADMIN_PASSWORD` | Password del admin (mín 8 chars) | Sí |
| `ADMIN_JWT_SECRET` | Secret para JWT (mín 32 chars) | Sí |
| `UPSTASH_REDIS_REST_URL` | URL de Upstash Redis | Sí (prod) |
| `UPSTASH_REDIS_REST_TOKEN` | Token de Upstash Redis | Sí (prod) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio | Sí |
| `UPLOADTHING_SECRET` | Secret de UploadThing | Opcional |
| `NEXT_PUBLIC_UPLOADTHING_APP_ID` | App ID de UploadThing | Opcional |

## Estructura

```
src/
├── app/              # App Router (pages + API routes)
│   ├── (storefront)/  # Home, producto/[id]
│   ├── admin/        # Login + dashboard
│   └── api/          # 22 endpoints REST
├── components/       # UI components (hero, product, admin, etc.)
├── lib/              # Schemas, auth, redis, data, security modules
└── middleware.ts     # CSP + CSRF + security headers
```

## Metodología SDD

Este proyecto sigue Spec-Driven Development (6 fases con gates).
Artefactos en `openspec/changes/diginast-catalog/`:
- `proposal.md` — PRD (Fase 2)
- `design.md` — Diseño técnico (Fase 3)
- `tasks.md` — Descomposición SPEC (Fase 4)

## Licencia

Propietario — Diginast © 2026
