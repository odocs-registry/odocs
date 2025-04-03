import { Command } from 'commander';
import { detectPackages } from '../detection/index.js';
import chalk from 'chalk';

export const detectCommand = new Command('detect')
  .description('Detect packages and versions in the current project')
  .action(async () => {
    console.log(chalk.blue('→ Scanning package.json...'));
    const packages = await detectPackages();
    
    if (packages.length === 0) {
      console.log(chalk.yellow('⚠️ No supported packages detected.'));
    } else {
      console.log(chalk.green('→ Detected frameworks:'));
      packages.forEach(pkg => {
        console.log(chalk.green(`  - ${pkg.name}:${pkg.version}`));
      });
    }
  });
