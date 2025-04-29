import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useBookConsultationMutation } from "@/modules/app/consultation/consultation.mutation";
import { useSuspenseConsultationSchedules } from "@/modules/app/consultation/consultation.query";
import {
  ensureEventData,
  useSuspenseEvent,
} from "@/modules/app/event/event.query";
import { FormatBadge } from "@/modules/app/seminar/components/format-badge";
import { Seminar } from "@/modules/app/seminar/seminar";
import { useRegisterSeminarMutation } from "@/modules/app/seminar/seminar.mutation";
import { useSeminarParticipations } from "@/modules/app/seminar/seminar.query";
import { rupiahFormatter } from "@/utils/currency";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import {
  BadgeCheck,
  Calendar,
  CalendarDays,
  Clock,
  FileBadge,
  FileCheck2,
  Globe,
  MapPin,
  MapPinIcon,
  Monitor,
  Scan,
  Video,
  WifiIcon,
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
  const [slotScheduleOpen, setSlotScheduleOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const registerSeminar = useRegisterSeminarMutation({
    onSuccess: () => {
      setOpen(false);
    },
  });
  const { data: participations } = useSeminarParticipations();
  const bookConsultationMutation = useBookConsultationMutation({
    eventId: params.id,
    onSuccess: () => {
      setSlotScheduleOpen(false);
    },
  });
  const { data: schedules } = useSuspenseConsultationSchedules();

  const registeredSeminarIds = participations?.map((p) => p.seminarId) || [];

  console.log({ event });

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
          <div className="mb-4">
            <h2 className="text-lg mb-2 font-semibold">Seminars</h2>
            <ul className="grid gap-2">
              {event.seminars.map((seminar) => {
                const registered = registeredSeminarIds.includes(seminar.id);
                const done = seminar.status === "DONE";
                const availableOnline =
                  seminar.format === "HYBRID" || seminar.format === "ONLINE";
                const availableOnsite =
                  seminar.format === "HYBRID" || seminar.format === "ONLINE";
                return (
                  <li
                    key={seminar.id}
                    className="px-4 py-2 border rounded-md bg-background"
                  >
                    <div className="flex gap-4 justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold">{seminar.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {seminar.description}
                        </p>
                      </div>
                      <div className="flex gap-6 items-center">
                        <div className="text-sm font-semibold w-[150px]">
                          <time dateTime={seminar.startDate}>
                            {new Date(seminar.startDate).toLocaleDateString(
                              "en-US",
                              {
                                dateStyle: "medium",
                              }
                            )}
                          </time>
                          <p className="flex items-center gap-1 text-muted-foreground">
                            <span>
                              {new Date(seminar.startDate).toLocaleTimeString(
                                "en-US",
                                {
                                  timeStyle: "short",
                                }
                              )}
                            </span>
                            <span>-</span>
                            <span>
                              {new Date(seminar.endDate).toLocaleTimeString(
                                "en-US",
                                {
                                  timeStyle: "short",
                                }
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <WifiIcon
                                  className={cn(
                                    "size-5",
                                    availableOnline
                                      ? "text-green-600"
                                      : "text-muted-foreground"
                                  )}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {availableOnline
                                    ? "Online: Available"
                                    : "Online: Not available"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger>
                                <MapPinIcon
                                  className={cn(
                                    "size-5",
                                    availableOnsite
                                      ? "text-green-600"
                                      : "text-muted-foreground"
                                  )}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {availableOnsite
                                    ? "Onsite: Available"
                                    : "Onsite: Not available"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger>
                                <FileCheck2
                                  className={cn(
                                    "size-5",
                                    registered
                                      ? "text-green-600"
                                      : "text-muted-foreground"
                                  )}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {registered
                                    ? "You are registered!"
                                    : "You are not registered"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {registered ? (
                          <>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                {done ? (
                                  <Button
                                    variant="outline"
                                    className="w-[120px] pl-2 pr-3"
                                  >
                                    <>
                                      <BadgeCheck className="size-5 shrink-0 text-green-600" />
                                      <p className="text-sm font-semibold">
                                        Completed
                                      </p>
                                    </>
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    className="w-[120px]"
                                  >
                                    Registered
                                  </Button>
                                )}
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {done ? (
                                  <DropdownMenuItem>
                                    <FileBadge />
                                    Get certificate
                                  </DropdownMenuItem>
                                ) : (
                                  <>
                                    {availableOnline && (
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
                                    {availableOnsite && (
                                      <DropdownMenuItem>
                                        <Scan />
                                        Scan to enter the room
                                      </DropdownMenuItem>
                                    )}
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        ) : (
                          <>
                            {done ? (
                              <>
                                <div className="w-[120px] pr-3 pl-2 h-8 flex items-center justify-center gap-2 bg-muted rounded-md">
                                  <BadgeCheck className="size-5 shrink-0 text-green-600" />
                                  <p className="text-sm font-semibold">
                                    Completed
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      className="h-8 w-[120px]"
                                      onClick={() =>
                                        setSelectedSeminar(seminar)
                                      }
                                      disabled={!seminar.isRegistrationOpen}
                                    >
                                      Register
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Register Seminar
                                      </DialogTitle>
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
                                              <dd>
                                                {selectedSeminar.description}
                                              </dd>
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
                                                  format={
                                                    selectedSeminar.format
                                                  }
                                                />
                                              </dd>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                              <dt className="text-muted-foreground w-28">
                                                Location
                                              </dt>
                                              <dd>
                                                {selectedSeminar.location}
                                              </dd>
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
                                          Are you sure to register as a
                                          participant to this seminar?
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
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className="text-lg mb-2 font-semibold">Consultations</h2>
            <ul className="grid grid-cols-3 gap-2">
              {event.consultations.map((consultation) => (
                <li
                  key={consultation.id}
                  className="flex gap-2 items-center justify-between p-3 border bg-background rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="rounded-md">
                      <AvatarImage
                        src={consultation.exhibitor.logo ?? ""}
                        className="object-contain"
                      />
                      <AvatarFallback className="rounded-md font-semibold text-lg">
                        {consultation.exhibitor.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold">
                      {consultation.exhibitor.name}
                    </p>
                  </div>
                  <Dialog
                    open={slotScheduleOpen}
                    onOpenChange={setSlotScheduleOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="h-8 px-2.5" variant="outline">
                        See Schedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Consultation Slot</DialogTitle>
                        <DialogDescription className="sr-only">
                          Consultation Slot
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center gap-2 border px-3 py-2 bg-muted rounded-md">
                        <Avatar className="rounded-md">
                          <AvatarImage
                            src={consultation.exhibitor.logo ?? ""}
                            className="object-contain"
                          />
                          <AvatarFallback className="rounded-md font-semibold text-lg">
                            {consultation.exhibitor.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold">
                          {consultation.exhibitor.name}
                        </p>
                      </div>
                      <ul className="grid grid-cols-2 gap-2">
                        {consultation.slots.map((slot) => {
                          const available = slot.status === "AVAILABLE";
                          const booked = schedules
                            .map((s) => s.id)
                            .includes(slot.id);
                          return (
                            <li
                              key={slot.id}
                              className="text-sm p-2 border rounded-md flex gap-2 items-center justify-between"
                            >
                              <p
                                className={cn(
                                  "flex items-center gap-1",
                                  !available ? "text-muted-foreground" : ""
                                )}
                              >
                                <span>
                                  {new Date(slot.startTime).toLocaleDateString(
                                    "en-US",
                                    { dateStyle: "medium" }
                                  )}
                                </span>
                                <span>
                                  {new Date(slot.startTime).toLocaleTimeString(
                                    "en-US",
                                    { timeStyle: "short", hourCycle: "h24" }
                                  )}
                                </span>
                                <span>-</span>
                                <span>
                                  {new Date(slot.endTime).toLocaleTimeString(
                                    "en-US",
                                    { timeStyle: "short", hourCycle: "h24" }
                                  )}
                                </span>
                              </p>
                              {available && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="text-primary hover:text-primary hover:bg-primary/10 h-7 px-2.5 rounded"
                                    >
                                      Book
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Book Consultation Slot
                                      </DialogTitle>
                                      <DialogDescription className="sr-only">
                                        Book Consultation Slot
                                      </DialogDescription>
                                    </DialogHeader>
                                    <p>
                                      Are you sure you want to book a slot on{" "}
                                      <span className="text-primary">
                                        {new Date(
                                          slot.startTime
                                        ).toLocaleDateString("en-US", {
                                          dateStyle: "long",
                                        })}
                                      </span>{" "}
                                      from{" "}
                                      <span className="text-primary">
                                        {new Date(
                                          slot.startTime
                                        ).toLocaleTimeString("en-US", {
                                          timeStyle: "short",
                                          hourCycle: "h24",
                                        })}
                                      </span>{" "}
                                      to{" "}
                                      <span className="text-primary">
                                        {new Date(
                                          slot.endTime
                                        ).toLocaleTimeString("en-US", {
                                          timeStyle: "short",
                                          hourCycle: "h24",
                                        })}
                                      </span>
                                      ?
                                    </p>
                                    <div className="flex justify-end gap-2">
                                      <DialogClose asChild>
                                        <Button variant="ghost">Cancel</Button>
                                      </DialogClose>
                                      <Button
                                        onClick={async () => {
                                          await bookConsultationMutation.mutateAsync(
                                            { slotId: slot.id }
                                          );
                                        }}
                                      >
                                        {bookConsultationMutation.isPending
                                          ? "Booking..."
                                          : "Book"}
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                              {booked && (
                                <Link
                                  to="/app/consultation-schedule/$id/room"
                                  params={{ id: slot.id }}
                                  className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "h-7 px-2.5 rounded"
                                  )}
                                >
                                  Booked
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </DialogContent>
                  </Dialog>
                </li>
              ))}
            </ul>
          </div>
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
