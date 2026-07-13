import { AlarmScreen } from "@/features/alarm/components/AlarmScreen";

// 알림 라우트. 상호작용은 AlarmScreen(client)에 위임하고 조립만 담당.
export default function AlarmPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AlarmScreen />
    </main>
  );
}
