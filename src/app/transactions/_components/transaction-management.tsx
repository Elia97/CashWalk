"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientTransaction } from "@/drizzle/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TransactionTable } from "./transaction-table";
import { DateRange } from "react-day-picker";
import { TransactionFilters } from "./transaction-filters";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ActionButton } from "@/components/ui/action-button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { deleteTransaction } from "../actions/transaction-actions";
import { UpdateTransactionForm } from "./update-transaction-form";

export function TransactionManagement({
  transactions,
}: {
  transactions: ClientTransaction[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [filter, setFilter] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState<
    "all" | "income" | "expense"
  >("all");
  const isMobile = useIsMobile(1024);

  const filterTerms = filter
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedAccount !== "all" && tx.bankAccount.id !== selectedAccount) {
      return false;
    }
    if (selectedType !== "all" && tx.category.categoryType !== selectedType) {
      return false;
    }
    if (selectedCategory !== "all" && tx.category.id !== selectedCategory) {
      return false;
    }
    if (date && date.from && date.to) {
      const txDate = new Date(tx.date).setHours(0, 0, 0, 0);
      const from = new Date(date.from).setHours(0, 0, 0, 0);
      const to = new Date(date.to).setHours(0, 0, 0, 0);
      if (txDate < from || txDate > to) {
        return false;
      }
    }
    if (filterTerms.length > 0) {
      const categoryName = tx.category.name.toLowerCase();
      const parentCategoryName = (tx.category.parent?.name ?? "").toLowerCase();
      const description = (tx.description ?? "").toLowerCase();
      const textMatch = filterTerms.every(
        (term) =>
          categoryName.includes(term) ||
          parentCategoryName.includes(term) ||
          description.includes(term),
      );
      if (!textMatch) return false;
    }
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions Management</CardTitle>
        <CardDescription>
          Manage your transactions efficiently with our intuitive interface.
        </CardDescription>
        <TransactionFilters
          transactions={transactions}
          filter={filter}
          setFilter={setFilter}
          date={date}
          setDate={setDate}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </CardHeader>
      <CardContent>
        <Separator className="lg:hidden" />
        {isMobile ? (
          <ul className="divide-y">
            {filteredTransactions.map((transaction) => (
              <li key={transaction.id} className="py-3 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">
                      {transaction.description}
                    </div>
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
                  <div
                    className={`font-bold text-right whitespace-nowrap ${
                      transaction.transactionType === "income"
                        ? "text-green-300"
                        : "text-red-300"
                    }`}
                  >
                    {formatCurrency(
                      transaction.amount,
                      transaction.bankAccount.currency,
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xl ${
                      transaction.transactionType === "income"
                        ? "text-green-300"
                        : "text-red-300"
                    }`}
                  >
                    {transaction.transactionType.toLocaleUpperCase()}
                  </span>
                  <ButtonGroup>
                    <Dialog
                      open={editingId === transaction.id}
                      onOpenChange={(open) =>
                        setEditingId(open ? transaction.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon-sm">
                          <SquarePen />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Modifica transazione</DialogTitle>
                        <DialogDescription>
                          Modifica i dettagli della transazione.
                        </DialogDescription>
                        <UpdateTransactionForm
                          transaction={transaction}
                          closeDialog={() => setEditingId(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <ActionButton
                      requireAreYouSure
                      variant="destructive"
                      size="icon-sm"
                      action={() => deleteTransaction(transaction.id)}
                    >
                      <Trash2 />
                    </ActionButton>
                  </ButtonGroup>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <TransactionTable data={filteredTransactions} />
        )}
      </CardContent>
    </Card>
  );
}
