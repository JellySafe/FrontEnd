import { notFound } from "next/navigation";
import { BeachDetailScreen } from "@/features/beaches/components/BeachDetailScreen";

// 얇은 서버 컴포넌트: 라우트 [id](숫자 문자열)를 검증해 클라이언트 상세 화면에 beachId(number) 전달.
export default async function BeachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beachId = Number(id);
  // 숫자가 아닌 경로는 존재하지 않는 해변으로 처리
  if (!Number.isInteger(beachId) || beachId <= 0) {
    notFound();
  }

  return <BeachDetailScreen beachId={beachId} />;
}
