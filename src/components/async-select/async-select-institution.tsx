import { AsyncSelect } from "./async-select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitialName } from "@/utils/string";
import { listInstitutions } from "@/modules/admin/institution/institution.api";

interface Institution {
  id: string;
  name: string;
  logo: string | null;
}

interface AsyncSelectInstitutionProps {
  selectedInstitutionId: string;
  setSelectedInstitutionId: (id: string) => void;
}

export function AsyncSelectInstitution({
  selectedInstitutionId,
  setSelectedInstitutionId,
}: AsyncSelectInstitutionProps) {
  return (
    <AsyncSelect<Institution>
      fetcher={(search) => listInstitutions({ search: search ?? "" })}
      renderOption={(user) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.logo ?? ""} className="object-cover" />
            <AvatarFallback>{getInitialName(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-medium">{user.name}</div>
          </div>
        </div>
      )}
      getOptionValue={(user) => user.id}
      getDisplayValue={(user) => (
        <div className="flex items-center gap-2">
          <div className="font-medium">{user.name}</div>
        </div>
      )}
      notFound={
        <div className="py-6 text-center text-sm">No insitutions found</div>
      }
      label="User"
      placeholder="Search insitutions..."
      value={selectedInstitutionId}
      onChange={setSelectedInstitutionId}
      width="100%"
    />
  );
}
