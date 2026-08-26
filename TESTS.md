# TESTS — Catálogo Diginast

> Ejecutar estos tests en Antigravity (entorno con Node.js funcional).
> Este archivo documenta todas las verificaciones pendientes de los 73 tasks de tasks.md.

## Prerrequisitos

```bash
pnpm install
cp .env.example .env
# Editar .env con ADMIN_PASSWORD, ADMIN_JWT_SECRET, UPSTASH_*
```

---

## Bloque 1 — Scaffold + config

### T-001: Inicializar proyecto Next.js 15
```bash
pnpm dev
# Verificar: arranca en localhost:3000 sin errores
```

### T-002: Instalar dependencias base
```bash
pnpm install
# Verificar: completa sin conflictos de versiones
```

### T-003: Instalar dependencias UI/3D
```bash
pnpm build
# Verificar: no reporta errores de tipos de three
```

### T-004: Instalar UploadThing
```bash
# Verificar: import de @uploadthing/react resuelve sin error
node -e "require('@uploadthing/react')"
```

### T-005: Crear .env.example
```bash
test -f .env.example && echo "OK"
grep -q "\.env" .gitignore && echo "OK"
```

### T-006: Configurar globals.css con tokens Diginast
```bash
pnpm build
# Verificar: compila CSS sin errores
# Verificar: variables CSS en :root disponibles
grep "color-dgn-base-950" src/app/globals.css
grep "color-dgn-primary-600" src/app/globals.css
grep "color-dgn-accent-500" src/app/globals.css
```

---

## Bloque 2 — Schemas + data layer

### T-007: Crear lib/schemas.ts
```bash
npx tsx -e "import { ProductSchema } from './src/lib/schemas'; console.log(ProductSchema.safeParse({id:'x',titulo:'t',descripcion:'d',precio:100}).success)"
# Expected: true
```

### T-008: Crear lib/env.ts
```bash
# En dev sin UPSTASH: warning pero no crash
NODE_ENV=development npx tsx -e "import { validateEnv } from './src/lib/env'; console.log(validateEnv().NODE_ENV)"
# Expected: development (con warnings en consola)

# En prod sin env: throw
NODE_ENV=production npx tsx -e "import { validateEnv } from './src/lib/env'; validateEnv()" 2>&1 | grep "Missing required"
# Expected: error message about missing required env vars
```

### T-009: Crear lib/redis.ts
```bash
npx tsx -e "import { getRedis } from './src/lib/redis'; console.log(getRedis())"
# En dev sin UPSTASH: null
npx tsx -e "import { KEYS } from './src/lib/redis'; console.log(KEYS.audit === 'catalog:audit')"
# Expected: true
```

### T-010: Crear lib/store.ts
```bash
# En dev sin Redis: retorna MemoryStore
NODE_ENV=development npx tsx -e "import { getStorage } from './src/lib/store'; console.log(getStorage().constructor.name)"
# Expected: MemoryStore
```

### T-011: Crear lib/data.ts
```bash
npx tsx -e "import { getProducts } from './src/lib/data'; getProducts().then(p => console.log(p.length))"
# Expected: 6 (seed products) o 0 si storage vacío
```

### T-012: Crear lib/seed.ts
```bash
npx tsx -e "import { diginastSeed } from './src/lib/seed'; console.log(diginastSeed.products.length >= 4)"
# Expected: true
npx tsx -e "import { diginastSeed } from './src/lib/seed'; console.log(diginastSeed.config.brandName === 'Diginast')"
# Expected: true
```

### T-013: Crear lib/ensureSeed.ts
```bash
npx tsx -e "import { ensureSeed } from './src/lib/ensureSeed'; import { getProducts } from './src/lib/data'; ensureSeed().then(() => getProducts()).then(p => console.log(p.length))"
# Expected: 6 (seed products)
# Segunda llamada: no duplica
npx tsx -e "import { ensureSeed } from './src/lib/ensureSeed'; import { getProducts } from './src/lib/data'; ensureSeed().then(() => ensureSeed()).then(() => getProducts()).then(p => console.log(p.length))"
# Expected: 6 (no duplica)
```

### T-014: Crear lib/cn.ts
```bash
npx tsx -e "import { cn } from './src/lib/cn'; console.log(cn('px-2 px-4'))"
# Expected: "px-4"
```

---

