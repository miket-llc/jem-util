import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import * as fs from 'fs'
import { loadConfig, saveConfig, getConfig, setConfig } from '../src/config'
import { NotFoundError, ValidationError } from '../src/error'
import { readFile, writeFile, exists, createDirectory, getDirName, joinPath } from '../src/file'

jest.mock('fs')
jest.mock('../src/file')

describe('config module', () => {
  const configPath = 'config.json'
  const mockConfig = {
    key1: 'value1',
    key2: 'value2'
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('loadConfig', () => {
    it('should load the configuration from a file', () => {
      ;(exists as jest.Mock).mockReturnValue(true)
      ;(readFile as jest.Mock).mockReturnValue(JSON.stringify(mockConfig))

      loadConfig(configPath)
      expect(getConfig('key1')).toBe('value1')
      expect(getConfig('key2')).toBe('value2')
    })

    it('should throw NotFoundError if the configuration file does not exist', () => {
      ;(exists as jest.Mock).mockReturnValue(false)

      expect(() => loadConfig(configPath)).toThrow(NotFoundError)
    })

    it('should throw ValidationError if the configuration file is not valid JSON', () => {
      ;(exists as jest.Mock).mockReturnValue(true)
      ;(readFile as jest.Mock).mockReturnValue('invalid json')

      expect(() => loadConfig(configPath)).toThrow(ValidationError)
    })
  })

  describe('saveConfig', () => {
    it('should save the configuration to a file', () => {
      ;(exists as jest.Mock).mockReturnValue(false)
      ;(createDirectory as jest.Mock).mockImplementation(() => {})
      setConfig('key1', 'value1')
      setConfig('key2', 'value2')

      saveConfig(configPath)
      expect(createDirectory).toHaveBeenCalledWith(getDirName(configPath))
      expect(writeFile).toHaveBeenCalledWith(configPath, JSON.stringify(mockConfig, null, 2))
    })

    it('should throw ValidationError if the configuration cannot be serialized to JSON', () => {
      setConfig('key', undefined)
      ;(writeFile as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to write file')
      })

      expect(() => saveConfig(configPath)).toThrow(ValidationError)
    })
  })

  describe('getConfig', () => {
    it('should get a configuration value by key', () => {
      setConfig('key1', 'value1')
      expect(getConfig('key1')).toBe('value1')
    })
  })

  describe('setConfig', () => {
    it('should set a configuration value by key', () => {
      setConfig('key1', 'value1')
      expect(getConfig('key1')).toBe('value1')
    })
  })
})
