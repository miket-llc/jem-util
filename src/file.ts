import * as fs from 'fs'
import * as path from 'path'
import { AppError, NotFoundError, ValidationError } from './error'

/**
 * Reads the content of a file.
 * @param filePath - The path to the file.
 * @returns The content of the file as a string.
 * @throws {NotFoundError} If the file does not exist.
 */
export function readFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new NotFoundError(`File not found: ${filePath}`)
  }
  return fs.readFileSync(filePath, 'utf8')
}

/**
 * Writes content to a file.
 * @param filePath - The path to the file.
 * @param content - The content to write to the file.
 * @throws {ValidationError} If the content is not a string.
 */
export function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf8')
}

/**
 * Deletes a file.
 * @param filePath - The path to the file.
 * @throws {NotFoundError} If the file does not exist.
 */
export function deleteFile(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new NotFoundError(`File not found: ${filePath}`)
  }
  fs.unlinkSync(filePath)
}

/**
 * Creates a directory if it does not exist.
 * @param dirPath - The path to the directory.
 */
export function createDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Checks if a file or directory exists.
 * @param filePath - The path to the file or directory.
 * @returns True if the file or directory exists, false otherwise.
 */
export function exists(filePath: string): boolean {
  return fs.existsSync(filePath)
}

/**
 * Joins multiple path segments into a single path.
 * @param paths - The path segments to join.
 * @returns The joined path.
 */
export function joinPath(...paths: string[]): string {
  return path.join(...paths)
}

/**
 * Gets the directory name of a file path.
 * @param filePath - The file path.
 * @returns The directory name.
 */
export function getDirName(filePath: string): string {
  return path.dirname(filePath)
}

/**
 * Copies a file from one location to another.
 * @param srcPath - The source file path.
 * @param destPath - The destination file path.
 * @throws {NotFoundError} If the source file does not exist.
 */
export function copyFile(srcPath: string, destPath: string): void {
  if (!fs.existsSync(srcPath)) {
    throw new NotFoundError(`Source file not found: ${srcPath}`)
  }
  fs.copyFileSync(srcPath, destPath)
}

/**
 * Moves a file from one location to another.
 * @param srcPath - The source file path.
 * @param destPath - The destination file path.
 * @throws {NotFoundError} If the source file does not exist.
 */
export function moveFile(srcPath: string, destPath: string): void {
  if (!fs.existsSync(srcPath)) {
    throw new NotFoundError(`Source file not found: ${srcPath}`)
  }
  fs.renameSync(srcPath, destPath)
}

/**
 * Reads the content of a directory.
 * @param dirPath - The path to the directory.
 * @returns An array of file and directory names in the directory.
 * @throws {NotFoundError} If the directory does not exist.
 */
export function readDirectory(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    throw new NotFoundError(`Directory not found: ${dirPath}`)
  }
  return fs.readdirSync(dirPath)
}

/**
 * Gets the stats of a file or directory.
 * @param filePath - The path to the file or directory.
 * @returns The stats of the file or directory.
 * @throws {NotFoundError} If the file or directory does not exist.
 */
export function getStats(filePath: string): fs.Stats {
  if (!fs.existsSync(filePath)) {
    throw new NotFoundError(`File or directory not found: ${filePath}`)
  }
  return fs.statSync(filePath)
}

/**
 * Reads a JSON file and parses its content.
 * @param filePath - The path to the JSON file.
 * @returns The parsed JSON content.
 * @throws {NotFoundError} If the file does not exist.
 * @throws {ValidationError} If the file content is not valid JSON.
 */
export function readJsonFile(filePath: string): any {
  const content = readFile(filePath)
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new ValidationError(`Invalid JSON in file: ${filePath}`)
  }
}

/**
 * Writes an object to a JSON file.
 * @param filePath - The path to the JSON file.
 * @param data - The data to write to the file.
 * @throws {ValidationError} If the data cannot be serialized to JSON.
 */
export function writeJsonFile(filePath: string, data: any): void {
  try {
    const content = JSON.stringify(data, null, 2)
    writeFile(filePath, content)
  } catch (error) {
    throw new ValidationError(`Failed to serialize data to JSON: ${filePath}`)
  }
}

/**
 * Appends content to a file.
 * @param filePath - The path to the file.
 * @param content - The content to append to the file.
 * @throws {ValidationError} If the content is not a string.
 */
export function appendToFile(filePath: string, content: string): void {
  if (typeof content !== 'string') {
    throw new ValidationError('Content must be a string')
  }
  fs.appendFileSync(filePath, content, 'utf8')
}

/**
 * Lists all files in a directory.
 * @param dirPath - The path to the directory.
 * @returns An array of file names in the directory.
 * @throws {NotFoundError} If the directory does not exist.
 */
export function listFilesInDirectory(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    throw new NotFoundError(`Directory not found: ${dirPath}`)
  }
  return fs.readdirSync(dirPath).filter((file) => fs.statSync(path.join(dirPath, file)).isFile())
}

/**
 * Recursively copies a directory.
 * @param srcDir - The source directory path.
 * @param destDir - The destination directory path.
 * @throws {NotFoundError} If the source directory does not exist.
 */
export async function copyDirectory(srcDir: string, destDir: string): Promise<void> {
  try {
    await fs.promises.access(srcDir)
  } catch {
    throw new NotFoundError(`Source directory not found: ${srcDir}`)
  }
  try {
    await fs.promises.mkdir(destDir, { recursive: true })
  } catch (error) {
    throw new AppError(`Failed to create directory: ${destDir}`, 500)
  }
  let entries: string[]
  try {
    entries = await fs.promises.readdir(srcDir)
  } catch (error) {
    throw new AppError(`Failed to read directory: ${srcDir}`, 500)
  }
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry)
    const destPath = path.join(destDir, entry)
    let stat: fs.Stats
    try {
      stat = await fs.promises.stat(srcPath)
    } catch (error) {
      throw new AppError(`Failed to get stats for: ${srcPath}`, 500)
    }
    if (stat.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    } else {
      try {
        await fs.promises.copyFile(srcPath, destPath)
      } catch (error) {
        throw new AppError(`Failed to copy file: ${srcPath} to ${destPath}`, 500)
      }
    }
  }
}

/**
 * Recursively moves a directory.
 * @param srcDir - The source directory path.
 * @param destDir - The destination directory path.
 * @throws {NotFoundError} If the source directory does not exist.
 */
export async function moveDirectory(srcDir: string, destDir: string): Promise<void> {
  await copyDirectory(srcDir, destDir)
  await deleteDirectory(srcDir)
}

/**
 * Recursively deletes a directory.
 * @param dirPath - The path to the directory.
 * @throws {NotFoundError} If the directory does not exist.
 */
export async function deleteDirectory(dirPath: string): Promise<void> {
  try {
    await fs.promises.access(dirPath)
  } catch {
    throw new NotFoundError(`Directory not found: ${dirPath}`)
  }
}
