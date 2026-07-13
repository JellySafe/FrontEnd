import { DetailedMapView } from "@/features/detailed-map/components/DetailedMapView";

type DetailedMapPageProps = {
  searchParams: Promise<{ beach?: string }>;
};

// 상세 지도(해변 상세 분석 + 대응 기록) 화면. 조립 중심으로 유지한다.
export default async function DetailedMapPage({ searchParams }: DetailedMapPageProps) {
  const { beach } = await searchParams;
  return <DetailedMapView beachId={beach} />;
}
