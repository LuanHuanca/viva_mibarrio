/** Rutas de elementos gráficos en /public/elementos-graficos */
const base = "/elementos-graficos";

export const graphics = {
  empty: {
    sinOfertas: `${base}/aun-no-tienes-oferta.png`,
    sinTiendas: `${base}/no-hay-tiendas.png`,
    sinCompras: `${base}/sin-compra-aun.png`,
    sinNotificaciones: `${base}/no-hay-notificaciones.png`,
    sinConexion: `${base}/sin-conexion.png`,
  },
  qr: {
    valido: `${base}/qr-vaido.png`,
    explicado: `${base}/qr-explicado.png`,
    usado: `${base}/qr-usado.png`,
    invalido: `${base}/qr-invalido.png`,
    noDisponible: `${base}/qr-no-disponible.png`,
  },
  meta: {
    alcanzada: `${base}/meta-alcanzada.png`,
    vecinos30: `${base}/meta-30-servicios.png`,
    vecinoUnico: `${base}/Vecino-unico.png`,
    insigniaPuntos: `${base}/insignia_puntos.png`,
    recompensa: `${base}/recompensa.png`,
    fondoPuntos: `${base}/Fondo-puntos y recompensa.png`,
  },
  decor: {
    patron: `${base}/patron-fondo-decorativo.png`,
    elemento: `${base}/elemento%20decorativo.png`,
    elemento1: `${base}/elemento-decorativo1.png`,
    elemento2: `${base}/elemento-decorativo2.png`,
    elemento3: `${base}/elemento-decorativo3.png`,
  },
} as const;
