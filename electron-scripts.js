
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the electron directory exists
if (!fs.existsSync('electron')) {
  fs.mkdirSync('electron');
}

// Ensure build-resources directory exists for icons
if (!fs.existsSync('build-resources')) {
  fs.mkdirSync('build-resources');
}

// For Windows builds, ensure we have icon files
const ensureIconFile = () => {
  const iconPath = path.join(__dirname, 'public', 'icon-512x512.png');
  const buildResourcesIconPath = path.join(__dirname, 'build-resources', 'icon.png');
  
  // If the source icon exists, copy it to build-resources
  if (fs.existsSync(iconPath)) {
    try {
      fs.copyFileSync(iconPath, buildResourcesIconPath);
      console.log('Copied icon to build resources');
    } catch (err) {
      console.error('Error copying icon to build resources:', err);
    }
  } else {
    console.warn('Warning: No icon file found at', iconPath);
    console.warn('Using a placeholder icon for the build');
    
    // Create a simple placeholder if it doesn't exist
    try {
      // Copy a placeholder if it exists
      const possiblePlaceholders = ['public/placeholder.svg', 'public/favicon.ico'];
      for (const placeholder of possiblePlaceholders) {
        if (fs.existsSync(placeholder)) {
          fs.copyFileSync(placeholder, iconPath);
          fs.copyFileSync(placeholder, buildResourcesIconPath);
          console.log('Created placeholder icon from', placeholder);
          return;
        }
      }
    } catch (err) {
      console.error('Error creating placeholder icon:', err);
    }
  }
};

// Add the needed packages
const ensurePackages = () => {
  try {
    console.log('Checking required packages for desktop app...');
    const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const missingDevDeps = [];
    
    // Check if electron-updater is installed
    const devDeps = packageInfo.devDependencies || {};
    if (!devDeps['electron-updater']) {
      missingDevDeps.push('electron-updater');
    }
    if (!devDeps['electron-log']) {
      missingDevDeps.push('electron-log');
    }
    
    // Install missing packages
    if (missingDevDeps.length > 0) {
      console.log(`Installing missing packages: ${missingDevDeps.join(', ')}`);
      execSync(`npm install -D ${missingDevDeps.join(' ')}`, { stdio: 'inherit' });
      console.log('Packages installed successfully!');
    } else {
      console.log('All required packages are installed.');
    }
  } catch (error) {
    console.error('Error checking or installing packages:', error);
  }
};

const commands = {
  'start-electron': async () => {
    try {
      console.log('Starting Electron development environment...');
      ensurePackages();
      execSync('concurrently "cross-env BROWSER=none npm run dev" "wait-on http://localhost:8080 && cross-env NODE_ENV=development electron electron/main.js"', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error starting Electron development environment:', error);
      process.exit(1);
    }
  },

  'build-electron': async () => {
    try {
      console.log('Building for Electron...');
      ensurePackages();
      ensureIconFile();
      // First build the React app
      execSync('npm run build', { stdio: 'inherit' });
      // Then build the Electron app
      execSync('electron-builder --config electron-builder.json', { stdio: 'inherit' });
      console.log('Electron build completed successfully!');
      console.log('Your installable application is available in the dist_electron directory');
    } catch (error) {
      console.error('Error building Electron app:', error);
      process.exit(1);
    }
  },

  'package-windows': async () => {
    try {
      console.log('Packaging for Windows...');
      ensurePackages();
      ensureIconFile();
      execSync('npm run build', { stdio: 'inherit' });
      execSync('electron-builder --win --config electron-builder.json', { stdio: 'inherit' });
      console.log('Windows packaging completed successfully!');
      console.log('Your Windows installation package is available in the dist_electron directory');
    } catch (error) {
      console.error('Error packaging for Windows:', error);
      process.exit(1);
    }
  },

  'package-mac': async () => {
    try {
      console.log('Packaging for macOS...');
      ensurePackages();
      ensureIconFile();
      execSync('npm run build', { stdio: 'inherit' });
      execSync('electron-builder --mac --config electron-builder.json', { stdio: 'inherit' });
      console.log('macOS packaging completed successfully!');
      console.log('Your macOS application bundle is available in the dist_electron directory');
    } catch (error) {
      console.error('Error packaging for macOS:', error);
      process.exit(1);
    }
  },

  'package-linux': async () => {
    try {
      console.log('Packaging for Linux...');
      ensurePackages();
      ensureIconFile();
      execSync('npm run build', { stdio: 'inherit' });
      execSync('electron-builder --linux --config electron-builder.json', { stdio: 'inherit' });
      console.log('Linux packaging completed successfully!');
      console.log('Your Linux packages are available in the dist_electron directory');
    } catch (error) {
      console.error('Error packaging for Linux:', error);
      process.exit(1);
    }
  },

  'publish-update': async () => {
    try {
      console.log('Building and publishing update...');
      ensurePackages();
      ensureIconFile();
      execSync('npm run build', { stdio: 'inherit' });
      execSync('electron-builder --publish always --config electron-builder.json', { stdio: 'inherit' });
      console.log('Update published successfully!');
    } catch (error) {
      console.error('Error publishing update:', error);
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
