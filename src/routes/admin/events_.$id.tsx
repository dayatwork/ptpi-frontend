import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  CalendarDays,
  Handshake,
  HouseIcon,
  MapPin,
  PhoneIcon,
  Presentation,
  Settings,
  Store,
} from "lucide-react";
import { AdminContainer } from "@/components/layouts/admin/admin-container";
import { EventDetailHeader } from "@/modules/admin/event/components/event-detail-header";
import { FormatBadge } from "@/modules/admin/event/components/format-badge";
import { StatusBadge } from "@/modules/admin/event/components/status-badge";
import { ensureEventData, useEvent } from "@/modules/admin/event/event.query";

export const Route = createFileRoute("/admin/events_/$id")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    ensureEventData({ id: params.id }, queryClient),
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useEvent({ id: params.id });
  return (
    <>
      <AdminContainer header={<EventDetailHeader title={data.title} />}>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="space-y-1 w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">{data.title}</h1>
              <StatusBadge
                status={data.status}
                className="px-4 py-1 text-base"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {data.description}
            </p>
            <dl className="flex gap-6 items-center">
              <div className="flex gap-2 items-center">
                <dt>
                  <CalendarDays className="size-4" />
                </dt>
                <dd className="flex gap-1 items-center text-sm text-muted-foreground">
                  <time dateTime={data.startDate}>
                    {new Date(data.startDate).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      hour12: false,
                    })}
                  </time>{" "}
                  -{" "}
                  <time dateTime={data.endDate}>
                    {new Date(data.endDate).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      hour12: false,
                    })}
                  </time>
                </dd>
              </div>
              <div className="flex gap-2 items-center">
                <dt>
                  <Settings className="size-4" />
                </dt>
                <dd className="flex gap-1 items-center text-sm text-muted-foreground">
                  <FormatBadge format={data.format} />
                </dd>
              </div>
              <div className="flex gap-2 items-center">
                <dt>
                  <MapPin className="size-4" />
                </dt>
                <dd className="flex gap-1 items-center text-sm text-muted-foreground">
                  {data.location}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="flex items-center mt-6 border-b mb-4">
          <Link
            to="/admin/events/$id/overview"
            params={{ id: data.id }}
            className="flex items-center gap-0.5 font-semibold text-sm py-1.5 px-3 border-b-2"
            activeProps={{ className: "border-primary text-primary" }}
          >
            <HouseIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Overview
          </Link>
          <Link
            to="/admin/events/$id/seminars"
            params={{ id: data.id }}
            className="flex items-center gap-0.5 font-semibold text-sm py-1.5 px-3 border-b-2"
            activeProps={{ className: "border-primary text-primary" }}
          >
            <Presentation
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Seminars
          </Link>
          <Link
            to="/admin/events/$id/consultations"
            params={{ id: data.id }}
            className="flex items-center gap-0.5 font-semibold text-sm py-1.5 px-3 border-b-2"
            activeProps={{ className: "border-primary text-primary" }}
          >
            <PhoneIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Consultations
          </Link>
          <Link
            to="/admin/events/$id/exhibition"
            params={{ id: data.id }}
            className="flex items-center gap-0.5 font-semibold text-sm py-1.5 px-3 border-b-2"
            activeProps={{ className: "border-primary text-primary" }}
          >
            <Store
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Exhibition
          </Link>
          <Link
            to="/admin/events/$id/sponsorships"
            params={{ id: data.id }}
            className="flex items-center gap-0.5 font-semibold text-sm py-1.5 px-3 border-b-2"
            activeProps={{ className: "border-primary text-primary" }}
          >
            <Handshake
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Sponsorships
          </Link>
        </div>
        <Outlet />
      </AdminContainer>
    </>
  );
}
