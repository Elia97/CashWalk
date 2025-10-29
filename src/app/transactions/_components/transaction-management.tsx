"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientTransaction } from "@/drizzle/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TransactionTable } from "./transaction-table";

export function TransactionManagement({
  transactions,
}: {
  transactions: ClientTransaction[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userAccounts = Array.from(
    new Map(
      transactions.map((tx) => [tx.bankAccount.id, tx.bankAccount]),
    ).values(),
  );
  //   const userCategories = Array.from(
  //     new Map(transactions.map((tx) => [tx.category.id, tx.category])).values(),
  //   );
  const [filter, setFilter] = useState("");

  const filterTerms = filter
    .toLowerCase()
    .split(/[\s,]+/) // divide per spazio o virgola
    .filter(Boolean);

  const filteredTransactions = transactions.filter((tx) => {
    const categoryName = tx.category.name.toLowerCase();
    const parentCategoryName = (tx.category.parent?.name ?? "").toLowerCase();
    return filterTerms.every(
      (term) =>
        categoryName.includes(term) || parentCategoryName.includes(term),
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions Management</CardTitle>
        <CardDescription>
          Manage your transactions efficiently with our intuitive interface.
        </CardDescription>
        <ButtonGroup className="w-full">
          <ButtonGroup className="flex-10">
            <Input
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button variant="outline" aria-label="Search">
              <Search />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {userAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ButtonGroup>
          <ButtonGroup>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="col-span-3 sm:col-span-1">
                  <Plus />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Choose one system category and create your own subcategory.
                </DialogDescription>
                {/* <CreateCategoryForm
                  closeDialog={() => setIsDialogOpen(false)}
                  categories={categories}
                /> */}
              </DialogContent>
            </Dialog>
          </ButtonGroup>
        </ButtonGroup>
      </CardHeader>
      <CardContent>
        <ul className="divide-y sm:hidden">
          {filteredTransactions.map((transaction) => (
            <li key={transaction.id} className="py-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)} •{" "}
                    {transaction.bankAccount.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.category.name}
                    {transaction.category.parent?.name && (
                      <> • {transaction.category.parent.name}</>
                    )}
                  </div>
                </div>
                <div className="font-bold text-right whitespace-nowrap">
                  {formatCurrency(
                    transaction.amount,
                    transaction.bankAccount.currency,
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <TransactionTable data={filteredTransactions} />
      </CardContent>
    </Card>
  );
}
