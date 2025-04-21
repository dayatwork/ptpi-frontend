import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  ensureSeminarData,
  useSuspenseSeminar,
} from "@/modules/app/seminar/seminar.query";
import { MeetingRoom } from "@/modules/app/seminar/components/meeting-room";
import { useUserSession } from "@/modules/auth/auth.query";

const seminarRoomSearchParams = z.object({
  from: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/app_/seminars_/$id_/room")({
  component: RouteComponent,
  validateSearch: zodValidator(seminarRoomSearchParams),
  beforeLoad: ({ search }) => {
    return { from: search.from };
  },
  loader: async ({ context: { queryClient, from }, params }) => {
    const data = await ensureSeminarData(params.id, queryClient);
    if (!data.participant) {
      return redirect({ to: from || "/app/seminars" });
    }
    return data;
  },
});

function RouteComponent() {
  const from = Route.useSearch().from || `/app/seminars`;
  const params = Route.useParams();
  const { data: seminar } = useSuspenseSeminar(params.id);
  const { data: user } = useUserSession();

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="flex gap-8 items-center mb-6">
        <Link
          to={from}
          className={cn(buttonVariants({ variant: "secondary" }), "pl-3")}
        >
          <ArrowLeft />
          Back
        </Link>
        <h1 className="text-xl font-semibold">{seminar.title}</h1>
      </div>
      {seminar.status === "SCHEDULED" && (
        <div className="bg-muted border rounded-lg p-4 max-w-7xl w-full aspect-video flex flex-col gap-2 justify-center items-center">
          <p className="text-base lg:text-2xl font-semibold">
            The seminar will be held on{" "}
            {new Date(seminar.startDate).toLocaleString("en-US", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
      )}
      {seminar.status === "DONE" && (
        <div className="bg-muted border rounded-lg p-4 max-w-7xl w-full aspect-video flex flex-col gap-2 justify-center items-center">
          <CheckCircle className="size-8 text-green-600" />
          <p className="text-center">The seminar has been completed</p>
        </div>
      )}
      {seminar.status === "ONGOING" &&
        (seminar.onlineRoomId ? (
          <div className="max-w-7xl w-full aspect-video">
            <MeetingRoom
              participantName={user.user.name}
              roomName={seminar.onlineRoomId}
              label="The seminar has started. Please enter the room."
            />
          </div>
        ) : (
          <div className="bg-muted border rounded-lg p-4 max-w-7xl w-full aspect-video flex flex-col gap-2 justify-center items-center">
            <p className="text-base lg:text-2xl font-semibold">
              Please wait, the room is being prepared
            </p>
          </div>
        ))}
    </div>
  );
}
