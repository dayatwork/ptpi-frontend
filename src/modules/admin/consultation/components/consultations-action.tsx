import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event } from "../../event/event";
import { Consultation } from "../consultation";
import { PlusIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { CreateConsultationForm } from "./forms/create-consultation-form";
import { useReducer } from "react";

type Props = {
  setOpen: (open: boolean) => void;
  state: State;
};

export function ConsultationsActionDialog({
  state: { intent, open, event },
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
              {intent === "create" && "Create Consultation"}
              {intent === "edit" && "Edit Consultation"}
              {intent === "delete" && "Delete Consultation"}
            </DialogTitle>
            <DialogDescription className="text-left">
              {intent === "create" && "Create Consultation"}
              {intent === "edit" && "Edit Consultation"}
              {intent === "delete" && "Delete Consultation"}
            </DialogDescription>
          </DialogHeader>
        </div>
        {intent === "create" && (
          <CreateConsultationForm
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            event={event}
          />
        )}
        {/* {intent === "edit" && selectedSeminar && (
          <EditSeminarForm
            selectedSeminar={selectedSeminar}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
        {intent === "delete" && selectedSeminar && (
          <DeleteSeminarForm
            selectedSeminar={selectedSeminar}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )} */}
      </DialogContent>
    </Dialog>
  );
}

type State = {
  selectedConsultation: Consultation | null;
  open: boolean;
  intent: "create" | "edit" | "delete" | null;
  event: Event;
};

type Action =
  | {
      type: "CREATE";
    }
  | { type: "EDIT"; payload: { selectedConsultation: Consultation } }
  | { type: "DELETE"; payload: { selectedConsultation: Consultation } }
  | { type: "CLOSE" }
  | { type: "OPEN" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CREATE":
      return {
        ...state,
        intent: "create",
        open: true,
        selectedConsultation: null,
      };
    case "EDIT":
      return {
        ...state,
        intent: "edit",
        open: true,
        selectedConsultation: action.payload.selectedConsultation,
      };
    case "DELETE":
      return {
        ...state,
        intent: "delete",
        open: true,
        selectedConsultation: action.payload.selectedConsultation,
      };
    case "CLOSE":
      return {
        ...state,
        intent: null,
        open: false,
        selectedConsultation: null,
      };
    case "OPEN":
      return {
        ...state,
        intent: null,
        open: true,
        selectedConsultation: null,
      };
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConsultationsAction = (event: Event) => {
  const [state, dispatch] = useReducer(reducer, {
    selectedConsultation: null,
    open: false,
    intent: null,
    event,
  });

  const createConsultation = () => {
    dispatch({ type: "CREATE" });
  };

  const editConsultation = (selectedConsultation: Consultation) => {
    dispatch({ type: "EDIT", payload: { selectedConsultation } });
  };

  const deleteConsultation = (selectedConsultation: Consultation) => {
    dispatch({ type: "DELETE", payload: { selectedConsultation } });
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
    createConsultation,
    editConsultation,
    deleteConsultation,
    setOpen,
  };
};
