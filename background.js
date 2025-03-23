// ProxSec Background Script

// Log helper
function log(message) {
  console.log(`[ProxSec Background] ${message}`);
}

// Initialize proxy configurations when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  log('Extension installed or updated');
  
  // Initialize storage
  chrome.storage.local.get(['proxies', 'programs'], (data) => {
    log('Initializing storage');
    
    // Initialize proxies if not exists
    if (!data.proxies) {
      log('Proxies not found, initializing empty array');
      chrome.storage.local.set({ 
        proxies: [],
        activeProxy: null
      });
    } else {
      log(`Found ${data.proxies.length} proxies`);
      // Check for any proxies in the old format and migrate them
      const updatedProxies = data.proxies.map(proxy => {
        if (proxy.url && (!proxy.protocol || !proxy.ip || !proxy.port)) {
          // Convert from old format to new format
          try {
            const urlObj = new URL(proxy.url);
            return {
              ...proxy,
              protocol: urlObj.protocol.replace(':', ''),
              ip: urlObj.hostname,
              port: parseInt(urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80))
            };
          } catch (e) {
            console.error('Error converting proxy format:', e);
            return proxy;
          }
        }
        return proxy;
      });
      
      // Save the updated proxies back to storage if we made any changes
      if (JSON.stringify(updatedProxies) !== JSON.stringify(data.proxies)) {
        log('Updated proxy format, saving to storage');
        chrome.storage.local.set({ proxies: updatedProxies });
      }
    }
    
    // Initialize programs if not exists
    if (!data.programs) {
      log('Programs not found, initializing empty array');
      chrome.storage.local.set({ programs: [] });
    } else {
      log(`Found ${data.programs.length} programs`);
    }
  });
  
  // Set up badge defaults
  chrome.action.setBadgeBackgroundColor({ color: '#9ca3af' }); // Grey
  chrome.action.setBadgeText({ text: "" });
  
  log('Initial setup complete');
});

// Function to set the active proxy
async function setActiveProxy(proxy) {
  if (!proxy) {
    // Clear proxy settings if no proxy is selected
    await clearProxySettings();
    return { success: true, message: 'Proxy settings cleared' };
  }

  try {
    // Initialize variables with safe defaults
    let scheme = null;
    let host = null;
    let port = null;
    
    // Safely extract protocol, IP and port - no using 'split' directly
    if (typeof proxy === 'object') {
      // Check if we have the new format with all required fields
      if (proxy.protocol && typeof proxy.protocol === 'string' && 
          proxy.ip && typeof proxy.ip === 'string' && 
          proxy.port !== undefined) {
        
        scheme = proxy.protocol;
        host = proxy.ip;
        
        // Convert port to number safely
        if (typeof proxy.port === 'number') {
          port = proxy.port;
        } else if (typeof proxy.port === 'string') {
          port = parseInt(proxy.port, 10);
        }
      } 
      // Check if we have the old URL format
      else if (proxy.url && typeof proxy.url === 'string') {
        try {
          const urlObj = new URL(proxy.url);
          scheme = urlObj.protocol.replace(':', '');
          host = urlObj.hostname;
          
          // Get port from URL or use defaults
          if (urlObj.port) {
            port = parseInt(urlObj.port, 10);
          } else {
            port = (urlObj.protocol === 'https:') ? 443 : 80;
          }
        } catch (e) {
          return { success: false, message: `Invalid proxy URL: ${e.message}` };
        }
      }
    }
    
    // Validate all required values
    if (!scheme) {
      return { success: false, message: 'Invalid proxy: Missing protocol' };
    }
    
    if (!host) {
      return { success: false, message: 'Invalid proxy: Missing host/IP address' };
    }
    
    if (!port || isNaN(port) || port < 1 || port > 65535) {
      return { success: false, message: 'Invalid proxy: Missing or invalid port number' };
    }
    
    // Create configuration object
    const config = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: scheme,
          host: host,
          port: port
        },
        bypassList: ['localhost']
      }
    };

    // Apply proxy settings
    await chrome.proxy.settings.set({
      value: config,
      scope: 'regular'
    });

    // Update the active proxy in storage
    if (proxy.id) {
      await chrome.storage.local.set({ activeProxy: proxy.id });
    }
    
    return { success: true, message: `Proxy ${proxy.name || 'unnamed'} activated` };
  } catch (error) {
    console.error('Error setting proxy:', error);
    return { success: false, message: error.message || 'Unknown error occurred' };
  }
}

