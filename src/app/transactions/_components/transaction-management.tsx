"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { BrushCleaning, SquarePen, Trash2 } from "lucide-react";
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
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TransactionsPagination } from "./transactions-pagination";
import { useRouter, useSearchParams } from "next/navigation";

export function TransactionManagement({
  initialData,
  totalCount,
  page,
  pageSize,
}: {
  initialData: ClientTransaction[];
  totalCount: number;
  page: number;
  pageSize: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramsString = searchParams.toString();
  const initialRange = useMemo<DateRange | undefined>(() => {
    const params = new URLSearchParams(paramsString);
    const fromParam = params.get("from");
    const toParam = params.get("to");

    if (!fromParam && !toParam) {
      const now = new Date();
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: now,
      };
    }

    return {
      from: fromParam ? new Date(fromParam) : undefined,
      to: toParam ? new Date(toParam) : undefined,
    };
  }, [paramsString]);

  const initialType = useMemo<"all" | "income" | "expense">(() => {
    const params = new URLSearchParams(paramsString);
    const typeParam = params.get("type");
    return typeParam === "income" || typeParam === "expense"
      ? typeParam
      : "all";
  }, [paramsString]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(initialRange);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState<
    "all" | "income" | "expense"
  >(initialType);
  const isMobile = useIsMobile(1024);

  useEffect(() => {
    setDate(initialRange);
  }, [initialRange]);

  useEffect(() => {
    setSelectedType(initialType);
  }, [initialType]);

  const filterTerms = filter
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

  const filteredTransactions = initialData.filter((tx) => {
    if (selectedAccount !== "all" && tx.bankAccount.id !== selectedAccount) {
      return false;
    }
    if (selectedType !== "all" && tx.transactionType !== selectedType) {
      return false;
    }
    if (selectedCategory !== "all" && tx.category.id !== selectedCategory) {
      return false;
    }
    if (filterTerms.length > 0) {
      const categoryName = tx.category.name.toLowerCase();
      const parentCategoryName = (tx.category.parent?.name ?? "").toLowerCase();
      const textMatch = filterTerms.every(
        (term) =>
          categoryName.includes(term) || parentCategoryName.includes(term),
      );
      if (!textMatch) return false;
    }
    return true;
  });

  function applyFilters(
    nextPage: number,
    nextRange: DateRange | undefined,
    nextType: "all" | "income" | "expense" = selectedType,
  ) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) params.set("page", String(nextPage));
    else params.delete("page");
    params.set("pageSize", String(pageSize));
    if (nextRange?.from) params.set("from", nextRange.from.toISOString());
    else params.delete("from");
    if (nextRange?.to) params.set("to", nextRange.to.toISOString());
    else params.delete("to");
    if (nextType !== "all") params.set("type", nextType);
    else params.delete("type");
    router.push(`?${params.toString()}`);
  }

  function handleDateChange(value: DateRange | undefined) {
    setDate(value);
    applyFilters(1, value);
  }

  function handleTypeChange(value: "all" | "income" | "expense") {
    setSelectedType(value);
    applyFilters(1, date, value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Transactions</CardTitle>
        <CardDescription>
          Track your income and expenses all in one place.
        </CardDescription>
        <TransactionFilters
          transactions={initialData}
          filter={filter}
          setFilter={setFilter}
          date={date}
          setDate={handleDateChange}
          selectedType={selectedType}
          setSelectedType={handleTypeChange}
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
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <li key={transaction.id} className="py-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
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
                        <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar">
                          <DialogTitle>Update Transaction</DialogTitle>
                          <DialogDescription>
                            Update the details of the transaction.
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
              ))
            ) : (
              <li>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <BrushCleaning />
                    </EmptyMedia>
                    <EmptyTitle>No transactions here</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </li>
            )}
          </ul>
        ) : (
          <TransactionTable data={filteredTransactions} />
        )}
      </CardContent>
      <CardFooter>
        <TransactionsPagination
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          from={date?.from}
          to={date?.to}
          type={selectedType !== "all" ? selectedType : undefined}
        />
      </CardFooter>
    </Card>
  );
}
