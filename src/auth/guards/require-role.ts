import { RootRouteContext } from "@/routes/__root";
import { redirect } from "@tanstack/react-router";

type Role = "admin" | "user";

export async function requireRole({
  context,
  role,
}: {
  context: RootRouteContext;
  role: Role;
}) {
  const session = await context.getSession();
  if (!session.data?.session) {
    throw redirect({ to: "/sign-in" });
  }

  if (session.data.user.role !== role) {
    throw redirect({ to: "/" });
  }

  return session.data;
}
