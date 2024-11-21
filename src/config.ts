import { readFile, writeFile, exists, createDirectory, getDirName } from './file'
import { NotFoundError, ValidationError } from './error'

interface Config {
  [key: string]: any
}

let config: Config = {}

/**
 * Loads the configuration from a JSON file.
 * @param configPath - The path to the configuration file.
 * @throws {NotFoundError} If the configuration file does not exist.
 * @throws {ValidationError} If the configuration file is not a valid JSON.
 */
export function loadConfig(configPath: string): void {
  if (!exists(configPath)) {
    throw new NotFoundError(`Config file not found: ${configPath}`)
  }
  try {
    const configFile = readFile(configPath)
    config = JSON.parse(configFile)
  } catch (error) {
    throw new ValidationError(`Invalid JSON in config file: ${configPath}`)
  }
}

/**
 * Saves the current configuration to a JSON file.
 * @param configPath - The path to the configuration file.
 * @throws {ValidationError} If the configuration cannot be serialized to JSON.
 */
export function saveConfig(configPath: string): void {
  try {
    const configDir = getDirName(configPath)
    if (!exists(configDir)) {
      createDirectory(configDir)
    }
    const configFile = JSON.stringify(config, null, 2)
    writeFile(configPath, configFile)
  } catch (error) {
    throw new ValidationError(`Failed to save config to file: ${configPath}`)
  }
}

/**
 * Gets a configuration value by key.
 * @param key - The configuration key.
 * @returns The configuration value.
 */
export function getConfig(key: string): any {
  return config[key]
}

/**
 * Sets a configuration value by key.
 * @param key - The configuration key.
 * @param value - The configuration value.
 */
export function setConfig(key: string, value: any): void {
  config[key] = value
}
