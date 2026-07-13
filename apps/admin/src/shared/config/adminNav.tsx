import type { AdminSidebarItem } from "@/shared/ui/AdminSidebar";
import {
  DashboardIcon,
  LogoutIcon,
  NotificationIcon,
  ReportIcon,
  TipOffIcon,
} from "@/shared/ui/icons";

const ICON_CLASS = "size-(--icon-size-24)";

// 관리자 사이드바 메뉴. Dashboard Figma의 sidebar/pc 아이콘·라벨 순서(대시보드→제보 검수→알림→리포트) 기준.
export const ADMIN_NAV_ITEMS: readonly AdminSidebarItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    href: "/dashboard",
    icon: <DashboardIcon className={ICON_CLASS} />,
  },
  {
    id: "tip-off",
    label: "제보 검수",
    href: "/tip-off",
    icon: <TipOffIcon className={ICON_CLASS} />,
  },
  {
    id: "notifications",
    label: "알림 발송",
    href: "/notifications",
    icon: <NotificationIcon className={ICON_CLASS} />,
  },
  {
    id: "reports",
    label: "리포트",
    href: "/reports",
    icon: <ReportIcon className={ICON_CLASS} />,
  },
];

export const ADMIN_LOGOUT_ITEM: AdminSidebarItem = {
  id: "logout",
  label: "로그아웃",
  href: "/login",
  icon: <LogoutIcon className={ICON_CLASS} />,
};
