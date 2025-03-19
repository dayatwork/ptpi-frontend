import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/events_/$id/seminars/$seminarId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const navigate = useNavigate();
  return (
    <Dialog
      open
      onOpenChange={(opened) => {
        if (!opened) {
          navigate({ to: "/admin/events/$id", params });
        }
      }}
    >
      <DialogContent className="h-screen min-w-screen">Content</DialogContent>
    </Dialog>
  );
}
