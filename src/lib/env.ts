const isDeployment = process.env.CI === "true" || process.env.VERCEL === "1";

export function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    if (isDeployment) {
      throw new Error(`Missing required deployment environment variable: ${name}`);
    }

    return "";
  }

  return value;
}

export function getProductionEnv(name: string, developmentFallback: string) {
  const value = getRequiredEnv(name);
  return value || developmentFallback;
}

export function getDatabaseUrl() {
  const value = getRequiredEnv("DATABASE_URL");

  if (isDeployment && /@localhost(?::|\/|$)|@127\.0\.0\.1(?::|\/|$)/.test(value)) {
    throw new Error(
      "DATABASE_URL points to localhost. Use a hosted PostgreSQL connection string in production.",
    );
  }

  return value;
}
