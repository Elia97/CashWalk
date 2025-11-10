'use client';

import { useCallback, useState } from 'react';
import type { ClientBankAccount } from '@/drizzle/schema';
import { Plus } from 'lucide-react';
import { BankAccountCard } from './bank-account-card';
import { CreateBankAccountForm } from './create-bank-account-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function BankAccountManagement({
  accounts,
  isAdmin,
}: {
  accounts: ClientBankAccount[];
  isAdmin: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!isAdmin) return;
      setIsDialogOpen(open);
    },
    [isAdmin],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Accounts Management</CardTitle>
        <CardDescription>Manage your bank accounts and add new ones as needed.</CardDescription>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length > 0 &&
          accounts.map((account) => <BankAccountCard key={account.id} account={account} />)}
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Card className="flex justify-center items-center h-[336px] border-2 border-dashed cursor-pointer bg-transparent hover:bg-card">
              {isAdmin ? (
                <Button variant="link" asChild>
                  <Plus className="w-full h-full" />
                </Button>
              ) : (
                <span className="text-muted-foreground">More bank accounts are coming soon</span>
              )}
            </Card>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar">
            <DialogHeader>
              <DialogTitle>Add New Bank Account</DialogTitle>
              <DialogDescription>
                Create a new bank account with the details below.
              </DialogDescription>
            </DialogHeader>
            <CreateBankAccountForm closeDialog={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
