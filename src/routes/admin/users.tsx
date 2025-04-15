import { createFileRoute } from "@tanstack/react-router";
import { AdminContainer } from "@/components/layouts/admin/admin-container";
import { ensureUsersData } from "@/modules/admin/user/user.query";
import { UsersTable } from "@/modules/admin/user/components/users-table";
import { UsersStats } from "@/modules/admin/user/components/users-stats";
import { UsersHeader } from "@/modules/admin/user/components/users-header";
import { CreateUser } from "@/modules/admin/user/components/create-user";

export const Route = createFileRoute("/admin/users")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => ensureUsersData(queryClient),
});

function RouteComponent() {
  return (
    <AdminContainer header={<UsersHeader />}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Users</h1>
        </div>
        <CreateUser />
      </div>
      <UsersStats />
      <div className="min-h-[100vh] flex-1 md:min-h-min mt-4">
        <UsersTable />
      </div>
    </AdminContainer>
  );
}
