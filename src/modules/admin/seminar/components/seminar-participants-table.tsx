import { CSSProperties, useId, useMemo, useState } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Columns3Icon,
  EllipsisIcon,
  PenSquare,
  PinOffIcon,
  Plus,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { RiMoreLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SeminarParticipant } from "../seminar-participant";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSeminarParticipants } from "../seminar-participant.query";
import {
  SeminarParticipantActionDialog,
  useSeminarParticipantAction,
} from "./seminar-participant-action";
import {
  validParticipantPaymentStatuses,
  validParticipantStatuses,
} from "../seminar-participant.validation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialName } from "@/utils/string";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

type Item = SeminarParticipant;

// Helper function to compute pinning styles for columns
const getPinningStyles = (column: Column<Item>): CSSProperties => {
  const isPinned = column.getIsPinned();
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

const formatFilterFn: FilterFn<Item> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export function SeminarParticipantsTable({ seminarId }: { seminarId: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    paidAt: false,
    registeredAt: false,
  });
  const { setOpen, state, registerParticipant } = useSeminarParticipantAction({
    seminarId,
  });
  const { data } = useSeminarParticipants({ seminarId });

  const columns: ColumnDef<Item>[] = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "userName",
        cell: ({ row }) => (
          <div className="truncate font-medium flex gap-2 items-center">
            <Avatar>
              <AvatarImage src={row.original.userAvatar ?? ""} />
              <AvatarFallback className="bg-foreground text-background">
                {getInitialName(row.original.userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p>{row.getValue("userName")}</p>
            </div>
          </div>
        ),
        meta: {
          filterVariant: "text",
        },
        enableHiding: false,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
        enableResizing: false,
        size: 60,
        meta: {
          filterVariant: "select",
        },
        filterFn: formatFilterFn,
      },
      {
        header: "Registered at",
        accessorKey: "registeredAt",
        cell: ({ row }) => (
          <time dateTime={row.getValue("registeredAt")}>
            {new Date(row.getValue("registeredAt")).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        ),
      },
      {
        header: "Payment Status",
        accessorKey: "paymentStatus",
        cell: ({ row }) => <Badge>{row.getValue("paymentStatus")}</Badge>,
        enableResizing: false,
        size: 60,
        meta: {
          filterVariant: "select",
        },
        filterFn: formatFilterFn,
      },
      {
        header: "Paid at",
        accessorKey: "paidAt",
        cell: ({ row }) =>
          row.original.paidAt ? (
            <time dateTime={row.original.paidAt}>
              {new Date(row.original.paidAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
          ) : null,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex justify-end">
                <Button
                  size="icon"
                  variant="ghost"
                  className="shadow-none text-muted-foreground/60"
                  aria-label="Edit item"
                >
                  <RiMoreLine className="size-5" size={20} aria-hidden="true" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PenSquare />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        enablePinning: false,
        size: 20,
      },
    ],
    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    enableSortingRemoval: false,
  });

  return (
    <div>
      <SeminarParticipantActionDialog
        state={state}
        setOpen={setOpen}
        seminarId={seminarId}
      />
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold">Participants</h2>
        <Button
          size="sm"
          onClick={registerParticipant}
          className="text-sm pl-2 h-8"
        >
          <Plus />
          Register Participant
        </Button>
      </div>
      <div className="flex gap-2 items-end mb-2">
        <Filter column={table.getColumn("userName")!} />
        <Filter
          column={table.getColumn("status")!}
          options={validParticipantStatuses as unknown as string[]}
          width={130}
        />
        <Filter
          column={table.getColumn("paymentStatus")!}
          options={validParticipantPaymentStatuses as unknown as string[]}
          width={130}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Columns3Icon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    onSelect={(event) => event.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {table.getRowModel().rows?.length ? (
        <Table
          className="[&_td]:border-border [&_th]:border-border table-fixed border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
          // style={{
          //   width: table.getTotalSize(),
          // }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  const isPinned = column.getIsPinned();
                  const isLastLeftPinned =
                    isPinned === "left" && column.getIsLastColumn("left");
                  const isFirstRightPinned =
                    isPinned === "right" && column.getIsFirstColumn("right");

                  return (
                    <TableHead
                      key={header.id}
                      className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 relative h-10 truncate border-t data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l border-r"
                      aria-sort={
                        header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                            ? "descending"
                            : "none"
                      }
                      colSpan={header.colSpan}
                      style={{ ...getPinningStyles(column) }}
                      data-pinned={isPinned || undefined}
                      data-last-col={
                        isLastLeftPinned
                          ? "left"
                          : isFirstRightPinned
                            ? "right"
                            : undefined
                      }
                    >
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex items-center justify-between gap-2"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          // Enhanced keyboard handling for sorting
                          if (
                            header.column.getCanSort() &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        <span className="truncate">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </span>
                        <div className="flex gap-1 items-center">
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}

                          {/* Pin/Unpin column controls with enhanced accessibility */}
                          {!header.isPlaceholder &&
                            header.column.getCanPin() &&
                            (header.column.getIsPinned() ? (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="-mr-1 size-7 shadow-none"
                                onClick={() => header.column.pin(false)}
                                aria-label={`Unpin ${header.column.columnDef.header as string} column`}
                                title={`Unpin ${header.column.columnDef.header as string} column`}
                              >
                                <PinOffIcon
                                  className="opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              </Button>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="-mr-1 size-7 shadow-none"
                                    aria-label={`Pin options for ${header.column.columnDef.header as string} column`}
                                    title={`Pin options for ${header.column.columnDef.header as string} column`}
                                  >
                                    <EllipsisIcon
                                      className="opacity-60"
                                      size={16}
                                      aria-hidden="true"
                                    />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => header.column.pin("left")}
                                  >
                                    <ArrowLeftToLineIcon
                                      size={16}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Stick to left
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => header.column.pin("right")}
                                  >
                                    <ArrowRightToLineIcon
                                      size={16}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Stick to right
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ))}
                        </div>
                        {header.column.getCanResize() && (
                          <div
                            {...{
                              onDoubleClick: () => header.column.resetSize(),
                              onClick: (e) => e.stopPropagation(),
                              onKeyDown: (e) => e.stopPropagation(),
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              className:
                                "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
                            }}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  const isPinned = column.getIsPinned();
                  const isLastLeftPinned =
                    isPinned === "left" && column.getIsLastColumn("left");
                  const isFirstRightPinned =
                    isPinned === "right" && column.getIsFirstColumn("right");

                  return (
                    <TableCell
                      key={cell.id}
                      className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 truncate data-pinned:backdrop-blur-xs [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l"
                      style={{ ...getPinningStyles(column) }}
                      data-pinned={isPinned || undefined}
                      data-last-col={
                        isLastLeftPinned
                          ? "left"
                          : isFirstRightPinned
                            ? "right"
                            : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex justify-center items-center py-4">
          <p className="text-muted-foreground text-sm">No result</p>
        </div>
      )}
    </div>
  );
}

function Filter({
  column,
  options,
  width,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: Column<any, unknown>;
  options?: string[];
  width?: number;
}) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnHeader =
    typeof column.columnDef.header === "string" ? column.columnDef.header : "";
  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === "range") return [];

    // Get all unique values from the column
    const values = Array.from(column.getFacetedUniqueValues().keys());

    // If the values are arrays, flatten them and get unique items
    const flattenedValues = values.reduce((acc: string[], curr) => {
      if (Array.isArray(curr)) {
        return [...acc, ...curr];
      }
      return [...acc, curr];
    }, []);

    // Get unique values and sort them
    return Array.from(new Set(flattenedValues)).sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFacetedUniqueValues(), filterVariant]);

  if (filterVariant === "range") {
    return (
      <div className="*:not-first:mt-2">
        <Label>{columnHeader}</Label>
        <div className="flex">
          <Input
            id={`${id}-range-1`}
            className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[0] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1],
              ])
            }
            placeholder="Min"
            type="number"
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined,
              ])
            }
            placeholder="Max"
            type="number"
            aria-label={`${columnHeader} max`}
          />
        </div>
      </div>
    );
  }

  if (filterVariant === "select") {
    return (
      <div className="*:not-first:mt-2">
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? "all"}
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger id={`${id}-select`} style={{ width }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={String(value)} value={String(value)}>
                {String(value)}
              </SelectItem>
            ))}
            {options?.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className="relative">
        <Input
          id={`${id}-input`}
          className="peer ps-9"
          value={(columnFilterValue ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type="search"
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}
