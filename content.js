// ProxSec Content Script
// Injects a scope indicator into the page

// Logging helper
function log(message) {
  console.log(`[ProxSec] ${message}`);
}

log('Content script loaded');

// Create the indicator
function createIndicator() {
  log('Creating indicator');
  
  // Check if indicator already exists
  if (document.getElementById('proxsec-indicator')) {
    log('Indicator already exists');
    return document.getElementById('proxsec-indicator');
  }
  
  try {
    // Create the indicator element
    const indicator = document.createElement('div');
    indicator.id = 'proxsec-indicator';
    indicator.style.cssText = `
      position: fixed;
      left: 20px;
      top: 20px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #6b7280;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.9;
      transition: all 0.3s ease;
      font-family: sans-serif;
      font-size: 12px;
      color: white;
      font-weight: bold;
    `;
    
    // Add "P" text inside the indicator
    indicator.textContent = "P";
    
    // Add hover effect
    indicator.addEventListener('mouseenter', () => {
      indicator.style.opacity = '1';
      indicator.style.transform = 'scale(1.1)';
    });
    
    indicator.addEventListener('mouseleave', () => {
      indicator.style.opacity = '0.9';
      indicator.style.transform = 'scale(1)';
    });
    
    // Add tooltip
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      top: 40px;
      left: 0;
      background-color: #1f2937;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      min-width: 120px;
      text-align: center;
      z-index: 2147483647;
    `;
    tooltip.textContent = 'ProxSec: Checking...';
    
    indicator.appendChild(tooltip);
    
    // Show tooltip on hover
    indicator.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });
    
    indicator.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
    
    // Add click event to open popup
    indicator.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
    
    // Add to document
    document.body.appendChild(indicator);
    log('Indicator added to document');
    
    return indicator;
  } catch (error) {
    log(`Error creating indicator: ${error.message}`);
    return null;
  }
}

// Update indicator with scope information
function updateIndicator(inScope, programs = []) {
  log(`Updating indicator: inScope=${inScope}, programs=${JSON.stringify(programs)}`);
  
  // Find the indicator
  const indicator = document.getElementById('proxsec-indicator') || 
                   document.getElementById('proxsec-indicator-forced');
  
  if (!indicator) {
    log('Indicator not found, creating it');
    const newIndicator = createIndicator();
    if (!newIndicator) return;
    
    // Give it time to render before updating
    setTimeout(() => updateIndicator(inScope, programs), 100);
    return;
  }
  
  const tooltip = indicator.querySelector('div');
  
  if (inScope && programs && programs.length > 0) {
    indicator.style.backgroundColor = '#10b981'; // Green
    const programNames = Array.isArray(programs) 
      ? programs.map(p => typeof p === 'string' ? p : p.name).join(', ')
      : 'Unknown program';
    tooltip.textContent = `In scope for: ${programNames}`;
  } else {
    indicator.style.backgroundColor = '#ef4444'; // Red
    tooltip.textContent = 'Out of scope';
  }
  
  log('Indicator updated successfully');
}

// Initialize the indicator
function init() {
  log('Initializing content script');
  
  // Create indicator (it will start in a neutral color)
  createIndicator();
  
  // Send message to check if this URL is in scope
  chrome.runtime.sendMessage(
    { action: 'checkScope', url: window.location.href },
    (response) => {
      if (chrome.runtime.lastError) {
        log(`Error sending checkScope message: ${chrome.runtime.lastError.message}`);
        return;
      }
      
      if (response) {
        log(`Received scope response: ${JSON.stringify(response)}`);
        updateIndicator(response.inScope, response.programs);
      }
    }
  );
  
  // Periodically check if indicator still exists (pages might remove it)
  setInterval(() => {
    if (!document.getElementById('proxsec-indicator') && 
        !document.getElementById('proxsec-indicator-forced')) {
      log('Indicator removed, recreating');
      createIndicator();
    }
  }, 5000);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    log(`Received message: ${JSON.stringify(message)}`);
    
    if (message && message.action === 'updateScope') {
      updateIndicator(
        message.inScope === true, 
        Array.isArray(message.programs) ? message.programs : []
      );
      sendResponse({ success: true });
      return true;
    }
  } catch (error) {
    log(`Error processing message: ${error.message}`);
    sendResponse({ success: false, error: error.message });
  }
  
  return false;
});

// Also listen for window messages (from scripting API)
window.addEventListener('message', (event) => {
  try {
    if (event.data && event.data.type === 'proxsec-scope-update') {
      log(`Received window message: ${JSON.stringify(event.data)}`);
      updateIndicator(
        event.data.inScope === true, 
        Array.isArray(event.data.programs) ? event.data.programs : []
      );
    }
  } catch (error) {
    log(`Error processing window message: ${error.message}`);
  }
}, false);

// Start initialization when the page is fully loaded
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
} 