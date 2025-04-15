import { createFileRoute } from "@tanstack/react-router";
import { AdminContainer } from "@/components/layouts/admin/admin-container";
import { InstitutionsHeader } from "@/modules/admin/institution/components/institutions-header";
import { InstitutionsTable } from "@/modules/admin/institution/components/institutions-table";
import { ensureInstitutionsData } from "@/modules/admin/institution/institution.query";

export const Route = createFileRoute("/admin/institutions")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => ensureInstitutionsData(queryClient),
});

function RouteComponent() {
  return (
    <AdminContainer header={<InstitutionsHeader />}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Institutions</h1>
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 md:min-h-min mt-4">
        <InstitutionsTable />
      </div>
    </AdminContainer>
  );
}
