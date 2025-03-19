import { RootRouteContext } from "@/routes/__root";
import { redirect } from "@tanstack/react-router";

export async function requireAuth({ context }: { context: RootRouteContext }) {
  const session = await context.getSession();
  if (!session.data?.session) {
    throw redirect({ to: "/sign-in" });
  }
  return session.data;
}
