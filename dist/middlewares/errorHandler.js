import { AppError } from "../errors/index.js";
import config from "../config.js";
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
            statusCode: err.statusCode,
            timestamp: new Date().toISOString(),
            ...(config.isDevelopment && { stack: err.stack }),
        });
        return;
    }
    console.error("Unexpected error:", err);
    res.status(500).json({
        error: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
        ...(config.isDevelopment && { stack: err.stack }),
    });
};
export default errorHandler;
