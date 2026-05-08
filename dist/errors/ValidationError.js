import AppError from "./AppError.js";
class ValidationError extends AppError {
    constructor(message) {
        super(message, 422);
    }
}
export default ValidationError;
