import type { ReactNode } from "react";

export type NavigationBarItem = {
  key: string;
  label: ReactNode;
  icon: ReactNode;
  href?: string;
  onSelect?: () => void;
};

export type NavigationBarProps = {
  items: NavigationBarItem[];
  activeKey: string;
  className?: string;
  "aria-label"?: string;
};

// Public 모바일 하단 내비게이션. 라우팅 상태(activeKey)와 이동 방식(href/onSelect)은 외부 주입.
export function NavigationBar({
  items,
  activeKey,
  className,
  "aria-label": ariaLabel = "메인 내비게이션",
}: NavigationBarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={[
        "flex w-full items-center bg-bg-default pt-(--padding-3) pb-(--padding-8) drop-shadow-[0_0_4px_var(--color-alpha-black-5)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const itemClassName = [
          "flex flex-1 flex-col items-center gap-(--gap-2)",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]",
          isActive ? "text-text-brand" : "text-text-tertiary",
        ].join(" ");
        const inner = (
          <>
            <span className="flex size-(--icon-size-24) items-center justify-center">
              {item.icon}
            </span>
            <span className="text-center text-caption-medium-mobile">
              {item.label}
            </span>
          </>
        );

        if (item.href) {
          return (
            <a
              aria-current={isActive ? "page" : undefined}
              className={itemClassName}
              href={item.href}
              key={item.key}
            >
              {inner}
            </a>
          );
        }
        return (
          <button
            aria-current={isActive ? "page" : undefined}
            className={itemClassName}
            key={item.key}
            onClick={item.onSelect}
            type="button"
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
