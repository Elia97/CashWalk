import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="animate-fade-up">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Compass />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            Looks like this trail doesn&apos;t exist yet. Let&apos;s guide you
            back to CashWalk.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex gap-2">
          <Button variant={"link"} asChild>
            <Link href="/">Go home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  );
}
