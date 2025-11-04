import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Skeleton className="h-[500px] w-full" />
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}
