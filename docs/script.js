(function(){
  const API_BASE = 'https://apis.xcasper.space/api/ai/mistral';
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');
  const messages = document.getElementById('messages');
  const sendBtn = document.getElementById('sendBtn');

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
    addMessage(text, 'user');
    input.value = '';
    setLoading(true);
    try{
      const reply = await fetchReply(text);
      addMessage(reply || 'Hmm, I got lost chasing my tail.', 'assistant');
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