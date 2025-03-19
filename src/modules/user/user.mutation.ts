import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { createUser } from "./user.api";
import { USERS_KEY } from "./user.query";

interface Props {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof createUser>>) => void;
}

export const useCreateUserMutation = (props?: Props) =>
  useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      toast.success(`New user "${data.data?.user.name}" created`);
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to create new user. ${error.message}`);
      props?.onError?.(error);
    },
  });
