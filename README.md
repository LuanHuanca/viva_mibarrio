# VIVA Barrio — Especificación de producto y UI

Documento para diseño de pantallas (Figma / ChatGPT / v0). Módulo web del ecosistema **VIVA App** que conecta **compradores** con **tiendas de barrio (caseritas)** en Cochabamba, Bolivia.

---

## 1. Resumen ejecutivo

**VIVA Barrio** permite:

- Descubrir kioskos cercanos con descuentos en un mapa.
- Pagar en tienda con flujo: publicidad obligatoria → escaneo de QR dinámico.
- Que la dueña de tienda cobre con QR que **se renueva cada 10 segundos** (anti-captura).
- Gamificación: la tienda necesita **30 vecinos únicos** (compradores distintos por mes) para ganar **internet gratis en casa**.
- Antifraude: un mismo comprador solo suma **1 punto** a la meta de la tienda por ciclo mensual, aunque compre varias veces.

**Ciudad demo:** Cochabamba (centro `-17.3895, -66.1568`).

---

## 2. Personas

| Persona | Rol técnico | Objetivo |
|---------|-------------|----------|
| **Vecino / Comprador** | `COMPRADOR` | Encontrar ofertas, ir al kiosko, pagar con descuento rápido |
| **Dueña de tienda (Caserita)** | `CASERITA` | Registrar kiosko, cobrar con QR, ver progreso hacia meta WiFi |

---

## 3. Identidad visual (sugerida)

| Token | Valor |
|-------|--------|
| Primario | Verde esmeralda `#059669` / `emerald-600` |
| Secundario | Teal `#0d9488` |
| Fondo | Degradado suave `emerald-50` → `teal-50` |
| Superficie | Tarjetas blancas, bordes `emerald-200`, sombra ligera |
| Tipografía | Sans geométrica (Geist / Inter) |
| Tono | Cercano, barrial, confiable; español Bolivia |

**Logo / marca:** “VIVA Barrio” + subtítulo “VIVA App · Módulo Barrio”.

---

## 4. Mapa completo de pantallas

### 4.1 Públicas (sin login)

#### P-01 — Landing `/`
- **Objetivo:** Presentar el módulo y entrar a login o registro.
- **Elementos:** Logo, título, descripción corta, 2 tarjetas (Comprador / Caserita), CTAs “Iniciar sesión” y “Crear cuenta”.
- **Si hay sesión:** CTA “Ir a mi panel” según rol.

#### P-02 — Login `/login`
- **Objetivo:** Autenticación email + contraseña.
- **Elementos:** Email, contraseña con **icono mostrar/ocultar**, botón Entrar, link a registro.
- **Estados:** Error credenciales, loading, banner “Cuenta creada” tras registro.
- **Demo:** `comprador@viva.demo` / `caserita@viva.demo` — `demo1234`

#### P-03 — Registro `/registro`
- **Objetivo:** Alta de usuario con elección de perfil.
- **Campos:** Nombre, email, contraseña (con toggle visibilidad), selector “Soy comprador” / “Soy dueña de tienda”.
- **Post-acción:** Redirige a login con email precargado.

---

### 4.2 Comprador (rol `COMPRADOR`)

#### C-01 — Mapa / Home `/comprador/mapa`
- **Objetivo:** Descubrimiento geolocalizado de tiendas con pasarela activa.
- **Elementos:**
  - Header: título “Tiendas cerca”, subtítulo “Cochabamba”.
  - **Mapa interactivo** (Leaflet): pines por tienda; centro Cochabamba.
  - Lista inferior o cards: nombre tienda, zona, ofertas destacadas (ej. Coca-Cola 9 Bs).
  - Botón “Comprar” por oferta.
- **Datos API:** `tienda.listMapa`
- **Estados:** Loading, lista vacía, error red.
- **Nota diseño MVP actual:** lista funcional; mapa es mejora visual prioritaria.

