import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-[64px] w-full mb-8" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[36px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
}
