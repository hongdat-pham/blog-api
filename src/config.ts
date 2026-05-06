const apiKey = process.env.API_KEY;
const adminKey = process.env.ADMIN_KEY;

if (!apiKey) throw new Error("API_KEY is required");
if (!adminKey) throw new Error("ADMIN_KEY is required");

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiKey,
  adminKey,
};

export default config;
