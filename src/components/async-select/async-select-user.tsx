import { listUsers } from "@/modules/user/user.api";
import { AsyncSelect } from "./async-select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitialName } from "@/utils/string";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
}

interface AsyncSelectUserProps {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
}

export function AsyncSelectUser({
  selectedUserId,
  setSelectedUserId,
}: AsyncSelectUserProps) {
  return (
    <AsyncSelect<User>
      fetcher={(search) => listUsers({ search: search ?? "" })}
      renderOption={(user) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image ?? ""} className="object-cover" />
            <AvatarFallback>{getInitialName(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.role}</div>
          </div>
        </div>
      )}
      getOptionValue={(user) => user.id}
      getDisplayValue={(user) => (
        <div className="flex items-center gap-2">
          <div className="font-medium">
            {user.name} ({user.role})
          </div>
        </div>
      )}
      notFound={<div className="py-6 text-center text-sm">No users found</div>}
      label="User"
      placeholder="Search users..."
      value={selectedUserId}
      onChange={setSelectedUserId}
      width="100%"
    />
  );
}
