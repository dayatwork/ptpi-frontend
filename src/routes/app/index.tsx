import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container py-6 md:py-8 mx-auto">
      <h1 className="font-semibold text-5xl">Welcome to PTPI Events!!!</h1>
    </div>
  );
}
