import * as path from 'path'
import * as fs from 'fs'

interface PackageJson {
  name: string
  version: string
}

function getPackageJson(): PackageJson {
  // Adjust the path to point to the main application's package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  return {
    name: packageJson.name || 'unknown-application',
    version: packageJson.version || '0.0.0'
  }
}

const { name, version } = getPackageJson()

export { name as appName, version as appVersion }