#### C-02 — Detalle tienda `/comprador/tienda/[id]` *(pendiente implementar)*
- **Objetivo:** Ver todas las ofertas de un kiosko antes de comprar.
- **Elementos:** Nombre, zona, distancia, lista de productos (precio original tachado, precio descuento), CTA comprar por ítem.

#### C-03 — Flujo de pago `/comprador/pagar/[ofertaId]`
- **Objetivo:** Pauta publicitaria + validación de compra por QR.
- **Fases (pantallas o estados en una sola vista):**
  1. **Ad obligatorio (5 s):** video o imagen full-width, countdown grande, texto “Patrocinado por VIVA”.
  2. **Escáner QR:** cámara trasera, marco de escaneo, instrucciones.
  3. **Éxito:** check verde, mensaje según si sumó punto a la tienda o no.
  4. **Error:** QR expirado / ya usado / red.
- **Datos API:** `transaccion.validar`
- **Query:** `?tienda=id` opcional.

---

### 4.3 Caserita (rol `CASERITA`)

#### S-01 — Onboarding tienda `/caserita/onboarding`
- **Objetivo:** Registrar kiosko y GPS para aparecer en el mapa.
- **Cuándo:** Caserita **sin tienda** aún (obligatorio antes del dashboard).
- **Campos:** Nombre kiosko, zona/barrio, WhatsApp opcional, botón “Usar mi ubicación GPS”.
- **Datos API:** `tienda.create`
- **Post-acción:** Dashboard.

#### S-02 — Dashboard `/caserita/dashboard`
- **Objetivo:** Centro de control de la dueña.
- **Si NO hay tienda:** pantalla vacía amigable + CTA grande “Registrar mi tienda” (no mostrar errores).
- **Si hay tienda:**
  - Header: nombre tienda, zona.
  - **Barra de progreso:** “X / 30 vecinos únicos” + “faltan N” + ciclo mensual (ej. 2026-05).
  - Banner si meta WiFi alcanzada.
  - CTA primario: “Cobrar ahora (QR dinámico)”.
  - CTA secundario: “Editar tienda” / “Agregar oferta”.
  - Lista de ofertas activas.
- **Datos API:** `tienda.mine` (incluye progreso en campos de tienda).

#### S-03 — Cobrar / QR fullscreen `/caserita/cobrar`
- **Objetivo:** Mostrar QR dinámico al comprador.
- **Elementos:** Fondo oscuro (`emerald-950`), QR grande centrado, countdown “Se actualiza en Ns”, nombre oferta opcional, link volver.
- **Comportamiento:** QR nuevo cada **10 segundos**.
- **Datos API:** `transaccion.qrToken`
- **Si sin tienda:** redirigir a onboarding.

#### S-04 — Nueva oferta `/caserita/ofertas/nueva` *(pendiente implementar)*
- **Objetivo:** CRUD oferta (producto, precios, stock).
- **Campos:** Nombre producto, precio original, precio descuento, stock.
- **Datos API:** `oferta.create`

#### S-05 — Meta alcanzada `/caserita/meta` *(pendiente implementar)*
- **Objetivo:** Celebración al llegar a 30 vecinos únicos.
- **Elementos:** Confeti, mensaje WiFi gratis, resumen del ciclo.

---

## 5. Flujos principales (para prototipo)

### Flujo A — Comprador compra con descuento
```
Login → Mapa → Elegir oferta → Ad 5s → Escanear QR caserita → Confirmación → Volver al mapa
```

### Flujo B — Caserita nueva
```
Registro (Caserita) → Login → Onboarding (GPS + datos) → Dashboard → Cobrar (QR) 
```

### Flujo C — Caserita demo (con datos seed)
```
Login caserita@viva.demo → Dashboard (barra 5/30) → Cobrar
```

---

## 6. Reglas de negocio (UI debe reflejarlas)

