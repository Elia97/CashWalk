import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex justify-center lg:justify-end">
          <Skeleton className="w-[174px] h-[36px]" />
        </div>
        <Skeleton className="h-[80px] sm:h-[96px] lg:h-[140px]" />
        <Skeleton className="h-[58.5px] sm:h-[65px]" />
        <div className="flex justify-center lg:justify-end">
          <Skeleton className="w-[193px] h-[48px]" />
        </div>
        <Skeleton className="h-[32px] mt-16" />
      </div>
      <Skeleton className="size-[250px] sm:size-[350px] mx-auto self-center" />
    </div>
  );
}
