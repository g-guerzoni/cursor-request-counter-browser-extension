#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '../dist');

try {
  console.log('Cleaning up unnecessary files...');
  
  execSync(
    'find dist -not -path "dist/bundles*" -not -path "dist/icons*" -not -name "popup.html" -not -name "manifest.json" -type f -delete',
    { stdio: 'inherit' }
  );
  
  execSync(
    'find dist -mindepth 1 -type d -empty -delete',
    { stdio: 'inherit' }
  );
  
  console.log('Cleanup completed successfully!');
} catch (error) {
  console.error('Error during cleanup:', error.message);
  process.exit(1);
} 