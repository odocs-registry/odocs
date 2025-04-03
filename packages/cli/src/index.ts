#!/usr/bin/env node
import { Command } from 'commander';
import { serveCommand } from './commands/serve.js';
import { detectCommand } from './commands/detect.js';
import { pullCommand } from './commands/pull.js';

const program = new Command();

program
  .name('odocs')
  .description('Version-aware documentation tool for AI code generation')
  .version('0.1.0');

program.addCommand(serveCommand);
program.addCommand(detectCommand);
program.addCommand(pullCommand);

program.parse();
