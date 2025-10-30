"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Plus, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { ClientTransaction } from "@/drizzle/schema";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { CreateTransactionForm } from "./create-transaction-form";

export function TransactionFilters({
  transactions,
  filter,
  setFilter,
  date,
  setDate,
  selectedType,
  setSelectedType,
  selectedAccount,
  setSelectedAccount,
  selectedCategory,
  setSelectedCategory,
}: {
  transactions: ClientTransaction[];
  filter: string;
  setFilter: (value: string) => void;
  date: DateRange | undefined;
  setDate: (value: DateRange | undefined) => void;
  selectedType: "income" | "expense" | "all";
  setSelectedType: (value: "income" | "expense" | "all") => void;
  selectedAccount: string;
  setSelectedAccount: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const userAccounts = Array.from(
    new Map(
      transactions.map((tx) => [tx.bankAccount.id, tx.bankAccount]),
    ).values(),
  );

  const userCategories = Array.from(
    new Map(transactions.map((tx) => [tx.category.id, tx.category])).values(),
  );

  return (
    <>
      <ButtonGroup className="w-full flex-col lg:flex-row">
        <ButtonGroup className="lg:flex-10 w-full">
          <Input
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <Button variant="outline" aria-label="Search">
            <Search />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="w-full lg:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date}
                className="data-[empty=true]:text-muted-foreground w-full lg:w-auto"
                aria-label="Date filter"
              >
                <CalendarIcon />
                {date?.from ? (
                  <span className="ml-2">
                    {formatDate(date.from)} - {formatDate(date.to || date.from)}
                  </span>
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="range" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
        </ButtonGroup>
        <ButtonGroup className="w-full lg:w-auto">
          <Button
            variant={selectedType === "all" ? "secondary" : "outline"}
            onClick={() => setSelectedType("all")}
            className="w-1/3 lg:w-auto"
          >
            All
          </Button>
          <Button
            variant={selectedType === "income" ? "secondary" : "outline"}
            onClick={() => setSelectedType("income")}
            className="w-1/3 lg:w-auto"
          >
            Income
          </Button>
          <Button
            variant={selectedType === "expense" ? "secondary" : "outline"}
            onClick={() => setSelectedType("expense")}
            className="w-1/3 lg:w-auto"
          >
            Expenses
          </Button>
        </ButtonGroup>
      </ButtonGroup>

      <ButtonGroup className="w-full flex-col lg:flex-row">
        <ButtonGroup className="w-full lg:w-1/3">
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-full">
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
        <ButtonGroup className="w-full lg:w-1/3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {userCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ButtonGroup>
        <ButtonGroup className="w-full lg:w-1/3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus />
                <span>Add New Transaction</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>
                Fill the form below to create a new transaction.
              </DialogDescription>
              <CreateTransactionForm
                closeDialog={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </ButtonGroup>
      </ButtonGroup>
    </>
  );
}
