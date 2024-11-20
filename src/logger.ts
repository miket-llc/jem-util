import { createLogger, format, transports, Logger } from 'winston'
import * as path from 'path'
import { appName, appVersion } from './versions'

/**
 * Destructures and imports specific functions from the `format` module.
 *
 * @constant
 * @type {Object}
 * @property {Function} combine - Combines multiple format functions into a single format function.
 * @property {Function} timestamp - Adds a timestamp to the log message.
 * @property {Function} label - Adds a label to the log message.
 * @property {Function} printf - Creates a custom log message format.
 */
const { combine, timestamp, label, printf } = format

// Custom format for log messages
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

/**
 * Configuration options for the Logger.
 *
 * @interface LoggerConfig
 * @property {string} [logDirectory] - The directory where log files will be stored.
 * @property {string} [fileName] - The name of the log file.
 * @property {any[]} [additionalTransports] - An array of additional transport mechanisms for logging.
 */
interface LoggerConfig {
  logDirectory?: string
  fileName?: string
  additionalTransports?: any[]
}

/**
 * Default configuration object for the logger.
 *
 * @property {string} logDirectory - The directory where log files will be stored.
 *                                   It is set to a 'logs' folder in the current working directory.
 * @property {string} fileName - The name of the log file, which includes the application name and version.
 */
const defaultConfig = {
  logDirectory: path.join(process.cwd(), 'logs'),
  fileName: `${appName}-${appVersion}.log`
}

/**
 * A singleton class that provides a logger instance.
 * The logger instance is created with a default configuration and can be customized
 * with additional configuration options.
 */
class LoggerSingleton {
  private static instance: Logger

  private constructor() {}

  /**
   * Returns the singleton logger instance, creating it if it doesn't exist.
   * @param customConfig Custom configuration options for the logger.
   * @returns The logger instance.
   */
  public static getInstance(customConfig: LoggerConfig = {}): Logger {
    if (!LoggerSingleton.instance) {
      const config = { ...defaultConfig, ...customConfig }

      const defaultTransports = [
        new transports.Console(),
        new transports.File({
          filename: config.fileName,
          dirname: config.logDirectory
        })
      ]

      LoggerSingleton.instance = createLogger({
        format: combine(label({ label: appName }), timestamp(), customFormat),
        transports: [...defaultTransports, ...(customConfig.additionalTransports || [])]
      })
    }

    return LoggerSingleton.instance
  }
}

/**
 * A singleton instance of the LoggerSingleton class.
 * This instance is used to log messages throughout the application.
 */
const logger = LoggerSingleton.getInstance()

/**
 * Exports the logger instance.
 *
 * @remarks
 * This allows the logger instance to be imported and used in other files.
 *
 * @example
 * ```typescript
 * import logger from 'path/to/logger';
 * logger.info('This is an info message');
 * ```
 */
export default logger

/**
 * Exports the LoggerSingleton as createCustomLogger.
 *
 * @remarks
 * This allows the LoggerSingleton to be imported using the alias createCustomLogger.
 *
 * @example
 * ```typescript
 * import { createCustomLogger } from 'path/to/logger';
 * const logger = createCustomLogger();
 * ```
 */
