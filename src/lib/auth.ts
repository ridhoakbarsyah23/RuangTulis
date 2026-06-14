export const DASHBOARD_COOKIE_NAME = "ruangtulis_dashboard";

export function getDashboardAccessKey() {
  return process.env.DASHBOARD_ACCESS_KEY ?? "local-dashboard-access";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME ?? "superadmin";
}
