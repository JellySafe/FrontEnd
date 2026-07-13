"use client";

import { Header } from "@jellysafe/design-system";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { clearAdminSession } from "@/features/admin-auth/model/admin-session";
import { ADMIN_LOGOUT_ITEM, ADMIN_NAV_ITEMS } from "@/shared/config/adminNav";
import { useScrollIndicator } from "@/shared/hooks/useScrollIndicator";
import {
  AdminPageHeaderProvider,
  useAdminPageHeader,
} from "@/shared/ui/admin-page-header-context";
import { AdminSidebar } from "@/shared/ui/AdminSidebar";

// 페이지 레벨 스크롤바를 숨길 내비 라우트. 비-내비 라우트(detailed-map 등 하위 화면)는 항상 숨긴다.
const SCROLLBAR_HIDDEN_NAV_ROUTES = ["/tip-off", "/notifications", "/reports"];

function isCurrentNavItem(pathname: string, href: string) {
  return (
    pathname === href ||
    (href === "/dashboard" && pathname.startsWith("/dashboard"))
  );
}

// Admin 공통 App Shell: 좌측 Sidebar + 상단 Header + Content. 현재 경로로 활성 메뉴/제목 결정.
// 상세 화면 등 하위 라우트는 pageHeader 오버라이드로 공통 Header를 대체할 수 있다.
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminPageHeaderProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminPageHeaderProvider>
  );
}

function AdminShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { pageHeader } = useAdminPageHeader();
  const mainRef = useScrollIndicator<HTMLElement>();
  const currentItem =
    ADMIN_NAV_ITEMS.find((item) => isCurrentNavItem(pathname, item.href)) ??
    ADMIN_NAV_ITEMS[0];
  const isNavRoute = ADMIN_NAV_ITEMS.some((item) => item.href === pathname);
  const isNotificationsRoute = pathname === "/notifications";
  // 스크롤 동작은 유지하되 바 표시 여부만 라우트별로 다르게 한다.
  const isScrollbarHidden =
    !isNavRoute || SCROLLBAR_HIDDEN_NAV_ROUTES.includes(pathname);

  const handleLogout = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    clearAdminSession();
    router.replace("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        currentItemId={currentItem?.id}
        items={ADMIN_NAV_ITEMS}
        logoutItem={{ ...ADMIN_LOGOUT_ITEM, onClick: handleLogout }}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-bg-default px-(--padding-10)">
        {pageHeader ??
          (isNavRoute ? <Header title={currentItem?.label ?? ""} /> : null)}
        <main
          className={[
            isScrollbarHidden ? "scrollbar-none" : "scrollbar-indicator",
            isNotificationsRoute
              ? "flex flex-col overflow-hidden"
              : "overflow-auto",
            "min-w-0 flex-1 pb-(--padding-10)",
          ].join(" ")}
          ref={mainRef}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
