import { getProductionEnv } from "@/lib/env";

export const DASHBOARD_COOKIE_NAME = "ruangtulis_dashboard";

export function getDashboardAccessKey() {
  return getProductionEnv("DASHBOARD_ACCESS_KEY", "local-dashboard-access");
}

export function getAdminPassword() {
  return getProductionEnv("ADMIN_PASSWORD", "admin123");
}

export function getAdminUsername() {
  return getProductionEnv("ADMIN_USERNAME", "superadmin");
}
