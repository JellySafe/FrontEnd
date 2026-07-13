import type { MapPoint } from "@/features/dashboard/types";

// 제주도 전체가 보이는 중심 좌표
export const JEJU_CENTER: MapPoint = { lat: 33.375, lng: 126.53 };

// 제주 전역 개요 줌 레벨(숫자가 클수록 축소)
export const JEJU_OVERVIEW_LEVEL = 10;

// 단일 핀 포커스 줌 레벨
export const PIN_FOCUS_LEVEL = 5;

// setBounds 시 가장자리 여백(px)
export const BOUNDS_PADDING_PX = 60;
