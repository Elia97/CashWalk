import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUpIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Text */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Now in Early Access
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Your year, <span className="text-primary">your story</span>,{" "}
            <span className="text-accent">your numbers</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto lg:mx-0">
            Turn your finances into a visual journey. The spreadsheet that
            finally feels alive.
          </p>

          <Button size="lg" className="text-lg px-8 py-6 group" asChild>
            <Link href="/dashboard">
              Start Your Story
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                  />
                ))}
              </div>
              <span>2,400+ creators</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span>Free for 30 days</span>
          </div>
        </div>

        {/* Right Column - Visual Mockup */}
        <Card>
          <CardHeader className="flex flex-wrap items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-3xl">😊</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" />
                Account - {new Date().getFullYear()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Great financial health! Keep up the good work.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Saldo Attuale</div>
              <div className="text-4xl font-bold">€10.250,75</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Annual Financial Progress</span>
                <span>€10.000,00 / €20.000,00</span>
              </div>
              <Progress
                value={50}
                className="h-4 bg-primary [&>div]:bg-accent"
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
                <div className="text-muted-foreground">Tasso di risparmio</div>
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
                  <div className="text-2xl">€2000,00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Expenses</div>
                  <div className="text-2xl">€500,00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="text-2xl">€1500,00</div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
