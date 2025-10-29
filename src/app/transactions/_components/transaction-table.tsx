import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { ClientTransaction } from "@/drizzle/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}
export const transactionColumns: ColumnDef<ClientTransaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    accessorKey: "bankAccount",
    header: "Account",
    cell: ({ row }) => row.original.bankAccount.name,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.category.name,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.category.parent?.name ?? "-",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span
        className={`${
          row.original.transactionType === "income"
            ? "text-green-300"
            : "text-red-300"
        }`}
      >
        {formatCurrency(row.original.amount, row.original.bankAccount.currency)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    meta: { className: "w-20 text-center" },
    cell: () => (
      <ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="icon-sm">
            <SquarePen />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="destructive" size="icon-sm">
            <Trash2 />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    ),
  },
];

export function TransactionTable({ data }: { data: ClientTransaction[] }) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const table = useReactTable({
    data,
    columns: transactionColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-md border w-full">
      <Table>
        <TableHeader className="text-base font-bold">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.className}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={transactionColumns.length}
                className="text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
