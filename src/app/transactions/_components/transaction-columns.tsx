import { ColumnDef } from "@tanstack/react-table";
import { ClientTransaction } from "@/drizzle/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import React from "react";

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
    cell: ({ row }) =>
      formatCurrency(row.original.amount, row.original.bankAccount.currency),
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="sm">
        <MoreHorizontal />
      </Button>
    ),
  },
];
