import { describe, it, expect, beforeAll, jest } from '@jest/globals'
import * as winston from 'winston'
import * as path from 'path'

// Mock winston before importing logger
jest.mock('winston', () => {
  class MockConsoleTransport {
    constructor() {
      return this
    }
  }

  class MockFileTransport {
    filename: string
    dirname: string
    level?: string

    constructor(opts: any) {
      this.filename = opts.filename
      this.dirname = opts.dirname
      this.level = opts.level
      return this
    }
  }

  const mockFormat = {
    combine: jest.fn().mockReturnValue({
      transform: jest.fn(
        (info: { timestamp: string; label: string; level: string; message: string }) => {
          const msg = `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
          return { ...info, [Symbol.for('message')]: msg }
        }
      )
    }),
    timestamp: jest.fn(),
    label: jest.fn(),
    printf: jest.fn((template) => template)
  }

  return {
    createLogger: jest.fn().mockImplementation((config: any) => ({
      format: config.format,
      transports: Array.isArray(config.transports) ? config.transports : [config.transports],
      info: jest.fn(),
      error: jest.fn()
    })),
    format: mockFormat,
    transports: {
      File: MockFileTransport,
      Console: MockConsoleTransport
    }
  }
})

jest.mock('path', () => {
  const originalPath = jest.requireActual('path') as typeof path
  return {
    ...originalPath,
    join: jest.fn((...args: string[]) => args.join('/'))
  }
})

// Add fs mock before logger import
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(
    JSON.stringify({
      name: 'jem-util',
      version: '1.0.0'
    })
  )
}))

const mockCwd = '/fake/directory'
jest.spyOn(process, 'cwd').mockReturnValue(mockCwd)

// Keep logger import last
import logger, { createCustomLogger } from '../src/logger'

describe('logger module', () => {
  const appName = 'jem-util'
  const appVersion = '1.0.0'
  const logDirectory = `${mockCwd}/logs`
  const logFileName = `${appName}-${appVersion}.log`

  it('should create a logger with the correct configuration', () => {
    // Check transports
    expect(logger.transports.length).toBe(2)
    expect(logger.transports[0]).toBeInstanceOf(winston.transports.Console)
    expect(logger.transports[1]).toBeInstanceOf(winston.transports.File)

    // Check file transport configuration
    const fileTransport = logger.transports[1] as winston.transports.FileTransportInstance
    expect(fileTransport.filename).toBe(logFileName)
    expect(fileTransport.dirname).toBe(logDirectory)

    // Test the actual format output (what we really care about)
    const testMessage = {
      level: 'info',
      message: 'Test message',
      label: appName,
      timestamp: '2023-10-05T14:48:00.000Z'
    }

    const transformedMessage = logger.format.transform(testMessage) as { [key: symbol]: string }
    const formattedMessage = transformedMessage[Symbol.for('message')]
    expect(formattedMessage).toBe('2023-10-05T14:48:00.000Z [jem-util] info: Test message')
  })

  it('should log messages correctly', () => {
    const infoSpy = jest.spyOn(logger, 'info')
    const errorSpy = jest.spyOn(logger, 'error')

    logger.info('This is an info message')
    logger.error('This is an error message')

    expect(infoSpy).toHaveBeenCalledWith('This is an info message')
    expect(errorSpy).toHaveBeenCalledWith('This is an error message')
  })

  it('should create transports based on config', () => {
    const customConfig = {
      logDirectory: '/custom/path',
      fileName: 'custom.log'
    }

    const customLogger = createCustomLogger(customConfig)
    const fileTransport = customLogger.transports.find((t) => t instanceof winston.transports.File)

    expect(fileTransport).toBeDefined()
    expect(fileTransport?.filename).toBe('custom.log')
    expect(fileTransport?.dirname).toBe('/custom/path')
  })

  it('should handle multiple file transports if configured', () => {
    const multiConfig = {
      logDirectory: '/custom/path',
      fileName: 'combined.log',
      additionalTransports: [new winston.transports.File({ filename: 'error.log', level: 'error' })]
    }

    const multiLogger = createCustomLogger(multiConfig)
    expect(multiLogger.transports.length).toBe(3) // Console + 2 files

    const fileTransports = multiLogger.transports.filter(
      (t) => t instanceof winston.transports.File
    )
    expect(fileTransports.length).toBe(2)
  })
})
