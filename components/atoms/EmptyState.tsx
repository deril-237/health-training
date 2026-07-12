import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  icon,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border  bg-base-200 py-20 px-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-base-300">
        {icon}
      </div>
      <div>
        <p className="text-base font-semibold text-base-content">{title}</p>
        <p className="text-sm text-neutral mt-1">{description}</p>
      </div>
      {action}
    </div>
  );
}
