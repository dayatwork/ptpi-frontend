import { AdminContainer } from "@/components/layouts/admin/admin-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminContainer
      header={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <LayoutDashboard className="size-4" />
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      Hello "/admin/dashboard"!
    </AdminContainer>
  );
}
