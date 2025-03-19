import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Globe,
  Video,
  CalendarDays,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/app/upcoming-events")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit 2025",
      description:
        "A comprehensive tech event featuring workshops, exhibitions, and networking opportunities for industry professionals.",
      startDate: "2025-03-15",
      endDate: "2025-03-17",
      time: "9:00 AM - 6:00 PM",
      location: "Tech Convention Center",
      format: "offline",
      type: "event",
      activities: ["seminar", "exhibition", "workshop", "networking"],
      attendees: 450,
      maxAttendees: 500,
      image: "https://picsum.photos/1000/1000",
    },
    {
      id: 2,
      title: "Digital Marketing Workshop",
      description:
        "Learn practical digital marketing strategies you can implement immediately.",
      startDate: "2025-03-20",
      endDate: "2025-03-20",
      time: "9:00 AM - 5:00 PM",
      location: "Business Center, Room 204",
      format: "offline",
      type: "small_event",
      activities: ["workshop"],
      attendees: 35,
      maxAttendees: 40,
      image: "https://picsum.photos/1000/1000",
    },
    {
      id: 3,
      title: "AI in Business Seminar",
      description:
        "Discover how artificial intelligence is transforming business operations and strategy.",
      startDate: "2025-03-25",
      endDate: "2025-03-25",
      time: "1:00 PM - 4:00 PM",
      location: "Zoom Meeting (Link provided after registration)",
      format: "online",
      type: "small_event",
      activities: ["seminar"],
      attendees: 75,
      maxAttendees: 100,
      image: "https://picsum.photos/1000/1000",
    },
    {
      id: 4,
      title: "Global Design Conference",
      description:
        "A three-day immersive experience exploring the future of design across multiple industries.",
      startDate: "2025-04-05",
      endDate: "2025-04-07",
      time: "10:00 AM - 7:00 PM",
      location: "Design Hub Convention Center",
      format: "hybrid",
      type: "event",
      activities: ["conference", "exhibition", "workshop", "forum"],
      attendees: 280,
      maxAttendees: 300,
      image: "https://picsum.photos/1000/1000",
    },
    {
      id: 5,
      title: "Startup Funding Forum",
      description:
        "Connect with investors and learn about funding opportunities for your startup.",
      startDate: "2025-04-10",
      endDate: "2025-04-10",
      time: "11:00 AM - 6:00 PM",
      location: "Microsoft Teams (Access details sent via email)",
      format: "online",
      type: "small_event",
      activities: ["forum"],
      attendees: 85,
      maxAttendees: 150,
      image: "https://picsum.photos/1000/1000",
    },
    {
      id: 6,
      title: "Sustainable Business Expo",
      description:
        "Explore sustainable business practices, green technologies, and networking with eco-conscious entrepreneurs.",
      startDate: "2025-04-15",
      endDate: "2025-04-17",
      time: "9:00 AM - 5:00 PM",
      location: "Green Convention Center & Live Stream",
      format: "hybrid",
      type: "event",
      activities: ["exhibition", "seminar", "workshop", "networking"],
      attendees: 320,
      maxAttendees: 400,
      image: "https://picsum.photos/1000/1000",
    },
  ];

  // Filter events based on search query, category, format, and type
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || event.activities.includes(categoryFilter);
    const matchesFormat =
      formatFilter === "all" || event.format === formatFilter;
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    return matchesSearch && matchesCategory && matchesFormat && matchesType;
  });

  // Format date range
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

  // Get duration in days
  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + (diffDays === 1 ? " day" : " days");
  };

  // Format activity name
  const formatActivityName = (activity: string) => {
    return activity.charAt(0).toUpperCase() + activity.slice(1);
  };

  return (
    <div className="container py-6 md:py-8 mx-auto">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            My Calendar
          </Button>
          <Button size="sm">Create Event</Button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_200px_200px_200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="seminar">Seminars</SelectItem>
              <SelectItem value="exhibition">Exhibitions</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="forum">Forums</SelectItem>
              <SelectItem value="conference">Conferences</SelectItem>
              <SelectItem value="networking">Networking</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">In-Person</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="event">Multi-day Events</SelectItem>
              <SelectItem value="small_event">Single-day Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid">
        <div className="mb-4 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        <TabsContent value="grid" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden p-0">
                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                  {event.type === "event" && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                      Multi-day Event
                    </div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="line-clamp-1">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {event.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={
                          event.format === "online"
                            ? "secondary"
                            : event.format === "hybrid"
                              ? "outline"
                              : "default"
                        }
                        className="capitalize"
                      >
                        {event.format === "offline"
                          ? "In-Person"
                          : event.format}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {event.startDate === event.endDate ? (
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>
                        {formatDateRange(event.startDate, event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.format === "online" ? (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      ) : event.format === "hybrid" ? (
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
                        Includes:
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
                                <p>{formatActivityName(activity)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex w-full items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {event.attendees}/{event.maxAttendees} attendees
                    </div>
                    <Button>Register</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-48 md:w-64">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    {event.type === "event" && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                        Multi-day Event
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={
                            event.format === "online"
                              ? "secondary"
                              : event.format === "hybrid"
                                ? "outline"
                                : "default"
                          }
                          className="capitalize"
                        >
                          {event.format === "offline"
                            ? "In-Person"
                            : event.format}
                        </Badge>
                        {event.startDate !== event.endDate && (
                          <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded text-center">
                            {getDuration(event.startDate, event.endDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm">
                        {event.startDate === event.endDate ? (
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>
                          {formatDateRange(event.startDate, event.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {event.format === "online" ? (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        ) : event.format === "hybrid" ? (
                          <Video className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {event.activities.map((activity, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {formatActivityName(activity)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {event.attendees}/{event.maxAttendees} attendees
                      </div>
                      <Button>Register</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
