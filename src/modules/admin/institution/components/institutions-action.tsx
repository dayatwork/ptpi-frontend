import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Institution } from "../institution";
import { PlusIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { CreateInstitutionForm } from "./forms/create-institution-form";
import { useReducer } from "react";
import { EditInstitutionForm } from "./forms/edit-institution-form";
import { DeleteInstitutionForm } from "./forms/delete-institution-form";

type Props = {
  setOpen: (open: boolean) => void;
  state: State;
};

export function InstitutionsActionDialog({
  state: { intent, open, selectedInstitution },
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
      <DialogContent className="w-[360px]">
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
              {intent === "create" && "Add New Institution"}
              {intent === "edit" && "Edit Institution"}
              {intent === "delete" && "Delete Institution"}
            </DialogTitle>
            <DialogDescription className="text-left">
              {intent === "create" && "Add New Institution"}
              {intent === "edit" && "Edit Institution"}
              {intent === "delete" && "Delete Institution"}
            </DialogDescription>
          </DialogHeader>
        </div>
        {intent === "create" && (
          <CreateInstitutionForm
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
        {intent === "edit" && selectedInstitution && (
          <EditInstitutionForm
            selectedInstitution={selectedInstitution}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
        {intent === "delete" && selectedInstitution && (
          <DeleteInstitutionForm
            selectedInstitution={selectedInstitution}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type State = {
  selectedInstitution: Institution | null;
  open: boolean;
  intent: "create" | "edit" | "delete" | null;
};

type Action =
  | {
      type: "CREATE";
    }
  | { type: "EDIT"; payload: { selectedInstitution: Institution } }
  | { type: "DELETE"; payload: { selectedInstitution: Institution } }
  | { type: "CLOSE" }
  | { type: "OPEN" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CREATE":
      return {
        ...state,
        intent: "create",
        open: true,
        selectedInstitution: null,
      };
    case "EDIT":
      return {
        ...state,
        intent: "edit",
        open: true,
        selectedInstitution: action.payload.selectedInstitution,
      };
    case "DELETE":
      return {
        ...state,
        intent: "delete",
        open: true,
        selectedInstitution: action.payload.selectedInstitution,
      };
    case "CLOSE":
      return {
        ...state,
        intent: null,
        open: false,
        selectedInstitution: null,
      };
    case "OPEN":
      return {
        ...state,
        intent: null,
        open: true,
        selectedInstitution: null,
      };
  }
};

const initialState: State = {
  selectedInstitution: null,
  open: false,
  intent: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInstitutionsAction = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const createInstitution = () => {
    dispatch({ type: "CREATE" });
  };

  const editInstitution = (selectedInstitution: Institution) => {
    dispatch({ type: "EDIT", payload: { selectedInstitution } });
  };

  const deleteInstitution = (selectedInstitution: Institution) => {
    dispatch({ type: "DELETE", payload: { selectedInstitution } });
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
    createInstitution,
    editInstitution,
    deleteInstitution,
    setOpen,
  };
};
