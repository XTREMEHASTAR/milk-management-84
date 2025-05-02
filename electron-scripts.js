
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute shell commands and display output
function runCommand(command) {
  console.log(`\n> ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Create directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Execute the appropriate command based on arguments
switch (command) {
  case 'start':
    // Start both Vite dev server and Electron
    runCommand('concurrently "vite" "cross-env NODE_ENV=development electron electron/main.js"');
    break;

  case 'build':
    // Build for all platforms
    console.log('Building for all supported platforms...');
    runCommand('vite build');
    runCommand('electron-builder build --win --mac --linux');
    break;

  case 'build-win':
    // Build for Windows
    console.log('Building for Windows...');
    runCommand('vite build');
    runCommand('electron-builder build --win');
    break;

  case 'build-mac':
    // Build for macOS
    console.log('Building for macOS...');
    runCommand('vite build');
    runCommand('electron-builder build --mac');
    break;

  case 'build-linux':
    // Build for Linux
    console.log('Building for Linux...');
    runCommand('vite build');
    runCommand('electron-builder build --linux');
    break;

  case 'dev':
    // For development only
    runCommand('vite build');
    runCommand('cross-env NODE_ENV=development electron electron/main.js');
    break;

  default:
    console.log(`
Electron build script for Milk Center Management
Usage: node electron-scripts.js [command]

Commands:
  start       Start both Vite dev server and Electron for development
  build       Build for all platforms
  build-win   Build for Windows
  build-mac   Build for macOS
  build-linux Build for Linux
  dev         Build once and start Electron (for testing)
`);
}
