(function(){
  const API_BASE = 'https://apis.xcasper.space/api/ai/mistral';
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');
  const messages = document.getElementById('messages');
  const sendBtn = document.getElementById('sendBtn');
  const themeToggle = document.getElementById('themeToggle');
  const colorPicker = document.getElementById('colorPicker');
  const clearBtn = document.getElementById('clearBtn');
  
  const WELCOME_SUGGESTIONS = [
    'Tell me a fun fox fact!',
    'What can you help me with?',
    'Tell me a joke',
    'Write me a short poem',
  ];

  // Theme & Color Management
  function initTheme(){
    const saved = localStorage.getItem('theme') || 'dark';
    const color = localStorage.getItem('accentColor') || '#f97316';
    setTheme(saved);
    setAccentColor(color);
    colorPicker.value = color;
  }

  function setTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
  }

  function setAccentColor(color){
    document.documentElement.style.setProperty('--accent', color);
    localStorage.setItem('accentColor', color);
  }

  themeToggle.addEventListener('click', ()=>{
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  colorPicker.addEventListener('change', (e)=>{
    setAccentColor(e.target.value);
  });

  // Chat Functions
  function showWelcome(){
    messages.innerHTML = '';
    const onlineBadge = document.createElement('div');
    onlineBadge.className = 'online-badge';
    onlineBadge.innerHTML = '<span class="online-dot"></span> Foxy is online';
    messages.appendChild(onlineBadge);

    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'msg assistant';
    welcomeMsg.innerHTML = '<strong>Hey there! I\'m Foxy</strong><br>Your clever AI companion. Ask me anything and I\'ll do my best to help!';
    messages.appendChild(welcomeMsg);

    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.style.cssText = 'padding: 0 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px;';
    WELCOME_SUGGESTIONS.forEach(s => {
      const btn = document.createElement('button');
      btn.textContent = s;
      btn.style.cssText = `
        padding: 10px 12px;
        border: 1px solid var(--border);
        background: var(--bg-tertiary);
        color: var(--text);
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      `;
      btn.onmouseover = () => btn.style.background = 'rgba(249, 115, 22, 0.1)';
      btn.onmouseout = () => btn.style.background = 'var(--bg-tertiary)';
      btn.onclick = () => { input.value = s; form.requestSubmit(); };
      suggestionsDiv.appendChild(btn);
    });
    messages.parentElement.insertBefore(suggestionsDiv, messages.nextSibling);
  }

  function addMessage(text, cls){
    const el = document.createElement('div');
    el.className = 'msg ' + cls;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function setLoading(on){
    sendBtn.disabled = on;
    input.disabled = on;
    if(on){
      addMessage('Foxy is thinking...', 'assistant loading');
    } else {
      const l = messages.querySelector('.loading');
      if(l) l.remove();
    }
  }

  async function fetchReply(message){
    const url = API_BASE + '?message=' + encodeURIComponent(message);
    const res = await fetch(url, { method: 'GET' });
    if(!res.ok) throw new Error('API error: ' + res.status);
    const ct = res.headers.get('content-type') || '';
    if(ct.includes('application/json')){
      const d = await res.json();
      return d.result || d.message || d.response || d.answer || d.text || d.content || d.reply || (typeof d === 'string' ? d : JSON.stringify(d));
    }
    return await res.text();
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    
    if(messages.querySelector('.online-badge')){
      messages.innerHTML = '';
    }
    
    addMessage(text, 'user');
    input.value = '';
    setLoading(true);
    
    try{
      const reply = await fetchReply(text);
      addMessage(reply || 'Hmm, I got lost chasing my tail.', 'assistant');
    }catch(err){
      addMessage('Oops! Foxy tripped over a log. ' + (err.message||''), 'error');
    }finally{
      setLoading(false);
    }
  });

  clearBtn.addEventListener('click', ()=>{
    if(confirm('Clear chat history?')){
      showWelcome();
    }
  });

  input.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      form.requestSubmit();
    }
  });

  // Init
  initTheme();
  showWelcome();

})();