import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Seminar } from "../seminar";
import { PlusIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { CreateSeminarForm } from "./forms/create-seminar-form";
import { useReducer } from "react";
import { EditSeminarForm } from "./forms/edit-seminar-form";
import { DeleteSeminarForm } from "./forms/delete-seminar-form";
import { type Event } from "@/modules/admin/event/event";

type Props = {
  setOpen: (open: boolean) => void;
  state: State;
};

export function SeminarsActionDialog({
  state: { intent, open, selectedSeminar, event },
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
              {intent === "create" && "Create New Seminar"}
              {intent === "edit" && "Edit Seminar"}
              {intent === "delete" && "Delete Seminar"}
            </DialogTitle>
            <DialogDescription className="text-left">
              {intent === "create" && "Create New Seminar"}
              {intent === "edit" && "Edit Seminar"}
              {intent === "delete" && "Delete Seminar"}
            </DialogDescription>
          </DialogHeader>
        </div>
        {intent === "create" && (
          <CreateSeminarForm
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            event={event}
          />
        )}
        {intent === "edit" && selectedSeminar && (
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
        )}
      </DialogContent>
    </Dialog>
  );
}

type State = {
  selectedSeminar: Seminar | null;
  open: boolean;
  intent: "create" | "edit" | "delete" | null;
  event?: Event | null;
};

type Action =
  | {
      type: "CREATE";
    }
  | { type: "EDIT"; payload: { selectedSeminar: Seminar } }
  | { type: "DELETE"; payload: { selectedSeminar: Seminar } }
  | { type: "CLOSE" }
  | { type: "OPEN" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CREATE":
      return {
        ...state,
        intent: "create",
        open: true,
        selectedSeminar: null,
      };
    case "EDIT":
      return {
        ...state,
        intent: "edit",
        open: true,
        selectedSeminar: action.payload.selectedSeminar,
      };
    case "DELETE":
      return {
        ...state,
        intent: "delete",
        open: true,
        selectedSeminar: action.payload.selectedSeminar,
      };
    case "CLOSE":
      return {
        ...state,
        intent: null,
        open: false,
        selectedSeminar: null,
      };
    case "OPEN":
      return {
        ...state,
        intent: null,
        open: true,
        selectedSeminar: null,
      };
  }
};

const initialState: State = {
  selectedSeminar: null,
  open: false,
  intent: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSeminarsAction = (event?: Event) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, event });

  const createSeminar = () => {
    dispatch({ type: "CREATE" });
  };

  const editSeminar = (selectedSeminar: Seminar) => {
    dispatch({ type: "EDIT", payload: { selectedSeminar } });
  };

  const deleteSeminar = (selectedSeminar: Seminar) => {
    dispatch({ type: "DELETE", payload: { selectedSeminar } });
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
    createSeminar,
    editSeminar,
    deleteSeminar,
    setOpen,
  };
};
