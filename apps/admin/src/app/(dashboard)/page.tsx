import { redirect } from "next/navigation";

// 관리자 진입점(`/`)은 로그인으로 이동한다.
export default function AdminHomePage() {
  redirect("/login");
}
