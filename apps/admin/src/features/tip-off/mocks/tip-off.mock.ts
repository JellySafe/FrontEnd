import type { TipOffDetail, TipOffListItem } from "../types";

const PHOTO = "/assets/tip-off/thumbnail-placeholder.png";

// 상세 화면용 10장 이미지 mock 경로
export const DETAIL_IMAGE_PATHS = Array.from({ length: 10 }, () => PHOTO);

export const TIP_OFF_TOTAL_COUNT = 99;

export const INITIAL_TIP_OFF_ROWS: TipOffListItem[] = [
  {
    id: "tip-001",
    title: "삼양 해수욕장 해파리 다수 출현",
    beach: "삼양해수욕장",
    address: "제주 제주시 삼양동",
    receivedAt: "2026.02.07 14:32",
    receivedAtSort: 202602071432,
    risk: "critical",
    reportType: "mass-sighting",
    aiVerdict: "not-jellyfish",
    confidence: 50,
    adminStatus: "unreviewed",
    thumbnailState: "loaded",
    thumbnailSrc: PHOTO,
  },
  {
    id: "tip-002",
    title: "함덕 해수욕장 쏘임 사고 제보",
    beach: "함덕 해수욕장",
    address: "제주 제주시 조천읍",
    receivedAt: "2026.02.07 13:18",
    receivedAtSort: 202602071318,
    risk: "danger",
    reportType: "sting-incident",
    aiVerdict: "duplicate",
    confidence: 78,
    adminStatus: "duplicate-report",
    thumbnailState: "loaded",
    thumbnailSrc: PHOTO,
  },
  {
    id: "tip-003",
    title: "김녕 해수욕장 해파리 출현",
    beach: "김녕 해수욕장",
    address: "제주 제주시 구좌읍",
    receivedAt: "2026.02.07 12:05",
    receivedAtSort: 202602071205,
    risk: "caution",
    reportType: "sighting",
    aiVerdict: "unclear-photo",
    confidence: 62,
    adminStatus: "unreviewed",
    thumbnailState: "loaded",
    thumbnailSrc: PHOTO,
  },
  {
    id: "tip-004",
    title: "월정 해수욕장 해파리 관련 제보",
    beach: "월정 해수욕장",
    address: "제주 제주시 구좌읍",
    receivedAt: "2026.02.07 11:44",
    receivedAtSort: 202602071144,
    risk: "safe",
    reportType: "sighting",
    aiVerdict: "location-error",
    confidence: 41,
    adminStatus: "pending",
    thumbnailState: "loaded",
    thumbnailSrc: PHOTO,
  },
  {
    id: "tip-005",
    title: "성산일출봉 해변 다수 출현 제보",
    beach: "성산일출봉 해변",
    address: "제주 서귀포시 성산읍",
    receivedAt: "2026.02.07 10:22",
    receivedAtSort: 202602071022,
    risk: "danger",
    reportType: "mass-sighting",
    aiVerdict: "not-jellyfish",
    confidence: 55,
    adminStatus: "approved",
    thumbnailState: "loaded",
    thumbnailSrc: PHOTO,
  },
  {
    id: "tip-006",
    title: "표선 해수욕장 해파리 쏘임 제보",
    beach: "표선 해수욕장",
    address: "제주 서귀포시 표선면",
    receivedAt: "2026.02.07 09:15",
    receivedAtSort: 202602070915,
    risk: "caution",
    reportType: "sting-incident",
    aiVerdict: "duplicate",
    confidence: 83,
    adminStatus: "rejected",
    thumbnailState: "loaded",
    thumbnailSrc: PHOTO,
  },
  {
    id: "tip-007",
    title: "중문색달 해수욕장 해파리 관련 제보",
    beach: "중문색달 해수욕장",
    address: "제주 서귀포시 색달동",
    receivedAt: "2026.02.06 22:48",
    receivedAtSort: 202602062248,
    risk: "critical",
    reportType: "mass-sighting",
    aiVerdict: "unclear-photo",
    confidence: 67,
    adminStatus: "admin-pending",
    thumbnailState: "loaded",
    thumbnailSrc: PHOTO,
  },
  {
    id: "tip-008",
    title: "협재 해수욕장 출현 제보",
    beach: "협재 해수욕장",
    address: "제주 제주시 한림읍",
    receivedAt: "2026.02.06 18:30",
    receivedAtSort: 202602061830,
    risk: "safe",
    reportType: "sighting",
    aiVerdict: "not-jellyfish",
    confidence: 38,
    adminStatus: "unreviewed",
    thumbnailState: "loaded",
    thumbnailSrc: PHOTO,
  },
];

