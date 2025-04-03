import { Command } from 'commander';
import { fetchDocumentation } from '../server/documentation.js';
import chalk from 'chalk';

export const pullCommand = new Command('pull')
  .description('Pull documentation for a package')
  .argument('<package>', 'Package name')
  .argument('[version]', 'Package version (defaults to latest)')
  .action(async (packageName, version) => {
    console.log(chalk.blue(`→ Pulling documentation for ${packageName}${version ? '@' + version : ' (latest)'}`));
    try {
      const doc = await fetchDocumentation(packageName, version || 'latest');
      console.log(chalk.green('→ Documentation fetched successfully'));
    } catch (error) {
      console.error(chalk.red('✖ Error fetching documentation:'), error instanceof Error ? error.message : String(error));
    }
  });
