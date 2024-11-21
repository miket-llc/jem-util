/**
 * Custom error class for application-specific errors.
 */
export class AppError extends Error {
  public readonly name: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true,
    stack: string = ''
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * Custom error class for validation errors.
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, true)
  }
}

/**
 * Custom error class for not found errors.
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, true)
  }
}

/**
 * Custom error class for internal server errors.
 */
export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500, true)
  }
}

/**
 * Utility function to handle async errors in any context.
 * @param fn - The async function to wrap.
 * @returns A function that handles errors.
 */
export function catchAsync(fn: Function) {
  return function (...args: any[]) {
    const fnReturn = fn(...args)
    if (fnReturn && fnReturn.catch) {
      fnReturn.catch((err: Error) => {
        console.error('Async error caught:', err)
      })
    }
    return fnReturn
  }
}
