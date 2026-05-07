import AppError from "./AppError.js";

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422);
  }
}

export default ValidationError;
