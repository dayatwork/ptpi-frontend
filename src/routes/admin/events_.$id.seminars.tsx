import { createFileRoute } from "@tanstack/react-router";
import { ensureEventData, useEvent } from "@/modules/admin/event/event.query";
import { EventSeminars } from "@/modules/admin/event/components/event-detail-seminars";

export const Route = createFileRoute("/admin/events_/$id/seminars")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    ensureEventData({ id: params.id }, queryClient),
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useEvent({ id: params.id });
  return (
    <>
      <EventSeminars event={data} />
    </>
  );
}
