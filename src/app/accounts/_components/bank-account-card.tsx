"use client";

import React, { useState } from "react";
import type { ClientBankAccount } from "@/types/bank-account";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  ActionButton,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import {
  getAccountIcon,
  getAccountTypeLabel,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { SquarePen, Trash2 } from "lucide-react";
import {
  deleteUserBankAccount,
  setUserPrimaryBankAccount,
} from "../actions/bank-account-actions";
import { UpdateBankAccountForm } from "./update-bank-account-form";

export function BankAccountCard({ account }: { account: ClientBankAccount }) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  console.log(account);
  return (
    <Card key={account.id} className="justify-between relative">
      {account.isPrimary && (
        <Badge variant="outline" className="absolute -top-2 -right-2">
          Primary
        </Badge>
      )}
      <CardHeader className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          {React.createElement(getAccountIcon(account.type))}
          <div>
            <CardTitle className="text-lg">{account.name}</CardTitle>
            <CardDescription>{account.currency}</CardDescription>
          </div>
        </div>
        <div className="space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <SquarePen />
              </Button>
            </DialogTrigger>
            <DialogContent>
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
            action={() => deleteUserBankAccount(account.id)}
          >
            <Trash2 />
          </ActionButton>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <span>Current Balance</span>
        <div className="text-2xl font-bold">
          {formatCurrency(account.balance, account.currency)}
        </div>
        <div className="flex justify-between mt-4">
          <Badge variant="outline">{getAccountTypeLabel(account.type)}</Badge>
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
        <ActionButton
          variant="outline"
          className="w-full"
          disabled={account.isPrimary}
          action={() => setUserPrimaryBankAccount(account.userId, account.id)}
        >
          Set as Primary
        </ActionButton>
      </CardFooter>
    </Card>
  );
}