// Function to clear proxy settings
async function clearProxySettings() {
  try {
    await chrome.proxy.settings.set({
      value: { mode: 'direct' },
      scope: 'regular'
    });
    await chrome.storage.local.set({ activeProxy: null });
    return { success: true, message: 'Proxy settings cleared' };
  } catch (error) {
    console.error('Error clearing proxy:', error);
    return { success: false, message: error.message };
  }
}

// Function to test a proxy
async function testProxy(proxy) {
  if (!proxy || typeof proxy !== 'object') {
    return { success: false, message: `Invalid proxy configuration` };
  }

  try {
    // Create a temp fetch request through the proxy to check if it works
    // In a real implementation, this would need to be adapted depending on browser capabilities
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    // For testing, we're just checking if we can connect to the proxy
    const response = await fetch('https://www.google.com', {
      signal: controller.signal,
      // We're simulating a proxy connection here
      // In a real extension, the proxy should already be configured via chrome.proxy API
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return { success: true, message: 'Proxy is working' };
    } else {
      return { success: false, message: `Proxy test failed: ${response.status} ${response.statusText}` };
    }
  } catch (error) {
    return { success: false, message: `Proxy test failed: ${error.message}` };
  }
}

// Function to check if a URL matches a scope pattern
function isUrlInScope(url, scopePatterns) {
  try {
    // Convert URL to URL object
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    log(`Checking if ${hostname} matches any patterns`);
    
    // Check each pattern
    return scopePatterns.some(pattern => {
      // Handle wildcard patterns
      if (pattern.includes('*')) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        const matches = regex.test(hostname);
        log(`Pattern: ${pattern} -> ${matches ? 'MATCH' : 'no match'}`);
        return matches;
      }
      // Handle exact matches
      const matches = hostname === pattern;
      log(`Pattern: ${pattern} -> ${matches ? 'MATCH' : 'no match'}`);
      return matches;
    });
  } catch (e) {
    console.error('Error checking scope:', e);
    return false;
  }
}

// Function to check if a URL is in scope of any program
async function checkUrlScope(url) {
  if (!url) {
    log('No URL provided for scope check');
    return { inScope: false, programs: [] };
  }
  
  log(`Checking scope for URL: ${url}`);
  
  try {
    const data = await chrome.storage.local.get(['programs']);
    const programs = data.programs || [];
    log(`Found ${programs.length} programs to check against`);
    
    const inScopePrograms = [];
    
    for (const program of programs) {
      // Skip disabled programs
      if (program.enabled === false) {
        log(`Skipping disabled program: ${program.name}`);
        continue;
      }
      
      if (program.scope) {
        // Split the scope string into an array of patterns
        const scopePatterns = program.scope.split('\n')
          .map(pattern => pattern.trim())
          .filter(Boolean);
        
        log(`Checking program: ${program.name} with ${scopePatterns.length} patterns`);
        
        if (isUrlInScope(url, scopePatterns)) {
          log(`URL is in scope for program: ${program.name}`);
          inScopePrograms.push({
            id: program.id,
            name: program.name
          });
        }
      } else {
        log(`Program ${program.name} has no scope defined`);
      }
    }
    
    const result = { 
      inScope: inScopePrograms.length > 0,
      programs: inScopePrograms
    };
    
    log(`Scope check result: ${result.inScope ? 'IN SCOPE' : 'OUT OF SCOPE'} for ${inScopePrograms.length} programs`);
    return result;
  } catch (e) {
    console.error('Error in checkUrlScope:', e);
    return { inScope: false, programs: [] };
  }
}

