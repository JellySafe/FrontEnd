export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

export type AdminRole = "public" | "operator" | "admin";

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  userId: number;
  email: string;
  role: AdminRole;
  name: string;
  lastLoginAt: string | null;
  accessToken: string;
};
