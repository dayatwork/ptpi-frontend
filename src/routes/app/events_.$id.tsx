import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ensureEventData,
  useSuspenseEvent,
} from "@/modules/app/event/event.query";
import { FormatBadge } from "@/modules/app/seminar/components/format-badge";
import { StatusBadge } from "@/modules/app/seminar/components/status-badge";
import { Seminar } from "@/modules/app/seminar/seminar";
import { useRegisterSeminarMutation } from "@/modules/app/seminar/seminar.mutation";
import { useSeminarParticipations } from "@/modules/app/seminar/seminar.query";
import { rupiahFormatter } from "@/utils/currency";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import {
  Calendar,
  CalendarDays,
  Clock,
  Globe,
  MapPin,
  Monitor,
  Presentation,
  Scan,
  Video,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/events_/$id")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    ensureEventData({ id: params.id }, queryClient),
});

function RouteComponent() {
  const params = Route.useParams();
  const { pathname } = useLocation();
  const { data: event } = useSuspenseEvent({ id: params.id });
  const [open, setOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const registerSeminar = useRegisterSeminarMutation({
    onSuccess: () => {
      setOpen(false);
    },
  });
  const { data: participations } = useSeminarParticipations();

  const registeredSeminarIds = participations?.map((p) => p.seminarId) || [];

  return (
    <main className="container py-6 md:py-6 mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/app/events">Events</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <>
                {event.status === "ONGOING" && (
                  <Link
                    to="/app/events/ongoing"
                    className="hover:text-foreground"
                  >
                    Ongoing
                  </Link>
                )}
                {event.status === "SCHEDULED" && (
                  <Link
                    to="/app/events/upcoming"
                    className="hover:text-foreground"
                  >
                    Upcoming
                  </Link>
                )}
                {event.status === "DONE" && (
                  <Link
                    to="/app/events/previous"
                    className="hover:text-foreground"
                  >
                    Previous
                  </Link>
                )}
              </>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{event.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-4 flex gap-10 items-start">
        <div>
          <h1 className="text-lg font-semibold mb-2">{event.title}</h1>
          <Card className="overflow-hidden p-0 w-[360px]">
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src={event.thumbnail || "/placeholder.svg"}
                alt={event.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="px-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {event.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge
                    variant={
                      event.format === "ONLINE"
                        ? "secondary"
                        : event.format === "HYBRID"
                          ? "outline"
                          : "default"
                    }
                    className="capitalize"
                  >
                    {event.format === "OFFLINE" ? "IN-PERSON" : event.format}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {event.startDate === event.endDate ? (
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{formatDateRange(event.startDate, event.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  {event.format === "ONLINE" ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : event.format === "HYBRID" ? (
                    <Video className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{event.location}</span>
                </div>
                {event.startDate !== event.endDate && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded">
                      {getDuration(event.startDate, event.endDate)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1">
          <h2 className="text-lg mb-2 font-semibold">Activities</h2>
          <ul className="grid gap-4 grid-cols-2">
            {event.seminars.map((seminar) => (
              <li
                key={seminar.id}
                className="px-4 py-4 border rounded-md bg-background flex gap-4"
              >
                <Presentation className="mt-1 size-6 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{seminar.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {seminar.description}
                      </p>
                    </div>
                    {!registeredSeminarIds.includes(seminar.id) ? (
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button
                            className="h-8"
                            onClick={() => setSelectedSeminar(seminar)}
                          >
                            Register
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Register Seminar</DialogTitle>
                            <DialogDescription className="sr-only">
                              Register Seminar
                            </DialogDescription>
                          </DialogHeader>
                          {selectedSeminar ? (
                            <>
                              <div className="border p-3 rounded-md bg-neutral-950">
                                <h3 className="font-semibold text-sm mb-2">
                                  Seminar Info
                                </h3>
                                <dl className="space-y-1 text-sm">
                                  <div className="flex gap-2 items-center">
                                    <dt className="text-muted-foreground w-28">
                                      Title
                                    </dt>
                                    <dd>{selectedSeminar.title}</dd>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <dt className="text-muted-foreground w-28">
                                      Description
                                    </dt>
                                    <dd>{selectedSeminar.description}</dd>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <dt className="text-muted-foreground w-28">
                                      Date & Time
                                    </dt>
                                    <dd>
                                      {new Date(
                                        selectedSeminar.startDate
                                      ).toLocaleString("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      })}
                                      {" - "}
                                      {new Date(
                                        selectedSeminar.endDate
                                      ).toLocaleString("en-US", {
                                        timeStyle: "short",
                                      })}
                                    </dd>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <dt className="text-muted-foreground w-28">
                                      Format
                                    </dt>
                                    <dd>
                                      <FormatBadge
                                        format={selectedSeminar.format}
                                      />
                                    </dd>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <dt className="text-muted-foreground w-28">
                                      Location
                                    </dt>
                                    <dd>{selectedSeminar.location}</dd>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <dt className="text-muted-foreground w-28">
                                      Price
                                    </dt>
                                    <dd>
                                      {selectedSeminar.price
                                        ? rupiahFormatter.format(
                                            selectedSeminar.price
                                          )
                                        : "FREE"}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                              <p className="mb-4">
                                Are you sure to register as a participant to
                                this seminar?
                              </p>
                            </>
                          ) : null}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="ghost">Close</Button>
                            </DialogClose>
                            {selectedSeminar ? (
                              <Button
                                onClick={async () =>
                                  await registerSeminar.mutateAsync(
                                    selectedSeminar.id
                                  )
                                }
                                disabled={registerSeminar.isPending}
                              >
                                Yes, register
                              </Button>
                            ) : null}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Registered</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(seminar.format === "HYBRID" ||
                            seminar.format === "ONLINE") && (
                            <DropdownMenuItem asChild>
                              <Link
                                to="/app/seminars/$id/room"
                                params={{ id: seminar.id }}
                                search={{ from: pathname }}
                              >
                                <Monitor />
                                Go to online room
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {(seminar.format === "HYBRID" ||
                            seminar.format === "OFFLINE") && (
                            <DropdownMenuItem>
                              <Scan />
                              Scan to enter the room
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <dl className="mt-2 text-sm mb-2">
                    <div className="flex gap-1 items-center ">
                      <dt>
                        <CalendarDays className="w-4" />
                        <span className="sr-only">Schedule</span>
                      </dt>
                      <dd>
                        {new Date(seminar.startDate).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}{" "}
                        -{" "}
                        {new Date(seminar.endDate).toLocaleString("en-US", {
                          timeStyle: "short",
                        })}
                      </dd>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-1 items-center ">
                        <dt className="w-14 text-muted-foreground">Format</dt>
                        <span className="mx-2">:</span>
                        <dd>
                          <FormatBadge format={seminar.format} />
                        </dd>
                      </div>
                      <div className="flex gap-1 items-center ">
                        <dt className="w-14 text-muted-foreground">Location</dt>
                        <span className="mx-2">:</span>
                        <dd className="ml-3">{seminar.location}</dd>
                      </div>
                      <div className="flex gap-1 items-center ">
                        <dt className="w-14 text-muted-foreground">Price</dt>
                        <span className="mx-2">:</span>
                        <dd className="ml-3">
                          {seminar.price
                            ? rupiahFormatter.format(seminar.price)
                            : "FREE"}
                        </dd>
                      </div>
                      <div className="flex gap-1 items-center ">
                        <dt className="w-14 text-muted-foreground">Status</dt>
                        <span className="mx-2">:</span>
                        <dd>
                          <StatusBadge status={seminar.status} />
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (startDate === endDate) {
    return start;
  }

  const end = new Date(endDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `${start} - ${end}`;
};

const getDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + (diffDays === 1 ? " day" : " days");
};
