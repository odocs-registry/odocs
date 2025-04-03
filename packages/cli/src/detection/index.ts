import * as fs from 'fs/promises';
import * as path from 'path';

export interface DetectedPackage {
  name: string;
  version: string;
  installedPath: string;
}

export async function detectPackages(): Promise<DetectedPackage[]> {
  try {
    // Read package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    
    const detectedPackages: DetectedPackage[] = [];
    
    // Check dependencies
    const dependencies = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {})
    };
    
    for (const [name, versionSpec] of Object.entries(dependencies)) {
      // For simplicity, just handle packages we support in the prototype
      if (['hono', 'next', 'react'].includes(name)) {
        // Try to find the actual installed version
        try {
          const installedPackageJsonPath = path.join(
            process.cwd(), 
            'node_modules', 
            name, 
            'package.json'
          );
          const installedPackageJson = JSON.parse(
            await fs.readFile(installedPackageJsonPath, 'utf-8')
          );
          
          detectedPackages.push({
            name,
            version: installedPackageJson.version,
            installedPath: path.join(process.cwd(), 'node_modules', name)
          });
        } catch (error) {
          console.warn(`Package ${name} is in package.json but not installed`);
        }
      }
    }
    
    return detectedPackages;
  } catch (error) {
    console.error('Error detecting packages:', error);
    return [];
  }
}
