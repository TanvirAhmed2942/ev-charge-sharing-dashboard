"use client";

import React from "react";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Shared pagination meta shape (users, FAQs, bookings, etc.)
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export const PAGINATION_LIMIT_OPTIONS = [10, 20, 50, 100] as const;

export type PaginationProps = {
  /** Current page (1-based) */
  page: number;
  /** Total number of pages */
  totalPage: number;
  /** Total number of items (optional, for summary text) */
  total?: number;
  /** Current limit (items per page) */
  limit?: number;
  /** Called when user selects a page */
  onPageChange: (page: number) => void;
  /** Called when user changes limit (optional). When provided, limit selector is shown. */
  onLimitChange?: (limit: number) => void;
  /** Optional class for the container */
  className?: string;
  /** Show "Showing X–Y of Z" summary */
  showSummary?: boolean;
  /** Max page buttons to show beside prev/next */
  siblingCount?: number;
};

function range(start: number, end: number): number[] {
  const len = Math.max(0, end - start + 1);
  return Array.from({ length: len }, (_, i) => start + i);
}

export default function Pagination({
  page,
  totalPage,
  total = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  className,
  showSummary = true,
  siblingCount = 1,
}: PaginationProps) {
  const hasPrev = page > 1;
  const hasNext = page < totalPage;

  const startItem = totalPage === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const pageNumbers: number[] =
    totalPage <= 0
      ? []
      : range(
          Math.max(1, page - siblingCount),
          Math.min(totalPage, page + siblingCount)
        );

  const handleLinkClick = (e: React.MouseEvent, p: number) => {
    e.preventDefault();
    onPageChange(p);
  };

  if (totalPage <= 1 && !showSummary && !onLimitChange) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        {showSummary && total > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {startItem}–{endItem} of {total}
          </p>
        )}
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page
            </span>
            <Select
              value={String(limit)}
              onValueChange={(v) => onLimitChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGINATION_LIMIT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <ShadcnPagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasPrev) onPageChange(page - 1);
              }}
              className={
                !hasPrev
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              aria-disabled={!hasPrev}
            />
          </PaginationItem>

          {pageNumbers[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => handleLinkClick(e, 1)}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {pageNumbers[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pageNumbers.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(e) => handleLinkClick(e, p)}
                isActive={p === page}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPage && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPage - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => handleLinkClick(e, totalPage)}
                  className="cursor-pointer"
                >
                  {totalPage}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasNext) onPageChange(page + 1);
              }}
              className={
                !hasNext
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              aria-disabled={!hasNext}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
}
