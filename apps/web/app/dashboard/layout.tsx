import { PortalShell } from "@/components/shell/portal-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalShell>{children}</PortalShell>
}
