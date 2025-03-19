import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  Handshake,
  Info,
  Landmark,
  LayoutDashboard,
  Phone,
  Presentation,
  Settings2,
  Store,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      title: "Sections",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Events",
          url: "/admin/events",
          icon: CalendarDays,
        },
        {
          title: "Seminars",
          url: "/admin/seminars",
          icon: Presentation,
          isActive: true,
        },
        {
          title: "Exhibitions",
          url: "/admin/exhibitions",
          icon: Store,
        },
        {
          title: "Consultations",
          url: "/admin/consultations",
          icon: Phone,
        },
        {
          title: "Sponsorships",
          url: "/admin/sponsorships",
          icon: Handshake,
        },
        {
          title: "Institutions",
          url: "/admin/institutions",
          icon: Landmark,
        },
        {
          title: "Users",
          url: "/admin/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Other",
      url: "#",
      items: [
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
        },
        {
          title: "Help Center",
          url: "#",
          icon: Info,
        },
      ],
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/admin/dashboard" className="flex px-3 py-2 gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground">
            <Calendar className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">PTPI Events</span>
            <span className="truncate text-xs">Admin Panel</span>
          </div>
        </Link>
        <hr className="border-t border-border mx-2 -mt-px" />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                      isActive={pathname === item.url}
                    >
                      <Link to={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent className="px-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
              >
                <Link to="/app">
                  <ArrowLeft className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary" />
                  Back to user app
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        <hr className="border-t border-border mx-2 -mt-px" />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
