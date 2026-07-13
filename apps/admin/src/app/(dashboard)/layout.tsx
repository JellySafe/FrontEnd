import type { ReactNode } from "react";
import { AuthGuard } from "@/features/admin-auth/ui/AuthGuard";
import { AdminShell } from "@/shared/ui/AdminShell";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
