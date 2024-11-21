import { NotFoundError, ValidationError } from './error'

/**
 * Gets an environment variable value.
 * @param key - The environment variable key.
 * @param defaultValue - The default value if the environment variable is not set.
 * @returns The environment variable value.
 * @throws {NotFoundError} If the environment variable is not set and no default value is provided.
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new NotFoundError(`Environment variable ${key} is not set`)
  }
  return value
}

/**
 * Validates that a required environment variable is set.
 * @param key - The environment variable key.
 * @throws {ValidationError} If the environment variable is not set.
 */
export function validateEnv(key: string): void {
  if (process.env[key] === undefined) {
    throw new ValidationError(`Environment variable ${key} is required`)
  }
}