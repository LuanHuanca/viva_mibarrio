import { CaseritaShell } from "~/components/ui/mobile-shell";

export default function CaseritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CaseritaShell>{children}</CaseritaShell>;
}
