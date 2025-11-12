import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { PrimaryBankAccountWithRelations } from '@/drizzle/schema';
import { formatCurrency } from '@/lib/utils';

export function OverviewManagement({ account }: { account: PrimaryBankAccountWithRelations }) {
  const totalIncome = account.transactions
    .filter((tx) => tx.transactionType === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpenses = account.transactions
    .filter((tx) => tx.transactionType === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const currentMonthIncome = account.transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === new Date().getMonth() &&
        txDate.getFullYear() === new Date().getFullYear() &&
        tx.transactionType === 'income'
      );
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const currentMonthExpenses = account.transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === new Date().getMonth() &&
        txDate.getFullYear() === new Date().getFullYear() &&
        tx.transactionType === 'expense'
      );
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const getFinancialHealthStatus = (savingRate: number) => {
    switch (true) {
      case savingRate >= 20:
        return 'Great financial health! Keep up the good work.';
      case savingRate >= 10:
        return 'Good financial health. Consider saving more.';
      case savingRate >= 0:
        return 'Fair financial health. Try to reduce expenses.';
      default:
        return 'Poor financial health. Take action immediately.';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{account.name}</CardTitle>
        <CardDescription>
          {getFinancialHealthStatus(((totalIncome - totalExpenses) / totalIncome) * 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Current Balance</div>
          <div className="text-4xl font-bold">
            {formatCurrency(account.balance, account.currency)}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Annual Progress</span>
            <span className="text-right">
              {formatCurrency(totalExpenses, account.currency)} /{' '}
              {formatCurrency(totalIncome, account.currency)}
            </span>
          </div>
          <Progress
            value={(totalExpenses / totalIncome) * 100}
            className="h-4 bg-green-400 [&>div]:bg-red-400"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="text-muted-foreground">Total income</div>
            <div>{formatCurrency(totalIncome, account.currency)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total expenses</div>
            <div>{formatCurrency(totalExpenses, account.currency)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Annual Balance</div>
            <div>{formatCurrency(totalIncome - totalExpenses, account.currency)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Savings Rate</div>
            <div>{(((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(2)}%</div>
          </div>
        </div>
        <Separator />
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-3 text-center">
            {new Date().toLocaleString('en-US', { month: 'long' })}
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Income</div>
              <div className="text-2xl">{formatCurrency(currentMonthIncome, account.currency)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Expenses</div>
              <div className="text-2xl">
                {formatCurrency(currentMonthExpenses, account.currency)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Balance</div>
              <div className="text-2xl">
                {formatCurrency(currentMonthIncome - currentMonthExpenses, account.currency)}
              </div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
