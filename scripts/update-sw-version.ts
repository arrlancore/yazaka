import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Updates service worker cache version to current package.json version + build timestamp
 * This ensures cache updates work properly in production deployments
 */
function updateServiceWorkerVersion() {
  try {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const swPath = join(process.cwd(), 'public', 'sw.js');

    // Read current package.json version
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const appVersion = packageJson.version;
    
    // Generate version with timestamp for unique builds
    const buildTimestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    const cacheVersion = `${appVersion}.${buildTimestamp}`;

    // Read service worker file
    const swContent = readFileSync(swPath, 'utf-8');

    // Update cache version
    const updatedContent = swContent.replace(
      /const CACHE_VERSION = '[^']*';/,
      `const CACHE_VERSION = '${cacheVersion}';`
    );

    // Write updated service worker
    writeFileSync(swPath, updatedContent);

    console.log(`✅ Service Worker cache version updated to: ${cacheVersion}`);
    console.log(`📦 App version: ${appVersion}`);
    console.log(`🏗️ Build timestamp: ${buildTimestamp}`);

  } catch (error) {
    console.error('❌ Error updating service worker version:', error);
    process.exit(1);
  }
}

updateServiceWorkerVersion();