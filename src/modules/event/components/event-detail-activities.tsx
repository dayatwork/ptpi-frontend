import { Button } from "@/components/ui/button";
import { Event } from "../event";
import {
  Clock,
  MapPin,
  PhoneCall,
  Plus,
  Presentation,
  Store,
} from "lucide-react";
import {
  SeminarsActionDialog,
  useSeminarsAction,
} from "@/modules/seminar/components/seminars-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";

export function EventDetailActivities({ event }: { event: Event }) {
  const { createSeminar, setOpen, state } = useSeminarsAction(event);
  return (
    <>
      <SeminarsActionDialog setOpen={setOpen} state={state} />
      <div>
        <h2 className="font-semibold mb-2">Activities</h2>
        <ul className="grid grid-cols-5 gap-4">
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-full h-full"
                  onClick={createSeminar}
                >
                  <Plus />
                  Add New Activity
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={createSeminar}>
                  <Presentation />
                  Add Seminar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Store />
                  Add Exhibition
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PhoneCall />
                  Add Consultation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          {event.seminars.length === 0 ? (
            <li className="flex items-center justify-center py-10 border rounded-lg border-dashed">
              <p className="text-sm text-muted-foreground text-center">
                No activities
              </p>
            </li>
          ) : (
            event.seminars.map((seminar) => (
              <li key={seminar.id}>
                <Link
                  to="/admin/events/$id/seminars/$seminarId"
                  params={{ id: event.id, seminarId: seminar.id }}
                  className="p-4 border rounded-lg flex  justify-center flex-col gap-2 bg-muted/40 hover:bg-accent"
                >
                  <Presentation className="size-8" strokeWidth={1} />
                  <p className="font-semibold text-sm">{seminar.title}</p>
                  <dl className="space-y-1">
                    <div className="flex gap-2 items-center text-muted-foreground">
                      <dt>
                        <Clock className="size-4" />
                      </dt>
                      <dd className="flex gap-1 text-sm">
                        <time>
                          {new Date(seminar.startDate).toLocaleString("en-US", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </time>
                        <span>-</span>
                        <time>
                          {new Date(seminar.endDate).toLocaleString("en-US", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </time>
                      </dd>
                    </div>
                    <div className="flex gap-2 items-center text-muted-foreground">
                      <dt>
                        <MapPin className="size-4" />
                      </dt>
                      <dd className="flex gap-1 text-sm">{seminar.location}</dd>
                    </div>
                  </dl>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
