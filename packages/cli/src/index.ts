#!/usr/bin/env node
import { Command } from 'commander';
import { serveCommand } from './commands/serve.js';
import { detectCommand } from './commands/detect.js';
import { pullCommand } from './commands/pull.js';

const program = new Command();

program
  .name('odocs')
  .description('Solving version blindness in AI-assisted development')
  .version('0.1.0');

program.addCommand(serveCommand);
program.addCommand(detectCommand);
program.addCommand(pullCommand);

program.parse();
