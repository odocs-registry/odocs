import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

// For development, use local path to the docs repository
const REPO_BASE_PATH = path.resolve(process.cwd(), '..', 'docs-repository', 'packages');
// Fallback to the project's own docs directory if above path doesn't exist
const FALLBACK_PATH = path.resolve(process.cwd(), '..', '..', 'packages', 'docs-repository', 'packages');

// Local cache directory
const CACHE_DIR = path.join(os.homedir(), '.odocs', 'cache');

export async function fetchDocumentation(packageName: string, version: string) {
  // Create cache directory if it doesn't exist
  await fs.mkdir(CACHE_DIR, { recursive: true });
  
  const cacheFilePath = path.join(CACHE_DIR, `${packageName}-${version}.json`);
  
  // In dev mode, ignore cache and always serve from local files
  // Determine the base path to use
  let basePath = REPO_BASE_PATH;
  try {
    await fs.access(basePath);
  } catch (error) {
    // If the first path doesn't exist, try the fallback
    basePath = FALLBACK_PATH;
    try {
      await fs.access(basePath);
    } catch (error) {
      throw new Error(`Could not find local documentation path. Expected at ${REPO_BASE_PATH} or ${FALLBACK_PATH}`);
    }
  }
  
  // If version is "latest", we need to look up the actual version
  let resolvedVersion = version;
  if (version === 'latest') {
    try {
      const latestFilePath = path.join(basePath, packageName, 'latest.json');
      const latestFileContent = await fs.readFile(latestFilePath, 'utf-8');
      const latestData = JSON.parse(latestFileContent);
      resolvedVersion = latestData.version;
    } catch (error) {
      throw new Error(`Could not resolve latest version for ${packageName}. Make sure latest.json exists in the package directory.`);
    }
  }
  
  // Fetch documentation from local file
  try {
    const docFilePath = path.join(basePath, packageName, resolvedVersion, 'documentation.md');
    const content = await fs.readFile(docFilePath, 'utf-8');
    
    const documentation = {
      package: packageName,
      version: resolvedVersion,
      content
    };
    
    // Save to cache (even though we're ignoring it in dev mode, useful for reference)
    await fs.writeFile(cacheFilePath, JSON.stringify(documentation));
    
    return documentation;
  } catch (error) {
    throw new Error(`Documentation not found for ${packageName}@${version} at ${path.join(basePath, packageName, resolvedVersion, 'documentation.md')}`);
  }
}
