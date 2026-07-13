"use client";

import { Badge, Tabs } from "@jellysafe/design-system";
import { useEffect, useState } from "react";
import { ALARM_NOTIFICATIONS } from "@/features/alarm/mocks/alarm.mock";
import { useLikes } from "@/shared/likes/LikesProvider";
import { BEACHES, getBeachById } from "@/shared/mocks/beaches.mock";
import { RISK_LABEL } from "@/shared/risk/types";
import { dismissAlarmTooltip } from "@/shared/ui/alarm-tooltip-storage";
import { NavigationBar } from "@/shared/ui/NavigationBar";
import { PUBLIC_NAV_ITEMS } from "@/shared/ui/navigation-items";
import { PlaceCard } from "@/shared/ui/PlaceCard";
import { PublicPageShell } from "@/shared/ui/PublicPageShell";

// 상단 탭(알림/관심). "알림"에만 new 인디케이터 표시.
const ALARM_TABS = [
  { value: "alarm", label: "알림", hasNew: true },
  { value: "likes", label: "관심" },
];

type AlarmTab = "alarm" | "likes";

// 알림 화면 상호작용 전담. 탭 상태를 보유하고 알림 목록/관심 해변을 렌더.
export function AlarmScreen() {
  const { isLiked, likedIds, toggleLike } = useLikes();
  const [tab, setTab] = useState<AlarmTab>("alarm");

  // 알림 탭 최초 진입 시 홈 툴팁을 영구 숨김
  useEffect(() => {
    dismissAlarmTooltip();
  }, []);

  // 조회 실패 항목은 렌더에서 제외
  const notifications = ALARM_NOTIFICATIONS.map((notification) => ({
    notification,
    beach: getBeachById(notification.beachId),
  })).filter((entry) => entry.beach != null);

  const likedBeaches = BEACHES.filter((beach) => likedIds.has(beach.id));

  return (
    <PublicPageShell
      contentClassName="flex min-h-0 flex-1 flex-col px-(--padding-5)"
      footer={<NavigationBar activeKey="alarm" items={PUBLIC_NAV_ITEMS} />}
      scrollable={false}
    >
      {/* Figma: 상단 32px(pt-(--padding-8)) 후 탭. 스크롤과 분리해 비침/여백 이중 적용 방지 */}
      <div className="shrink-0 bg-bg-default pt-(--padding-8) pb-(--gap-3)">
        <Tabs
          aria-label="알림 탭"
          items={ALARM_TABS}
          onValueChange={(value) => setTab(value as AlarmTab)}
          value={tab}
          variant="line"
        />
      </div>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        {tab === "alarm" ? (
          // 알림 리스트: 항목 사이 1px 구분선
          <ul className="divide-y divide-border-default">
            {notifications.map(({ beach, notification }) => (
              <li
                className="flex flex-col gap-(--gap-2) py-(--padding-5)"
                key={notification.id}
              >
                <p className="text-caption-small-mobile text-text-tertiary">
                  {notification.notifiedAt}
                </p>
                <div className="flex flex-col gap-(--gap-2)">
                  <div className="flex items-center gap-(--gap-2)">
                    <Badge platform="mobile" status={notification.risk}>
                      {RISK_LABEL[notification.risk]}
                    </Badge>
                    <span className="min-w-0 flex-1 truncate text-body-xsmall-mobile text-text-secondary">
                      {beach?.name}
                    </span>
                  </div>
                  <p className="text-body-large-mobile text-text-primary">
                    {notification.title}
                  </p>
                </div>
                <p className="whitespace-pre-line text-caption-small-mobile text-text-secondary">
                  {notification.description}
                </p>
              </li>
            ))}
          </ul>
        ) : likedBeaches.length > 0 ? (
          <div className="grid grid-cols-2 gap-(--gap-3)">
            {likedBeaches.map((beach) => (
              <PlaceCard
                address={beach.address}
                className="w-full"
                href={`/beaches/${beach.id}`}
                imageAlt={`${beach.name} 사진`}
                imageSrc={beach.imageSrc}
                isLiked={isLiked(beach.id)}
                key={beach.id}
                likeLabel={`${beach.name} 관심 등록`}
                onLikeChange={() => toggleLike(beach.id)}
                status={beach.risk}
                statusLabel={RISK_LABEL[beach.risk]}
                title={beach.name}
              />
            ))}
          </div>
        ) : (
          <p className="py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
            관심 등록한 해변이 없습니다
          </p>
        )}
      </div>
    </PublicPageShell>
  );
}
