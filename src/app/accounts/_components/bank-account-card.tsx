"use client";

import React, { useState } from "react";
import type { ClientBankAccount } from "@/drizzle/schema";
import {
  getAccountIcon,
  getAccountTypeLabel,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { SquarePen, Trash2 } from "lucide-react";
import { deleteUserBankAccount } from "../actions/bank-account-actions";
import { UpdateBankAccountForm } from "./update-bank-account-form";
import { ActionButton } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/button-group";

export function BankAccountCard({ account }: { account: ClientBankAccount }) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  console.log(account);
  return (
    <Card key={account.id} className="justify-between relative">
      {account.isPrimary && (
        <Badge className="absolute -top-2 -right-2">Primary</Badge>
      )}
      <CardHeader>
        <div className="flex gap-3 items-center">
          {React.createElement(getAccountIcon(account.accountType))}
          <div>
            <CardTitle className="text-lg">{account.name}</CardTitle>
            <CardDescription>{account.currency}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <span>Current Balance</span>
        <div className="text-2xl font-bold">
          {formatCurrency(account.balance, account.currency)}
        </div>
        <div className="flex justify-between mt-4">
          <Badge variant="outline">
            {getAccountTypeLabel(account.accountType)}
          </Badge>
          <div className="text-sm text-muted-foreground">
            ...{account.accountNumber?.slice(-4)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Last Update</span>
          <div>{formatDate(account.updatedAt)}</div>
        </div>
      </CardContent>
      <CardFooter>
        <ButtonGroup className="w-full">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="w-1/2">
                <SquarePen />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar">
              <DialogHeader>
                <DialogTitle>Update {account.name}</DialogTitle>
                <DialogDescription>
                  Update the details for your bank account.
                </DialogDescription>
              </DialogHeader>
              <UpdateBankAccountForm
                account={account}
                closeDialog={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <ActionButton
            requireAreYouSure
            variant="destructive"
            size="icon"
            className="w-1/2"
            action={() => deleteUserBankAccount(account.id)}
          >
            <Trash2 />
          </ActionButton>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
