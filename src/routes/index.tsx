import { buttonVariants } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="font-semibold text-4xl">Welcome to PTPI Events</h1>
      <Link to="/app" className={buttonVariants()}>
        Go to app
      </Link>
    </div>
  );
}
