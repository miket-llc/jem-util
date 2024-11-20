import * as path from 'path'
import * as fs from 'fs'

/**
 * Represents the structure of a package.json file.
 */
interface PackageJson {
  name: string
  version: string
}

/**
 * Retrieves the package.json file of the main application and returns its name and version.
 *
 * @returns {PackageJson} An object containing the name and version of the application.
 *
 * @remarks
 * This function reads the package.json file located in the current working directory.
 * If the name or version fields are not present in the package.json, it defaults to 'unknown-application' and '0.0.0' respectively.
 *
 * @throws {Error} If the package.json file cannot be read or parsed.
 */
function getPackageJson(): PackageJson {
  // Adjust the path to point to the main application's package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  return {
    name: packageJson.name || 'unknown-application',
    version: packageJson.version || '0.0.0'
  }
}

/**
 * Extracts the `name` and `version` properties from the package.json file.
 *
 * @returns An object containing the `name` and `version` of the package.
 */
const { name, version } = getPackageJson()

/**
 * Exports the application name and version.
 *
 * @module versions
 * @exports appName - The name of the application.
 * @exports appVersion - The version of the application.
 */
export { name as appName, version as appVersion }
