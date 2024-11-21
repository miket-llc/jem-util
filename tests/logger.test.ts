import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import * as winston from 'winston'
import * as path from 'path'
import * as fs from 'fs'

jest.mock('fs')

describe('logger module', () => {
  let appName: string
  let appVersion: string
  let logger: any

  const mockPackageJson = {
    name: 'test-application',
    version: '1.0.0'
  }

  const logDirectory = path.join(process.cwd(), 'logs')
  const logFileName = `${mockPackageJson.name}-${mockPackageJson.version}.log`
  const logFilePath = path.join(logDirectory, logFileName)

  beforeAll(() => {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    ;(fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockPackageJson))

    // Import appName and appVersion after setting up the mock
    const versions = require('../src/versions')
    appName = versions.appName
    appVersion = versions.appVersion

    // Import logger after setting up the mock
    logger = require('../src/logger').default
  })

  afterAll(() => {
    // Clean up the log file created during the test
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath)
    }
  })

  it('should create a logger with the correct configuration', () => {
    expect(logger.transports.length).toBeGreaterThan(0)
    expect(logger.transports[0]).toBeInstanceOf(winston.transports.Console)
    expect(logger.transports[1]).toBeInstanceOf(winston.transports.File)
    expect(path.resolve(logger.transports[1].dirname)).toBe(path.resolve(logDirectory))
    expect(logger.transports[1].filename).toBe(logFileName)
  })

  it('should log messages correctly', () => {
    const infoSpy = jest.spyOn(logger, 'info')
    const errorSpy = jest.spyOn(logger, 'error')

    logger.info('This is an info message')
    logger.error('This is an error message')

    expect(infoSpy).toHaveBeenCalledWith('This is an info message')
    expect(errorSpy).toHaveBeenCalledWith('This is an error message')
  })
})
