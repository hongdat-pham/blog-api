import { z } from "zod";
const envSchema = z.object({
    PORT: z.coerce.number().min(1024).max(65535).default(3000),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    APP_NAME: z.string().min(1),
    API_KEY: z.string().min(1),
    ADMIN_KEY: z.string().min(1),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error("Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
}
const env = result.data;
const config = {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    appName: env.APP_NAME,
    apiKey: env.API_KEY,
    adminKey: env.ADMIN_KEY,
    isProduction: env.NODE_ENV === "production",
    isDevelopment: env.NODE_ENV === "development",
};
export default config;
