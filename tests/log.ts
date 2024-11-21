import { logInfo, logWarning, logError } from '../src/log'
import * as fs from 'fs'
import * as path from 'path'
import { appendToFile, createDirectory, exists } from '../src/file'
import { appName, appVersion } from '../src/versions'

jest.mock('fs')
jest.mock('../src/file')

describe('log', () => {
  const logDirectory = path.join(process.cwd(), 'logs')
  const logFilePath = path.join(logDirectory, `${appName}-${appVersion}.log`)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('logInfo', () => {
    it('should log an info message', () => {
      ;(exists as jest.Mock).mockReturnValue(false)
      logInfo('This is an info message')
      expect(createDirectory).toHaveBeenCalledWith(logDirectory)
      expect(appendToFile).toHaveBeenCalledWith(
        logFilePath,
        expect.stringContaining('[INFO] This is an info message')
      )
    })
  })

  describe('logWarning', () => {
    it('should log a warning message', () => {
      ;(exists as jest.Mock).mockReturnValue(false)
      logWarning('This is a warning message')
      expect(createDirectory).toHaveBeenCalledWith(logDirectory)
      expect(appendToFile).toHaveBeenCalledWith(
        logFilePath,
        expect.stringContaining('[WARNING] This is a warning message')
      )
    })
  })

  describe('logError', () => {
    it('should log an error message', () => {
      ;(exists as jest.Mock).mockReturnValue(false)
      logError('This is an error message')
      expect(createDirectory).toHaveBeenCalledWith(logDirectory)
      expect(appendToFile).toHaveBeenCalledWith(
        logFilePath,
        expect.stringContaining('[ERROR] This is an error message')
      )
    })
  })
})
