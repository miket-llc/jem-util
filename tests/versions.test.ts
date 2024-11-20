// jem-util/tests/unit/versions.test.ts
import { jest, describe, it, expect, beforeAll } from '@jest/globals'
import * as path from 'path'
import * as fs from 'fs'

jest.mock('fs')

describe('versions module', () => {
  const mockPackageJson = {
    name: 'test-application',
    version: '1.0.0'
  }

  beforeAll(() => {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    ;(fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockPackageJson))
  })

  it('should return the correct application name', () => {
    const { appName } = require('@/versions')
    expect(appName).toBe('test-application')
  })

  it('should return the correct application version', () => {
    const { appVersion } = require('@/versions')
    expect(appVersion).toBe('1.0.0')
  })
})
