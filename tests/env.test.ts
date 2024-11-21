import { getEnv, validateEnv } from '../src/env'
import { NotFoundError, ValidationError } from '../src/error'

describe('env utility functions', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = {}
  })

  describe('getEnv', () => {
    it('should return the value of an environment variable', () => {
      process.env.TEST_VAR = 'test_value'
      const value = getEnv('TEST_VAR')
      expect(value).toBe('test_value')
    })

    it('should return the default value if the environment variable is not set', () => {
      const value = getEnv('TEST_VAR', 'default_value')
      expect(value).toBe('default_value')
    })

    it('should throw NotFoundError if the environment variable is not set and no default value is provided', () => {
      expect(() => getEnv('TEST_VAR')).toThrow(NotFoundError)
    })
  })

  describe('validateEnv', () => {
    it('should not throw an error if the environment variable is set', () => {
      process.env.TEST_VAR = 'test_value'
      expect(() => validateEnv('TEST_VAR')).not.toThrow()
    })

    it('should throw ValidationError if the environment variable is not set', () => {
      expect(() => validateEnv('TEST_VAR')).toThrow(ValidationError)
    })
  })
})
