import {
  AppError,
  ValidationError,
  NotFoundError,
  InternalServerError,
  catchAsync,
  logError
} from '../src/error'

describe('AppError', () => {
  it('should create an instance of AppError', () => {
    const error = new AppError('Test error', 500)
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('Test error')
    expect(error.statusCode).toBe(500)
    expect(error.isOperational).toBe(true)
  })
})

describe('ValidationError', () => {
  it('should create an instance of ValidationError', () => {
    const error = new ValidationError('Validation failed')
    expect(error).toBeInstanceOf(ValidationError)
    expect(error.message).toBe('Validation failed')
    expect(error.statusCode).toBe(400)
    expect(error.isOperational).toBe(true)
  })
})

describe('NotFoundError', () => {
  it('should create an instance of NotFoundError', () => {
    const error = new NotFoundError('Resource not found')
    expect(error).toBeInstanceOf(NotFoundError)
    expect(error.message).toBe('Resource not found')
    expect(error.statusCode).toBe(404)
    expect(error.isOperational).toBe(true)
  })
})

describe('InternalServerError', () => {
  it('should create an instance of InternalServerError', () => {
    const error = new InternalServerError('Internal server error')
    expect(error).toBeInstanceOf(InternalServerError)
    expect(error.message).toBe('Internal server error')
    expect(error.statusCode).toBe(500)
    expect(error.isOperational).toBe(true)
  })
})

describe('catchAsync', () => {
  it('should catch async errors', async () => {
    const asyncFunction = jest.fn().mockRejectedValue(new Error('Async error'))
    const wrappedFunction = catchAsync(asyncFunction)

    await expect(wrappedFunction()).rejects.toThrow('Async error')

    expect(asyncFunction).toHaveBeenCalled()
  })
})

describe('logError', () => {
  it('should log the error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Test error')

    logError(error)

    expect(consoleSpy).toHaveBeenCalledWith('Error:', error)
    consoleSpy.mockRestore()
  })
})
