#!/usr/bin/env node
import { existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

console.log('Cleaning build directories...');

const dirsToClean = [
  join(root, 'api'),
  join(root, 'dist'),
  join(root, 'client', 'dist'),
  join(root, 'client', 'node_modules', '.vite')
];

dirsToClean.forEach(dir => {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`✓ Cleaned ${dir}`);
  }
});

console.log('✓ Clean complete');
