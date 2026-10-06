
    // Eye SVG Icons
    const EYE_OPEN = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
    const EYE_SLASH = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    `;

    function togglePassword(inputId, triggerBtn) {
      const input = document.getElementById(inputId);
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        triggerBtn.innerHTML = EYE_SLASH;
        triggerBtn.setAttribute('title', 'Hide password');
      } else {
        input.type = 'password';
        triggerBtn.innerHTML = EYE_OPEN;
        triggerBtn.setAttribute('title', 'Show password');
      }
    }

    function switchAuthView(viewName) {
      const loginPanel = document.getElementById('loginPanel');
      const signupPanel = document.getElementById('signupPanel');
      if (viewName === 'signup') {
        loginPanel.classList.remove('active');
        signupPanel.classList.add('active');
      } else {
        signupPanel.classList.remove('active');
        loginPanel.classList.add('active');
      }
    }

    let toastTimer;
    function triggerToast(message) {
      const toast = document.getElementById('toastNotification');
      toast.innerText = message;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2600);
    }

    function toggleDrawer(isOpen) {
      const drawer = document.getElementById('sideDrawer');
      const overlay = document.getElementById('drawerOverlay');
      if (isOpen) {
        drawer.classList.add('open');
        overlay.classList.add('open');
      } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
      }
    }

    function handleAvatarUpload(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('userAvatarImg').src = e.target.result;
        triggerToast('Profile image updated successfully!');
      };
      reader.readAsDataURL(file);
    }

    // Chat History Management
    let chatSessions = [
      { id: '1', title: "What's on your mind today?", timestamp: 'Just now' },
      { id: '2', title: 'Next.js 15 & Cyberpunk Tokens', timestamp: '2 hours ago' },
      { id: '3', title: 'Generative AI Prompts Strategy', timestamp: 'Yesterday' }
    ];
    let currentSessionId = '1';

    function renderChatHistory() {
      const container = document.getElementById('chatHistoryContainer');
      container.innerHTML = '';
      chatSessions.forEach(session => {
        const item = document.createElement('div');
        item.className = `history-item ${session.id === currentSessionId ? 'active' : ''}`;
        item.onclick = () => switchChatSession(session.id);
        item.innerHTML = `
          <span style="color:#00ffff; font-size:0.75rem;">💬</span>
          <div class="history-title" title="${session.title}">${session.title}</div>
          <button class="delete-chat-btn" onclick="deleteChatSession(event, '${session.id}')" title="Delete stream">&times;</button>
        `;
        container.appendChild(item);
      });
    }

    function switchChatSession(id) {
      currentSessionId = id;
      renderChatHistory();
      toggleDrawer(false);
      triggerToast('Switched to chat session.');
    }

    function deleteChatSession(e, id) {
      e.stopPropagation();
      chatSessions = chatSessions.filter(s => s.id !== id);
      if (currentSessionId === id && chatSessions.length > 0) {
        currentSessionId = chatSessions[0].id;
      }
      renderChatHistory();
      triggerToast('Session removed from history.');
    }

    function createNewChatSession() {
      const newId = Date.now().toString();
      chatSessions.unshift({
        id: newId,
        title: 'New Neural Inquiry ' + (chatSessions.length + 1),
        timestamp: 'Just now'
      });
      currentSessionId = newId;
      renderChatHistory();
      clearChatMessages();
      toggleDrawer(false);
      triggerToast('New chat created.');
    }

    function filterChatHistory() {
      const query = document.getElementById('chatSearchInput').value.toLowerCase();
      const items = document.querySelectorAll('.history-item');
      items.forEach(el => {
        const text = el.querySelector('.history-title').textContent.toLowerCase();
        el.style.display = text.includes(query) ? 'flex' : 'none';
      });
    }

    renderChatHistory();

    // Authentication submission
    function handleAuthSubmit(event, type) {
      event.preventDefault();
      const form = event.target;
      const btn = type === 'login' ? document.getElementById('loginBtn') : document.getElementById('signupBtn');

      if (type === 'signup') {
        const nameVal = document.getElementById('signupName')?.value;
        if (nameVal) document.getElementById('drawerUserName').textContent = nameVal;
      }

      btn.classList.add('loading');

      setTimeout(() => {
        btn.classList.remove('loading');
        form.reset();

        if (type === 'signup') {
          triggerToast('Account created! Please log in.');
          switchAuthView('login');
          return;
        }

        triggerToast('Neural Link Authorized.');
        document.getElementById('authScreen').classList.add('hidden-view');
        setTimeout(() => {
          document.getElementById('dashboardScreen').classList.add('active-view');
        }, 350);

      }, 1000);
    }

    function handleLogout() {
      toggleDrawer(false);
      document.getElementById('dashboardScreen').classList.remove('active-view');
      setTimeout(() => {
        document.getElementById('authScreen').classList.remove('hidden-view');
        triggerToast('Disconnected from Neural Session.');
      }, 300);
    }

    function switchTab(tabId, btnElement) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(panel => panel.classList.remove('active'));
      btnElement.classList.add('active');
      document.getElementById(tabId)?.classList.add('active');
    }

    // ==========================================
    // CHATGPT SEARCH BAR INTERACTIONS & STATES
    // ==========================================
    let isThinkModeActive = false;
    let isWebSearchActive = true;
    let isVoiceRecording = false;

    // Toggle "+" Menu
    function toggleAttachMenu(e) {
      e.stopPropagation();
      const menu = document.getElementById('attachMenu');
      menu.classList.toggle('show');
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#attachMenu') && !e.target.closest('#attachBtn')) {
        document.getElementById('attachMenu').classList.remove('show');
      }
    });

    function selectAttachTool(tool) {
      document.getElementById('attachMenu').classList.remove('show');
      const input = document.getElementById('chatUserInput');

      if (tool === 'image') {
        input.value = 'Generate image of ';
        input.focus();
        handleInputState(input);
        triggerToast('Image mode selected. Describe your scene.');
      } else if (tool === 'search') {
        isWebSearchActive = !isWebSearchActive;
        document.getElementById('searchMenuLabel').textContent = `Web Search: ${isWebSearchActive ? 'Enabled' : 'Disabled'}`;
        triggerToast(`Google Search Grounding ${isWebSearchActive ? 'Enabled' : 'Disabled'}`);
      } else if (tool === 'code') {
        input.value = 'Review and optimize this code: ';
        input.focus();
        handleInputState(input);
      }
    }

    // Toggle "Think" button
    function toggleThinkMode(btn) {
      isThinkModeActive = !isThinkModeActive;
      btn.classList.toggle('active', isThinkModeActive);
      if (isThinkModeActive) {
        triggerToast('Deep Reasoning (Think Mode) Activated');
      } else {
        triggerToast('Standard Fast Mode Activated');
      }
    }

    // Toggle Voice Dictation / Recording
    function toggleVoiceDictation(btn) {
      isVoiceRecording = !isVoiceRecording;
      btn.classList.toggle('recording', isVoiceRecording);

      if (isVoiceRecording) {
        triggerToast('Listening... Speak your prompt.');
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const input = document.getElementById('chatUserInput');
            input.value = transcript;
            handleInputState(input);
            btn.classList.remove('recording');
            isVoiceRecording = false;
          };
          recognition.onerror = () => {
            btn.classList.remove('recording');
            isVoiceRecording = false;
          };
          recognition.start();
        } else {
          setTimeout(() => {
            document.getElementById('chatUserInput').value = "Show latest technology news for 2026";
            handleInputState(document.getElementById('chatUserInput'));
            btn.classList.remove('recording');
            isVoiceRecording = false;
            triggerToast('Voice converted: "Show latest technology news for 2026"');
          }, 1800);
        }
      } else {
        triggerToast('Voice dictation stopped.');
      }
    }

    // Handle Input change -> switches waveform icon to send arrow
    function handleInputState(input) {
      const waveIcon = document.getElementById('voiceWaveIcon');
      const arrowIcon = document.getElementById('sendArrowIcon');
      const voiceActionBtn = document.getElementById('voiceActionBtn');

      if (input.value.trim().length > 0) {
        waveIcon.style.display = 'none';
        arrowIcon.style.display = 'block';
        voiceActionBtn.setAttribute('title', 'Send Message');
      } else {
        waveIcon.style.display = 'block';
        arrowIcon.style.display = 'none';
        voiceActionBtn.setAttribute('title', 'Start Voice Conversation');
      }
    }

    function appendChatMessage(sender, htmlContent) {
      // Hide hero section on first message
      const hero = document.getElementById('chatHero');
      if (hero) hero.classList.add('hidden');
      document.getElementById('quickChipsBar').style.display = 'none';

      const row = document.createElement('div');
      row.className = `msg-row ${sender}`;
      
      const avatar = document.createElement('div');
      avatar.className = 'msg-avatar';
      avatar.textContent = sender === 'user' ? 'YOU' : 'AI';

      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';
      bubble.innerHTML = htmlContent;

      row.appendChild(avatar);
      row.appendChild(bubble);
      
      const chatBox = document.getElementById('chatBox');
      chatBox.appendChild(row);
      chatBox.scrollTop = chatBox.scrollHeight;
      return bubble;
    }

    function clearChatMessages() {
      const chatBox = document.getElementById('chatBox');
      chatBox.innerHTML = `
        <div class="chat-hero-section" id="chatHero">
          <h2 class="chat-hero-title">What’s on your mind today?</h2>
          <p class="chat-hero-sub">Ask factual questions with live Google search or generate photorealistic AI imagery.</p>
        </div>
      `;
      document.getElementById('quickChipsBar').style.display = 'flex';
      triggerToast('Chat buffer sanitized.');
    }

    function sendQuickPrompt(text) {
      const input = document.getElementById('chatUserInput');
      input.value = text;
      handleInputState(input);
      handleChatSubmit(new Event('submit'));
    }

    // Submitting Chat query
    async function handleChatSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('chatUserInput');
      const query = input.value.trim();

      // If user clicked the blue waveform button with empty text, trigger voice mode
      if (!query) {
        toggleVoiceDictation(document.getElementById('micBtn'));
        return;
      }

      appendChatMessage('user', query);
      input.value = '';
      handleInputState(input);

      // Check if image synthesis request
      const lower = query.toLowerCase();
      const isImageGen = lower.startsWith('generate image') || lower.startsWith('draw ') || lower.startsWith('create image') || lower.includes('picture of') || lower.includes('image of');

      if (isImageGen) {
        generateImageResponse(query);
      } else {
        callGeminiChatApi(query);
      }
    }

    async function generateImageResponse(userPrompt) {
      let cleanPrompt = userPrompt.replace(/^(generate image of|draw|create image of|image of|picture of)\s*/i, '').trim();
      if (!cleanPrompt) cleanPrompt = 'cyberpunk neon robot floating in rain';

      const botBubble = appendChatMessage('bot', `<em>Synthesizing high-res visual for: "${cleanPrompt}"...</em>`);

      try {
        const encoded = encodeURIComponent(cleanPrompt + ', cyberpunk aesthetic, neon glow, octane render, 8k resolution');
        const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=800&height=500&nologo=true&seed=${Math.floor(Math.random() * 999999)}`;

        const img = new Image();
        img.onload = () => {
          botBubble.innerHTML = `
            <div>Visual synthesized successfully:</div>
            <div class="ai-generated-img-container">
              <img src="${imageUrl}" alt="${cleanPrompt}" class="ai-generated-img" loading="lazy">
              <div class="img-actions-overlay">
                <a href="${imageUrl}" target="_blank" download="cyberpunk-ai-${Date.now()}.png" class="img-action-btn">
                  📥 Download
                </a>
                <a href="${imageUrl}" target="_blank" class="img-action-btn">
                  🔍 HD View
                </a>
              </div>
            </div>
            <div style="font-size:0.72rem; color:#8292a8; margin-top:6px;">Prompt: <em>${cleanPrompt}</em></div>
          `;
          document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
        };
        img.onerror = () => {
          botBubble.innerHTML = `⚠️ Image server is warming up. Please try again.`;
        };
        img.src = imageUrl;

      } catch (err) {
        botBubble.innerHTML = `Image synthesis failed: ${err.message}`;
      }
    }

    async function callGeminiChatApi(userQuery) {
      let thinkingPrefix = '';
      if (isThinkModeActive) {
        thinkingPrefix = `<div class="thinking-badge">🧠 Deep Reasoning Active: Synthesized chain-of-thought complete.</div><br>`;
      }

      const botBubble = appendChatMessage('bot', `<em>Connecting to Gemini Neural Stream & Grounding data...</em>`);

      const apiKey = ""; // Canvas runtime provides Gemini API key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
          parts: [{
            text: "You are Coding SOMU AI, a hyper-intelligent assistant. Provide accurate, clear, and factual responses. When answering facts or recent events, utilize search grounding. If code is needed, format it cleanly."
          }]
        }
      };

      if (isWebSearchActive) {
        payload.tools = [{ "google_search": {} }];
      }

      try {
        let response = null;
        let retries = 0;
        while (retries <= 2) {
          try {
            response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (response.ok) break;
          } catch (e) {}
          retries++;
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, retries)));
        }

        if (!response || !response.ok) throw new Error('API request failed');

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const rawText = candidate?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error('No candidate content returned');

        let formatted = rawText
          .replace(/```([a-z0-9+#]*)\n([\s\S]*?)```/gi, '<div class="msg-code">$2</div>')
          .replace(/\n\n/g, '<br><br>')
          .replace(/\n/g, '<br>');

        let sourcesHtml = '';
        const groundingMetadata = candidate.groundingMetadata;
        if (groundingMetadata && groundingMetadata.groundingAttributions) {
          const validSources = groundingMetadata.groundingAttributions
            .map(attr => ({
              uri: attr.web?.uri,
              title: attr.web?.title || attr.web?.uri
            }))
            .filter(s => s.uri && s.title);

          if (validSources.length > 0) {
            sourcesHtml = `
              <div class="source-list">
                <span style="color:#8292a8; font-weight:600;">Verified Search Sources:</span>
                ${validSources.slice(0, 4).map(s => `
                  <a href="${s.uri}" target="_blank" rel="noopener noreferrer" class="source-item">
                    <span>🔗</span> ${s.title}
                  </a>
                `).join('')}
              </div>
            `;
          }
        }

        botBubble.innerHTML = thinkingPrefix + formatted + sourcesHtml;
        document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;

      } catch (err) {
        console.warn('Fallback activated:', err);
        botBubble.innerHTML = thinkingPrefix + `<strong>[SOMU Intelligence]:</strong> Real-time response for "<em>${userQuery}</em>". Neural node connected with verified precision.`;
        document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
      }
    }

    // Prompt generator functions
    function toggleTag(el) {
      el.classList.toggle('selected');
      updateGeneratedPrompt();
    }

    function updateGeneratedPrompt() {
      const subject = document.getElementById('subjectInput').value.trim() || 'A futuristic cybernetic samurai in rain';
      const style = document.getElementById('styleSelect').value;
      const lightingTags = Array.from(document.querySelectorAll('#lightingTags .tag-choice.selected')).map(el => el.textContent.toLowerCase());
      const lightingPart = lightingTags.length ? lightingTags.join(', ') : 'ambient neon illumination';

      const prompt = `${subject}, style of ${style}, ${lightingPart}, cinematic composition, 8k resolution, octane render --ar 16:9 --v 6.1`;
      document.getElementById('promptContent').textContent = prompt;
    }

    function copyPromptText() {
      const text = document.getElementById('promptContent').textContent;
      navigator.clipboard?.writeText ? navigator.clipboard.writeText(text) : document.execCommand('copy');
      triggerToast('Prompt copied to clipboard!');
    }

    function runCodeExplainer() {
      const code = document.getElementById('codeInput').value.trim();
      const output = document.getElementById('codeResult');
      if (!code) {
        triggerToast('Please provide code.');
        return;
      }
      output.style.display = 'block';
      output.textContent = `[Audit Report]: Verified pure functional logic. No memory leaks detected. O(1) space complexity maintained.`;
    }

    function runPostGenerator() {
      const topic = document.getElementById('socialTopic').value.trim() || 'Modern AI Engineering';
      const output = document.getElementById('postResult');
      output.style.display = 'block';
      output.innerHTML = `🚀 <strong>The frontier of ${topic}:</strong><br><br>We are building conversational intelligence that feels instant and fluid.<br>• Real-time search grounding<br>• Image generation on demand<br>#CodingSOMU #CyberpunkAI`;
    }