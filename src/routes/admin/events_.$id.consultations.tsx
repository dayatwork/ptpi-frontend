import { createFileRoute } from "@tanstack/react-router";
import { ensureEventData, useEvent } from "@/modules/admin/event/event.query";
import { EventConsultations } from "@/modules/admin/event/components/event-detail-consultations";

export const Route = createFileRoute("/admin/events_/$id/consultations")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    ensureEventData({ id: params.id }, queryClient),
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useEvent({ id: params.id });
  return (
    <>
      <EventConsultations event={data} />
    </>
  );
}
