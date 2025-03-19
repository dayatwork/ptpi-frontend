import { createFileRoute } from "@tanstack/react-router";
import { AdminContainer } from "@/components/layouts/admin/admin-container";
import { SeminarsHeader } from "@/modules/seminar/components/seminars-header";
import { SeminarsTable } from "@/modules/seminar/components/seminars-table";
import { ensureSeminarsData } from "@/modules/seminar/seminar.query";

export const Route = createFileRoute("/admin/seminars")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => ensureSeminarsData(queryClient),
});

function RouteComponent() {
  return (
    <AdminContainer header={<SeminarsHeader />}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Seminars</h1>
        </div>
      </div>
      <div
        className="min-h-[100vh] flex-1 md:min-h-min mt-4 overflow-hidden calc(100vw-16rem)"
        // style={{
        //   maxWidth: state === "collapsed" ? "100vw" : "",
        // }}
      >
        <SeminarsTable />
      </div>
    </AdminContainer>
  );
}
