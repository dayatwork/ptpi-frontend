import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/events_/$id/")({
  loader: ({ params }) => {
    return redirect({ to: "/admin/events/$id/overview", params });
  },
});
