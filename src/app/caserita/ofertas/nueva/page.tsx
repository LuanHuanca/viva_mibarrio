"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PageTopBar } from "~/components/ui/mobile-shell";
import { api } from "~/trpc/react";

export default function NuevaOfertaPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [precioOriginal, setPrecioOriginal] = useState("");
  const [precioDescuento, setPrecioDescuento] = useState("");
  const [stock, setStock] = useState("10");
  const [error, setError] = useState<string | null>(null);

  const create = api.oferta.create.useMutation({
    onSuccess: () => router.push("/caserita/dashboard"),
    onError: (e) => setError(e.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const orig = parseFloat(precioOriginal);
    const desc = parseFloat(precioDescuento);
    if (desc >= orig) {
      setError("El precio con descuento debe ser menor al original");
      return;
    }
    create.mutate({
      nombreProducto: nombre,
      precioOriginal: orig,
      precioDescuento: desc,
      stock: parseInt(stock, 10) || 0,
    });
  }

  return (
    <>
      <PageTopBar title="Nueva oferta" backHref="/caserita/dashboard" />
      <form onSubmit={handleSubmit} className="space-y-4 px-4 py-6">
        <Input
          label="Producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Coca-Cola 2L"
          required
        />
        <Input
          label="Precio original (Bs)"
          type="number"
          step="0.01"
          min="0"
          value={precioOriginal}
          onChange={(e) => setPrecioOriginal(e.target.value)}
          required
        />
        <Input
          label="Precio con descuento (Bs)"
          type="number"
          step="0.01"
          min="0"
          value={precioDescuento}
          onChange={(e) => setPrecioDescuento(e.target.value)}
          required
        />
        <Input
          label="Stock"
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" fullWidth disabled={create.isPending}>
          {create.isPending ? "Guardando…" : "Publicar oferta"}
        </Button>
      </form>
    </>
  );
}
