import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ColumnDef } from '@tanstack/react-table';
import { ClientTransaction } from '@/drizzle/schema';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BrushCleaning, SquarePen, Trash2 } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';

import { RowData } from '@tanstack/react-table';
import { ActionButton } from '@/components/ui/action-button';
import { deleteTransaction } from '../actions/transaction-actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UpdateTransactionForm } from './update-transaction-form';
import { useState } from 'react';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

export function TransactionTable({ data }: { data: ClientTransaction[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const transactionColumns: ColumnDef<ClientTransaction>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: 'bankAccount',
      header: 'Account',
      cell: ({ row }) => row.original.bankAccount.name,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => row.original.category.name,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => row.original.category.parent?.name ?? '-',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span
          className={`${
            row.original.transactionType === 'income' ? 'text-green-300' : 'text-red-300'
          }`}
        >
          {formatCurrency(row.original.amount, row.original.bankAccount.currency)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { className: 'w-20 text-center' },
      cell: ({ row }) => (
        <ButtonGroup>
          <Dialog
            open={editingId === row.original.id}
            onOpenChange={(open) => setEditingId(open ? row.original.id : null)}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <SquarePen />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Modifica transazione</DialogTitle>
              <DialogDescription>Modifica i dettagli della transazione.</DialogDescription>
              <UpdateTransactionForm
                transaction={row.original}
                closeDialog={() => setEditingId(null)}
              />
            </DialogContent>
          </Dialog>
          <ActionButton
            requireAreYouSure
            variant="destructive"
            size="icon-sm"
            action={() => deleteTransaction(row.original.id)}
          >
            <Trash2 />
          </ActionButton>
        </ButtonGroup>
      ),
    },
  ];

  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data,
    columns: transactionColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-md border w-full">
      <Table>
        <TableHeader className="text-base font-bold">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={header.column.columnDef.meta?.className}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
              <TableCell colSpan={transactionColumns.length} className="text-center">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <BrushCleaning />
                    </EmptyMedia>
                    <EmptyTitle>No transactions here</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