const DETAIL_BY_ID: Record<string, Omit<TipOffDetail, keyof TipOffListItem>> = {
  "tip-001": {
    description:
      "삼양 해수욕장 인근에서 해파리 다수 출현이 제보되었습니다. AI 판별 신뢰도가 낮아 관리자 확인이 필요합니다.",
    images: DETAIL_IMAGE_PATHS,
    location: { lat: 33.5253, lng: 126.5859 },
    locationLabel: "제주 제주시 삼양동",
  },
  "tip-002": {
    description:
      "함덕 해수욕장에서 쏘임 사고가 접수되었습니다. 유사 제보와 중복 가능성이 있습니다.",
    images: DETAIL_IMAGE_PATHS,
    location: { lat: 33.5432, lng: 126.6698 },
    locationLabel: "제주 제주시 조천읍",
  },
  "tip-003": {
    description:
      "김녕 해수욕장에서 해파리 출현 제보가 접수되었습니다. 사진이 다소 불명확합니다.",
    images: DETAIL_IMAGE_PATHS,
    location: { lat: 33.5578, lng: 126.7583 },
    locationLabel: "제주 제주시 구좌읍",
  },
  "tip-004": {
    description:
      "월정 해수욕장 해파리 관련 제보입니다. 제보 위치 정보에 오류 가능성이 있습니다.",
    images: DETAIL_IMAGE_PATHS,
    location: { lat: 33.5565, lng: 126.7959 },
    locationLabel: "제주 제주시 구좌읍",
  },
  "tip-005": {
    description: "성산일출봉 해변에서 해파리 다수 출현이 제보되었습니다.",
    images: DETAIL_IMAGE_PATHS,
    location: { lat: 33.4590, lng: 126.9360 },
    locationLabel: "제주 서귀포시 성산읍",
  },
  "tip-006": {
    description:
      "표선 해수욕장 쏘임 사고 제보입니다. 중복 제보로 판별되었습니다.",
    images: DETAIL_IMAGE_PATHS,
    location: { lat: 33.3262, lng: 126.8339 },
    locationLabel: "제주 서귀포시 표선면",
  },
  "tip-007": {
    description:
      "중문색달 해수욕장 해파리 다수 출현 제보입니다. 관리자 확인이 필요합니다.",
    images: DETAIL_IMAGE_PATHS,
    location: { lat: 33.2447, lng: 126.4103 },
    locationLabel: "제주 서귀포시 색달동",
  },
  "tip-008": {
    description: "협재 해수욕장 출현 제보입니다.",
    images: DETAIL_IMAGE_PATHS,
    location: { lat: 33.3941, lng: 126.2396 },
    locationLabel: "제주 제주시 한림읍",
  },
};

export function getTipOffDetail(item: TipOffListItem): TipOffDetail {
  const extra = DETAIL_BY_ID[item.id];
  return {
    ...item,
    description: extra?.description ?? `${item.beach} 제보 상세`,
    images: extra?.images ?? DETAIL_IMAGE_PATHS,
    location: extra?.location ?? { lat: 33.5253, lng: 126.5859 },
    locationLabel: extra?.locationLabel ?? item.beach,
  };
}

export function reviewDecisionToAdminStatus(
  decision: "approved" | "pending" | "rejected",
): TipOffListItem["adminStatus"] {
  if (decision === "approved") return "approved";
  if (decision === "pending") return "pending";
  return "rejected";
}
