import {
  readFile,
  writeFile,
  deleteFile,
  createDirectory,
  exists,
  joinPath,
  getDirName,
  copyFile,
  moveFile,
  readDirectory,
  getStats
} from '../src/file'
import { NotFoundError, ValidationError } from '../src/error'
import * as fs from 'fs'
import * as path from 'path'

jest.mock('fs')

describe('fileUtils', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  const filePath = 'test.txt'
  const dirPath = 'testDir'

  describe('readFile', () => {
    it('should read the content of a file', () => {
      const fileContent = 'Hello, world!'
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readFileSync as jest.Mock).mockReturnValue(fileContent)

      const result = readFile(filePath)
      expect(result).toBe(fileContent)
    })

    it('should throw NotFoundError if the file does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)

      expect(() => readFile(filePath)).toThrow(NotFoundError)
    })
  })

  describe('writeFile', () => {
    it('should write content to a file', () => {
      const fileContent = 'Hello, world!'
      writeFile(filePath, fileContent)
      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, fileContent, 'utf8')
    })

    it('should throw ValidationError if the content is not a string', () => {
      expect(() => writeFile(filePath, 123 as any)).toThrow(ValidationError)
    })
  })

  describe('deleteFile', () => {
    it('should delete a file', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      deleteFile(filePath)
      expect(fs.unlinkSync).toHaveBeenCalledWith(filePath)
    })

    it('should throw NotFoundError if the file does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      expect(() => deleteFile(filePath)).toThrow(NotFoundError)
    })
  })

  describe('createDirectory', () => {
    it('should create a directory if it does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      createDirectory(dirPath)
      expect(fs.mkdirSync).toHaveBeenCalledWith(dirPath, { recursive: true })
    })

    it('should not create a directory if it already exists', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      createDirectory(dirPath)
      expect(fs.mkdirSync).not.toHaveBeenCalled()
    })
  })

  describe('exists', () => {
    it('should return true if a file or directory exists', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      const result = exists(filePath)
      expect(result).toBe(true)
    })

    it('should return false if a file or directory does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      const result = exists(filePath)
      expect(result).toBe(false)
    })
  })

  describe('joinPath', () => {
    it('should join multiple path segments into a single path', () => {
      const result = joinPath('dir', 'subdir', 'file.txt')
      expect(result).toBe(path.join('dir', 'subdir', 'file.txt'))
    })
  })

  describe('getDirName', () => {
    it('should get the directory name of a file path', () => {
      const result = getDirName('/path/to/file.txt')
      expect(result).toBe(path.dirname('/path/to/file.txt'))
    })
  })

  describe('copyFile', () => {
    it('should copy a file from one location to another', () => {
      const srcPath = 'src.txt'
      const destPath = 'dest.txt'
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      copyFile(srcPath, destPath)
      expect(fs.copyFileSync).toHaveBeenCalledWith(srcPath, destPath)
    })

    it('should throw NotFoundError if the source file does not exist', () => {
      const srcPath = 'src.txt'
      const destPath = 'dest.txt'
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      expect(() => copyFile(srcPath, destPath)).toThrow(NotFoundError)
    })
  })

  describe('moveFile', () => {
    it('should move a file from one location to another', () => {
      const srcPath = 'src.txt'
      const destPath = 'dest.txt'
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      moveFile(srcPath, destPath)
      expect(fs.renameSync).toHaveBeenCalledWith(srcPath, destPath)
    })

    it('should throw NotFoundError if the source file does not exist', () => {
      const srcPath = 'src.txt'
      const destPath = 'dest.txt'
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      expect(() => moveFile(srcPath, destPath)).toThrow(NotFoundError)
    })
  })

  describe('readDirectory', () => {
    it('should read the content of a directory', () => {
      const files = ['file1.txt', 'file2.txt']
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readdirSync as jest.Mock).mockReturnValue(files)

      const result = readDirectory(dirPath)
      expect(result).toEqual(files)
      expect(fs.existsSync).toHaveBeenCalledWith(dirPath)
      expect(fs.readdirSync).toHaveBeenCalledWith(dirPath)
    })

    it('should throw NotFoundError if the directory does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)

      expect(() => readDirectory(dirPath)).toThrow(NotFoundError)
      expect(fs.existsSync).toHaveBeenCalledWith(dirPath)
    })
  })

  describe('getStats', () => {
    it('should get the stats of a file or directory', () => {
      const stats = {} as fs.Stats
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.statSync as jest.Mock).mockReturnValue(stats)

      const result = getStats(filePath)
      expect(result).toBe(stats)
      expect(fs.existsSync).toHaveBeenCalledWith(filePath)
      expect(fs.statSync).toHaveBeenCalledWith(filePath)
    })

    it('should throw NotFoundError if the file or directory does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)

      expect(() => getStats(filePath)).toThrow(NotFoundError)
      expect(fs.existsSync).toHaveBeenCalledWith(filePath)
    })
  })
})
