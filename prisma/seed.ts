import { PrismaClient, UserRole } from "../generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const CICLO_ID = "2026-05";
const PASSWORD = "demo1234";
const COCHA_CENTER = { lat: -17.3895, lng: -66.1568 };

type OfertaSeed = {
  nombre: string;
  original: number;
  descuento: number;
  stock: number;
  activa?: boolean;
};

type TiendaSeed = {
  nombre: string;
  zona: string;
  offset: { lat: number; lng: number };
  whatsapp: string;
  ownerEmail: string;
  ownerName: string;
  metaUsuarios?: number;
  /** Vecinos únicos con punto este ciclo (se recalcula al insertar compras) */
  targetVecinos?: number;
  ofertas: OfertaSeed[];
};

type CompradorSeed = {
  email: string;
  name: string;
};

const COMPRADORES: CompradorSeed[] = [
  { email: "comprador@viva.demo", name: "Juan Pérez" },
  { email: "maria.lopez@viva.demo", name: "María López" },
  { email: "carlos.mamani@viva.demo", name: "Carlos Mamani" },
  { email: "ana.torres@viva.demo", name: "Ana Torres" },
  { email: "pedro.quispe@viva.demo", name: "Pedro Quispe" },
  { email: "lucia.fernandez@viva.demo", name: "Lucía Fernández" },
  { email: "diego.salas@viva.demo", name: "Diego Salas" },
  { email: "valeria.rios@viva.demo", name: "Valeria Ríos" },
  { email: "miguel.vargas@viva.demo", name: "Miguel Vargas" },
  { email: "sofia.mendoza@viva.demo", name: "Sofía Mendoza" },
  { email: "jorge.castro@viva.demo", name: "Jorge Castro" },
  { email: "elena.paredes@viva.demo", name: "Elena Paredes" },
];

