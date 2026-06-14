"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DASHBOARD_COOKIE_NAME,
  getAdminPassword,
  getAdminUsername,
  getDashboardAccessKey,
} from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (username !== getAdminUsername() || password !== getAdminPassword()) {
    return {
      error: "Username atau password salah. Coba cek lagi.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(DASHBOARD_COOKIE_NAME, getDashboardAccessKey(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(DASHBOARD_COOKIE_NAME);
  redirect("/");
}
