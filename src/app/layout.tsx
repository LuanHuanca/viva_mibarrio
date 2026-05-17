import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { Providers } from "~/app/providers";

export const metadata: Metadata = {
  title: "VIVA Barrio",
  description: "Descubre tiendas de barrio, paga con descuento y gana beneficios",
  icons: [
    { rel: "icon", url: "/logo.png", type: "image/png" },
    { rel: "apple-touch-icon", url: "/logo.png" },
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable}`}>
      <body className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
