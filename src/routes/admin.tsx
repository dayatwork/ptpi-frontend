import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/layouts/admin/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ensureUserSessionData } from "@/modules/auth/auth.query";
import { isAdmin } from "@/auth/guards/is-admin";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    const session = await ensureUserSessionData(context.queryClient);
    if (!session) {
      throw redirect({ to: "/sign-in" });
    }
    if (!isAdmin({ user: session.user })) {
      throw redirect({ to: "/app" });
    }
    return { session };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <Outlet />
    </SidebarProvider>
  );
}
