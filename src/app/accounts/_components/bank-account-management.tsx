"use client";

import React from "react";
import { useState } from "react";
import type { ClientBankAccount } from "@/drizzle/schema";
import { Plus } from "lucide-react";
import { BankAccountCard } from "./bank-account-card";
import { CreateBankAccountForm } from "./create-bank-account-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function BankAccountManagement({
  accounts,
}: {
  accounts: ClientBankAccount[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.length > 0 &&
        accounts.map((account) => (
          <BankAccountCard key={account.id} account={account} />
        ))}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Card className="flex justify-center items-center h-80 border-2 border-dashed cursor-pointer bg-transparent hover:bg-card">
            <Button variant="link" asChild>
              <Plus className="w-full h-full text-white" />
            </Button>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bank Account</DialogTitle>
            <DialogDescription>
              Create a new bank account with the details below.
            </DialogDescription>
          </DialogHeader>
          <CreateBankAccountForm closeDialog={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
