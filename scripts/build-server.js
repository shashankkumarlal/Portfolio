#!/usr/bin/env node
import { existsSync, mkdirSync, cpSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

console.log('Building server...');

// Create api directory
const apiDir = join(root, 'api');
if (!existsSync(apiDir)) {
  mkdirSync(apiDir, { recursive: true });
}

// Copy server files
const serverDir = join(root, 'server');
if (existsSync(serverDir)) {
  cpSync(serverDir, apiDir, { recursive: true });
  console.log('✓ Copied server files');
}

// Copy shared files
const sharedDir = join(root, 'shared');
if (existsSync(sharedDir)) {
  cpSync(sharedDir, join(apiDir, 'shared'), { recursive: true });
  console.log('✓ Copied shared files');
}

console.log('✓ Server build complete');
