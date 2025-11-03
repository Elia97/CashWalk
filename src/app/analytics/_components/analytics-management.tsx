import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClientBankAccountWithTransactions } from "@/drizzle/schema";
import { BarChart3, PieChart } from "lucide-react";
import { MonthlyTrend } from "./monthly-trend";
import { CategoryBreakdown } from "./category-breakdown";

export function AnalyticsManagement({
  account,
}: {
  account: ClientBankAccountWithTransactions;
}) {
  const transactions = account.transactions || [];
  const currentYear = new Date().getFullYear();
  const monthlyTemplate = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(currentYear, index, 1);
    return {
      key: `${currentYear}-${String(index + 1).padStart(2, "0")}`,
      month: date.toLocaleDateString("en-US", { month: "short" }),
      income: 0,
      expense: 0,
    };
  });
  const grouped = transactions.reduce<
    Record<string, { month: string; income: number; expense: number }>
  >((acc, tx) => {
    const date = new Date(tx.date);
    if (date.getFullYear() !== currentYear) return acc;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
    if (!acc[key]) {
      acc[key] = {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        income: 0,
        expense: 0,
      };
    }
    const amount = Number(tx.amount ?? 0);
    if (tx.transactionType === "income") acc[key].income += amount;
    if (tx.transactionType === "expense") acc[key].expense += amount;
    return acc;
  }, {});

  const categoryGroups = transactions
    .filter((tx) => tx.transactionType === "expense" && tx.category)
    .reduce<Record<string, { name: string; value: number; color: string }>>(
      (acc, tx) => {
        const parent = tx.category?.parent;
        if (!parent) return acc;
        if (!acc[parent.id]) {
          acc[parent.id] = {
            name: parent.name,
            value: 0,
            color: parent.color || "#8884d8",
          };
        }
        acc[parent.id].value += tx.amount;
        return acc;
      },
      {},
    );

  const chartData = monthlyTemplate.map((slot) => ({
    month: slot.month,
    income: grouped[slot.key]?.income ?? 0,
    expense: grouped[slot.key]?.expense ?? 0,
  }));

  const categoryData = Object.values(categoryGroups);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Andamento Mensile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nessun dato disponibile per l&apos;andamento mensile</p>
            </div>
          ) : (
            <MonthlyTrend data={chartData} currency={account.currency} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Spese per Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nessuna spesa da visualizzare</p>
            </div>
          ) : (
            <CategoryBreakdown
              data={categoryData}
              currency={account.currency}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
