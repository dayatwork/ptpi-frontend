import { Button } from "@/components/ui/button";
import { Event } from "../event";
import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  ConsultationsActionDialog,
  useConsultationsAction,
} from "../../consultation/components/consultations-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function EventConsultations({ event }: { event: Event }) {
  const { createConsultation, setOpen, state } = useConsultationsAction(event);
  return (
    <>
      <ConsultationsActionDialog setOpen={setOpen} state={state} />
      <div>
        <h2 className="font-semibold mb-2">Consultations</h2>
        <ul className="grid grid-cols-8 gap-4">
          <li>
            <Button
              variant="secondary"
              className="w-full h-full"
              onClick={createConsultation}
            >
              <Plus />
              New Consultation
            </Button>
          </li>
          {event.consultations.length === 0 ? (
            <li className="flex items-center justify-center py-10 border rounded-lg border-dashed">
              <p className="text-sm text-muted-foreground text-center">
                No consultations
              </p>
            </li>
          ) : (
            event.consultations.map((consultation) => (
              <li key={consultation.id}>
                <Link
                  to="/admin/consultations/$id"
                  params={{ id: consultation.id }}
                  className="p-4 border rounded-lg flex  justify-center items-center flex-col gap-2 bg-muted/40 hover:bg-accent"
                >
                  <Avatar className="border size-12">
                    <AvatarImage
                      src={consultation.exhibitor.logo ?? ""}
                      className="object-contain"
                    />
                    <AvatarFallback className="text-2xl font-semibold">
                      {consultation.exhibitor.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm line-clamp-1">
                    {consultation.exhibitor.name}
                  </p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
