// PWA Service Worker Registration and Install Prompt

// Manifest JSON as inline data - will be dynamically injected
const manifestData = {
  "name": "AlgoDash - AI-Powered Business Intelligence",
  "short_name": "AlgoDash",
  "description": "Transform Your Data Into Insights - AI-Powered Dashboard Analytics",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#00d9ff",
  "orientation": "any",
  "scope": "./",
  "icons": [
    {
      "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect width='192' height='192' fill='%23000000'/><text x='96' y='120' font-size='80' text-anchor='middle' fill='%2300d9ff' font-family='Arial, sans-serif' font-weight='bold'>AD</text></svg>",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' fill='%23000000'/><text x='256' y='320' font-size='200' text-anchor='middle' fill='%2300d9ff' font-family='Arial, sans-serif' font-weight='bold'>AD</text></svg>",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "categories": ["business", "productivity", "finance"],
  "screenshots": [
    {
      "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'><rect width='1280' height='720' fill='%23000000'/><text x='640' y='360' font-size='48' text-anchor='middle' fill='%2300d9ff' font-family='Arial'>AlgoDash Dashboard</text></svg>",
      "sizes": "1280x720",
      "type": "image/svg+xml"
    }
  ]
};

// Create manifest blob URL and inject it
const manifestBlob = new Blob([JSON.stringify(manifestData)], { type: 'application/json' });
const manifestURL = URL.createObjectURL(manifestBlob);
const manifestLink = document.getElementById('manifest-placeholder');
if (manifestLink) {
  manifestLink.href = manifestURL;
}

// Install prompt state
let deferredPrompt;

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('✅ ServiceWorker registered:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch(err => {
        console.log('❌ ServiceWorker registration failed:', err);
      });
  });
}

// Capture install prompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show custom install banner
  showInstallBanner();
});

// Show install banner
function showInstallBanner() {
  // Check if banner already exists
  if (document.getElementById('install-banner')) {
    return;
  }
  
  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #00d9ff, #a855f7);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 0 30px rgba(0, 217, 255, 0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 16px;
    animation: slideUp 0.3s ease;
    max-width: 90%;
    flex-wrap: wrap;
  `;
  
  banner.innerHTML = `
    <span style="font-size: 24px;">📱</span>
    <div style="flex: 1; min-width: 200px;">
      <div style="font-weight: 600; margin-bottom: 4px;">Install AlgoDash</div>
      <div style="font-size: 13px; opacity: 0.9;">Add to your home screen for quick access</div>
    </div>
    <button id="install-btn" style="
      background: white;
      color: #000;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    ">Install</button>
    <button id="close-banner" style="
      background: transparent;
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 0 8px;
      line-height: 1;
    ">×</button>
  `;
  
  document.body.appendChild(banner);
  
  document.getElementById('install-btn').addEventListener('click', installApp);
  document.getElementById('close-banner').addEventListener('click', () => {
    banner.remove();
  });
}

// Install app function
function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }
      deferredPrompt = null;
      const banner = document.getElementById('install-banner');
      if (banner) banner.remove();
    });
  }
}

// Track when app is installed
window.addEventListener('appinstalled', () => {
  console.log('✅ AlgoDash installed successfully');
  const banner = document.getElementById('install-banner');
  if (banner) banner.remove();
  showToast('🎉 AlgoDash installed successfully!', 'success');
});

// Online/Offline status
window.addEventListener('online', () => {
  showToast('✅ Back online', 'success');
});

window.addEventListener('offline', () => {
  showToast('⚠️ You are offline - some features may be limited', 'warning');
});

// Toast notification function
function showToast(message, type) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#00ff88' : type === 'warning' ? '#fbbf24' : '#00d9ff'};
    color: ${type === 'success' ? '#000' : type === 'warning' ? '#000' : '#fff'};
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    max-width: 300px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Update notification
function showUpdateNotification() {
  // Check if notification already exists
  if (document.getElementById('update-notification')) {
    return;
  }
  
  const notification = document.createElement('div');
  notification.id = 'update-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #a855f7;
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease;
    max-width: 90%;
  `;
  
  notification.innerHTML = `
    <span style="font-size: 20px;">🎉</span>
    <span>New version available!</span>
    <button onclick="window.location.reload()" style="
      background: white;
      color: #a855f7;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    ">Update Now</button>
  `;
  
  document.body.appendChild(notification);
}

// Log PWA status
console.log('🚀 AlgoDash PWA initialized');
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✅ Running as installed PWA');
} else {
  console.log('🌐 Running in browser mode');
}
