# VIVA Barrio

Módulo web para **VIVA App**: tiendas de barrio, mapa, QR dinámico, gamificación (meta WiFi) y antifraude por usuario único.

## Stack

- [T3 Stack](https://create.t3.gg): Next.js 15, tRPC, Prisma, NextAuth
- **pnpm** + **PostgreSQL** (Docker en local)

## Inicio rápido

```bash
docker compose up -d    # Postgres en puerto 5433
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

> Si falla la conexión a la BD, revisa que `DATABASE_URL` use el puerto **5433** (ver `.env.example`).

→ http://localhost:3000

**Demo:** `comprador@viva.demo` / `caserita@viva.demo` — contraseña `demo1234`

Documentación del equipo: carpeta [`.cursor/`](./.cursor/) (setup, arquitectura, AWS).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Desarrollo |
| `pnpm db:docker` | Postgres en Docker |
| `pnpm db:setup` | Docker + schema + seed |
| `pnpm build` | Build producción |

## Licencia

Privado — CochaTech / VIVA App.
