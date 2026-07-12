import { type ReactNode } from "react";
import { type TableByColumnsProps, TableByColumns } from "./Table";
import Pagination from "./Pagination";
import { type PaginationProps } from "./Pagination";

interface DataTableProps<T> extends Omit<
  TableByColumnsProps<T>,
  "data" | "startIndex"
> {
  data: T[];
  pagination?: PaginationProps;
  showPagination?: boolean;
  mobileView?: ({ item, index }: { item: T; index: number }) => ReactNode;
}

export type MobileView<T> = (item: T) => ReactNode;

export function DataTable<T>({
  pagination,
  showPagination = true,
  data,
  mobileView,
  ...tableProps
}: DataTableProps<T>) {
  const startIndex =
    showPagination && pagination
      ? (pagination.currentPage - 1) * pagination.perPage
      : 0;
  return (
    <>
      <div
        className={`${mobileView ? "hidden md:block" : ""} w-full overflow-hidden rounded-xl border border-base-300 shadow-sm`}
      >
        <div className={`overflow-x-auto pb-30 bg-base-200`}>
          <TableByColumns startIndex={startIndex} data={data} {...tableProps} />
          {showPagination && pagination && pagination.total && (
            <Pagination {...pagination} />
          )}
        </div>
      </div>
      {mobileView && (
        <div className="bg-base-100 flex flex-col gap-4 w-full md:hidden">
          {data.map((item, index) => (
            <div className="relative" key={index}>
              {mobileView({ item, index })}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
