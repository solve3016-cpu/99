// UI Elements
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const openSettings = document.getElementById('openSettings');
const closeSettings = document.getElementById('closeSettings');
const settingsOverlay = document.getElementById('settingsOverlay');
const apiUrlInput = document.getElementById('apiUrlInput');
const authTokenInput = document.createElement('input'); // New input for token
const saveSettings = document.getElementById('saveSettings');

// Add Token Input to UI dynamically
const tokenGroup = document.createElement('div');
tokenGroup.className = 'form-group';
tokenGroup.innerHTML = '<label>Authorization Token (Bearer ...)</label>';
authTokenInput.type = 'text';
authTokenInput.placeholder = 'Bearer eyJhbG...';
authTokenInput.style.width = '100%';
authTokenInput.style.padding = '10px';
authTokenInput.style.border = '1px solid #e2e8f0';
authTokenInput.style.borderRadius = '8px';
tokenGroup.appendChild(authTokenInput);
apiUrlInput.parentNode.insertBefore(tokenGroup, apiUrlInput.nextSibling);

let API_URL = '';
let AUTH_TOKEN = '';

// Load saved configuration
chrome.storage.local.get(['apiUrl', 'authToken'], (result) => {
  if (result.apiUrl) {
    API_URL = result.apiUrl;
    apiUrlInput.value = result.apiUrl;
  }
  if (result.authToken) {
    AUTH_TOKEN = result.authToken;
    authTokenInput.value = result.authToken;
  }
});

// Settings Handlers
openSettings.addEventListener('click', () => settingsOverlay.style.display = 'flex');
closeSettings.addEventListener('click', () => settingsOverlay.style.display = 'none');
saveSettings.addEventListener('click', () => {
  const url = apiUrlInput.value.trim().replace(/\/$/, '');
  const token = authTokenInput.value.trim();
  
  chrome.storage.local.set({ apiUrl: url, authToken: token }, () => {
    API_URL = url;
    AUTH_TOKEN = token;
    settingsOverlay.style.display = 'none';
    alert('Configuration saved!');
  });
});

function addMessage(role, content) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}`;
  msgDiv.innerHTML = content;
  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
  return msgDiv;
}

async function handleSend() {
  const text = userInput.value.trim();
  if (!text || !API_URL || !AUTH_TOKEN) {
    alert('Please complete Setup API first!');
    return;
  }

  userInput.value = '';
  addMessage('user', text);
  const loading = addMessage('assistant', 'Processing...');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const projectId = tab.url.split('/').pop().split('?')[0];
    
    const cookies = await chrome.cookies.getAll({ domain: 'lovable.dev' });
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        projectId: projectId,
        cookies: cookieStr,
        authToken: AUTH_TOKEN
      })
    });

    const data = await response.json();
    loading.remove();
    addMessage('assistant', data.success ? '✅ Sent!' : '❌ Failed: ' + data.message);
  } catch (err) {
    loading.remove();
    addMessage('assistant', '❌ Connection Error');
  }
}

sendBtn.addEventListener('click', handleSend);
