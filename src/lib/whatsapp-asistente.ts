export type ResumenTienda = {
  nombreTienda: string;
  cicloId: string;
  clientesAtendidos: number;
  metaUsuarios: number;
  faltan: number;
  metaAlcanzada: boolean;
  ventasCiclo: number;
  ventasHoy: number;
};

export function formatCicloLabel(cicloId: string): string {
  const [y, m] = cicloId.split("-");
  if (!y || !m) return cicloId;
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const idx = parseInt(m, 10) - 1;
  return `${meses[idx] ?? m} ${y}`;
}

export function buildReporteWhatsApp(r: ResumenTienda): string {
  const ciclo = formatCicloLabel(r.cicloId);
  const lineas = [
    `Hola VIVA Barrio 👋`,
    `Reporte de *${r.nombreTienda}*`,
    `Ciclo: ${ciclo}`,
    ``,
    `📊 Vecinos únicos: *${r.clientesAtendidos}* / ${r.metaUsuarios}`,
    r.metaAlcanzada
      ? `✅ ¡Meta de internet gratis alcanzada!`
      : `🎯 Faltan *${r.faltan}* vecinos para el beneficio`,
    `🛒 Ventas registradas (ciclo): *${r.ventasCiclo}*`,
    `📅 Ventas hoy: *${r.ventasHoy}*`,
    ``,
    `_Responde con: ventas | meta | reporte_`,
  ];
  return lineas.join("\n");
}

export function responderPregunta(
  pregunta: string,
  r: ResumenTienda,
): string {
  const p = pregunta.toLowerCase().trim();

  if (
    p.includes("meta") ||
    p.includes("falta") ||
    p.includes("wifi") ||
    p.includes("internet")
  ) {
    if (r.metaAlcanzada) {
      return `¡Felicitaciones! Ya alcanzaste la meta de ${r.metaUsuarios} vecinos únicos este mes. Tu beneficio de internet gratis está activo.`;
    }
    return `Te faltan ${r.faltan} vecinos únicos para la meta (${r.clientesAtendidos}/${r.metaUsuarios}). Cada comprador nuevo con QR suma 1 punto.`;
  }

  if (
    p.includes("venta") ||
    p.includes("cobro") ||
    p.includes("vendí") ||
    p.includes("vendi")
  ) {
    return `Este ciclo llevas ${r.ventasCiclo} ventas registradas. Hoy: ${r.ventasHoy}. Sigue mostrando el QR de cobro a tus clientes.`;
  }

  if (p.includes("hola") || p.includes("ayuda")) {
    return `Puedo ayudarte con: "¿cómo van mis ventas?", "¿cuánto me falta para la meta?" o pide "reporte" para enviarlo por WhatsApp.`;
  }

  if (p.includes("reporte") || p.includes("resumen")) {
    return buildReporteWhatsApp(r);
  }

  return `En ${r.nombreTienda} vas ${r.clientesAtendidos}/${r.metaUsuarios} vecinos (${r.faltan} faltan) y ${r.ventasCiclo} ventas en el ciclo. ¿Quieres saber de ventas o de la meta?`;
}

export function waMeLink(phoneDigits: string, text: string): string {
  const digits = phoneDigits.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
