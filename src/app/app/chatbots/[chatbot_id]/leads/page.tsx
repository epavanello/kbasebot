"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useDeleteMutation,
  usePaginationQuery,
} from "@supabase-cache-helpers/postgrest-swr";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@/components/ui/popover";
import { useState } from "react";
import { DatabaseBackup, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useSupabaseAuth } from "@/lib/store/use-user";
import LoadingDots from "@/components/ui/loading-dots";
import Link from "next/link";

export type FormSubmission = {
  id: string;
  amount: number;
  email: string;
};

const ITEMS_PER_PAGE = 8;

const Actions: React.FC<{ row: any }> = ({ row }) => {
  const { supabase } = useSupabaseAuth();
  const data = row.original;

  const [removePopupOpen, setRemovePopupOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { trigger: handleDelete, isMutating: removing } = useDeleteMutation(
    supabase.from("leads"),
    ["id"],
    "created_at",
    {
      onSuccess: () => {
        setRemovePopupOpen(false);
        setDropdownOpen(false);
      },
    },
  );

  return (
    <DropdownMenu onOpenChange={setDropdownOpen} open={dropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Popover open={removePopupOpen} onOpenChange={setRemovePopupOpen}>
          <PopoverTrigger asChild>
            <Button variant="destructive" size={"sm"} className="w-full">
              <TrashIcon size={18} />
              <span className="ml-1">Remove</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col justify-center items-center">
            <p className="text-md font-medium my-2">Are you sure to remove?</p>
            <p className="text-xs text-muted-foreground text-center">
              This action will remove data of {data.email}
            </p>
            <div className="mt-2 flex">
              <Button
                className="mr-2"
                variant="ghost"
                onClick={() => setRemovePopupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete({ id: data.id })}
                disabled={removing}
                loading={removing}
                variant="destructive"
              >
                {removing ? <LoadingDots /> : "Confirm"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/*<DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>*/}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<FormSubmission>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    enableSorting: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    enableSorting: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
        </Button>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="justify-end w-full"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Received At
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const createdAT: string = row.getValue("created_at");

      return (
        <div className="text-right font-medium">
          {new Date(createdAT).toLocaleString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: Actions,
  },
];

function Leads() {
  const { chatbot_id } = useParams();
  const { supabase } = useSupabaseAuth();

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [rowSelection, setRowSelection] = React.useState({});

  // Initialize query
  let query = supabase.from("leads").select("*").eq("chatbot_id", chatbot_id);

  if (columnFilters?.length) {
    columnFilters.forEach((filter) => {
      if (filter.id === "email") {
        query.like("response->>email", `%${filter.value}%`);
      }
    });
  }

  // Apply each order condition to the query
  sorting.forEach((sort) => {
    let id = sort.id;
    if (id === "email") id = "response -> email";

    query = query.order(id, { ascending: !sort.desc });
  });

  // @ts-ignore
  const { currentPage, nextPage, previousPage, setPage, pageIndex, isLoading } =
    usePaginationQuery(query, {
      pageSize: ITEMS_PER_PAGE,
      revalidateOnReconnect: true,
    });

  // @ts-ignore
  const table = useReactTable({
    data: currentPage,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize: ITEMS_PER_PAGE,
      },
    },
    onPaginationChange: setPage,
  });

  const downloadFile = async (content) => {
    const blob = new Blob([content], { type: "text/csv" });
    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = `${chatbot_id}-${new Date().toLocaleString()}.csv`;
    // Programmatically click the link to trigger the download
    link.click();
    // Clean up the temporary objects and revoke the URL
    URL.revokeObjectURL(url);
  };

  const [exporting, setExporting] = useState(false);
  const [exportDropDownOpen, setExportDropDownOpen] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("chatbot_id", chatbot_id)
        .csv();

      if (!data) throw new Error("Something went wrong! Please try again");

      await downloadFile(data);

      setExportDropDownOpen(false);
    } catch (e) {
      console.error(e);
      alert(e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardShell className="container mt-4 gap-0">
      <DashboardHeader
        heading={"Leads"}
        text="Manage your collected leads details here"
        wrapperClass={"text-center"}
      />

      <div className="w-full overflow-x-auto">
        <div className="flex flex-col lg:flex-row py-4 gap-1">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm mr-auto"
          />
          <Button disabled={true}>
            Integration <DatabaseBackup className="ml-2 h-4 w-4" /> (Coming
            soon)
          </Button>
          <Button
            asChild
            as={Link}
            href={`/app/chatbots/${chatbot_id}/settings#leads-settings`}
            scroll={true}
            variant={"outline"}
          >
            Leads Settings
          </Button>

          <DropdownMenu
            onOpenChange={setExportDropDownOpen}
            open={exportDropDownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                loading={exporting}
                disabled={exporting}
                variant="outline"
              >
                Export CSV <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                Export All
              </DropdownMenuItem>
              {/*<DropdownMenuItem>Export Selected</DropdownMenuItem>*/}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[65px] text-center"
                  >
                    <LoadingDots />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousPage}
              disabled={!previousPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={!nextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default Leads;
