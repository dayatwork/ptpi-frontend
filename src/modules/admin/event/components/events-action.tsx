import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event } from "../event";
import { PlusIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { CreateEventForm } from "./forms/create-event-form";
import { useReducer } from "react";
import { EditEventForm } from "./forms/edit-event-form";
import { DeleteEventForm } from "./forms/delete-event-form";

type Props = {
  setOpen: (open: boolean) => void;
  state: State;
};

export function EventsActionDialog({
  state: { intent, open, selectedEvent },
  setOpen,
}: Props) {
  if (!intent) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DialogContent className="w-[560px]">
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            {intent === "create" && (
              <PlusIcon className="opacity-80" size={16} />
            )}
            {intent === "edit" && (
              <SquarePenIcon className="opacity-80" size={16} />
            )}
            {intent === "delete" && (
              <Trash2Icon className="opacity-80" size={16} />
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">
              {intent === "create" && "Create New Event"}
              {intent === "edit" && "Edit Event"}
              {intent === "delete" && "Delete Event"}
            </DialogTitle>
            <DialogDescription className="text-left">
              {intent === "create" && "Create New Event"}
              {intent === "edit" && "Edit Event"}
              {intent === "delete" && "Delete Event"}
            </DialogDescription>
          </DialogHeader>
        </div>
        {intent === "create" && (
          <CreateEventForm
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
        {intent === "edit" && selectedEvent && (
          <EditEventForm
            selectedEvent={selectedEvent}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
        {intent === "delete" && selectedEvent && (
          <DeleteEventForm
            selectedEvent={selectedEvent}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type State = {
  selectedEvent: Event | null;
  open: boolean;
  intent: "create" | "edit" | "delete" | null;
};

type Action =
  | {
      type: "CREATE";
    }
  | { type: "EDIT"; payload: { selectedEvent: Event } }
  | { type: "DELETE"; payload: { selectedEvent: Event } }
  | { type: "CLOSE" }
  | { type: "OPEN" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CREATE":
      return {
        ...state,
        intent: "create",
        open: true,
        selectedEvent: null,
      };
    case "EDIT":
      return {
        ...state,
        intent: "edit",
        open: true,
        selectedEvent: action.payload.selectedEvent,
      };
    case "DELETE":
      return {
        ...state,
        intent: "delete",
        open: true,
        selectedEvent: action.payload.selectedEvent,
      };
    case "CLOSE":
      return {
        ...state,
        intent: null,
        open: false,
        selectedEvent: null,
      };
    case "OPEN":
      return {
        ...state,
        intent: null,
        open: true,
        selectedEvent: null,
      };
  }
};

const initialState: State = {
  selectedEvent: null,
  open: false,
  intent: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEventsAction = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const createEvent = () => {
    dispatch({ type: "CREATE" });
  };

  const editEvent = (selectedEvent: Event) => {
    dispatch({ type: "EDIT", payload: { selectedEvent } });
  };

  const deleteEvent = (selectedEvent: Event) => {
    dispatch({ type: "DELETE", payload: { selectedEvent } });
  };

  const setOpen = (open: boolean) => {
    if (open) {
      dispatch({ type: "CLOSE" });
    } else {
      dispatch({ type: "OPEN" });
    }
  };

  return {
    state,
    createEvent,
    editEvent,
    deleteEvent,
    setOpen,
  };
};
