import dotenv from "dotenv";

dotenv.config();

export default {
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "postgres",
  POSTGRES_DB: process.env.POSTGRES_DB || "emailDB",
  REDIS_HOST: "redis",
  REDIS_PORT: 6379,
  PORT: 4000,
  JWT_SECRET:
    process.env.JWT_SECRET /* This is a secret key used to sign the JWT */,
};
