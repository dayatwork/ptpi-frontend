import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export function AdminContainer({
  children,
  header,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <SidebarInset>
      <header className="flex pt-4 pb-2 shrink-0 items-center gap-2 justify-between">
        <div className="flex items-center gap-2 px-6">
          <SidebarTrigger className="bg-muted hover:bg-muted-foreground/20" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {header}
        </div>
        <div className="flex items-center gap-2 px-6">
          <ModeToggle />
        </div>
      </header>
      <Separator className="mb-3 mt-1" />
      <div className="py-4 px-6 pt-0">{children}</div>
    </SidebarInset>
  );
}
