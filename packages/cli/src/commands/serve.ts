import { Command } from 'commander';
import { startServer } from '../server/index.js';
import { detectPackages, DetectedPackage } from '../detection/index.js';
import { fetchDocumentation } from '../server/documentation.js';
import chalk from 'chalk';

export const serveCommand = new Command('serve')
  .description('Start the documentation server')
  .option('-p, --port <number>', 'Port to run the server on', '2803')
  .action(async (options) => {
    console.log(chalk.blue('→ Scanning package.json...'));
    const packages = await detectPackages();
    
    if (packages.length === 0) {
      console.log(chalk.yellow('⚠️ No supported packages detected.'));
    } else {
      console.log(chalk.green('→ Detected frameworks:'));
      packages.forEach((pkg: DetectedPackage) => {
        console.log(chalk.green(`  - ${pkg.name}:${pkg.version}`));
      });
      
      console.log(chalk.blue('→ Pulling documentation for detected frameworks...'));
      
      // Pull documentation for each package
      const results = await Promise.allSettled(
        packages.map(async (pkg: DetectedPackage) => {
          try {
            await fetchDocumentation(pkg.name, pkg.version);
            return { package: pkg.name, version: pkg.version, success: true };
          } catch (error) {
            return { 
              package: pkg.name, 
              version: pkg.version, 
              success: false, 
              error: error instanceof Error ? error.message : String(error)
            };
          }
        })
      );
      
      // Report on the documentation pulling results
      const successful = results.filter((result: any) => 
        result.status === 'fulfilled' && result.value.success
      );
      
      const failed = results.filter((result: any) => 
        result.status === 'fulfilled' && !result.value.success
      );
      
      if (successful.length > 0) {
        console.log(chalk.green('→ Documentation pulled successfully for:'));
        successful.forEach((result: any) => {
          if (result.status === 'fulfilled') {
            console.log(chalk.green(`  - ${result.value.package}@${result.value.version}`));
          }
        });
      }
      
      if (failed.length > 0) {
        console.log(chalk.yellow('⚠️ Failed to pull documentation for:'));
        failed.forEach((result: any) => {
          if (result.status === 'fulfilled') {
            console.log(chalk.yellow(`  - ${result.value.package}@${result.value.version}: ${result.value.error}`));
          }
        });
      }
      
      console.log(chalk.blue('→ API server running at') + chalk.cyan(` http://localhost:${options.port}/api`));
      console.log(chalk.blue('→ MCP server running at') + chalk.cyan(` http://localhost:${options.port}/mcp`));
    }
    
    // Start the server with the detected packages
    startServer(parseInt(options.port), packages);
  });