const TIENDAS: TiendaSeed[] = [
  {
    nombre: "Kiosko Don Pepe",
    zona: "Zona Norte",
    offset: { lat: 0.002, lng: 0.001 },
    whatsapp: "59170000001",
    ownerEmail: "caserita@viva.demo",
    ownerName: "Doña Rosa Pepe",
    targetVecinos: 18,
    ofertas: [
      { nombre: "Coca-Cola 2.5L", original: 12, descuento: 9, stock: 40 },
      { nombre: "Papas Filipitos Ceibo", original: 8, descuento: 6.5, stock: 25 },
      { nombre: "Galletas Wafer Mabel", original: 7, descuento: 5.5, stock: 30 },
      { nombre: "Maruchan Pollo", original: 5, descuento: 4, stock: 45 },
    ],
  },
  {
    nombre: "Kiosko Doña María",
    zona: "Centro",
    offset: { lat: 0.001, lng: -0.002 },
    whatsapp: "59170000002",
    ownerEmail: "dona.maria@viva.demo",
    ownerName: "Doña María Velasco",
    targetVecinos: 12,
    ofertas: [
      { nombre: "Coca-Cola 2L", original: 10, descuento: 9, stock: 50 },
      { nombre: "Chocolate Ceibo", original: 6, descuento: 4.5, stock: 35 },
      { nombre: "Maruchan", original: 5, descuento: 4, stock: 60 },
      { nombre: "Pan integral", original: 5, descuento: 4.5, stock: 20 },
    ],
  },
  {
    nombre: "Mini Market El Vecino",
    zona: "Calatayud",
    offset: { lat: -0.003, lng: 0.002 },
    whatsapp: "59170000003",
    ownerEmail: "el.vecino@viva.demo",
    ownerName: "Carmen Rojas",
    targetVecinos: 8,
    ofertas: [
      { nombre: "Tacos Picantes", original: 9, descuento: 7, stock: 20 },
      { nombre: "Agua VIVA 2L", original: 8, descuento: 6, stock: 45 },
      { nombre: "Galletas Oreo", original: 11, descuento: 8.5, stock: 22 },
    ],
  },
  {
    nombre: "Depósito San Antonio",
    zona: "Sarco",
    offset: { lat: 0.001, lng: -0.004 },
    whatsapp: "59170000004",
    ownerEmail: "san.antonio@viva.demo",
    ownerName: "Antonio Gutiérrez",
    targetVecinos: 5,
    ofertas: [
      { nombre: "Coca-Cola 2.5L", original: 12, descuento: 9, stock: 80 },
      { nombre: "Tarjeta VIVA 10 Bs", original: 10, descuento: 10, stock: 100 },
      { nombre: "Filipitos Ceibo", original: 8, descuento: 6.5, stock: 40 },
    ],
  },
  {
    nombre: "Bodega La Esquina",
    zona: "Sarco",
    offset: { lat: -0.002, lng: -0.003 },
    whatsapp: "59170000005",
    ownerEmail: "la.esquina@viva.demo",
    ownerName: "Patricia Mamani",
    targetVecinos: 14,
    ofertas: [
      { nombre: "Papas Lay's Clásicas", original: 9, descuento: 7, stock: 18 },
      { nombre: "Chocolate Ceibo", original: 6, descuento: 5, stock: 28 },
      { nombre: "Coca-Cola 2L", original: 10, descuento: 8.5, stock: 35 },
    ],
  },
  {
    nombre: "Mercadito Los Pinos",
    zona: "Queru Queru",
    offset: { lat: 0.004, lng: 0.003 },
    whatsapp: "59170000006",
    ownerEmail: "los.pinos@viva.demo",
    ownerName: "Rosa Losada",
    targetVecinos: 9,
    ofertas: [
      { nombre: "Maruchan Pollo", original: 5, descuento: 4, stock: 55 },
      { nombre: "Galletas Wafer Mabel", original: 7, descuento: 5.5, stock: 32 },
      { nombre: "Coca-Cola 2L", original: 10, descuento: 8.5, stock: 40 },
      { nombre: "Tacos Picantes", original: 9, descuento: 7, stock: 15, activa: false },
    ],
  },
  {
    nombre: "Kiosco VIVA Express",
    zona: "Hipódromo",
    offset: { lat: -0.001, lng: 0.004 },
    whatsapp: "59170000007",
    ownerEmail: "viva.express@viva.demo",
    ownerName: "Lucía VIVA",
    metaUsuarios: 30,
    targetVecinos: 30,
    ofertas: [
      { nombre: "Tarjeta VIVA 10 Bs", original: 10, descuento: 10, stock: 200 },
      { nombre: "Agua VIVA 2L", original: 8, descuento: 6, stock: 70 },
      { nombre: "Coca-Cola 2.5L", original: 12, descuento: 9, stock: 50 },
    ],
  },
  {
    nombre: "Kiosko El Progreso",
    zona: "Muyurina",
    offset: { lat: 0.003, lng: -0.001 },
    whatsapp: "59170000008",
    ownerEmail: "el.progreso@viva.demo",
    ownerName: "Marcela Progreso",
    targetVecinos: 22,
    ofertas: [
      { nombre: "Coca-Cola 2L", original: 10, descuento: 8, stock: 60 },
      { nombre: "Chocolate Ceibo", original: 6, descuento: 4.5, stock: 40 },
      { nombre: "Maruchan", original: 5, descuento: 3.5, stock: 80 },
    ],
  },
  {
    nombre: "Depósito 16 de Julio",
    zona: "16 de Julio",
    offset: { lat: -0.004, lng: 0.001 },
    whatsapp: "59170000009",
    ownerEmail: "16julio@viva.demo",
    ownerName: "Héctor Flores",
    targetVecinos: 7,
    ofertas: [
      { nombre: "Coca-Cola 2.5L", original: 12, descuento: 9.5, stock: 90 },
      { nombre: "Papas Filipitos Ceibo", original: 8, descuento: 6, stock: 30 },
    ],
  },
  {
    nombre: "Mini Market Sur",
    zona: "Villa Coronilla",
    offset: { lat: -0.002, lng: 0.005 },
    whatsapp: "59170000010",
    ownerEmail: "market.sur@viva.demo",
    ownerName: "Verónica Sur",
    targetVecinos: 11,
    ofertas: [
      { nombre: "Galletas Wafer Mabel", original: 7, descuento: 5.5, stock: 25 },
      { nombre: "Agua VIVA 2L", original: 8, descuento: 6, stock: 55 },
      { nombre: "Tarjeta VIVA 10 Bs", original: 10, descuento: 10, stock: 80 },
      { nombre: "Tacos Picantes", original: 9, descuento: 7, stock: 12 },
    ],
  },
  {
    nombre: "Bodega San Pedro",
    zona: "San Pedro",
    offset: { lat: 0.005, lng: -0.002 },
    whatsapp: "59170000011",
    ownerEmail: "san.pedro@viva.demo",
    ownerName: "Elena San Pedro",
    targetVecinos: 4,
    ofertas: [
      { nombre: "Coca-Cola 2L", original: 10, descuento: 9, stock: 30 },
      { nombre: "Maruchan Pollo", original: 5, descuento: 4, stock: 40 },
    ],
  },
  {
    nombre: "Kiosko La Familia",
    zona: "Tupuraya",
    offset: { lat: -0.001, lng: -0.005 },
    whatsapp: "59170000012",
    ownerEmail: "la.familia@viva.demo",
    ownerName: "Familia Quispe",
    targetVecinos: 16,
    ofertas: [
      { nombre: "Chocolate Ceibo", original: 6, descuento: 4.5, stock: 50 },
      { nombre: "Papas Lay's Clásicas", original: 9, descuento: 7, stock: 22 },
      { nombre: "Coca-Cola 2.5L", original: 12, descuento: 9, stock: 45 },
      { nombre: "Galletas Oreo", original: 11, descuento: 8, stock: 18 },
    ],
  },
];

