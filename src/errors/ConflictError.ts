import AppError from "./AppError.js";

class ConflictError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} already exists`, 409);
  }
}

export default ConflictError;
