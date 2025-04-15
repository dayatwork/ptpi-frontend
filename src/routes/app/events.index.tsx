import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/events/")({
  beforeLoad: () => redirect({ to: "/app/events/ongoing" }),
});