/** Compra planificada: índices de comprador y tienda, índice de oferta, días atrás */
type CompraPlan = {
  compradorIdx: number;
  tiendaIdx: number;
  ofertaIdx: number;
  daysAgo: number;
};

function daysAgoDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(10 + (days % 8), (days * 7) % 60, 0, 0);
  return d;
}

/** Genera compras variadas para todas las tiendas */
function buildComprasPlan(): CompraPlan[] {
  const plans: CompraPlan[] = [];
  const nCompradores = COMPRADORES.length;
  const nTiendas = TIENDAS.length;

  for (let t = 0; t < nTiendas; t++) {
    const tienda = TIENDAS[t]!;
    const target = tienda.targetVecinos ?? 10;
    const nOfertas = tienda.ofertas.filter((o) => o.activa !== false).length;

    // Primeras compras: vecinos únicos con punto
    for (let v = 0; v < target; v++) {
      const compradorIdx = (t * 3 + v) % nCompradores;
      plans.push({
        compradorIdx,
        tiendaIdx: t,
        ofertaIdx: v % nOfertas,
        daysAgo: 28 - (v % 20),
      });
    }

    // Compras extra (sin punto — mismo vecino repite)
    const extras = Math.floor(target * 0.6) + 2;
    for (let e = 0; e < extras; e++) {
      const compradorIdx = (t + e) % nCompradores;
      plans.push({
        compradorIdx,
        tiendaIdx: t,
        ofertaIdx: (e + 1) % nOfertas,
        daysAgo: 15 - (e % 12),
      });
    }
  }

  // Historial cruzado: compradores activos en varias tiendas
  const cross: CompraPlan[] = [
    { compradorIdx: 0, tiendaIdx: 0, ofertaIdx: 0, daysAgo: 3 },
    { compradorIdx: 0, tiendaIdx: 1, ofertaIdx: 1, daysAgo: 5 },
    { compradorIdx: 0, tiendaIdx: 2, ofertaIdx: 0, daysAgo: 8 },
    { compradorIdx: 0, tiendaIdx: 4, ofertaIdx: 2, daysAgo: 12 },
    { compradorIdx: 0, tiendaIdx: 0, ofertaIdx: 1, daysAgo: 2 },
    { compradorIdx: 1, tiendaIdx: 0, ofertaIdx: 0, daysAgo: 4 },
    { compradorIdx: 1, tiendaIdx: 3, ofertaIdx: 0, daysAgo: 7 },
    { compradorIdx: 2, tiendaIdx: 1, ofertaIdx: 2, daysAgo: 6 },
    { compradorIdx: 2, tiendaIdx: 6, ofertaIdx: 0, daysAgo: 10 },
    { compradorIdx: 3, tiendaIdx: 7, ofertaIdx: 1, daysAgo: 9 },
    { compradorIdx: 4, tiendaIdx: 5, ofertaIdx: 2, daysAgo: 11 },
    { compradorIdx: 5, tiendaIdx: 8, ofertaIdx: 0, daysAgo: 14 },
    { compradorIdx: 6, tiendaIdx: 9, ofertaIdx: 1, daysAgo: 13 },
    { compradorIdx: 7, tiendaIdx: 10, ofertaIdx: 0, daysAgo: 16 },
    { compradorIdx: 8, tiendaIdx: 11, ofertaIdx: 2, daysAgo: 18 },
    { compradorIdx: 9, tiendaIdx: 0, ofertaIdx: 2, daysAgo: 1 },
    { compradorIdx: 10, tiendaIdx: 4, ofertaIdx: 0, daysAgo: 20 },
    { compradorIdx: 11, tiendaIdx: 7, ofertaIdx: 0, daysAgo: 22 },
  ];

  plans.push(...cross);
  return plans;
}

async function limpiarDatosDemo() {
  const demoEmails = [
    ...COMPRADORES.map((c) => c.email),
    ...TIENDAS.map((t) => t.ownerEmail),
  ];

  const users = await prisma.user.findMany({
    where: { email: { in: demoEmails } },
    select: { id: true },
  });
  const userIds = users.map((u) => u.id);

  if (userIds.length > 0) {
    await prisma.cuponTransaccion.deleteMany({
      where: { usuarioId: { in: userIds } },
    });
  }

  await prisma.cuponTransaccion.deleteMany({
    where: { tienda: { owner: { email: { endsWith: "@viva.demo" } } } },
  });

  await prisma.productoOferta.deleteMany({
    where: { tienda: { owner: { email: { endsWith: "@viva.demo" } } } },
  });

  await prisma.kioskoTienda.deleteMany({
    where: { owner: { email: { endsWith: "@viva.demo" } } },
  });

  await prisma.user.deleteMany({
    where: { email: { endsWith: "@viva.demo" } },
  });
}

