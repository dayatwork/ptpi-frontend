import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/events")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container py-6 md:py-8 mx-auto">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
      </div>

      <div className="flex mb-4">
        <Link
          to="/app/events/ongoing"
          className="px-4 py-1 bg-muted border text-sm hover:bg-primary/20 rounded-l-md"
          activeProps={{
            className:
              "font-semibold bg-primary text-primary-foreground hover:bg-primary/80",
          }}
        >
          Ongoing Events
        </Link>
        <Link
          to="/app/events/upcoming"
          className="px-4 py-1 bg-muted border text-sm hover:bg-primary/20"
          activeProps={{
            className:
              "font-semibold bg-primary text-primary-foreground hover:bg-primary/80",
          }}
        >
          Upcoming Events
        </Link>
        <Link
          to="/app/events/previous"
          className="px-4 py-1 bg-muted border text-sm hover:bg-primary/20 rounded-r-md"
          activeProps={{
            className:
              "font-semibold bg-primary text-primary-foreground hover:bg-primary/80",
          }}
        >
          Previous Events
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