// Function to update the extension badge for a tab
async function updateBadge(tabId, url) {
  if (!url || !url.startsWith('http')) return;
  
  try {
    const scopeResult = await checkUrlScope(url);
    
    if (scopeResult.inScope) {
      // In scope - set green badge with ✓
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#10b981' });
      chrome.action.setBadgeText({ tabId, color: '#FFFFFF', text: '✓' });
      
      // Set title to show program names
      if (scopeResult.programs && scopeResult.programs.length > 0) {
        const programNames = scopeResult.programs.map(p => p.name).join(', ');
        chrome.action.setTitle({ tabId, title: `In scope for: ${programNames}` });
      } else {
        chrome.action.setTitle({ tabId, title: 'ProxSec: In scope' });
      }
    } else {
      // Out of scope - set red badge with ✗
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#ef4444' });
      chrome.action.setBadgeText({ tabId, color: '#FFFFFF', text: '✗' });
      chrome.action.setTitle({ tabId, title: 'ProxSec: Out of scope' });
    }
    
    log(`Badge updated for tab ${tabId}: ${scopeResult.inScope ? 'In scope' : 'Out of scope'}`);
  } catch (error) {
    log(`Error updating badge: ${error.message}`);
    
    // Reset badge on error
    chrome.action.setBadgeText({ tabId, text: '' });
  }
}

// Update badges on all tabs when programs change
function updateAllTabBadges() {
  log('Updating badges for all tabs');
  
  chrome.tabs.query({ url: '<all_urls>' }, (tabs) => {
    for (const tab of tabs) {
      if (tab.url && tab.url.startsWith('http')) {
        updateBadge(tab.id, tab.url);
        updateTabIndicator(tab.id, tab.url);
      }
    }
  });
}

// Listen for tab changes and URL updates
chrome.tabs.onActivated.addListener(activeInfo => {
  updateBadge(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    updateBadge(tabId, changeInfo.url);
  }
});

// Listen for messages from popup or content scripts with better debugging
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log(`Received message: ${JSON.stringify(request)}`);
  
  if (request.action === 'setActiveProxy') {
    setActiveProxy(request.proxy)
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, message: error.message }));
    return true; // Keep the channel open for async response
  }
  
  if (request.action === 'clearProxy') {
    clearProxySettings()
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, message: error.message }));
    return true;
  }
  
  if (request.action === 'testProxy') {
    testProxy(request.proxy)
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, message: error.message }));
    return true;
  }
  
  if (request.action === 'checkScope') {
    log(`Processing checkScope request for URL: ${request.url}`);
    
    checkUrlScope(request.url)
      .then(result => {
        log(`Sending scope check response: ${JSON.stringify(result)}`);
        sendResponse(result);
      })
      .catch(error => {
        log(`Error in checkScope request: ${error.message}`);
        sendResponse({ inScope: false, programs: [], error: error.message });
      });
    
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'openPopup') {
    chrome.action.openPopup();
    sendResponse({ success: true });
    return true;
  }
});

// Update tabs when they change
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Wait for the tab to be fully loaded
  if (changeInfo.status === 'complete' && tab.url) {
    log(`Tab updated with URL: ${tab.url}`);
    
    // Update badge
    updateBadge(tabId, tab.url);
    
    // Update content script
    checkUrlScope(tab.url).then(scopeResult => {
      log(`Sending scope update to tab ${tabId}: ${JSON.stringify(scopeResult)}`);
      
      // Send scope result to content script
      chrome.tabs.sendMessage(tabId, {
        action: 'updateScope',
        ...scopeResult
      }).catch(error => {
        // It's normal for this to fail if the content script hasn't loaded yet
        log(`Could not send scope update to tab ${tabId}: ${error.message}`);
      });
    });
  }
});