## Bloque 3 — Seguridad

### T-015: Crear lib/auth.ts
```bash
npx tsx -e "import { createSessionToken, verifyToken } from './src/lib/auth'; createSessionToken().then(t => verifyToken(t)).then(p => console.log(p?.role === 'admin'))"
# Expected: true
# Token expirado/falso:
npx tsx -e "import { verifyToken } from './src/lib/auth'; verifyToken('invalid').then(p => console.log(p))"
# Expected: null
```

### T-016: Crear lib/auth-check.ts
```bash
# Request sin cookie → authenticated: false
# Con cookie válida → authenticated: true
# (Requiere servidor corriendo para test completo)
curl -s http://localhost:3000/api/auth/me
# Expected: {"authenticated":false} (status 401)
```

### T-017: Crear lib/csrf.ts
```bash
npx tsx -e "import { generateCsrfToken, verifyCsrfToken } from './src/lib/csrf'; const t = generateCsrfToken(); console.log(verifyCsrfToken(t, t))"
# Expected: true
npx tsx -e "import { verifyCsrfToken } from './src/lib/csrf'; console.log(verifyCsrfToken('a', 'b'))"
# Expected: false
npx tsx -e "import { verifyCsrfToken } from './src/lib/csrf'; console.log(verifyCsrfToken(undefined, undefined))"
# Expected: false
```

### T-018: Crear lib/ratelimit.ts
```bash
npx tsx -e "import { checkLoginLimit } from './src/lib/ratelimit'; checkLoginLimit('test').then(r => console.log(r.success))"
# Expected: true (no-op en dev sin Redis)
```

### T-019: Crear lib/sanitize.ts
```bash
npx tsx -e "import { sanitizeHtml } from './src/lib/sanitize'; console.log(sanitizeHtml('<script>alert(1)</script>Hello'))"
# Expected: "Hello"
npx tsx -e "import { sanitizeHtml } from './src/lib/sanitize'; console.log(sanitizeHtml('<b>bold</b>'))"
# Expected: "bold" (strips all tags)
```

### T-020: Crear lib/audit.ts
```bash
npx tsx -e "import { logAudit } from './src/lib/audit'; import { getAuditLog } from './src/lib/data'; logAudit('login-success', '127.0.0.1', true).then(() => getAuditLog()).then(l => console.log(l.some(e => e.action === 'login-success')))"
# Expected: true
```

### T-021: Crear middleware.ts
```bash
pnpm dev
# Security headers:
curl -I http://localhost:3000 | grep -i "content-security-policy"
curl -I http://localhost:3000 | grep -i "strict-transport-security"
curl -I http://localhost:3000 | grep -i "x-frame-options"
curl -I http://localhost:3000 | grep -i "x-content-type-options"
curl -I http://localhost:3000 | grep -i "referrer-policy"
# CSRF gate:
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{}'
# Expected: 403 Forbidden (CSRF token missing)
```

### T-022: Crear lib/uploadthing/core.ts
```bash
npx tsx -e "import { uploadRouter } from './src/lib/uploadthing/core'; console.log(typeof uploadRouter.imageUploader)"
# Expected: "object"
```

### T-023: Crear app/api/uploadthing/route.ts
```bash
curl -s http://localhost:3000/api/uploadthing
# Expected: 200 (cuando auth OK) o redirect
```

### T-024: Crear lib/constants.ts
```bash
npx tsx -e "import { SESSION_COOKIE, CSRF_COOKIE, SESSION_MAX_AGE, MAX_FILE_SIZE } from './src/lib/constants'; console.log(SESSION_COOKIE === 'admin_token' && CSRF_COOKIE === 'csrf_token' && SESSION_MAX_AGE === 8*60*60 && MAX_FILE_SIZE === 4*1024*1024)"
# Expected: true
```

---

## Bloque 4 — API routes

### T-025: POST /api/auth/login
```bash
# Password correcto → 200 + cookie
curl -s -c cookies.txt -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"password":"changeme123"}'
# Expected: {"ok":true,"csrfToken":"..."}

# Password incorrecto → 401
curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"password":"wrong"}'
# Expected: {"error":"Password incorrecto"}

# 6º intento → 429
for i in $(seq 1 6); do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"password":"wrong"}'; done
# Expected: 401 401 401 401 401 429
```

