// shared.tsx
import React from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { FolderOpen } from "lucide-react";

export type Column<T> = {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  renderCell?: (item: T, index: number) => React.ReactNode;
};

export const getAlignment = (align?: string) => {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
};

export function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="w-full flex items-center justify-center py-16">
          <Spinner size="md" variant="dark" text="load data" />
        </div>
      </td>
    </tr>
  );
}

export function EmptyRow({
  colSpan,
  emptyMessage,
}: {
  colSpan: number;
  emptyMessage: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="w-full flex flex-col items-center justify-center py-16 px-4">
          <FolderOpen className="w-16 h-16 text-base-300 mb-4" />
          <p className="text-lg text-center px-2 font-semibold text-neutral mb-2">
            {emptyMessage}
          </p>
        </div>
      </td>
    </tr>
  );
}
