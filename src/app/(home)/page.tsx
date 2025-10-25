import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HomepageTabs } from "./_components/homepage-tabs";

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
        <HomepageTabs />
      </div>
    </section>
  );
}
