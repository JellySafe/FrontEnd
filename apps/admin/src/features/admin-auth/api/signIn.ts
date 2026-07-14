import { postJson } from "@/shared/api/http-client";
import type { LoginUserResponse } from "@/shared/api/types";
import { setAdminSession } from "../model/admin-session";

export type AdminCredentials = {
  email: string;
  password: string;
};

export async function signInAdmin(credentials: AdminCredentials): Promise<void> {
  const email = credentials.email.trim();
  const password = credentials.password;

  const response = await postJson<LoginUserResponse>("/api/admin/auth/login", {
    email,
    password,
  });

  setAdminSession({
    accessToken: response.accessToken,
    userId: response.userId,
    email: response.email,
    role: response.role,
    name: response.name,
  });
}
