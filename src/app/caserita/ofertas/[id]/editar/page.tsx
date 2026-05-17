"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ProductImage } from "~/components/ui/product-image";
import { ScreenHeader } from "~/components/ui/screen-header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function EditarOfertaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: oferta, isLoading } = api.oferta.getById.useQuery({ id: params.id });

  const [nombre, setNombre] = useState("");
  const [precioOriginal, setPrecioOriginal] = useState("");
  const [precioDescuento, setPrecioDescuento] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState<string | null>(null);

  const update = api.oferta.update.useMutation({
    onSuccess: () => router.push("/caserita/ofertas"),
    onError: (e) => setError(e.message),
  });
  const remove = api.oferta.delete.useMutation({
    onSuccess: () => router.push("/caserita/ofertas"),
    onError: (e) => setError(e.message),
  });

  useEffect(() => {
    if (!oferta) return;
    setNombre(oferta.nombreProducto);
    setPrecioOriginal(String(oferta.precioOriginal));
    setPrecioDescuento(String(oferta.precioDescuento));
    setStock(String(oferta.stock));
  }, [oferta]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const orig = parseFloat(precioOriginal);
    const desc = parseFloat(precioDescuento);
    if (desc >= orig) {
      setError("El precio con descuento debe ser menor al original");
      return;
    }
    update.mutate({
      id: params.id,
      nombreProducto: nombre,
      precioOriginal: orig,
      precioDescuento: desc,
      stock: parseInt(stock, 10) || 0,
    });
  }

  if (isLoading || !oferta) {
    return <p className="p-6 text-center text-gray-500">Cargando…</p>;
  }

  return (
    <>
      <ScreenHeader title="Editar oferta" backHref="/caserita/ofertas" />
      <form onSubmit={handleSubmit} className="space-y-4 px-4 py-6">
        <div className="flex flex-col items-center">
          <ProductImage nombre={nombre} size="xl" />
          <button
            type="button"
            className="mt-2 text-sm font-semibold text-[#007a4d]"
          >
            Cambiar foto
          </button>
        </div>

        <Input
          label="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <Input
          label="Precio original (Bs)"
          type="number"
          step="0.01"
          value={precioOriginal}
          onChange={(e) => setPrecioOriginal(e.target.value)}
          required
        />
        <Input
          label="Precio con descuento (Bs)"
          type="number"
          step="0.01"
          value={precioDescuento}
          onChange={(e) => setPrecioDescuento(e.target.value)}
          required
        />
        <Input
          label="Stock disponible"
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" fullWidth disabled={update.isPending}>
          {update.isPending ? "Guardando…" : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="!border-red-500 !text-red-600"
          disabled={remove.isPending}
          onClick={() => {
            if (confirm("¿Eliminar esta oferta?")) {
              remove.mutate({ id: params.id });
            }
          }}
        >
          Eliminar oferta
        </Button>
      </form>
    </>
  );
}
