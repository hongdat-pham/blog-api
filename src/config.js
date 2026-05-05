const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiKey: process.env.API_KEY,
};

if (!config.apiKey) throw new Error("API_KEY is required");

export default config;
