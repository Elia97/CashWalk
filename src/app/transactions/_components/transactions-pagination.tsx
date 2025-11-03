import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";

export function TransactionsPagination({
  totalCount,
  page,
  pageSize,
  from,
  to,
  type,
}: {
  totalCount: number;
  page: number;
  pageSize: number;
  from?: Date;
  to?: Date;
  type?: "income" | "expense";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);

  function pushParams(nextPage: number, nextPageSize: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) params.set("page", String(nextPage));
    else params.delete("page");
    params.set("pageSize", String(nextPageSize));
    if (from) params.set("from", from.toISOString());
    else params.delete("from");
    if (to) params.set("to", to.toISOString());
    else params.delete("to");
    if (type) params.set("type", type);
    else params.delete("type");
    router.push(`?${params.toString()}`);
  }

  function updatePage(nextPage: number) {
    pushParams(nextPage, pageSize);
  }

  function handlePageSizeChange(nextValue: string) {
    const nextSize = Number(nextValue);
    if (!Number.isFinite(nextSize) || nextSize <= 0) return;
    pushParams(1, nextSize);
  }

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const showPagination = totalPages > 1;

  return (
    <div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
        <span className="whitespace-nowrap">Elementi per pagina</span>
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="h-8 w-[5.5rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((sizeOption) => (
              <SelectItem key={sizeOption} value={String(sizeOption)}>
                {sizeOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="hidden sm:inline whitespace-nowrap">
          Totale {totalCount}
        </span>
      </div>

      {showPagination && (
        <Pagination className="justify-center md:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => canGoPrev && updatePage(page - 1)}
                aria-disabled={!canGoPrev}
              />
            </PaginationItem>
            <PaginationItem className="px-3 py-2 text-sm">
              Pagina {page} di {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => canGoNext && updatePage(page + 1)}
                aria-disabled={!canGoNext}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
