import { useReducer } from "react";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegisterSeminarParticipantForm } from "./forms/register-seminar-participant-form";

type Props = {
  seminarId: string;
  setOpen: (open: boolean) => void;
  state: State;
};

export function SeminarParticipantActionDialog({
  state: { intent, open, seminarId },
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
            {intent === "register" && (
              <PlusIcon className="opacity-80" size={16} />
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">
              {intent === "register" && "Register Participant"}
            </DialogTitle>
            <DialogDescription className="text-left">
              {intent === "register" && "Register Participant"}
            </DialogDescription>
          </DialogHeader>
        </div>
        {intent === "register" && (
          <RegisterSeminarParticipantForm
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            seminarId={seminarId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type State = {
  open: boolean;
  intent: "register" | null;
  seminarId: string;
};

type Action =
  | {
      type: "REGISTER";
    }
  | { type: "CLOSE" }
  | { type: "OPEN" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "REGISTER":
      return {
        ...state,
        intent: "register",
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
  seminarId: "",
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSeminarParticipantAction = ({
  seminarId,
}: {
  seminarId: string;
}) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, seminarId });

  const registerParticipant = () => {
    dispatch({ type: "REGISTER" });
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
    setOpen,
    registerParticipant,
  };
};
