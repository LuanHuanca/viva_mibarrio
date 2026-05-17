import { CompradorShell } from "~/components/ui/mobile-shell";

export default function CompradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CompradorShell>{children}</CompradorShell>;
}
