import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <section>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6 sm:space-y-8 text-center lg:text-right fade-in-translate-full animate-in">
          <div className="inline-flex items-center max-w-max mx-auto lg:mx-0 gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse text-left" />
            Now in Early Access
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Your year, <span className="text-primary">your story</span>,{" "}
            <span className="text-secondary">your numbers</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto lg:mx-0">
            Turn your finances into a visual journey. <br /> The spreadsheet
            that finally feels alive.
          </p>

          <Button size="lg" className="text-lg px-8 py-6 group" asChild>
            <Link href="/overview">
              Start Your Story
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <div className="flex items-center gap-8 justify-center lg:justify-end text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent border-2 border-background"
                  />
                ))}
              </div>
              <span>2,400+ creators</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span>Free for 30 days</span>
          </div>
        </div>
        <Image
          src="/logo.svg"
          alt="Homepage Mockup"
          width={500}
          height={500}
          className="mx-auto bg-background size-[300px] sm:size-[500px]"
        />
      </div>
    </section>
  );
}
