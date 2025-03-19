import { AdminContainer } from "@/components/layouts/admin/admin-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/admin/exhibitions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminContainer
      header={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-2">
                <LayoutDashboard className="size-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Exhibitions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      Hello "/admin/exhibitions"!
    </AdminContainer>
  );
}
