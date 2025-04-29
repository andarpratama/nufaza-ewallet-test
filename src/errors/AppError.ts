export class AppError extends Error {
    public readonly code: string;
    public readonly customMessage?: string;
  
    constructor(code: string, customMessage?: string) {
      super(customMessage ?? code);
      this.code = code;
      this.customMessage = customMessage;
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this);
    }
  }