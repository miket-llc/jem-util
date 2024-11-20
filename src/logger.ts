// jem-util/src/logger.ts
import { createLogger, format, transports, Logger } from 'winston'
import * as path from 'path'
import { appName, appVersion } from './versions'

const { combine, timestamp, label, printf } = format

// Custom format for log messages
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

interface LoggerConfig {
  logDirectory?: string
  fileName?: string
  additionalTransports?: any[]
}

const defaultConfig = {
  logDirectory: path.join(process.cwd(), 'logs'),
  fileName: `${appName}-${appVersion}.log`
}

class LoggerSingleton {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(customConfig: LoggerConfig = {}): Logger {
    if (!LoggerSingleton.instance) {
      const config = { ...defaultConfig, ...customConfig };

      const defaultTransports = [
        new transports.Console(),
        new transports.File({
          filename: config.fileName,
          dirname: config.logDirectory
        })
      ];

      LoggerSingleton.instance = createLogger({
        format: combine(label({ label: appName }), timestamp(), customFormat),
        transports: [...defaultTransports, ...(customConfig.additionalTransports || [])]
      });
    }

    return LoggerSingleton.instance;
  }
}

const logger = LoggerSingleton.getInstance();

export default logger;
export { LoggerSingleton as createCustomLogger };
