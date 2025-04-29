import { signOut } from "@/auth/auth-client";
import { isAdmin } from "@/auth/guards/is-admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  invalidateUserSession,
  useUserSession,
} from "@/modules/auth/auth.query";
import { UserCard } from "@/modules/auth/components/user-card";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, Calendar, LogOut, Settings2, User } from "lucide-react";
import { useState } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <div className="flex gap-12 items-center">
            <Link to="/app" className="flex items-center gap-2 font-semibold">
              <Calendar className="h-6 w-6" />
              <span className="hidden sm:inline-block">PTPI Events</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/app"
                className="text-sm px-2 py-1 rounded hover:bg-accent"
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-foreground font-semibold" }}
                inactiveProps={{ className: "text-muted-foreground" }}
              >
                Home
              </Link>
              <Link
                to="/app/events"
                className="text-sm px-2 py-1 rounded hover:bg-accent"
                activeProps={{ className: "text-foreground font-semibold" }}
                inactiveProps={{ className: "text-muted-foreground" }}
              >
                Events
              </Link>
              <Link
                to="/app/consultation-schedule"
                className="text-sm px-2 py-1 rounded hover:bg-accent"
                activeProps={{ className: "text-foreground font-semibold" }}
                inactiveProps={{ className: "text-muted-foreground" }}
              >
                Consultation Schedule
              </Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <AdminLink />
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/40">{children}</main>
    </div>
  );
}

const AdminLink = () => {
  const { data: session } = useUserSession();

  if (!session || !isAdmin({ user: session.user })) return null;

  return (
    <Link
      to="/admin"
      className="font-semibold text-sm flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-accent"
    >
      Go to admin Panel
      <ArrowRight className="size-4" />
    </Link>
  );
};

const UserButton = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useUserSession();
  const router = useRouter();

  const onSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: async () => {
          await invalidateUserSession();
          router.invalidate();
          window.location.href = "/sign-in";
        },
      },
    });
  };

  if (!session) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-3xl">
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
          </DialogHeader>
          <UserCard noCard />
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full border">
            <Avatar>
              <AvatarImage
                src={session.user.image ?? ""}
                alt={session.user.name}
                className="object-cover"
              />
              <AvatarFallback>
                {session.user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="p-0 font-normal pr-4">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={session.user.image ?? ""}
                  alt={session.user.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {session.user.name}
                </span>
                <span className="truncate text-xs">{session.user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <User />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar />
            My Events
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings2 />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSignOut}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
