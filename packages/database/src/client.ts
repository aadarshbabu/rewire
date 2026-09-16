import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

export function createDatabaseClient(customUrl?: string): PrismaClient {
  const connectionString =
    customUrl ||
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/rewire_dev";

  let poolConfig: { connectionString: string; ssl?: { rejectUnauthorized: boolean } };

  try {
    const url = new URL(connectionString);
    const hasSsl =
      url.searchParams.get("sslmode") === "require" ||
      url.searchParams.has("ssl") ||
      url.searchParams.get("sslmode") === "no-verify";

    if (hasSsl) {
      url.searchParams.delete("sslmode");
      poolConfig = {
        connectionString: url.toString(),
        ssl: { rejectUnauthorized: false },
      };
    } else {
      poolConfig = { connectionString };
    }
  } catch {
    poolConfig = { connectionString };
  }

  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
  });
}

export const db =
  globalForPrisma.prisma ??
  createDatabaseClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
