import { NextResponse } from "next/server";

import { env } from "~/env";
import {
  buildReporteWhatsApp,
  responderPregunta,
  type ResumenTienda,
} from "~/lib/whatsapp-asistente";
import { db } from "~/server/db";

/** Verificación del webhook de Meta WhatsApp Cloud API */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token &&
    env.WHATSAPP_VERIFY_TOKEN &&
    token === env.WHATSAPP_VERIFY_TOKEN &&
    challenge
  ) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

type WaMessage = { from: string; text?: { body: string } };

async function enviarWhatsApp(to: string, body: string) {
  const token = env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return;

  await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });
}

async function resumenPorTelefono(phone: string): Promise<ResumenTienda | null> {
  const digits = phone.replace(/\D/g, "").slice(-8);
  const tienda = await db.kioskoTienda.findFirst({
    where: {
      whatsappDuenia: { contains: digits },
    },
  });
  if (!tienda) return null;

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);

  const [ventasCiclo, ventasHoy] = await Promise.all([
    db.cuponTransaccion.count({
      where: { tiendaId: tienda.id, cicloId: tienda.cicloId, estado: "COMPLETADO" },
    }),
    db.cuponTransaccion.count({
      where: {
        tiendaId: tienda.id,
        estado: "COMPLETADO",
        fechaRegistro: { gte: inicioHoy },
      },
    }),
  ]);

  return {
    nombreTienda: tienda.nombreTienda,
    cicloId: tienda.cicloId,
    clientesAtendidos: tienda.clientesAtendidosCiclo,
    metaUsuarios: tienda.metaUsuarios,
    faltan: Math.max(0, tienda.metaUsuarios - tienda.clientesAtendidosCiclo),
    metaAlcanzada: tienda.metaInternetAlcanzada,
    ventasCiclo,
    ventasHoy,
  };
}

/** Mensajes entrantes — requiere WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID */
export async function POST(req: Request) {
  if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
    return NextResponse.json({ ok: true, skipped: "not_configured" });
  }

  try {
    const body = (await req.json()) as {
      entry?: Array<{
        changes?: Array<{
          value?: { messages?: WaMessage[] };
        }>;
      }>;
    };

    const messages =
      body.entry?.[0]?.changes?.[0]?.value?.messages ?? [];

    for (const msg of messages) {
      const from = msg.from;
      const text = msg.text?.body?.trim();
      if (!from || !text) continue;

      const resumen = await resumenPorTelefono(from);
      if (!resumen) {
        await enviarWhatsApp(
          from,
          "Hola 👋 No encontramos tu tienda en VIVA Barrio. Registra tu WhatsApp en la app (Editar tienda) con el mismo número.",
        );
        continue;
      }

      let respuesta: string;
      if (text.toLowerCase() === "reporte") {
        respuesta = buildReporteWhatsApp(resumen);
      } else {
        respuesta = responderPregunta(text, resumen);
      }

      await enviarWhatsApp(from, respuesta);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
