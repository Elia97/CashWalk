"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, TrendingUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";

type Tab = "checking" | "cash" | "savings";

export function HomepageTabs() {
  const [tab, setTab] = useState<Tab>("checking");

  useEffect(() => {
    const tabs: Tab[] = ["checking", "cash", "savings"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % tabs.length;
      setTab(tabs[i]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
      <TabsContent value="checking">
        <Card>
          <CardHeader className="flex flex-wrap items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-3xl">😊</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Checking Account - {new Date().getFullYear()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Great financial health! Keep up the good work.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Current Balance
              </div>
              <div className="text-4xl font-bold">€10.250,75</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Annual Financial Progress</span>
                <span>€10.000,00 / €20.000,00</span>
              </div>
              <Progress
                value={50}
                className="h-4 bg-primary [&>div]:bg-secondary"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="text-muted-foreground">Total income</div>
                <div>€20.000,00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total expenses</div>
                <div>€10.000,00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Annual Balance</div>
                <div>€10.000,00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Savings Rate</div>
                <div>50%</div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter>
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-3 text-center">
                Monthly summary -{" "}
                {new Date().toLocaleString("en-US", { month: "long" })}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Income</div>
                  <div className="text-2xl">€2.000,00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Expenses</div>
                  <div className="text-2xl">€500,00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="text-2xl">€1.500,00</div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="cash">
        <Card>
          <CardHeader className="flex flex-wrap items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-3xl">💰</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5" />
                Account Contanti - {new Date().getFullYear()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor your cash flow effectively with detailed insights.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Current Balance
              </div>
              <div className="text-4xl font-bold">€1.000,00</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Spese / Ricariche Anno</span>
                <span>€2.000,00 / €3.000,00</span>
              </div>
              <Progress
                value={66.67}
                className="h-4 bg-primary [&>div]:bg-secondary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <div className="text-muted-foreground">Ricariche Totali</div>
                <div>€3.000,00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Spese Totali</div>
                <div>€2.000,00</div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter>
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-3 text-center">
                Monthly summary -{" "}
                {new Date().toLocaleString("en-US", { month: "long" })}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Ricariche</div>
                  <div className="text-2xl">€600,00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Spese</div>
                  <div className="text-2xl">€400,00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Saldo</div>
                  <div className="text-2xl">€200,00</div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="savings">
        <Card>
          <CardHeader className="flex flex-wrap items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-3xl">🎯</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5" />
                Account Risparmi - {new Date().getFullYear()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Secure your future with saving money consistently.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Current Balance
              </div>
              <div className="text-4xl font-bold">€18.000,00</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Prelievi / Depositi</span>
                <span>€2.000,00 / €20.000,00</span>
              </div>
              <Progress
                value={10}
                className="h-4 bg-primary [&>div]:bg-secondary"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-muted-foreground">Depositi Totali</div>
                <div>€20.000,00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Prelievi Totali</div>
                <div>€2.000,00</div>
              </div>
              <div>
                <div className="text-muted-foreground">Risparmio Netto</div>
                <div>€18.000,00</div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter>
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-3 text-center">
                Monthly summary -{" "}
                {new Date().toLocaleString("en-US", { month: "long" })}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Depositi</div>
                  <div className="text-2xl">€20.000,00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Prelievi</div>
                  <div className="text-2xl">€2.000,00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Crescita</div>
                  <div className="text-2xl">€18.000,00</div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
