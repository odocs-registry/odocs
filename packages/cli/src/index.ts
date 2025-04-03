#!/usr/bin/env node
import { Command } from 'commander';
import { serveCommand } from './commands/serve.js';
import { detectCommand } from './commands/detect.js';
import { pullCommand } from './commands/pull.js';
import { VERSION } from './version.js';

const program = new Command();

program
  .name('odocs')
  .description('Solving version blindness in AI-assisted development')
  .version(VERSION);

program.addCommand(serveCommand);
program.addCommand(detectCommand);
program.addCommand(pullCommand);

program.parse();
