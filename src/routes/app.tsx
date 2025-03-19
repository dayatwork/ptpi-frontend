import { isAdmin } from "@/auth/guards/is-admin";
import { AppLayout } from "@/components/layouts/app/app-layout";
import { ensureUserSessionData } from "@/modules/auth/auth.query";
import { redirect } from "@tanstack/react-router";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const session = await ensureUserSessionData(context.queryClient);
    if (!session) {
      throw redirect({ to: "/sign-in" });
    }
    return { session, isAdmin: isAdmin({ user: session.user }) };
  },
});

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
