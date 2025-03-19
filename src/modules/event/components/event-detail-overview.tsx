import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Event } from "../event";
import { FormatBadge } from "./format-badge";
import { StatusBadge } from "./status-badge";

export function EventDetailOverview({ event }: { event: Event }) {
  return (
    <div>
      <h2 className="font-semibold mb-2">Overview</h2>
      <div className="max-w-xl">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableBody>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 font-medium">
                  Title
                </TableCell>
                <TableCell className="py-2">{event.title}</TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 font-medium">
                  Description
                </TableCell>
                <TableCell className="py-2">{event.description}</TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 font-medium">
                  Format
                </TableCell>
                <TableCell className="py-2">
                  <FormatBadge format={event.format} />
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 font-medium">
                  Location
                </TableCell>
                <TableCell className="py-2">{event.location}</TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 font-medium">
                  Start Date
                </TableCell>
                <TableCell className="py-2">
                  {new Date(event.startDate).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 font-medium">
                  End Date
                </TableCell>
                <TableCell className="py-2">
                  {new Date(event.endDate).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 font-medium">
                  Status
                </TableCell>
                <TableCell className="py-2">
                  <StatusBadge status={event.status} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
