export const SectionTitle = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="font-heading text-xl font-semibold text-base-content">
        {title}
      </h2>
    </div>
    {description && (
      <p className="text-sm text-base-content/60">{description}</p>
    )}
  </div>
);
