import { useRef, useState } from "react";
import { UserRoundPlusIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/form";
import { FormErrors } from "@/components/form/form-errors";
import { useCreateUserMutation } from "../user.mutation";

const createUserSchema = z.object({
  name: z.string().min(3, "Minimum 3 characters"),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, "Minimum 8 characters"),
});

export function CreateUser() {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const createUserMutation = useCreateUserMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => setOpen(false),
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: createUserSchema,
    },
    onSubmit: async ({ value }) => {
      await createUserMutation.mutateAsync(value);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        form.reset();
        setOpen(o);
      }}
    >
      <DialogTrigger asChild>
        <Button className="px-3">Add User</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
        className="w-[360px]"
      >
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <UserRoundPlusIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Add New User</DialogTitle>
            <DialogDescription className="text-left">
              Invite new user.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FormErrors error={formError} />
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Name" />}
          />
          <form.AppField
            name="email"
            children={(field) => <field.EmailField label="Email" />}
          />
          <form.AppField
            name="password"
            children={(field) => <field.PasswordField label="Password" />}
          />
          <div className="flex gap-2 justify-end mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <form.AppForm>
              <form.SubmitButton
                text="Create User"
                submittingText="Creating User..."
              />
            </form.AppForm>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
