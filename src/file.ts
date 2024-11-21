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
  if (typeof content !== 'string') {
    throw new ValidationError('Content must be a string')
  }
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
