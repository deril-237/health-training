import type { ReactNode } from "react";

interface ButtonLoadingProps extends React.ComponentProps<"button"> {
  loadingComponent?: ReactNode;
}

interface ButtonProps extends React.ComponentProps<"button"> {}

export function ButtonLoading({
  disabled,
  loadingComponent,
  children,
  ...rest
}: ButtonLoadingProps) {
  return (
    <button {...rest} disabled={disabled}>
      {loadingComponent && disabled === true && (
        <span className="loading"></span>
      )}
      {children}
    </button>
  );
}

export function Button({ children, ...rest }: ButtonProps) {
  return <button {...rest}>{children}</button>;
}
