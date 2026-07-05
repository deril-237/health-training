import React from "react";
import { Column, getAlignment, LoadingRow, EmptyRow } from "./shared";

export type TableByColumnsProps<T> = {
  startIndex?: number;
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor?: (item: T, index: number) => string | number;
};

export function TableByColumns<T>({
  startIndex = 0,
  columns,
  data,
  isLoading = false,
  emptyMessage = "Data is unavailable",
  keyExtractor = (_, index) => index,
}: TableByColumnsProps<T>) {
  const colSpan = columns.length + 1;

  return (
    <table className="w-full text-sm">
      <thead className="bg-primary/90 border-b-2 border-primary text-primary-content border-opacity-20">
        <tr>
          <th className="px-6 py-4 text-center text-xs font-bold text-primary-content uppercase tracking-wider">
            N°
          </th>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`px-6 py-4 ${getAlignment(column.align)} text-xs font-bold uppercase tracking-wider`}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="bg-base-200 divide-y divide-base-300">
        {isLoading ? (
          <LoadingRow colSpan={colSpan} />
        ) : data.length === 0 ? (
          <EmptyRow colSpan={colSpan} emptyMessage={emptyMessage} />
        ) : (
          data.map((item, index) => (
            <tr
              key={keyExtractor(item, index)}
              className="transition-all duration-150 hover:bg-base-200 hover:bg-opacity-50 group"
            >
              <td className="px-6 py-4 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-base-200 group-hover:bg-primary group-hover:text-white group-hover:bg-opacity-10 text-neutral font-semibold text-sm transition-colors">
                  {startIndex + index + 1}
                </div>
              </td>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 ${getAlignment(column.align)}`}
                >
                  {column.renderCell ? column.renderCell(item, index) : null}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
