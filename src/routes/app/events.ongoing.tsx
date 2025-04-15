import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  Clock,
  Globe,
  MapPin,
  Radio,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ensureEventsData,
  useSuspenseEvents,
} from "@/modules/app/event/event.query";

export const Route = createFileRoute("/app/events/ongoing")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    ensureEventsData(queryClient, "ongoing"),
});

function RouteComponent() {
  const { data: events } = useSuspenseEvents("ongoing");
  return (
    <div className="grid grid-cols-4 gap-4">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden p-0">
          <div className="aspect-video w-full overflow-hidden relative">
            <img
              src={event.thumbnail || "/placeholder.svg"}
              alt={event.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
            <div className="absolute top-2 right-2">
              <Radio className="size-5 text-red-600 animate-pulse" />
            </div>
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
          <CardContent className="px-4">
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
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">
                  Activities:
                </p>
                <div className="flex flex-wrap gap-1">
                  {event.activities.map((activity, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="text-xs">
                            {formatActivityName(activity)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="">{formatActivityName(activity)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 mt-auto">
            <div className="flex w-full items-center justify-end">
              {/* <div className="text-sm text-muted-foreground">
                            {event.attendees}/{event.maxAttendees} attendees
                          </div> */}
              <Link
                to="/app/events/$id"
                params={{ id: event.id }}
                className={cn(buttonVariants(), "pr-3")}
              >
                Go to Event
                <ArrowRight />
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
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

const formatActivityName = (activity: string) => {
  return activity.charAt(0).toUpperCase() + activity.slice(1);
};