async function main() {
  console.log("Limpiando datos demo anteriores…");
  await limpiarDatosDemo();

  const passwordHash = await hash(PASSWORD, 12);

  const compradorIds: string[] = [];
  for (const c of COMPRADORES) {
    const u = await prisma.user.create({
      data: {
        email: c.email,
        name: c.name,
        role: UserRole.COMPRADOR,
        passwordHash,
      },
    });
    compradorIds.push(u.id);
  }

  type TiendaCreada = {
    id: string;
    metaUsuarios: number;
    ofertaIds: string[];
  };

  const tiendasCreadas: TiendaCreada[] = [];

  for (const t of TIENDAS) {
    const owner = await prisma.user.create({
      data: {
        email: t.ownerEmail,
        name: t.ownerName,
        role: UserRole.CASERITA,
        passwordHash,
      },
    });

    const metaUsuarios = t.metaUsuarios ?? 30;
    const tienda = await prisma.kioskoTienda.create({
      data: {
        nombreTienda: t.nombre,
        lat: COCHA_CENTER.lat + t.offset.lat,
        lng: COCHA_CENTER.lng + t.offset.lng,
        zonaBarrio: t.zona,
        cicloId: CICLO_ID,
        clientesAtendidosCiclo: 0,
        metaUsuarios,
        metaInternetAlcanzada: false,
        whatsappDuenia: t.whatsapp,
        pasarelaActiva: true,
        ownerId: owner.id,
        ofertas: {
          create: t.ofertas.map((o) => ({
            nombreProducto: o.nombre,
            precioOriginal: o.original,
            precioDescuento: o.descuento,
            stock: o.stock,
            activa: o.activa ?? true,
          })),
        },
      },
      include: { ofertas: true },
    });

    tiendasCreadas.push({
      id: tienda.id,
      metaUsuarios,
      ofertaIds: tienda.ofertas.map((o) => o.id),
    });
  }

  const comprasPlan = buildComprasPlan();
  const puntoPorTiendaUsuario = new Map<string, boolean>();

  for (const plan of comprasPlan) {
    const tienda = tiendasCreadas[plan.tiendaIdx];
    const usuarioId = compradorIds[plan.compradorIdx];
    if (!tienda || !usuarioId) continue;

    const ofertaId =
      tienda.ofertaIds[plan.ofertaIdx % tienda.ofertaIds.length] ?? null;

    const key = `${tienda.id}:${usuarioId}`;
    const yaSumo = puntoPorTiendaUsuario.get(key) === true;
    const puntoOtorgado = !yaSumo;
    if (puntoOtorgado) puntoPorTiendaUsuario.set(key, true);

    await prisma.cuponTransaccion.create({
      data: {
        tiendaId: tienda.id,
        usuarioId,
        ofertaId,
        cicloId: CICLO_ID,
        estado: "COMPLETADO",
        puntoOtorgado,
        fechaRegistro: daysAgoDate(plan.daysAgo),
      },
    });
  }

  for (const tienda of tiendasCreadas) {
    const vecinosUnicos = await prisma.cuponTransaccion.groupBy({
      by: ["usuarioId"],
      where: {
        tiendaId: tienda.id,
        cicloId: CICLO_ID,
        puntoOtorgado: true,
        estado: "COMPLETADO",
      },
    });

    const count = vecinosUnicos.length;
    const metaAlcanzada = count >= tienda.metaUsuarios;

    await prisma.kioskoTienda.update({
      where: { id: tienda.id },
      data: {
        clientesAtendidosCiclo: count,
        metaInternetAlcanzada: metaAlcanzada,
      },
    });
  }

  const totalCompras = await prisma.cuponTransaccion.count();
  const totalOfertas = await prisma.productoOferta.count();

  console.log("\nSeed completo — VIVA Barrio");
  console.log("────────────────────────────────────────");
  console.log(`  Compradores: ${COMPRADORES.length} (contraseña: ${PASSWORD})`);
  console.log(`  Tiendas:     ${TIENDAS.length}`);
  console.log(`  Ofertas:     ${totalOfertas}`);
  console.log(`  Compras:     ${totalCompras}`);
  console.log("────────────────────────────────────────");
  console.log("  Cuentas principales:");
  console.log("    comprador@viva.demo  → Juan (muchas compras y puntos)");
  console.log("    caserita@viva.demo   → Kiosko Don Pepe");
  console.log("    viva.express@viva.demo → Meta 30/30 alcanzada");
  console.log("  Otros compradores: maria.lopez, carlos.mamani, ana.torres… @viva.demo");
  console.log("────────────────────────────────────────\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
