import { Logo } from "@jellysafe/design-system";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type AdminSidebarItem = Omit<
  ComponentProps<typeof Link>,
  "children" | "className" | "href"
> & {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
};

export type AdminSidebarProps = {
  items: readonly AdminSidebarItem[];
  currentItemId?: string;
  logoutItem: AdminSidebarItem;
};

function SidebarLink({
  item,
  isCurrent = false,
}: {
  item: AdminSidebarItem;
  isCurrent?: boolean;
}) {
  const { label, icon, href, ...linkProps } = item;

  // Figma sidebar_el: default=tertiary-fill, hover=tertiary-fill-hover+파란 라벨, pressed=tertiary-fill-pressed
  return (
    <li className="group relative">
      <Link
        {...linkProps}
        aria-current={isCurrent ? "page" : undefined}
        aria-label={label}
        className={[
          "flex size-10 items-center justify-center rounded-lg p-(--padding-3)",
          "bg-button-tertiary-fill",
          "hover:bg-button-tertiary-fill-hover",
          "active:bg-button-tertiary-fill-pressed",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]",
        ].join(" ")}
        href={href}
      >
        {icon}
      </Link>
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute top-1/2 left-14 z-30 -translate-y-1/2",
          "rounded-lg bg-bg-strong px-(--padding-3) py-(--padding-2)",
          "text-body-xxsmall-pc whitespace-nowrap text-text-inverse",
          // focus-within이면 클릭 후에도 포커스가 남아 라벨이 유지되므로 hover만 사용
          "opacity-0 transition-opacity group-hover:opacity-100",
        ].join(" ")}
      >
        {label}
      </span>
    </li>
  );
}

export function AdminSidebar({
  items,
  currentItemId,
  logoutItem,
}: AdminSidebarProps) {
  return (
    <aside className="flex h-full w-14 shrink-0 bg-bg-surface px-(--padding-3) py-(--padding-5)">
      <nav
        aria-label="관리자 메뉴"
        className="flex min-h-0 flex-1 flex-col justify-between"
      >
        <div className="flex flex-col items-center gap-(--gap-3)">
          <Link
            aria-label="대시보드로 이동"
            className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
            href="/dashboard"
          >
            <Logo aria-hidden="true" variant="symbol" />
          </Link>
          <ul className="flex flex-col">
            {items.map((item) => (
              <SidebarLink
                isCurrent={item.id === currentItemId}
                item={item}
                key={item.id}
              />
            ))}
          </ul>
        </div>
        <ul>
          <SidebarLink item={logoutItem} />
        </ul>
      </nav>
    </aside>
  );
}
