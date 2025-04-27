
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the electron directory exists
if (!fs.existsSync('electron')) {
  fs.mkdirSync('electron');
}

const commands = {
  'start-electron': async () => {
    try {
      console.log('Starting Electron development environment...');
      execSync('concurrently "cross-env BROWSER=none npm run dev" "wait-on http://localhost:8080 && cross-env NODE_ENV=development electron electron/main.js"', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error starting Electron development environment:', error);
      process.exit(1);
    }
  },

  'build-electron': async () => {
    try {
      console.log('Building for Electron...');
      // First build the React app
      execSync('npm run build', { stdio: 'inherit' });
      // Then build the Electron app
      execSync('electron-builder --config electron-builder.json', { stdio: 'inherit' });
      console.log('Electron build completed successfully!');
    } catch (error) {
      console.error('Error building Electron app:', error);
      process.exit(1);
    }
  },

  'package-windows': async () => {
    try {
      console.log('Packaging for Windows...');
      execSync('npm run build', { stdio: 'inherit' });
      execSync('electron-builder --win --config electron-builder.json', { stdio: 'inherit' });
      console.log('Windows packaging completed successfully!');
    } catch (error) {
      console.error('Error packaging for Windows:', error);
      process.exit(1);
    }
  },

  'package-mac': async () => {
    try {
      console.log('Packaging for macOS...');
      execSync('npm run build', { stdio: 'inherit' });
      execSync('electron-builder --mac --config electron-builder.json', { stdio: 'inherit' });
      console.log('macOS packaging completed successfully!');
    } catch (error) {
      console.error('Error packaging for macOS:', error);
      process.exit(1);
    }
  },

  'package-linux': async () => {
    try {
      console.log('Packaging for Linux...');
      execSync('npm run build', { stdio: 'inherit' });
      execSync('electron-builder --linux --config electron-builder.json', { stdio: 'inherit' });
      console.log('Linux packaging completed successfully!');
    } catch (error) {
      console.error('Error packaging for Linux:', error);
      process.exit(1);
    }
  },
};

// Get the command from command line arguments
const command = process.argv[2];

if (commands[command]) {
  commands[command]();
} else {
  console.log('Available commands:');
  Object.keys(commands).forEach(cmd => console.log(`- ${cmd}`));
}
