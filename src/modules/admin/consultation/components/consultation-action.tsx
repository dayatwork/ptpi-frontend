import { useReducer } from "react";
import { Event } from "../../event/event";
import { Consultation, ConsultationSlot } from "../consultation";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PenSquare, PlusIcon } from "lucide-react";
import { CreateConsultationSlotForm } from "./forms/create-consultation-slot-form";
import { EditConsultationSlotForm } from "./forms/edit-consultation-slot-form";
import { BookConsultationForm } from "./forms/book-consultation-slot-form";

type Props = {
  setOpen: (open: boolean) => void;
  state: State;
  consultation: Consultation & { event: Event; slots: ConsultationSlot[] };
};

export function ConsultationActionDialog({
  consultation,
  setOpen,
  state: { intent, open, selectedSlot },
}: Props) {
  const navigate = useNavigate();
  if (!intent) return null;
  console.log({ consultation, navigate });

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent
        className={intent === "create" ? "sm:max-w-7xl" : "w-[560px]"}
      >
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            {intent === "create" && (
              <PlusIcon className="opacity-80" size={16} />
            )}
            {intent !== "book" && intent !== "create" && (
              <PenSquare className="opacity-80" size={16} />
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">
              {intent === "create" && "Create Consultation Slot"}
              {intent === "book" && "Book Consultation Slot"}
              {intent === "mark-as-available" && "Mark Slot as Available"}
              {intent === "mark-as-not-available" &&
                "Mark Slot as Not Available"}
              {intent === "mark-as-done" && "Mark Slot as Done"}
              {intent === "mark-as-not-present" && "Mark Slot as Not Present"}
              {intent === "remove-participant" && "Remove Participant"}
            </DialogTitle>
            <DialogDescription className="text-left">
              {intent === "create" && "Create Consultation Slot"}
              {intent === "book" && "Book Consultation Slot"}
              {intent === "mark-as-available" && "Mark Slot as Available"}
              {intent === "mark-as-not-available" &&
                "Mark Slot as Not Available"}
              {intent === "mark-as-done" && "Mark Slot as Done"}
              {intent === "mark-as-not-present" && "Mark Slot as Not Present"}
              {intent === "remove-participant" && "Remove Participant"}
            </DialogDescription>
          </DialogHeader>
        </div>
        {intent === "create" && (
          <CreateConsultationSlotForm
            consultation={consultation}
            onSuccess={() => setOpen(false)}
          />
        )}
        {intent === "book" && selectedSlot && (
          <BookConsultationForm
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            selectedSlot={selectedSlot}
          />
        )}
        {intent !== "book" && intent !== "create" && selectedSlot && (
          <EditConsultationSlotForm
            intent={intent}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            selectedSlot={selectedSlot}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type State = {
  open: boolean;
  intent:
    | "create"
    | "book"
    | "mark-as-available"
    | "mark-as-not-available"
    | "mark-as-done"
    | "mark-as-not-present"
    | "remove-participant"
    | null;
  selectedSlot: ConsultationSlot | null;
};

type Action =
  | { type: "CREATE" }
  | { type: "BOOK"; payload: { selectedSlot: ConsultationSlot } }
  | { type: "AVAILABLE"; payload: { selectedSlot: ConsultationSlot } }
  | { type: "NOT_AVAILABLE"; payload: { selectedSlot: ConsultationSlot } }
  | { type: "DONE"; payload: { selectedSlot: ConsultationSlot } }
  | { type: "NOT_PRESENT"; payload: { selectedSlot: ConsultationSlot } }
  | { type: "REMOVE_PARTICIPANT"; payload: { selectedSlot: ConsultationSlot } }
  | { type: "CLOSE" }
  | { type: "OPEN" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CREATE":
      return {
        ...state,
        intent: "create",
        selectedSlot: null,
        open: true,
      };
    case "BOOK":
      return {
        ...state,
        intent: "book",
        selectedSlot: action.payload.selectedSlot,
        open: true,
      };
    case "AVAILABLE":
      return {
        ...state,
        intent: "mark-as-available",
        selectedSlot: action.payload.selectedSlot,
        open: true,
      };
    case "NOT_AVAILABLE":
      return {
        ...state,
        intent: "mark-as-not-available",
        selectedSlot: action.payload.selectedSlot,
        open: true,
      };
    case "DONE":
      return {
        ...state,
        intent: "mark-as-done",
        selectedSlot: action.payload.selectedSlot,
        open: true,
      };
    case "NOT_PRESENT":
      return {
        ...state,
        intent: "mark-as-not-present",
        selectedSlot: action.payload.selectedSlot,
        open: true,
      };
    case "REMOVE_PARTICIPANT":
      return {
        ...state,
        intent: "remove-participant",
        selectedSlot: action.payload.selectedSlot,
        open: true,
      };
    case "CLOSE":
      return {
        ...state,
        intent: null,
        open: false,
      };
    case "OPEN":
      return {
        ...state,
        intent: null,
        open: true,
      };
  }
};

const initialState: State = {
  open: false,
  intent: null,
  selectedSlot: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConsultationAction = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  const createSlot = () => {
    dispatch({ type: "CREATE" });
  };
  const bookSlot = (slot: ConsultationSlot) => {
    dispatch({ type: "BOOK", payload: { selectedSlot: slot } });
  };
  const markSlotAsAvailable = (slot: ConsultationSlot) => {
    dispatch({ type: "AVAILABLE", payload: { selectedSlot: slot } });
  };
  const markSlotAsNotAvailable = (slot: ConsultationSlot) => {
    dispatch({ type: "NOT_AVAILABLE", payload: { selectedSlot: slot } });
  };
  const markSlotAsDone = (slot: ConsultationSlot) => {
    dispatch({ type: "DONE", payload: { selectedSlot: slot } });
  };
  const markSlotAsNotPresent = (slot: ConsultationSlot) => {
    dispatch({ type: "NOT_PRESENT", payload: { selectedSlot: slot } });
  };
  const removeSlotParticipant = (slot: ConsultationSlot) => {
    dispatch({ type: "REMOVE_PARTICIPANT", payload: { selectedSlot: slot } });
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
    createSlot,
    bookSlot,
    markSlotAsAvailable,
    markSlotAsNotAvailable,
    markSlotAsDone,
    markSlotAsNotPresent,
    removeSlotParticipant,
    setOpen,
  };
};
