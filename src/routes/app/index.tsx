import { useSuspenseUserSession } from "@/modules/auth/auth.query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseUserSession();
  return (
    <div className="container py-6 md:py-8 mx-auto">
      <h1 className="font-bold text-3xl">Hello {data?.user.name}👋</h1>
    </div>
  );
}
