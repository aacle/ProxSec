// VulnCure Popup Script

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const addProxyButton = document.getElementById('add-proxy-btn');
  const cancelProxyButton = document.getElementById('cancel-proxy-btn');
  const proxyList = document.getElementById('proxy-list');
  const proxyForm = document.getElementById('proxy-form');
  const proxyFormContainer = document.getElementById('proxy-form-container');
  const statusBar = document.getElementById('status-bar');
  const formTitle = document.getElementById('form-title');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Program Management DOM Elements
  const addProgramButton = document.getElementById('add-program-btn');
  const cancelProgramButton = document.getElementById('cancel-program-btn');
  const programList = document.getElementById('program-list');
  const programForm = document.getElementById('program-form');
  const programFormContainer = document.getElementById('program-form-container');
  const programFormTitle = document.getElementById('program-form-title');
  const scopeStatusContainer = document.getElementById('scope-status-container');
  
  // Program Form Fields
  const programNameInput = document.getElementById('program-name');
  const programUrlInput = document.getElementById('program-url');
  const programScopeInput = document.getElementById('program-scope');
  const programNotesInput = document.getElementById('program-notes');
  
  // Form fields
  const nameInput = document.getElementById('proxy-name');
  const protocolSelect = document.getElementById('proxy-protocol');
  const ipInput = document.getElementById('proxy-ip');
  const portInput = document.getElementById('proxy-port');
  const usernameInput = document.getElementById('proxy-username');
  const passwordInput = document.getElementById('proxy-password');
  
  // Icons
  const ICONS = {
    active: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    inactive: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    test: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
    add: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
    cancel: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    scope: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    notes: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
  };
  
  // Current proxy being edited
  let currentProxyId = null;
  let proxies = [];
  let activeProxyId = null;
  
  // Program Management State
  let currentProgramId = null;
  let programs = [];
  let currentUrl = '';

  // Initial load
  loadProxies();
  loadPrograms();
  checkCurrentUrl();
  updateActiveProxyInfo();
  
  // Update icon for add button
  addProxyButton.innerHTML = `Add Proxy`;
  cancelProxyButton.innerHTML = `Cancel`;
  if (addProgramButton) {
    const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
    addProgramButton.innerHTML = `${addIcon} Add Program`;
  }
  if (cancelProgramButton) {
    cancelProgramButton.innerHTML = `Cancel`;
  }

  // Event Listeners
  addProxyButton.addEventListener('click', showAddProxyForm);
  cancelProxyButton.addEventListener('click', hideProxyForm);
  proxyForm.addEventListener('submit', saveProxy);
  
  // Program Management Event Listeners
  if (addProgramButton) {
    addProgramButton.addEventListener('click', showAddProgramForm);
  }
  
  if (cancelProgramButton) {
    cancelProgramButton.addEventListener('click', hideProgramForm);
  }
  
  if (programForm) {
    programForm.addEventListener('submit', saveProgram);
  }
  
  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Dashboard DOM Elements and actions
  const dashboardAddProxyBtn = document.getElementById('dashboard-add-proxy');
  const dashboardAddProgramBtn = document.getElementById('dashboard-add-program');
  const checkCurrentUrlBtn = document.getElementById('check-current-url');
  const toggleProxyBtn = document.getElementById('toggle-proxy');
  const refreshStatsBtn = document.getElementById('refresh-stats');
  const viewSettingsBtn = document.getElementById('view-settings');

  // Dashboard stats elements
  const totalProxiesElement = document.getElementById('total-proxies');
  const activeProxiesElement = document.getElementById('active-proxies');
  const proxyChartBar = document.getElementById('proxy-active-bar');
  const totalProgramsElement = document.getElementById('total-programs');
  const inScopeCountElement = document.getElementById('in-scope-count');
  const scopeStatusElement = document.getElementById('scope-status');

  // Event Listeners
  // Dashboard Buttons
  if (dashboardAddProxyBtn) {
    dashboardAddProxyBtn.addEventListener('click', () => {
      showAddProxyForm();
      // Switch to proxies tab after clicking
      switchTab('proxies');
    });
  }
  
  if (dashboardAddProgramBtn) {
    dashboardAddProgramBtn.addEventListener('click', () => {
      showAddProgramForm();
      // Switch to programs tab after clicking
      switchTab('programs');
    });
  }
  
  if (checkCurrentUrlBtn) {
    checkCurrentUrlBtn.addEventListener('click', () => {
      checkCurrentUrl();
    });
  }
  
  if (toggleProxyBtn) {
    toggleProxyBtn.addEventListener('click', () => {
      toggleActiveProxy();
    });
  }
  
  // Quick proxy toggle in header
  const quickProxyToggle = document.getElementById('quick-proxy-toggle');
  if (quickProxyToggle) {
    quickProxyToggle.addEventListener('click', () => {
      toggleActiveProxy();
    });
  }
  
  if (refreshStatsBtn) {
    refreshStatsBtn.addEventListener('click', () => {
      updateDashboardStats();
    });
  }
  
  if (viewSettingsBtn) {
    viewSettingsBtn.addEventListener('click', () => {
      // TODO: Implement settings view
      alert('Settings will be implemented in a future update!');
    });
  }
  
  // Initialize dashboard stats when the popup is opened
  updateDashboardStats();
  
  // Update scope status when tab changes or proxy changes
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].url) {
      const url = tabs[0].url;
      
      // First check if we have cached scope status
      chrome.storage.local.get(['currentUrl', 'currentScopeStatus'], (data) => {
        // If URL matches cached URL, use cached status
        if (data.currentUrl === url && data.currentScopeStatus) {
          updateScopeStatus();
          updateScopeStatusIndicator(
            data.currentScopeStatus.inScope, 
            data.currentScopeStatus.programs
          );
          return;
        }
        
        // Otherwise check URL scope fresh
        chrome.runtime.sendMessage({ action: 'checkScope', url }, (result) => {
          if (chrome.runtime.lastError) {
            console.error('Error checking scope:', chrome.runtime.lastError);
            return;
          }
          
          if (result) {
            chrome.storage.local.set({ 
              currentUrl: url,
              currentScopeStatus: result
            });
            
            updateScopeStatus();
            updateScopeStatusIndicator(result.inScope, result.programs);
          }
        });
      });
    }
  });

  // Functions
  function loadProxies() {
    chrome.storage.local.get(['proxies', 'activeProxy'], (data) => {
      proxies = data.proxies || [];
      activeProxyId = data.activeProxy;
      
      // Check for any proxies in the old format and migrate them
      let needsUpdate = false;
      proxies = proxies.map(proxy => {
        if (proxy.url && (!proxy.protocol || !proxy.ip || !proxy.port)) {
          needsUpdate = true;
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
      if (needsUpdate) {
        chrome.storage.local.set({ proxies }, () => {
          renderProxyList();
        });
      } else {
        renderProxyList();
      }
    });
  }

  function renderProxyList() {
    // Clear existing list
    proxyList.innerHTML = '';

    if (proxies.length === 0) {
      // Show empty state
      proxyList.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="2" y1="7" x2="7" y2="7"></line>
            <line x1="2" y1="17" x2="7" y2="17"></line>
            <line x1="17" y1="17" x2="22" y2="17"></line>
            <line x1="17" y1="7" x2="22" y2="7"></line>
          </svg>
          <p>No proxies configured yet</p>
          <p>Add your first proxy to get started</p>
        </div>
      `;
      updateActiveProxyInfo();
      return;
    }

    // Add each proxy to the list
    proxies.forEach(proxy => {
      // Create proxy item
      const proxyItem = document.createElement('div');
      proxyItem.className = 'proxy-item';
      proxyItem.dataset.id = proxy.id;
      
      // Create name row with status
      const nameRow = document.createElement('div');
      nameRow.className = 'proxy-name';
      
      // Add name
      const nameSpan = document.createElement('span');
      nameSpan.textContent = proxy.name;
      nameRow.appendChild(nameSpan);
      
      // Add status badge
      const statusBadge = document.createElement('span');
      const status = proxy.status || 'Inactive';
      let statusClass = 'status-inactive';
      let statusLabel = 'Inactive';
      
      if (status === 'Active') {
        statusClass = 'status-active';
        statusLabel = 'Active';
      } else if (status === 'Error') {
        statusClass = 'status-error';
        statusLabel = 'Error';
      }
      
      statusBadge.className = `proxy-status ${statusClass}`;
      statusBadge.innerHTML = `${status === 'Active' ? ICONS.active : (status === 'Error' ? ICONS.error : ICONS.inactive)} <span>${statusLabel}</span>`;
      nameRow.appendChild(statusBadge);
      
      proxyItem.appendChild(nameRow);
      
      // Add URL details
      const details = document.createElement('p');
      details.className = 'proxy-details';
      
      let detailsText;
      if (proxy.protocol && proxy.ip && proxy.port) {
        detailsText = `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
      } else if (proxy.url) {
        detailsText = proxy.url;
      } else {
        detailsText = 'Invalid proxy configuration';
      }
      details.textContent = detailsText;
      proxyItem.appendChild(details);
      
      // Add actions (buttons and toggle switch)
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'proxy-actions';
      
      // Add action buttons (test, edit, delete)
      const actionButtons = document.createElement('div');
      actionButtons.className = 'action-buttons';
      
      // Test button
      const testButton = document.createElement('button');
      testButton.className = 'btn-icon';
      testButton.innerHTML = ICONS.test;
      testButton.title = 'Test proxy';
      testButton.addEventListener('click', (e) => {
        e.stopPropagation();
        testProxy(proxy.id);
      });
      actionButtons.appendChild(testButton);
      
      // Edit button
      const editButton = document.createElement('button');
      editButton.className = 'btn-icon';
      editButton.innerHTML = ICONS.edit;
      editButton.title = 'Edit proxy';
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showEditProxyForm(proxy.id);
      });
      actionButtons.appendChild(editButton);
      
      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn-icon';
      deleteButton.innerHTML = ICONS.delete;
      deleteButton.title = 'Delete proxy';
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProxy(proxy.id);
      });
      actionButtons.appendChild(deleteButton);
      
      actionsDiv.appendChild(actionButtons);
      
      // Add toggle switch
      const toggleDiv = document.createElement('div');
      toggleDiv.className = 'toggle-container';
      
      const toggleLabel = document.createElement('label');
      toggleLabel.className = 'switch';
      
      const toggleInput = document.createElement('input');
      toggleInput.type = 'checkbox';
      toggleInput.className = 'proxy-toggle';
      toggleInput.checked = activeProxyId === proxy.id;
      
      const toggleSlider = document.createElement('span');
      toggleSlider.className = 'slider round';
      
      toggleLabel.appendChild(toggleInput);
      toggleLabel.appendChild(toggleSlider);
      
      const toggleText = document.createElement('span');
      toggleText.className = 'toggle-label';
      toggleText.textContent = activeProxyId === proxy.id ? 'Active' : 'Inactive';
      
      toggleDiv.appendChild(toggleLabel);
      toggleDiv.appendChild(toggleText);
      actionsDiv.appendChild(toggleDiv);
      proxyItem.appendChild(actionsDiv);
      
      // Add event listeners
      toggleInput.addEventListener('change', (e) => toggleProxy(proxy.id, e.target.checked));
      
      // Add to proxy list
      proxyList.appendChild(proxyItem);
    });
  }

  function showAddProxyForm() {
    formTitle.textContent = 'Add Proxy';
    nameInput.value = '';
    protocolSelect.value = 'http';
    ipInput.value = '';
    portInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
    currentProxyId = null;
    proxyFormContainer.classList.remove('hidden');
    
    // Add animation class
    proxyFormContainer.classList.add('fade-in');
    setTimeout(() => {
      proxyFormContainer.classList.remove('fade-in');
    }, 300);
    
    nameInput.focus();
  }

  function showEditProxyForm(proxyId) {
    const proxy = proxies.find(p => p.id === proxyId);
    if (!proxy) return;
    
    formTitle.textContent = 'Edit Proxy';
    nameInput.value = proxy.name;
    
    // Handle old format conversion for edit
    if (proxy.protocol && proxy.ip && proxy.port) {
      // New format
      protocolSelect.value = proxy.protocol;
      ipInput.value = proxy.ip;
      portInput.value = proxy.port;
    } else if (proxy.url) {
      // Try to parse old URL format
      try {
        const urlObj = new URL(proxy.url);
        protocolSelect.value = urlObj.protocol.replace(':', '');
        ipInput.value = urlObj.hostname;
        portInput.value = urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80);
      } catch (e) {
        protocolSelect.value = 'http';
        ipInput.value = '';
        portInput.value = '';
      }
    } else {
      protocolSelect.value = 'http';
      ipInput.value = '';
      portInput.value = '';
    }
    
    usernameInput.value = proxy.username || '';
    passwordInput.value = proxy.password || '';
    currentProxyId = proxyId;
    proxyFormContainer.classList.remove('hidden');
    
    // Add animation class
    proxyFormContainer.classList.add('fade-in');
    setTimeout(() => {
      proxyFormContainer.classList.remove('fade-in');
    }, 300);
    
    nameInput.focus();
  }

  function hideProxyForm() {
    proxyFormContainer.classList.add('fade-out');
    
    setTimeout(() => {
      proxyFormContainer.classList.add('hidden');
      proxyFormContainer.classList.remove('fade-out');
    }, 200);
  }

  function saveProxy(e) {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const protocol = protocolSelect.value;
    const ip = ipInput.value.trim();
    const portValue = portInput.value.trim();
    const port = parseInt(portValue);
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!name || !ip || !portValue) {
      showStatus('Name, IP address, and port are required', 'error');
      return;
    }
    
    if (!isValidIP(ip)) {
      showStatus('Invalid IP address format', 'error');
      return;
    }
    
    if (isNaN(port) || port < 1 || port > 65535) {
      showStatus('Port must be a number between 1 and 65535', 'error');
      return;
    }
    
    if (currentProxyId) {
      // Edit existing proxy
      const index = proxies.findIndex(p => p.id === currentProxyId);
      if (index !== -1) {
        // Save in new format and remove old url property if it exists
        const { url, ...restOfProxy } = proxies[index];
        proxies[index] = {
          ...restOfProxy,
          name,
          protocol,
          ip,
          port,
          username: username || null,
          password: password || null,
          lastUpdated: new Date().toISOString()
        };
      }
    } else {
      // Add new proxy
      const newProxy = {
        id: generateId(),
        name,
        protocol,
        ip,
        port,
        username: username || null,
        password: password || null,
        status: 'Inactive',
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      proxies.push(newProxy);
    }
    
    // Save to storage
    chrome.storage.local.set({ proxies }, () => {
      hideProxyForm();
      renderProxyList();
      showStatus(currentProxyId ? 'Proxy updated successfully' : 'Proxy added successfully', 'success');
    });
  }

  function deleteProxy(proxyId) {
    if (!confirm('Are you sure you want to delete this proxy?')) return;
    
    const index = proxies.findIndex(p => p.id === proxyId);
    if (index !== -1) {
      proxies.splice(index, 1);
      
      // If the active proxy is being deleted, clear it
      if (activeProxyId === proxyId) {
        activeProxyId = null;
        chrome.runtime.sendMessage({ action: 'clearProxy' });
      }
      
      // Save to storage
      chrome.storage.local.set({ 
        proxies,
        activeProxy: activeProxyId 
      }, () => {
        renderProxyList();
        showStatus('Proxy deleted successfully', 'success');
      });
    }
  }

  function testProxy(proxyId) {
    const proxy = proxies.find(p => p.id === proxyId);
    if (!proxy) return;
    
    showStatus('Testing proxy...', 'info');
    
    // Make sure the proxy object is complete before testing
    if (!proxy.protocol && !proxy.ip && !proxy.port && !proxy.url) {
      showStatus('Invalid proxy configuration', 'error');
      return;
    }
    
    chrome.runtime.sendMessage({ 
      action: 'testProxy',
      proxy
    }, (response) => {
      if (response && response.success) {
        proxy.status = 'Active';
        showStatus('Proxy test successful', 'success');
      } else {
        proxy.status = 'Error';
        const errorMsg = response ? response.message : 'Unknown error';
        showStatus(`Proxy test failed: ${errorMsg}`, 'error');
      }
      
      // Update storage
      chrome.storage.local.set({ proxies }, () => {
        renderProxyList();
      });
    });
  }

  function toggleProxy(proxyId, isActive) {
    // Add logic to prevent toggling if a proxy is already active
    if (isActive && activeProxyId && activeProxyId !== proxyId) {
      showStatus('Another proxy is already active. Please deactivate it first.', 'warning');
      return;
    }
    
    // Clear any existing active proxy
    if (isActive) {
      // First clear any existing proxies
      chrome.runtime.sendMessage({ action: 'clearProxy' }, (response) => {
        // Then activate the selected proxy
        const proxy = proxies.find(p => p.id === proxyId);
        if (!proxy) {
          showStatus('Proxy not found', 'error');
          return;
        }
        
        chrome.runtime.sendMessage({ action: 'setActiveProxy', proxy }, (response) => {
          if (response && response.success) {
            // Set this proxy as active
            chrome.storage.local.set({ activeProxy: proxyId }, () => {
              activeProxyId = proxyId;
              showStatus(`Proxy "${proxy.name}" activated`, 'success');
              renderProxyList();
              updateActiveProxyInfo();
              updateQuickToggleState();
            });
          } else {
            showStatus('Failed to activate proxy: ' + (response ? response.message : 'Unknown error'), 'error');
            renderProxyList(); // Reset UI
          }
        });
      });
    } else {
      // Deactivate the proxy
      chrome.runtime.sendMessage({ action: 'clearProxy' }, (response) => {
        if (response && response.success) {
          chrome.storage.local.set({ activeProxy: null }, () => {
            activeProxyId = null;
            showStatus('Proxy deactivated', 'success');
            renderProxyList();
            updateActiveProxyInfo();
            updateQuickToggleState();
          });
        } else {
          showStatus('Failed to deactivate proxy: ' + (response ? response.message : 'Unknown error'), 'error');
          renderProxyList(); // Reset the UI
        }
      });
    }
  }

  function showStatus(message, type = 'info') {
    // Get the appropriate icon
    let icon = ICONS.info;
    if (type === 'success') icon = ICONS.success;
    if (type === 'error') icon = ICONS.error;
    if (type === 'warning') icon = ICONS.warning;
    
    // Set message with icon
    statusBar.innerHTML = `${icon} <span>${message}</span>`;
    statusBar.className = 'status-bar status-' + type;
    statusBar.style.opacity = 1;
    
    // Clear after 3 seconds
    setTimeout(() => {
      statusBar.style.opacity = 0;
    }, 3000);
  }

  // Helper functions
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  function isValidIP(ip) {
    // Basic IPv4 validation
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // Also allow hostnames
    const hostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
    
    // Allow localhost
    if (ip === 'localhost') return true;
    
    return ipv4Regex.test(ip) || hostnameRegex.test(ip);
  }

  // Program Management Functions
  function loadPrograms() {
    chrome.storage.local.get(['programs'], (data) => {
      programs = data.programs || [];
      renderProgramList();
    });
  }

  function renderProgramList() {
    programList.innerHTML = '';

    if (programs.length === 0) {
      programList.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <p>No bug bounty programs added yet.</p>
          <p>Click "Add Program" to get started.</p>
        </div>
      `;
      return;
    }

    programs.forEach(program => {
      const programItem = document.createElement('div');
      programItem.className = 'program-item';
      programItem.dataset.id = program.id;
      
      // Program name and status
      const nameRow = document.createElement('div');
      nameRow.className = 'program-name';
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = program.name;
      nameRow.appendChild(nameSpan);
      
      // Scope status badge
      const scopeBadge = document.createElement('span');
      
      // If program is disabled, show disabled status regardless of scope
      if (program.enabled === false) {
        scopeBadge.className = 'program-status status-disabled';
        scopeBadge.innerHTML = `${ICONS.scope} <span>Disabled</span>`;
      } else {
        const isInScope = isUrlInScope(currentUrl, program.scope, program.enabled);
        scopeBadge.className = `program-status ${isInScope ? 'status-active' : 'status-inactive'}`;
        scopeBadge.innerHTML = `${ICONS.scope} <span>${isInScope ? 'In Scope' : 'Out of Scope'}</span>`;
      }
      
      nameRow.appendChild(scopeBadge);
      
      programItem.appendChild(nameRow);
      
      // Program URL
      const urlDetails = document.createElement('p');
      urlDetails.className = 'program-details';
      urlDetails.textContent = program.url;
      programItem.appendChild(urlDetails);
      
      // Program actions
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'program-actions';
      
      // Toggle switch for enabled/disabled state
      const toggleDiv = document.createElement('div');
      toggleDiv.className = 'toggle-container';
      
      const toggleLabel = document.createElement('label');
      toggleLabel.className = 'switch';
      
      const toggleInput = document.createElement('input');
      toggleInput.type = 'checkbox';
      toggleInput.checked = program.enabled !== false; // Default to true if not set
      toggleInput.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleProgram(program.id, e.target.checked);
      });
      
      const toggleSlider = document.createElement('span');
      toggleSlider.className = 'slider round';
      
      toggleLabel.appendChild(toggleInput);
      toggleLabel.appendChild(toggleSlider);
      
      const toggleText = document.createElement('span');
      toggleText.className = 'toggle-label';
      toggleText.textContent = program.enabled !== false ? 'Enabled' : 'Disabled';
      
      toggleDiv.appendChild(toggleLabel);
      toggleDiv.appendChild(toggleText);
      
      actionsDiv.appendChild(toggleDiv);
      
      // Action buttons
      const actionButtons = document.createElement('div');
      actionButtons.className = 'action-buttons';
      
      // Edit button
      const editButton = document.createElement('button');
      editButton.className = 'btn-icon';
      editButton.innerHTML = ICONS.edit;
      editButton.title = 'Edit program';
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showEditProgramForm(program.id);
      });
      actionButtons.appendChild(editButton);
      
      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn-icon';
      deleteButton.innerHTML = ICONS.delete;
      deleteButton.title = 'Delete program';
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProgram(program.id);
      });
      actionButtons.appendChild(deleteButton);
      
      actionsDiv.appendChild(actionButtons);
      programItem.appendChild(actionsDiv);
      
      programList.appendChild(programItem);
    });
  }

  function showAddProgramForm() {
    programFormTitle.textContent = 'Add Program';
    programNameInput.value = '';
    programUrlInput.value = '';
    programScopeInput.value = '';
    programNotesInput.value = '';
    currentProgramId = null;
    programFormContainer.classList.remove('hidden');
    
    programFormContainer.classList.add('fade-in');
    setTimeout(() => {
      programFormContainer.classList.remove('fade-in');
    }, 300);
    
    programNameInput.focus();
  }

  function showEditProgramForm(programId) {
    const program = programs.find(p => p.id === programId);
    if (!program) return;
    
    programFormTitle.textContent = 'Edit Program';
    programNameInput.value = program.name;
    programUrlInput.value = program.url;
    programScopeInput.value = program.scope;
    programNotesInput.value = program.notes || '';
    currentProgramId = programId;
    programFormContainer.classList.remove('hidden');
    
    programFormContainer.classList.add('fade-in');
    setTimeout(() => {
      programFormContainer.classList.remove('fade-in');
    }, 300);
    
    programNameInput.focus();
  }

  function hideProgramForm() {
    programFormContainer.classList.add('fade-out');
    
    setTimeout(() => {
      programFormContainer.classList.add('hidden');
      programFormContainer.classList.remove('fade-out');
    }, 200);
  }

  function saveProgram(e) {
    e.preventDefault();
    
    const name = programNameInput.value.trim();
    const url = programUrlInput.value.trim();
    const scope = programScopeInput.value.trim();
    const notes = programNotesInput.value.trim();
    
    if (!name || !url || !scope) {
      showStatus('Name, URL, and scope are required', 'error');
      return;
    }
    
    if (!isValidUrl(url)) {
      showStatus('Invalid URL format', 'error');
      return;
    }
    
    if (currentProgramId) {
      // Edit existing program
      const index = programs.findIndex(p => p.id === currentProgramId);
      if (index !== -1) {
        // Preserve the enabled state if it exists, default to true if not
        const enabled = programs[index].enabled !== undefined ? programs[index].enabled : true;
        
        programs[index] = {
          ...programs[index],
          name,
          url,
          scope,
          notes: notes || null,
          enabled, // Keep existing enabled state
          lastUpdated: new Date().toISOString()
        };
      }
    } else {
      // Add new program
      const newProgram = {
        id: generateId(),
        name,
        url,
        scope,
        notes: notes || null,
        enabled: true, // Enable by default
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      programs.push(newProgram);
    }
    
    // Save to storage
    chrome.storage.local.set({ programs }, () => {
      hideProgramForm();
      renderProgramList();
      checkCurrentUrl();
      showStatus(currentProgramId ? 'Program updated successfully' : 'Program added successfully', 'success');
    });
  }

  function deleteProgram(programId) {
    if (confirm('Are you sure you want to delete this program?')) {
      programs = programs.filter(p => p.id !== programId);
      chrome.storage.local.set({ programs }, () => {
        renderProgramList();
        updateDashboardStats();
        checkCurrentUrl();
        showStatus('Program deleted successfully', 'success');
      });
    }
  }

  // Toggle program enabled state
  function toggleProgram(programId, isEnabled) {
    const index = programs.findIndex(p => p.id === programId);
    if (index !== -1) {
      programs[index].enabled = isEnabled;
      
      // Update toggle label text immediately for better UX
      const programItem = document.querySelector(`.program-item[data-id="${programId}"]`);
      if (programItem) {
        const toggleText = programItem.querySelector('.toggle-label');
        if (toggleText) {
          toggleText.textContent = isEnabled ? 'Enabled' : 'Disabled';
        }
      }
      
      chrome.storage.local.set({ programs }, () => {
        renderProgramList();
        
        // Check current URL scope with updated program state
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].url) {
            const url = tabs[0].url;
            
            // Send message to background script to recheck scope
            chrome.runtime.sendMessage({ action: 'checkScope', url }, (result) => {
              if (chrome.runtime.lastError) {
                console.error('Error checking scope:', chrome.runtime.lastError);
                showStatus('Error checking URL scope', 'error');
                return;
              }
              
              if (result) {
                chrome.storage.local.set({ 
                  currentUrl: url,
                  currentScopeStatus: result
                });
                
                // Update UI with new scope results
                updateScopeStatus();
                updateScopeStatusIndicator(result.inScope, result.programs);
                updateDashboardStats();
              } else {
                console.warn('No result returned from checkScope');
                showStatus('Unable to determine scope status', 'warning');
              }
            });
          }
        });
        
        showStatus(`Program ${isEnabled ? 'enabled' : 'disabled'} successfully`, 'success');
      });
    }
  }

  function checkCurrentUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        currentUrl = tabs[0].url;
        updateScopeStatus();
      }
    });
  }

  function updateScopeStatus() {
    if (!currentUrl || !scopeStatusContainer) return;
    
    try {
      const urlObj = new URL(currentUrl);
      const domain = urlObj.hostname;
      
      // Only consider enabled programs when checking scope
      const inScopePrograms = programs
        .filter(program => program.enabled !== false) // Only enabled programs
        .filter(program => isUrlInScope(currentUrl, program.scope, program.enabled));
      
      let statusHTML = `<h3>Current Tab Status</h3>`;
      
      // Add current URL display
      statusHTML += `
        <div class="url-display">
          <p class="current-domain">${domain}</p>
        </div>
      `;
      
      if (inScopePrograms.length > 0) {
        // In-scope status
        statusHTML += `
          <div class="scope-status in-scope">
            ${ICONS.scope} <span>In scope for ${inScopePrograms.length} program${inScopePrograms.length > 1 ? 's' : ''}</span>
          </div>
          <div class="program-list-mini">
        `;
        
        // List the programs it's in scope for using getProgramNames helper
        const programNames = getProgramNames(inScopePrograms);
        inScopePrograms.forEach(program => {
          statusHTML += `
            <div class="program-mini-item">
              ${program.name || 'Unknown program'}
            </div>
          `;
        });
        
        statusHTML += `</div>`;
      } else {
        // Out-of-scope status
        statusHTML += `
          <div class="scope-status out-of-scope">
            ${ICONS.scope} <span>Not in scope for any program</span>
          </div>
        `;
      }
      
      scopeStatusContainer.innerHTML = statusHTML;
    } catch (e) {
      console.error('Error updating scope status:', e);
      scopeStatusContainer.innerHTML = `
        <h3>Current Tab Status</h3>
        <div class="scope-status out-of-scope">
          ${ICONS.warning} <span>Unable to determine scope status</span>
        </div>
      `;
    }
  }

  function isUrlInScope(url, scope, programEnabled = true) {
    // If program is disabled, always return false
    if (programEnabled === false) {
      return false;
    }
    
    // If no URL or scope, return false
    if (!url || !scope) {
      return false;
    }
    
    try {
      const urlObj = new URL(url);
      const scopePatterns = scope.split('\n').map(pattern => pattern.trim()).filter(Boolean);
      
      // If no valid patterns, return false
      if (scopePatterns.length === 0) {
        return false;
      }
      
      return scopePatterns.some(pattern => {
        // Handle wildcard patterns
        if (pattern.includes('*')) {
          const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
          return regex.test(urlObj.hostname);
        }
        // Handle exact matches
        return urlObj.hostname === pattern;
      });
    } catch (e) {
      console.error('Error checking URL scope:', e);
      return false;
    }
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Function to update dashboard statistics
  function updateDashboardStats() {
    chrome.storage.local.get(['proxies', 'programs', 'activeProxy', 'currentScopeStatus'], (data) => {
      const proxies = data.proxies || [];
      const programs = data.programs || [];
      const activeProxyId = data.activeProxy;
      const currentScopeStatus = data.currentScopeStatus || { inScope: false, programs: [] };
      
      // Update proxy stats
      const totalProxies = proxies.length;
      const activeProxies = activeProxyId ? 1 : 0;
      const activeRate = totalProxies > 0 ? (activeProxies / totalProxies) * 100 : 0;
      
      totalProxiesElement.textContent = totalProxies;
      activeProxiesElement.textContent = activeProxies;
      proxyChartBar.style.width = `${activeRate}%`;
      
      // Update program stats
      const totalPrograms = programs.length;
      const inScopePrograms = currentScopeStatus.programs.length;
      
      totalProgramsElement.textContent = totalPrograms;
      inScopeCountElement.textContent = inScopePrograms;
      
      // Update scope status indicator
      updateScopeStatusIndicator(currentScopeStatus.inScope, currentScopeStatus.programs);
    });
  }

  // Helper function to safely get program names
  function getProgramNames(programs) {
    if (!programs || !Array.isArray(programs) || programs.length === 0) {
      return '';
    }
    
    return programs
      .map(p => (p && typeof p === 'object' && p.name) ? p.name : (typeof p === 'string' ? p : 'Unknown'))
      .join(', ');
  }

  // Function to update the scope status indicator on the dashboard
  function updateScopeStatusIndicator(inScope, programs = []) {
    let html = '';
    
    if (inScope && programs && programs.length > 0) {
      const programNames = getProgramNames(programs);
      html = `
        <div class="status-icon in-scope">
          <span class="icon-content">In Scope: ${programNames || 'Unknown program'}</span>
        </div>
      `;
    } else {
      html = `
        <div class="status-icon out-of-scope">
          <span class="icon-content">Out of Scope</span>
        </div>
      `;
    }
    
    if (scopeStatusElement) {
      scopeStatusElement.innerHTML = html;
    }
  }

  // Function to toggle the active proxy (used by quick toggle)
  function toggleActiveProxy() {
    // If there's an active proxy, deactivate it
    if (activeProxyId) {
      toggleProxy(activeProxyId, false);
    } else {
      // If no active proxy, check if there's a proxy to activate
      if (proxies.length > 0) {
        // Use the most recently used proxy or the first one
        const proxyToActivate = proxies[0].id;
        toggleProxy(proxyToActivate, true);
      } else {
        showStatus('No proxies available. Please add a proxy first.', 'warning');
      }
    }
    
    // Update the quick toggle button state
    updateQuickToggleState();
  }

  // Function to switch tabs - improved for dashboard
  function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      if (tab.dataset.tab === tabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      if (content.id === `${tabId}-content`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
    
    // Perform tab-specific actions
    if (tabId === 'dashboard') {
      updateDashboardStats();
    } else if (tabId === 'proxies') {
      loadProxies();
    } else if (tabId === 'programs') {
      loadPrograms();
      updateScopeStatus();
    }
  }

  // Add this new function to update the active proxy info
  function updateActiveProxyInfo() {
    const activeProxyInfoElement = document.getElementById('active-proxy-info');
    if (!activeProxyInfoElement) return;
    
    chrome.storage.local.get(['proxies', 'activeProxy'], (data) => {
      const proxies = data.proxies || [];
      const activeProxyId = data.activeProxy;
      
      // If no active proxy, show empty state
      if (!activeProxyId || proxies.length === 0) {
        activeProxyInfoElement.innerHTML = `
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <p>No active proxy</p>
          </div>
        `;
        return;
      }
      
      // Find the active proxy
      const activeProxy = proxies.find(proxy => proxy.id === activeProxyId);
      if (!activeProxy) {
        activeProxyInfoElement.innerHTML = `
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <p>Selected proxy not found</p>
          </div>
        `;
        return;
      }
      
      // Create HTML for active proxy details with improved table-like structure
      const connectionString = `${activeProxy.protocol}://${activeProxy.ip}:${activeProxy.port}`;
      
      activeProxyInfoElement.innerHTML = `
        <div class="active-proxy-details">
          <div class="proxy-info-row">
            <div class="proxy-info-label">Status</div>
            <div class="proxy-status-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Active
            </div>
          </div>
          <div class="proxy-info-row">
            <div class="proxy-info-label">Name</div>
            <div class="proxy-info-value">${activeProxy.name}</div>
          </div>
          <div class="proxy-info-row">
            <div class="proxy-info-label">Connection</div>
            <div class="proxy-info-value">${connectionString}</div>
          </div>
          ${activeProxy.username ? `
          <div class="proxy-info-row">
            <div class="proxy-info-label">Auth</div>
            <div class="proxy-info-value">${activeProxy.username}</div>
          </div>` : ''}
        </div>
      `;
    });
  }

  // Function to update the quick toggle button state
  function updateQuickToggleState() {
    const quickToggleBtn = document.getElementById('quick-proxy-toggle');
    if (!quickToggleBtn) return;
    
    // Clear existing classes
    quickToggleBtn.classList.remove('active', 'inactive');
    
    if (activeProxyId) {
      quickToggleBtn.classList.add('active');
      quickToggleBtn.title = 'Disable Proxy';
    } else {
      quickToggleBtn.classList.add('inactive');
      quickToggleBtn.title = 'Enable Proxy';
    }
  }

  // Initialize the popup
  function init() {
    // Load data
    loadProxies();
    loadPrograms();
    
    // Set up tabs
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        switchTab(tabName);
      });
    });
    
    // Update UI
    updateDashboardStats();
    renderProxyList();
    renderProgramList();
    updateActiveProxyInfo();
    checkCurrentUrl();
    updateQuickToggleState();
    
    // Set up form event listeners
    if (proxyForm) {
      proxyForm.addEventListener('submit', saveProxy);
    }
  }
  
  // Call init when DOM is ready
  init();

  // Function to ensure a URL has a scheme
  function ensureUrlScheme(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }
});