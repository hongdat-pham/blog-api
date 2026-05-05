import "dotenv/config";
import app from "./app.js";
import config from "./config.js";

app.listen(config.port, () => {
  console.log(`Blog API running on port ${config.port} (${config.nodeEnv})`);
});
