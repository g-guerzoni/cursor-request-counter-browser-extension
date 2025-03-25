#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting build process...');

try {
  console.log('Cleaning dist directory...');
  execSync('rm -rf dist', { stdio: 'inherit' });

  console.log('Compiling TypeScript...');
  execSync('tsc', { stdio: 'inherit' });

  console.log('Creating directories...');
  execSync('mkdir -p dist/icons dist/bundles', { stdio: 'inherit' });

  console.log('Copying assets...');
  execSync('cp -r src/icons/* dist/icons/', { stdio: 'inherit' });
  execSync('cp src/popup.html dist/', { stdio: 'inherit' });
  execSync('cp manifest.json dist/', { stdio: 'inherit' });

  console.log('Bundling with webpack...');
  execSync('npx webpack', { stdio: 'inherit' });

  console.log('Updating HTML references...');
  execSync('node scripts/update-html.js', { stdio: 'inherit' });

  console.log('Cleaning up...');
  execSync('node scripts/cleanup.js', { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 