| Regla | Copy sugerido en UI |
|-------|---------------------|
| 1 comprador = 1 punto/mes/tienda | “Tu compra quedó registrada. Ya sumaste a esta tienda este mes.” |
| QR expira 10 s | “El código ya no vale. Pide uno nuevo en caja.” |
| Meta 30 vecinos | “Te faltan N vecinos únicos para tu internet gratis” |
| Ad obligatorio | “Un momento… contenido patrocinado” |

---

## 7. Modelo de datos (referencia UI)

### Tienda (Kiosko)
- nombre, zona, lat/lng, progreso `clientesAtendidosCiclo` / `metaUsuarios` (30), `metaInternetAlcanzada`, ciclo mensual.

### Oferta
- nombre producto, precio original, precio descuento, stock, activa.

### Transacción (cupón)
- usuario, tienda, oferta, si `puntoOtorgado` o no.

---

## 8. APIs tRPC (para datos en prototipo)

| Endpoint | Uso en pantalla |
|----------|-----------------|
| `auth.register` | Registro |
| `tienda.listMapa` | Mapa comprador |
| `tienda.getById` | Detalle tienda |
| `tienda.create` | Onboarding |
| `tienda.mine` | Dashboard caserita |
| `oferta.create` | Nueva oferta |
| `transaccion.qrToken` | Pantalla cobrar |
| `transaccion.validar` | Post-escaneo comprador |

---

## 9. Pantallas prioritarias para diseñar en Figma (orden)

1. C-01 Mapa (con mapa real + bottom sheet tienda)
2. C-03 Pago (Ad + Escáner + Éxito/Error) — 3 estados
3. S-02 Dashboard (con y sin tienda)
4. S-03 Cobrar QR fullscreen
5. S-01 Onboarding
6. P-01 Landing, P-02 Login, P-03 Registro
7. S-04 Nueva oferta, S-05 Meta alcanzada
8. C-02 Detalle tienda

---

## 10. Responsive

- **Comprador:** mobile-first (uso en calle con cámara).
- **Caserita:** móvil o tablet en mostrador; QR landscape-friendly.

---

## 11. Stack técnico (implementación actual)

- Next.js 15, T3 (tRPC, Prisma, NextAuth), pnpm, PostgreSQL Docker puerto **5433**.
- Auth: email/contraseña, JWT, roles `COMPRADOR` | `CASERITA`.

### Desarrollo local

```bash
pnpm install
pnpm db:setup   # docker + schema + seed
pnpm dev        # levanta Docker automáticamente
```

### Cuentas demo

| Email | Contraseña | Rol |
|-------|------------|-----|
| comprador@viva.demo | demo1234 | Comprador |
| caserita@viva.demo | demo1234 | Caserita (ya tiene tienda y ofertas) |

---

## 12. Prompt sugerido para ChatGPT (copiar y pegar)

```
Diseña un sistema de pantallas mobile-first para "VIVA Barrio", app web de tiendas de barrio en Cochabamba. 
Usa verde esmeralda (#059669), tarjetas blancas, tono cercano en español.

Personas: (1) Comprador vecino — mapa con pines, ofertas con descuento, flujo pago con ad 5s y escáner QR. 
(2) Caserita dueña de kiosko — onboarding GPS, dashboard con barra  X/30 vecinos únicos para ganar WiFi, pantalla cobro con QR grande que rota cada 10s.

Incluye: Landing, Login, Registro, Mapa, Detalle tienda, Pago (3 estados), Onboarding tienda, Dashboard, Cobrar QR, Nueva oferta, Pantalla meta lograda.

Sigue el detalle de rutas y componentes del README del proyecto VIVA Barrio.
```

---

## 13. Roadmap vs diseño

| Pantalla | Estado código |
|----------|----------------|
| Landing, Login, Registro | ✅ |
| Mapa (lista) | ✅ parcial |
| Pago (ad + pegar token) | ✅ parcial |
| Onboarding, Dashboard, Cobrar | ✅ |
| Mapa Leaflet, Cámara QR, Detalle tienda, Nueva oferta, Meta | 🔜 |

---

**CochaTech · VIVA App · Módulo VIVA Barrio**
