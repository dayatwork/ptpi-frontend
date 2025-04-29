import { createFileRoute } from "@tanstack/react-router";
import { EventDetailOverview } from "@/modules/admin/event/components/event-detail-overview";
import { ensureEventData, useEvent } from "@/modules/admin/event/event.query";

export const Route = createFileRoute("/admin/events_/$id/overview")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    ensureEventData({ id: params.id }, queryClient),
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useEvent({ id: params.id });
  return (
    <>
      <EventDetailOverview event={data} />
    </>
  );
}
