import type { ReactNode } from "react";

export type ListProps = {
  children: ReactNode;
  className?: string;
  divider?: boolean;
};

export function List({ children, className, divider = false }: ListProps) {
  return (
    <ul
      className={[
        "flex w-full list-none flex-col",
        divider ? "divide-y divide-border-default" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </ul>
  );
}

export type ListItemProps = {
  title: ReactNode;
  leading?: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
  align?: "start" | "center";
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
};

export function ListItem({
  title,
  leading,
  description,
  trailing,
  align = "start",
  href,
  onSelect,
  disabled,
  className,
}: ListItemProps) {
  const isInteractive = Boolean(href) || Boolean(onSelect);
  const rowClassName = [
    "flex w-full gap-(--gap-3) px-(--padding-5) py-(--padding-4) text-left",
    align === "center" ? "items-center" : "items-start",
    isInteractive
      ? "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
      : "",
    isInteractive && !disabled ? "hover:bg-bg-surface" : "",
    disabled ? "cursor-not-allowed opacity-50" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {leading ? (
        <span className="flex shrink-0 items-center">{leading}</span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col gap-(--gap-2)">
        <span className="text-body-xsmall-pc text-text-primary">{title}</span>
        {description ? (
          <span className="text-caption-small-pc text-text-tertiary">
            {description}
          </span>
        ) : null}
      </span>
      {trailing ? (
        <span className="flex shrink-0 items-center">{trailing}</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <li>
        <a
          aria-disabled={disabled || undefined}
          className={rowClassName}
          href={href}
        >
          {inner}
        </a>
      </li>
    );
  }

  if (onSelect) {
    return (
      <li>
        <button
          className={rowClassName}
          disabled={disabled}
          onClick={onSelect}
          type="button"
        >
          {inner}
        </button>
      </li>
    );
  }

  return <li className={rowClassName}>{inner}</li>;
}
