import { setAdminAuthenticated } from "../model/admin-session";

export type AdminCredentials = {
  username: string;
  password: string;
};

// 프론트 임시 계정. 백엔드 인증 연동 시 이 함수를 실제 API 호출로 교체한다.
const MOCK_USERNAME = "test";
const MOCK_PASSWORD = "test1234";

export async function signInAdmin(credentials: AdminCredentials): Promise<void> {
  const username = credentials.username.trim();
  const password = credentials.password;

  if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
    setAdminAuthenticated();
    return;
  }

  throw new Error("INVALID_CREDENTIALS");
}
