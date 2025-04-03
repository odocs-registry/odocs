import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import chalk from 'chalk';

// GitHub repository URL for fetching documentation
const BASE_URL = 'https://raw.githubusercontent.com/odocs-registry/odocs/main/packages/docs-repository/packages';

// Local cache directory
const CACHE_DIR = path.join(os.homedir(), '.odocs', 'cache');

export async function fetchDocumentation(packageName: string, version: string) {
  // Create cache directory if it doesn't exist
  await fs.mkdir(CACHE_DIR, { recursive: true });
  
  const cacheFilePath = path.join(CACHE_DIR, `${packageName}-${version}.json`);
  
  // Check if documentation is in cache and not expired
  try {
    const cacheStats = await fs.stat(cacheFilePath);
    const cacheTime = new Date(cacheStats.mtime);
    const now = new Date();
    const cacheAgeInDays = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60 * 24);
    
    // Cache is valid for 7 days
    if (cacheAgeInDays < 7) {
      console.log(chalk.blue(`→ Using cached documentation for ${chalk.cyan(packageName)}@${chalk.cyan(version)}`));
      const cachedContent = await fs.readFile(cacheFilePath, 'utf-8');
      return JSON.parse(cachedContent);
    }
  } catch (error) {
    // Cache miss, continue to fetch
  }
  
  // If version is "latest", we need to look up the actual version
  let resolvedVersion = version;
  if (version === 'latest') {
    try {
      console.log(chalk.blue(`→ Resolving latest version for ${chalk.cyan(packageName)}`));
      const latestVersionResponse = await axios.get(
        `${BASE_URL}/${packageName}/latest.json`
      );
      resolvedVersion = latestVersionResponse.data.version;
      console.log(chalk.blue(`→ Latest version resolved to ${chalk.cyan(resolvedVersion)}`));
    } catch (error) {
      throw new Error(`Could not resolve latest version for ${packageName}`);
    }
  }
  
  // Fetch documentation from GitHub
  try {
    console.log(chalk.blue(`→ Fetching documentation for ${chalk.cyan(packageName)}@${chalk.cyan(resolvedVersion)} from GitHub`));
    const response = await axios.get(
      `${BASE_URL}/${packageName}/${resolvedVersion}/documentation.md`
    );
    
    const documentation = {
      package: packageName,
      version: resolvedVersion,
      content: response.data
    };
    
    // Save to cache
    await fs.writeFile(cacheFilePath, JSON.stringify(documentation));
    
    console.log(chalk.green(`→ Documentation for ${packageName}@${resolvedVersion} fetched and cached successfully`));
    return documentation;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(chalk.red(`✖ Documentation not found for ${packageName}@${version} (HTTP ${error.response.status})`));
      throw new Error(`Documentation not found for ${packageName}@${version} (HTTP ${error.response.status})`);
    } else {
      console.error(chalk.red(`✖ Error fetching documentation for ${packageName}@${version}: ${error instanceof Error ? error.message : String(error)}`));
      throw new Error(`Error fetching documentation for ${packageName}@${version}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
