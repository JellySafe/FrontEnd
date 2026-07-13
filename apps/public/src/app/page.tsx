import { BeachSearchScreen } from "@/features/beaches/components/BeachSearchScreen";

// 홈(해변 검색) 라우트. 상호작용은 BeachSearchScreen(client)에 위임하고 조립만 담당.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <BeachSearchScreen />
    </main>
  );
}
