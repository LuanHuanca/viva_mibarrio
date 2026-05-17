/** Imágenes por defecto en /public hasta conectar S3 */
const PRODUCT_IMAGES: { match: string; src: string }[] = [
  { match: "coca", src: "/coca_cola.png" },
  { match: "gaseosa", src: "/coca_cola.png" },
  { match: "chocolate", src: "/chocolate_ceibo.jpg" },
  { match: "ceibo", src: "/chocolate_ceibo.jpg" },
  { match: "filipito", src: "/filipitos_ceibo.jpg" },
  { match: "galleta", src: "/galletas_wafer_mabel.jpg" },
  { match: "wafer", src: "/galletas_wafer_mabel.jpg" },
  { match: "maruchan", src: "/maruchan.jpg" },
  { match: "taco", src: "/tacos.jpg" },
  { match: "viva", src: "/tarjeta_viva_10.jpg" },
  { match: "tarjeta", src: "/tarjeta_viva_10.jpg" },
  { match: "papa", src: "/filipitos_ceibo.jpg" },
  { match: "lay", src: "/filipitos_ceibo.jpg" },
  { match: "oreo", src: "/galletas_wafer_mabel.jpg" },
  { match: "agua", src: "/tarjeta_viva_10.jpg" },
  { match: "pan", src: "/galletas_wafer_mabel.jpg" },
];

const FALLBACK_IMAGE = "/coca_cola.png";

export function getProductImageSrc(nombre: string): string {
  const n = nombre.toLowerCase();
  for (const { match, src } of PRODUCT_IMAGES) {
    if (n.includes(match)) return src;
  }
  return FALLBACK_IMAGE;
}

export function productBgClass(_nombre: string): string {
  return "bg-white";
}
