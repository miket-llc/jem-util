import * as fs from 'fs'
import * as path from 'path'
import { format } from 'date-fns'
import { createDirectory, appendToFile, exists } from './file'
import { appName, appVersion } from './versions'

const logDirectory = path.join(process.cwd(), 'logs')
const logFilePath = path.join(logDirectory, `${appName}-${appVersion}.log`)

/**
 * Ensures the log directory exists.
 */
function ensureLogDirectoryExists(): void {
  if (!exists(logDirectory)) {
    createDirectory(logDirectory)
  }
}

/**
 * Formats the log message with a timestamp.
 * @param level - The log level (e.g., 'INFO', 'ERROR').
 * @param message - The log message.
 * @returns The formatted log message.
 */
function formatLogMessage(level: string, message: string): string {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  return `${timestamp} [${level}] ${message}`
}

/**
 * Logs a message to the log file.
 * @param level - The log level (e.g., 'INFO', 'ERROR').
 * @param message - The log message.
 */
function logMessage(level: string, message: string): void {
  ensureLogDirectoryExists()
  const formattedMessage = formatLogMessage(level, message)
  appendToFile(logFilePath, formattedMessage + '\n')
}

/**
 * Logs an info message.
 * @param message - The log message.
 */
export function logInfo(message: string): void {
  logMessage('INFO', message)
}

/**
 * Logs a warning message.
 * @param message - The log message.
 */
export function logWarning(message: string): void {
  logMessage('WARNING', message)
}

/**
 * Logs an error message.
 * @param message - The log message.
 */
export function logError(message: string): void {
  logMessage('ERROR', message)
}
