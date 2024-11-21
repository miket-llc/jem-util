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
  getStats,
  readJsonFile,
  writeJsonFile,
  appendToFile,
  listFilesInDirectory,
  copyDirectory,
  moveDirectory,
  deleteDirectory
} from '../src/file'
import { NotFoundError, ValidationError, AppError } from '../src/error'
import * as fs from 'fs'
import * as path from 'path'

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
  renameSync: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn(),
  appendFileSync: jest.fn(),
  promises: {
    access: jest.fn(),
    mkdir: jest.fn(),
    readdir: jest.fn(),
    stat: jest.fn(),
    copyFile: jest.fn()
  }
}))

describe('fileUtils', () => {
  const filePath = 'test.txt'
  const dirPath = 'testDir'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Sync operations tests
  describe('readFile', () => {
    it('should read the content of a file', () => {
      const content = 'test content'
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readFileSync as jest.Mock).mockReturnValue(content)

      expect(readFile(filePath)).toBe(content)
      expect(fs.existsSync).toHaveBeenCalledWith(filePath)
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8')
    })

    it('should throw NotFoundError if file does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)
      expect(() => readFile(filePath)).toThrow(NotFoundError)
    })
  })

  describe('writeFile', () => {
    it('should write content to file', () => {
      const content = 'test content'
      writeFile(filePath, content)
      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, content, 'utf8')
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

  describe('readJsonFile', () => {
    it('should read and parse a JSON file', () => {
      const jsonContent = { key: 'value' }
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(jsonContent))

      const result = readJsonFile(filePath)
      expect(result).toEqual(jsonContent)
    })

    it('should throw NotFoundError if the JSON file does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)

      expect(() => readJsonFile(filePath)).toThrow(NotFoundError)
    })

    it('should throw ValidationError if the JSON content is invalid', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readFileSync as jest.Mock).mockReturnValue('invalid json')

      expect(() => readJsonFile(filePath)).toThrow(ValidationError)
    })
  })

  describe('writeJsonFile', () => {
    it('should write an object to a JSON file', () => {
      const jsonContent = { key: 'value' }
      writeJsonFile(filePath, jsonContent)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(jsonContent, null, 2),
        'utf8'
      )
    })

    it('should throw ValidationError if the data cannot be serialized to JSON', () => {
      const circularReference: any = {}
      circularReference.myself = circularReference

      expect(() => writeJsonFile(filePath, circularReference)).toThrow(ValidationError)
    })
  })

  describe('appendToFile', () => {
    it('should append content to a file', () => {
      const content = 'Hello, world!'
      appendToFile(filePath, content)
      expect(fs.appendFileSync).toHaveBeenCalledWith(filePath, content, 'utf8')
    })

    it('should throw ValidationError if the content is not a string', () => {
      expect(() => appendToFile(filePath, 123 as any)).toThrow(ValidationError)
    })
  })

  describe('listFilesInDirectory', () => {
    it('should list all files in a directory', () => {
      const files = ['file1.txt', 'file2.txt', 'subdir']
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readdirSync as jest.Mock).mockReturnValue(files)
      ;(fs.statSync as jest.Mock).mockImplementation((filePath: string) => ({
        isFile: () => !filePath.includes('subdir')
      }))

      const result = listFilesInDirectory(dirPath)
      expect(result).toEqual(['file1.txt', 'file2.txt'])
    })

    it('should throw NotFoundError if the directory does not exist', () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(false)

      expect(() => listFilesInDirectory(dirPath)).toThrow(NotFoundError)
    })
  })

  // Async operations tests
  describe('copyDirectory', () => {
    it('should recursively copy a directory', async () => {
      const srcDir = 'srcDir'
      const destDir = 'destDir'
      const files = ['file1.txt', 'file2.txt', 'subdir']
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readdirSync as jest.Mock).mockReturnValue(files)
      ;(fs.statSync as jest.Mock).mockImplementation((filePath: string) => ({
        isDirectory: () => filePath.includes('subdir')
      }))
      ;(fs.promises.access as jest.Mock).mockResolvedValue(undefined)
      ;(fs.promises.mkdir as jest.Mock).mockResolvedValue(undefined)
      ;(fs.promises.readdir as jest.Mock).mockResolvedValue(files)
      ;(fs.promises.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false })
      ;(fs.promises.copyFile as jest.Mock).mockResolvedValue(undefined)

      await copyDirectory(srcDir, destDir)
      expect(fs.promises.access).toHaveBeenCalledWith(srcDir)
      expect(fs.promises.mkdir).toHaveBeenCalledWith(destDir, { recursive: true })
      expect(fs.promises.readdir).toHaveBeenCalledWith(srcDir)
      files.forEach((file) => {
        expect(fs.promises.copyFile).toHaveBeenCalledWith(
          path.join(srcDir, file),
          path.join(destDir, file)
        )
      })
    })

    it('should throw NotFoundError if the source directory does not exist', async () => {
      ;(fs.promises.access as jest.Mock).mockRejectedValue(new Error())
      await expect(copyDirectory('srcDir', 'destDir')).rejects.toThrow(NotFoundError)
    })
  })

  describe('moveDirectory', () => {
    it('should recursively move a directory', async () => {
      const srcDir = 'srcDir'
      const destDir = 'destDir'
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readdirSync as jest.Mock).mockReturnValue([])
      ;(fs.statSync as jest.Mock).mockImplementation(() => ({
        isDirectory: () => true
      }))
      ;(fs.promises.access as jest.Mock).mockResolvedValue(undefined)
      ;(fs.promises.mkdir as jest.Mock).mockResolvedValue(undefined)
      ;(fs.promises.readdir as jest.Mock).mockResolvedValue([])
      ;(fs.promises.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false })
      ;(fs.promises.copyFile as jest.Mock).mockResolvedValue(undefined)

      await moveDirectory(srcDir, destDir)
      expect(fs.promises.access).toHaveBeenCalledWith(srcDir)
      expect(fs.promises.mkdir).toHaveBeenCalledWith(destDir, { recursive: true })
      expect(fs.promises.readdir).toHaveBeenCalledWith(srcDir)
      expect(fs.promises.copyFile).toHaveBeenCalledTimes(0)
      expect(fs.promises.stat).toHaveBeenCalledTimes(0)
    })

    it('should throw NotFoundError if the source directory does not exist', async () => {
      ;(fs.promises.access as jest.Mock).mockRejectedValue(new Error())
      await expect(moveDirectory('srcDir', 'destDir')).rejects.toThrow(NotFoundError)
    })
  })

  describe('deleteDirectory', () => {
    it('should recursively delete a directory', async () => {
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)
      ;(fs.promises.access as jest.Mock).mockResolvedValue(undefined)
      await deleteDirectory(dirPath)
      expect(fs.promises.access).toHaveBeenCalledWith(dirPath)
    })

    it('should throw NotFoundError if the directory does not exist', async () => {
      ;(fs.promises.access as jest.Mock).mockRejectedValue(new Error())
      await expect(deleteDirectory(dirPath)).rejects.toThrow(NotFoundError)
    })
  })
})
