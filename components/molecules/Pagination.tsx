"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  firstPage: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
  total: number;
  perPage: number;
  getPageNumbers: () => (number | string)[];
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
};

export default function Pagination({
  currentPage,
  firstPage,
  lastPage,
  startIndex,
  endIndex,
  total,
  perPage,
  getPageNumbers,
  goToPage,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: PaginationProps) {
  const pageNumbers = getPageNumbers();

  return (
    <div className="px-4 md:px-6 py-4 flex flex-col gap-4 border-t border-base-300 bg-base-200">
      {/* Info + Controls Container */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Informations */}
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-6">
          <div className="text-sm font-medium text-base-content">
            {startIndex} - {endIndex} of {total}
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-base-content/70">
            <span>{perPage} items par page</span>
          </div>
        </div>

        {/* Navigation Controls - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <div className="join join-horizontal shadow-sm">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === firstPage}
              className="join-item btn btn-sm btn-ghost"
              title="First page"
              aria-label="Go to first page"
            >
              <ChevronLeftIcon className="size-4" />
              <ChevronLeftIcon className="size-4" />
            </button>

            <button
              onClick={goToPreviousPage}
              disabled={currentPage === firstPage}
              className="join-item btn btn-sm btn-ghost"
              title="Previous page"
              aria-label="Go to previous page"
            >
              <ChevronLeftIcon className="size-4" />
            </button>

            <div className="join-item flex items-center">
              {pageNumbers.map((page, index) =>
                typeof page === "string" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-base-content/50"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`join-item btn btn-sm ${
                      currentPage === page
                        ? "btn-active bg-primary text-primary-content"
                        : "btn-ghost"
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === lastPage}
              className="join-item btn btn-sm btn-ghost"
              title="Next page"
              aria-label="Go to next page"
            >
              <ChevronRightIcon className="size-4" />
            </button>

            <button
              onClick={goToLastPage}
              disabled={currentPage === lastPage}
              className="join-item btn btn-sm btn-ghost"
              title="Last page"
              aria-label="Go to last page"
            >
              <ChevronRightIcon className="size-4" />
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls - Mobile */}
      <div className="md:hidden">
        <div className="flex flex-col gap-3">
          {/* Page info */}
          <div className="text-xs text-base-content/70 text-center">
            Page {currentPage} of {lastPage}
          </div>

          {/* Mobile Navigation */}
          <div className="join join-horizontal w-full shadow-sm">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === firstPage}
              className="join-item btn btn-xs btn-ghost flex-1"
              title="First page"
              aria-label="Go to first page"
            >
              <ChevronLeftIcon className="size-3.5" />
            </button>

            <button
              onClick={goToPreviousPage}
              disabled={currentPage === firstPage}
              className="join-item btn btn-xs btn-ghost flex-1"
              title="Previous page"
              aria-label="Go to previous page"
            >
              <ChevronLeftIcon className="size-3.5" />
            </button>

            <button
              disabled
              className="join-item btn btn-xs btn-ghost flex-1 bg-base-300 text-base-content/70"
            >
              {currentPage}/{lastPage}
            </button>

            <button
              onClick={goToNextPage}
              disabled={currentPage === lastPage}
              className="join-item btn btn-xs btn-ghost flex-1"
              title="Next page"
              aria-label="Go to next page"
            >
              <ChevronRightIcon className="size-3.5" />
            </button>

            <button
              onClick={goToLastPage}
              disabled={currentPage === lastPage}
              className="join-item btn btn-xs btn-ghost flex-1"
              title="Last page"
              aria-label="Go to last page"
            >
              <ChevronRightIcon className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
