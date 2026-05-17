import { ScreenHeader } from "~/components/ui/screen-header";

export function ProfileStubPage({
  title,
  description,
  backHref = "/comprador/perfil",
}: {
  title: string;
  description: string;
  backHref?: string;
}) {
  return (
    <>
      <ScreenHeader title={title} backHref={backHref} />
      <div className="bg-viva-soft px-4 py-6">
      <div className="viva-card p-6 text-center">
        <p className="text-sm text-gray-600">{description}</p>
        <p className="mt-2 text-xs text-gray-400">Disponible en una próxima versión.</p>
      </div>
      </div>
    </>
  );
}
