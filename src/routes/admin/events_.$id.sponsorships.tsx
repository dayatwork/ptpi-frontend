import { createFileRoute } from "@tanstack/react-router";
import { ensureEventData, useEvent } from "@/modules/admin/event/event.query";

export const Route = createFileRoute("/admin/events_/$id/sponsorships")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    ensureEventData({ id: params.id }, queryClient),
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useEvent({ id: params.id });
  console.log({ data });
  return (
    <>
      <h1>Sponsorships</h1>
    </>
  );
}
