(function(){
  const API_BASE = 'https://apis.xcasper.space/api/ai/mistral';
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');
  const messages = document.getElementById('messages');
  const sendBtn = document.getElementById('sendBtn');

  function addMessage(text, cls){
    const el = document.createElement('div');
    el.className = 'msg ' + cls;
    
    // Check if text contains code blocks
    const codeMatch = text.match(/```(\w*)\n([\s\S]*?)```/);
    if(codeMatch){
      renderCodeBlock(el, codeMatch[2], codeMatch[1]);
    } else {
      el.textContent = text;
    }
    
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }
  
  function renderCodeBlock(containerEl, code, lang){
    containerEl.className = 'msg assistant';
    containerEl.innerHTML = '';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    
    const pre = document.createElement('pre');
    const codeEl = document.createElement('code');
    codeEl.textContent = code;
    pre.appendChild(codeEl);
    wrapper.appendChild(pre);
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', async ()=>{
      try{
        await navigator.clipboard.writeText(code);
        copyBtn.textContent = 'Copied';
        setTimeout(()=>copyBtn.textContent='Copy', 1200);
      }catch{
        copyBtn.textContent = 'Failed';
        setTimeout(()=>copyBtn.textContent='Copy', 1200);
      }
    });
    
    wrapper.appendChild(copyBtn);
    containerEl.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }
  
  // Typing simulation
  async function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
  async function typeMessage(el, text, speed = 16){
    el.textContent = '';
    for(let i = 0; i < text.length; i++){
      el.textContent += text[i];
      messages.scrollTop = messages.scrollHeight;
      await sleep(speed);
    }
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
    addMessage(text, 'user');
    input.value = '';
    setLoading(true);
    try{
      const reply = await fetchReply(text);
      const replyText = reply || 'Hmm, I got lost chasing my tail.';
      const msgEl = document.createElement('div');
      msgEl.className = 'msg assistant';
      messages.appendChild(msgEl);
      
      // Check if reply contains code blocks
      const codeMatch = replyText.match(/```(\w*)\n([\s\S]*?)```/);
      if(codeMatch){
        renderCodeBlock(msgEl, codeMatch[2], codeMatch[1]);
      } else {
        await typeMessage(msgEl, replyText);
      }
    }catch(err){
      addMessage('Oops! Foxy tripped. ' + (err.message||''), 'assistant');
    }finally{
      setLoading(false);
    }
  });

  // Enter sends, Shift+Enter new line
  input.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      form.requestSubmit();
    }
  });

})();