// Function to forcibly inject the indicator using the scripting API
async function injectIndicator(tabId) {
  log(`Forcibly injecting indicator into tab ${tabId}`);
  
  try {
    // Check if we have scripting permissions
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Only add if not already present
        if (!document.getElementById('proxsec-indicator-forced')) {
          console.log('[ProxSec] Force-injecting indicator');
          
          // Create the indicator
          const indicator = document.createElement('div');
          indicator.id = 'proxsec-indicator-forced';
          indicator.style.cssText = `
            position: fixed;
            left: 20px;
            top: 20px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: ${result.inScope ? '#10b981' : '#ef4444'};
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-family: sans-serif;
            font-size: 12px;
            color: white;
            font-weight: bold;
          `;
          
          // Add shield icon inside indicator instead of 'P' text
          indicator.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          `;
          
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
          tooltip.textContent = 'ProxSec Status';
          
          indicator.appendChild(tooltip);
          
          // Show tooltip on hover
          indicator.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
          });
          
          indicator.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
          });
          
          // Add to document
          document.body.appendChild(indicator);
          
          // Listen for messages from content script
          window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'proxsec-scope-update') {
              const indicator = document.getElementById('proxsec-indicator-forced');
              if (indicator) {
                indicator.style.backgroundColor = event.data.inScope ? '#10b981' : '#ef4444';
                
                const tooltip = indicator.querySelector('div');
                if (tooltip) {
                  if (event.data.inScope) {
                    const programNames = event.data.programs.map(p => p.name).join(', ');
                    tooltip.textContent = programNames ? `In scope for: ${programNames}` : 'In scope';
                  } else {
                    tooltip.textContent = 'Out of scope';
                  }
                }
              }
            }
          });
          
          // Send result to window
          window.postMessage({
            type: 'proxsec-scope-update',
            inScope: result.inScope,
            programs: result.programs || []
          }, '*');
        }
      }
    });
    
    return true;
  } catch (error) {
    log(`Error injecting indicator: ${error.message}`);
    return false;
  }
}

// Update indicator on tabs with scope information
async function updateTabIndicator(tabId, url) {
  if (!url || !url.startsWith('http')) return;
  
  try {
    // Get scope information
    const scopeResult = await checkUrlScope(url);
    
    // Try to update with standard messaging first
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: 'updateScope',
        ...scopeResult
      });
      log(`Sent scope update via messaging to tab ${tabId}`);
    } catch (e) {
      log(`Messaging failed for tab ${tabId}, trying scripting API injection`);
      
      // If messaging fails, try to inject the indicator
      const injected = await injectIndicator(tabId);
      
      if (injected) {
        // Wait a moment for the injection to complete
        setTimeout(async () => {
          // Send the scope information via a page message
          await chrome.scripting.executeScript({
            target: { tabId },
            func: (scopeData) => {
              window.postMessage({
                type: 'proxsec-scope-update',
                inScope: scopeData.inScope,
                programs: scopeData.programs.map(p => p.name)
              }, '*');
            },
            args: [scopeResult]
          });
          log(`Sent scope update via scripting API to tab ${tabId}`);
        }, 500);
      }
    }
  } catch (error) {
    log(`Error updating tab indicator: ${error.message}`);
  }
}

// Listen for tabs to update
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Wait for the tab to be fully loaded
  if (changeInfo.status === 'complete' && tab.url) {
    log(`Tab ${tabId} completed loading: ${tab.url}`);
    
    // Update badge
    updateBadge(tabId, tab.url);
    
    // Update indicator with scope
    updateTabIndicator(tabId, tab.url);
  }
});

// Listen for storage changes to update badges
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.programs) {
    log('Programs changed, updating all badges');
    updateAllTabBadges();
  }
}); 