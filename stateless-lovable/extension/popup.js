// UI Elements
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const openSettings = document.getElementById('openSettings');
const closeSettings = document.getElementById('closeSettings');
const settingsOverlay = document.getElementById('settingsOverlay');
const apiUrlInput = document.getElementById('apiUrlInput');
const saveSettings = document.getElementById('saveSettings');

let API_URL = '';

// Load saved configuration
chrome.storage.local.get(['apiUrl'], (result) => {
  if (result.apiUrl) {
    API_URL = result.apiUrl;
    apiUrlInput.value = result.apiUrl;
  }
});

// Settings Handlers
openSettings.addEventListener('click', () => settingsOverlay.style.display = 'flex');
closeSettings.addEventListener('click', () => settingsOverlay.style.display = 'none');
saveSettings.addEventListener('click', () => {
  const url = apiUrlInput.value.trim().replace(/\/$/, '');
  if (!url) {
    alert('Please enter a valid Render URL');
    return;
  }
  chrome.storage.local.set({ apiUrl: url }, () => {
    API_URL = url;
    settingsOverlay.style.display = 'none';
    addMessage('assistant', `✅ Configuration saved! Connected to: ${url}`);
  });
});

// Helper to add messages
function addMessage(role, content) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}`;
  msgDiv.innerHTML = content.replace(/\n/g, '<br>');
  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
  return msgDiv;
}

// Get Lovable cookies
async function getLovableCookies() {
  const domains = ['lovable.dev', '.lovable.dev'];
  let cookieString = '';
  
  for (const domain of domains) {
    const cookies = await chrome.cookies.getAll({ domain });
    cookieString += cookies.map(c => `${c.name}=${c.value}`).join('; ') + '; ';
  }
  
  return cookieString;
}

// Get current project ID
async function getProjectId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url || !tab.url.includes('lovable.dev')) {
    throw new Error('Please open a Lovable.dev project tab first!');
  }
  const parts = tab.url.split('/');
  return parts[parts.length - 1].split('?')[0];
}

// Send Logic
async function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;
  if (!API_URL) {
    alert('Please configure your Render URL first!');
    settingsOverlay.style.display = 'flex';
    return;
  }

  userInput.value = '';
  addMessage('user', text);
  
  const loadingMsg = addMessage('assistant', '<div class="loading-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>');

  try {
    const projectId = await getProjectId();
    const cookies = await getLovableCookies();

    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        projectId: projectId,
        cookies: cookies
      })
    });

    const data = await response.json();
    loadingMsg.remove();

    if (data.success) {
      addMessage('assistant', '✅ Message sent successfully! Lovable is now processing your request.');
    } else {
      addMessage('assistant', `❌ Error: ${data.message || 'Failed to send message'}`);
    }

  } catch (err) {
    loadingMsg.remove();
    addMessage('assistant', `❌ Connection Error: ${err.message}. Make sure your Render server is awake!`);
  }
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});
