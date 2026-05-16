import { PrismaClient, UserRole } from "../generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const CICLO_ID = "2026-05";
const COCHA_CENTER = { lat: -17.3895, lng: -66.1568 };

const TIENDAS_DEMO = [
  {
    nombre: "Kiosko Doña María",
    zona: "Centro",
    offset: { lat: 0.002, lng: 0.001 },
  },
  {
    nombre: "Mini Market El Vecino",
    zona: "Calatayud",
    offset: { lat: -0.003, lng: 0.002 },
  },
  {
    nombre: "Depósito San Antonio",
    zona: "Sarco",
    offset: { lat: 0.001, lng: -0.004 },
  },
] as const;

async function main() {
  const passwordHash = await hash("demo1234", 12);

  const comprador = await prisma.user.upsert({
    where: { email: "comprador@viva.demo" },
    update: {},
    create: {
      email: "comprador@viva.demo",
      name: "Vecino Demo",
      role: UserRole.COMPRADOR,
      passwordHash,
    },
  });

  const caseritaUser = await prisma.user.upsert({
    where: { email: "caserita@viva.demo" },
    update: {},
    create: {
      email: "caserita@viva.demo",
      name: "Doña María",
      role: UserRole.CASERITA,
      passwordHash,
    },
  });

  await prisma.kioskoTienda.upsert({
    where: { ownerId: caseritaUser.id },
    update: {},
    create: {
      nombreTienda: "Kiosko Doña María",
      lat: COCHA_CENTER.lat + 0.002,
      lng: COCHA_CENTER.lng + 0.001,
      zonaBarrio: "Centro",
      cicloId: CICLO_ID,
      whatsappDuenia: "+59170000001",
      ownerId: caseritaUser.id,
      ofertas: {
        create: [
          {
            nombreProducto: "Coca-Cola 2L",
            precioOriginal: 10,
            precioDescuento: 9,
            stock: 50,
            activa: true,
          },
          {
            nombreProducto: "Pan integral",
            precioOriginal: 5,
            precioDescuento: 4.5,
            stock: 30,
            activa: true,
          },
        ],
      },
    },
  });

  for (let i = 0; i < TIENDAS_DEMO.length; i++) {
    const t = TIENDAS_DEMO[i]!;
    const email = `tienda${i + 1}@viva.demo`;
    const owner = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: `Dueña ${t.nombre}`,
        role: UserRole.CASERITA,
        passwordHash,
      },
    });

    await prisma.kioskoTienda.upsert({
      where: { ownerId: owner.id },
      update: {},
      create: {
        nombreTienda: t.nombre,
        lat: COCHA_CENTER.lat + t.offset.lat,
        lng: COCHA_CENTER.lng + t.offset.lng,
        zonaBarrio: t.zona,
        cicloId: CICLO_ID,
        clientesAtendidosCiclo: i === 0 ? 5 : 0,
        whatsappDuenia: `+5917000000${i + 2}`,
        ownerId: owner.id,
        ofertas: {
          create: [
            {
              nombreProducto: "Coca-Cola 2L",
              precioOriginal: 10,
              precioDescuento: 9,
              stock: 40,
            },
          ],
        },
      },
    });
  }

  console.log("Seed OK");
  console.log("  Comprador: comprador@viva.demo / demo1234");
  console.log("  Caserita:  caserita@viva.demo / demo1234");
  console.log("  Comprador id:", comprador.id);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