### T-026: POST /api/auth/logout
```bash
curl -s -b cookies.txt -X POST http://localhost:3000/api/auth/logout
# Expected: {"ok":true}
curl -s -b cookies.txt http://localhost:3000/api/auth/me
# Expected: 401 (cookie eliminada)
```

### T-027: GET /api/auth/me
```bash
# Sin cookie → 401
curl -s http://localhost:3000/api/auth/me
# Expected: {"authenticated":false}

# Con cookie válida → 200
curl -s -b cookies.txt http://localhost:3000/api/auth/me
# Expected: {"authenticated":true}
```

### T-028: GET /api/products
```bash
curl -s http://localhost:3000/api/products | head -c 100
# Expected: {"data":[...]}
```

### T-029: POST /api/products
```bash
# Sin auth → 401
curl -s -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{}'
# Expected: 401

# Con auth + CSRF → 201
CSRF=$(curl -s -b cookies.txt http://localhost:3000/api/auth/me > /dev/null; grep csrf_token cookies.txt | awk '{print $NF}')
curl -s -b cookies.txt -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "x-csrf-token: $CSRF" -d '{"titulo":"Test","descripcion":"Test desc","precio":100}'
# Expected: {"data":{...}} (201)
```

### T-030: PUT /api/products/[id]
```bash
# Con id existente → 200
# Con id inexistente → 404
```

### T-031: DELETE /api/products/[id]
```bash
# DELETE → producto desaparece de GET
# Id inexistente → 404
```

### T-032 a T-043: Sections, Categories, Config, Media, Backup
```bash
# Mismo patrón: GET público, POST/PUT/DELETE requieren auth + CSRF
# Verificar cada endpoint con curl -b cookies.txt -H "x-csrf-token: $CSRF"
```

---

## Bloque 5 — Storefront UI

### T-044: Layout root + providers
```bash
pnpm build
# Verificar: fuentes Outfit + JetBrains Mono en el bundle
grep -r "font-outfit\|font-jetbrains" .next/static/css/
```

### T-046: Home storefront
```bash
pnpm dev
# Abrir http://localhost:3000
# Verificar: productos seed visibles, Hero con terminal 3D
```

### T-047: Hero con Terminal3D
```bash
# Verificar: terminal 3D renderiza
# En reduced-motion (DevTools > Rendering > prefers-reduced-motion): versión estática
```

### T-048: ProductGrid
```bash
# Verificar: grid responsive 1/2/3 cols
# Hover escala la tarjeta (scale 1.03)
# Reduced-motion: sin animación
```

---

## Bloque 6 — Admin UI

### T-056: Admin login
```bash
# Ir a http://localhost:3000/admin
# Password correcto → redirect a /admin/dashboard
# Password incorrecto → mensaje de error
```

### T-060: Admin productos
```bash
# Crear producto → aparece en lista y en storefront
# Editar producto → cambios reflejados
# Eliminar producto → desaparece
```

---

## Bloque 7 — Seed + deploy

### T-069: ensureSeed en boot
```bash
# Primera carga en dev con Redis vacío → productos seed aparecen
curl -s http://localhost:3000/api/products | python3 -c "import sys,json; print(len(json.load(sys.stdin)['data']))"
# Expected: 6
```

### T-070: next.config.ts security
```bash
curl -I http://localhost:3000 | grep -i "x-powered-by"
# Expected: (sin output — poweredByHeader: false)
```

### T-071: Dockerfile
```bash
docker build .
# Expected: completa sin errores
```

---

## Resumen

| Bloque | Tests | Estado |
|--------|-------|--------|
| 1. Scaffold + config | T-001 a T-006 | ⬜ Pendiente (ejecutar en Antigravity) |
| 2. Schemas + data | T-007 a T-014 | ⬜ Pendiente |
| 3. Seguridad | T-015 a T-024 | ⬜ Pendiente |
| 4. API routes | T-025 a T-043 | ⬜ Pendiente |
| 5. Storefront UI | T-044 a T-055 | ⬜ Pendiente |
| 6. Admin UI | T-056 a T-068 | ⬜ Pendiente |
| 7. Seed + deploy | T-069 a T-073 | ⬜ Pendiente |

> Todos los tests requieren Node.js funcional (no disponible en WSL/Windows actual).
> Ejecutar `pnpm install && pnpm dev` en Antigravity para validar.
