"use client";

import { Badge, Tabs } from "@jellysafe/design-system";
import { useEffect, useState } from "react";
import { useAlertsQuery } from "@/features/alarm/api/useAlertsQuery";
import { useMarkAlertReadMutation } from "@/features/alarm/api/useMarkAlertReadMutation";
import { useLikes } from "@/shared/likes/LikesProvider";
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

// 해변 사진은 API가 제공하지 않아 목록 화면과 동일한 placeholder 사용
const PLACEHOLDER_IMAGE = "/assets/beaches/placeholder.png";

// 알림 화면 상호작용 전담. 탭 상태를 보유하고 알림 목록/관심 해변을 렌더.
export function AlarmScreen() {
  const {
    favorites,
    isError: isFavoritesError,
    isLiked,
    isLoading: isFavoritesLoading,
    toggleLike,
  } = useLikes();
  const [tab, setTab] = useState<AlarmTab>("alarm");

  // 알림 목록 조회 및 열람 처리
  const alertsQuery = useAlertsQuery();
  const markReadMutation = useMarkAlertReadMutation();
  const notifications = alertsQuery.data?.items ?? [];

  // 미열람 알림 항목 탭 시 열람 처리(성공 시 목록 무효화). 상세 이동은 없다.
  const handleNotificationClick = (id: number, isRead: boolean) => {
    if (isRead || markReadMutation.isPending) return;
    markReadMutation.mutate(id);
  };

  // 알림 탭 최초 진입 시 홈 툴팁을 영구 숨김
  useEffect(() => {
    dismissAlarmTooltip();
  }, []);

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
          !alertsQuery.isFetched && !alertsQuery.isError ? (
            <p className="py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
              알림을 불러오는 중입니다
            </p>
          ) : alertsQuery.isError ? (
            <p className="py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
              알림을 불러오지 못했습니다
            </p>
          ) : notifications.length > 0 ? (
            // 알림 리스트: 항목 사이 1px 구분선
            <ul className="divide-y divide-border-default">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  {/* 탭 시 열람 처리. 상세 이동이 없어 button으로 열람만 수행 */}
                  <button
                    className="flex w-full flex-col gap-(--gap-2) py-(--padding-5) text-left"
                    onClick={() =>
                      handleNotificationClick(notification.id, notification.isRead)
                    }
                    type="button"
                  >
                    <div className="flex items-center gap-(--gap-2)">
                      {/* 미열람 강조: 좌측 작은 점(디자인 시스템 미정의라 조용한 표시만) */}
                      {!notification.isRead ? (
                        <span
                          aria-label="읽지 않은 알림"
                          className="size-(--gap-2) shrink-0 rounded-full bg-text-primary"
                        />
                      ) : null}
                      <p className="text-caption-small-mobile text-text-tertiary">
                        {notification.notifiedAt}
                      </p>
                    </div>
                    <div className="flex flex-col gap-(--gap-2)">
                      <div className="flex items-center gap-(--gap-2)">
                        {/* riskLevel이 null이면 Badge 생략 */}
                        {notification.risk ? (
                          <Badge platform="mobile" status={notification.risk}>
                            {RISK_LABEL[notification.risk]}
                          </Badge>
                        ) : null}
                        <span className="min-w-0 flex-1 truncate text-body-xsmall-mobile text-text-secondary">
                          {notification.beachName}
                        </span>
                      </div>
                      <p className="text-body-large-mobile text-text-primary">
                        {notification.title}
                      </p>
                    </div>
                    <p className="whitespace-pre-line text-caption-small-mobile text-text-secondary">
                      {notification.message}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
              받은 알림이 없습니다
            </p>
          )
        ) : isFavoritesLoading ? (
          <p className="py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
            관심 해변을 불러오는 중입니다
          </p>
        ) : isFavoritesError ? (
          <p className="py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
            관심 해변을 불러오지 못했습니다
          </p>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-(--gap-3)">
            {favorites.map((beach) => (
              <PlaceCard
                address={beach.region}
                className="w-full"
                href={`/beaches/${beach.id}`}
                imageAlt={`${beach.name} 사진`}
                imageSrc={PLACEHOLDER_IMAGE}
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
