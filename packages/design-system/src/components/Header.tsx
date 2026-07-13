import type { HTMLAttributes, ReactNode } from "react";

export type HeaderProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  platform?: "pc" | "mobile";
  title: ReactNode;
  leadingIcon?: ReactNode;
  badge?: ReactNode;
  trailingAction?: ReactNode;
};

export function Header({
  platform = "pc",
  title,
  leadingIcon,
  badge,
  trailingAction,
  className,
  ...props
}: HeaderProps) {
  const isMobile = platform === "mobile";

  return (
    <header
      className={[
        "flex w-full items-center justify-between bg-bg-default",
        isMobile
          ? "px-(--padding-5) py-(--padding-4)"
          : "py-(--padding-5)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-(--gap-3)">
        {leadingIcon ? (
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <h1
          className={
            isMobile
              ? "truncate text-heading-small-mobile text-text-primary"
              : "truncate text-heading-small-pc text-text-primary"
          }
        >
          {title}
        </h1>
        {badge ? (
          <span
            className="shrink-0 rounded-sm px-(--padding-2) py-(--padding-1) text-caption-medium-pc text-text-error"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-text-error) 25%, transparent)",
            }}
          >
            {badge}
          </span>
        ) : null}
      </div>
      {trailingAction ? (
        <div className="flex shrink-0 items-center">{trailingAction}</div>
      ) : null}
    </header>
  );
}
