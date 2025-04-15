import { useReducer } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Play, SquarePenIcon, Trash2Icon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event } from "../../event/event";
import { Seminar } from "../seminar";
import { EditSeminarForm } from "./forms/edit-seminar-form";
import { DeleteSeminarForm } from "./forms/delete-seminar-form";
import { StartSeminarForm } from "./forms/start-seminar-form.";
import { CancelSeminarForm } from "./forms/cancel-seminar-form.";
import { EndSeminarForm } from "./forms/end-seminar-form";

type Props = {
  setOpen: (open: boolean) => void;
  state: State;
  seminar: Seminar & { event: Event | null };
};

export function SeminarActionDialog({
  state: { intent, open },
  setOpen,
  seminar,
}: Props) {
  const navigate = useNavigate();
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
            {intent === "edit" && (
              <SquarePenIcon className="opacity-80" size={16} />
            )}
            {intent === "delete" && (
              <Trash2Icon className="opacity-80" size={16} />
            )}
            {intent === "start" && <Play className="opacity-80" size={16} />}
            {intent === "cancel" && <X className="opacity-80" size={16} />}
            {intent === "end" && <Check className="opacity-80" size={16} />}
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">
              {intent === "edit" && "Edit Seminar"}
              {intent === "delete" && "Delete Seminar"}
              {intent === "start" && "Start Seminar"}
              {intent === "cancel" && "Cancel Seminar"}
              {intent === "end" && "End Seminar"}
            </DialogTitle>
            <DialogDescription className="text-left">
              {intent === "edit" && "Edit Seminar"}
              {intent === "delete" && "Delete Seminar"}
              {intent === "start" && "Start Seminar"}
              {intent === "cancel" && "Cancel Seminar"}
              {intent === "end" && "End Seminar"}
            </DialogDescription>
          </DialogHeader>
        </div>
        {intent === "edit" && (
          <EditSeminarForm
            selectedSeminar={seminar}
            onSuccess={() => {
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        )}
        {intent === "delete" && (
          <DeleteSeminarForm
            selectedSeminar={seminar}
            onSuccess={() => {
              if (seminar.eventId) {
                navigate({
                  to: "/admin/events/$id",
                  params: { id: seminar.eventId },
                });
              } else {
                navigate({ to: "/admin/seminars" });
              }
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        )}
        {intent === "start" && (
          <StartSeminarForm
            selectedSeminar={seminar}
            onSuccess={() => {
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        )}
        {intent === "cancel" && (
          <CancelSeminarForm
            selectedSeminar={seminar}
            onSuccess={() => {
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        )}
        {intent === "end" && (
          <EndSeminarForm
            selectedSeminar={seminar}
            onSuccess={() => {
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type State = {
  open: boolean;
  intent: "edit" | "delete" | "start" | "cancel" | "end" | null;
};

type Action =
  | { type: "EDIT" }
  | { type: "DELETE" }
  | { type: "START" }
  | { type: "CANCEL" }
  | { type: "END" }
  | { type: "CLOSE" }
  | { type: "OPEN" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "EDIT":
      return {
        ...state,
        intent: "edit",
        open: true,
      };
    case "DELETE":
      return {
        ...state,
        intent: "delete",
        open: true,
      };
    case "START":
      return {
        ...state,
        intent: "start",
        open: true,
      };
    case "CANCEL":
      return {
        ...state,
        intent: "cancel",
        open: true,
      };
    case "END":
      return {
        ...state,
        intent: "end",
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
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSeminarAction = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  const editSeminar = () => {
    dispatch({ type: "EDIT" });
  };

  const deleteSeminar = () => {
    dispatch({ type: "DELETE" });
  };
  const startSeminar = () => {
    dispatch({ type: "START" });
  };
  const cancelSeminar = () => {
    dispatch({ type: "CANCEL" });
  };
  const endSeminar = () => {
    dispatch({ type: "END" });
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
    editSeminar,
    deleteSeminar,
    startSeminar,
    cancelSeminar,
    endSeminar,
    setOpen,
  };
};
