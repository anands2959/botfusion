(function () {
  // Configuration
  const BOTFUSION_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://botfusion-ten.vercel.app';

  // Get the chatbot ID from the script tag
  const scriptTag = document.currentScript;
  const chatbotId = scriptTag.getAttribute('data-chatbot-id');

  if (!chatbotId) {
    console.error('BotFusion: Missing chatbot ID');
    return;
  }

  // Create and inject base CSS
  const style = document.createElement('style');
  style.textContent = `
    .botfusion-widget {
      position: fixed;
      z-index: 9999;
      transition: all 0.3s ease;
    }
    .botfusion-widget.bottom-right {
      bottom: 20px;
      right: 20px;
    }
    .botfusion-widget.bottom-left {
      bottom: 20px;
      left: 20px;
    }
    .botfusion-widget.top-right {
      top: 20px;
      right: 20px;
    }
    .botfusion-widget.top-left {
      top: 20px;
      left: 20px;
    }
    .botfusion-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
    }
    .botfusion-button:hover {
      transform: scale(1.05);
    }
    .botfusion-button img {
      width: 35px;
      height: 35px;
      object-fit: contain;
    }
    .botfusion-chat {
      position: absolute;
      width: 350px;
      height: 500px;
      border-radius: 10px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
    }
    .botfusion-chat.bottom-right {
      bottom: 80px;
      right: 0;
    }
    .botfusion-chat.bottom-left {
      bottom: 80px;
      left: 0;
    }
    .botfusion-chat.top-right {
      top: 80px;
      right: 0;
    }
    .botfusion-chat.top-left {
      top: 80px;
      left: 0;
    }
    .botfusion-chat.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }
    .botfusion-chat-header {
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eaeaea;
    }
    .botfusion-chat-header-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .botfusion-chat-header-title img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    .botfusion-chat-header-title h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    .botfusion-chat-close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 20px;
      color: #666;
    }
    .botfusion-chat-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      white-space: normal;
      word-wrap: break-word;
    }
    .botfusion-message {
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
      white-space: normal;
      word-wrap: break-word;
    }
    .botfusion-message p {
      margin: 0 0 8px 0;
    }
    .botfusion-message p:last-child {
      margin-bottom: 0;
    }
    .botfusion-message strong {
      font-weight: bold;
    }
    .botfusion-message em {
      font-style: italic;
    }
    .botfusion-message u {
      text-decoration: underline;
    }
    .botfusion-message.bot {
      align-self: flex-start;
      background: #f0f0f0;
      color: #333;
      border-bottom-left-radius: 5px;
    }
    .botfusion-message.user {
      align-self: flex-end;
      color: white;
      border-bottom-right-radius: 5px;
    }
    .botfusion-chat-input {
      padding: 15px;
      color: #424242;
      border-top: 1px solid #eaeaea;
      display: flex;
      gap: 10px;
    }
    .botfusion-chat-input input {
      flex: 1;
      padding: 10px 15px;
      color: #424242;
      border: 1px solid #ddd;
      border-radius: 20px;
      outline: none;
      font-size: 14px;
    }
    .botfusion-chat-input button {
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .botfusion-chat-input button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .botfusion-typing {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px 15px;
      background: #f0f0f0;
      border-radius: 18px;
      font-size: 14px;
      align-self: flex-start;
      margin-bottom: 10px;
      color: #666;
    }
      .botfusion-chat-close{
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        color: #fff;
      }
    .botfusion-dot {
      width: 8px;
      height: 8px;
      background: #666;
      border-radius: 50%;
      animation: botfusion-typing 1.4s infinite both;
    }
    .botfusion-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    .botfusion-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes botfusion-typing {
      0%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      50% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);

  // Create widget elements
  const widget = document.createElement('div');
  widget.className = 'botfusion-widget bottom-right'; // Default position, will be updated from API

  const button = document.createElement('div');
  button.className = 'botfusion-button';
  button.style.backgroundColor = '#4F46E5'; // Default color, will be updated from API

  const buttonIcon = document.createElement('img');
  buttonIcon.src = `${BOTFUSION_URL}/chat-icon.png`; // Default icon, will be updated from API
  buttonIcon.alt = 'Chat';

  const chat = document.createElement('div');
  chat.className = 'botfusion-chat bottom-right'; // Default position, will be updated from API

  // Build chat interface with placeholders that will be updated from API
  chat.innerHTML = `
    <div class="botfusion-chat-header">
      <div class="botfusion-chat-header-title">
        <img src="${BOTFUSION_URL}/chat-icon.png" alt="Bot">
        <h3>BotFusion Assistant</h3>
      </div>
      <button class="botfusion-chat-close">&times;</button>
    </div>
    <div class="botfusion-chat-messages"></div>
    <div class="botfusion-chat-input">
      <input type="text" placeholder="Type your message...">
      <button type="submit">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  `;

  // Append elements
  button.appendChild(buttonIcon);
  widget.appendChild(button);
  widget.appendChild(chat);
  document.body.appendChild(widget);

  // Get references to elements
  const chatMessages = chat.querySelector('.botfusion-chat-messages');
  const chatInput = chat.querySelector('input');
  const chatSubmit = chat.querySelector('button[type="submit"]');
  const chatClose = chat.querySelector('.botfusion-chat-close');

  // Chat state
  let isChatOpen = false;
  let isTyping = false;

  // Fetch chatbot configuration
  fetch(`${BOTFUSION_URL}/api/embed/${chatbotId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load chatbot configuration');
      }
      return response.json();
    })
    .then(data => {
      // Update widget with chatbot configuration
      if (data.name) {
        chat.querySelector('h3').textContent = data.name;
      }

      if (data.logoUrl) {
        // Update logo in both button and chat header
        buttonIcon.src = data.logoUrl.startsWith('mongodb-image-')
          ? `${BOTFUSION_URL}/api/uploads/${data.userId}/${data.logoUrl}`
          : data.logoUrl;

        // Add error handling for logo image
        buttonIcon.onerror = function () {
          console.error('Failed to load logo image:', buttonIcon.src);
          // Fallback to default icon
          buttonIcon.src = `${BOTFUSION_URL}/chat-icon.png`;
        };

        const headerLogo = chat.querySelector('.botfusion-chat-header-title img');
        headerLogo.src = buttonIcon.src;

        // Add error handling for header logo image
        headerLogo.onerror = function () {
          console.error('Failed to load header logo image:', headerLogo.src);
          // Fallback to default icon
          headerLogo.src = `${BOTFUSION_URL}/chat-icon.png`;
        };
      }

      if (data.colorScheme) {
        // Apply color scheme to button and send button
        button.style.backgroundColor = data.colorScheme;
        chat.querySelector('.botfusion-chat-input button').style.backgroundColor = data.colorScheme;

        // Apply color to chat header
        chat.querySelector('.botfusion-chat-header').style.backgroundColor = data.colorScheme;
        chat.querySelector('.botfusion-chat-header').style.color = 'white';

        // Update user message color and input focus color
        style.textContent += `
          .botfusion-message.user {
            background: ${data.colorScheme};
          }
          .botfusion-chat-input input:focus {
            border-color: ${data.colorScheme};
          }
        `;
      }

      if (data.widgetPosition) {
        // Update widget position
        widget.className = `botfusion-widget ${data.widgetPosition}`;
        // Also update chat position to match
        chat.className = `botfusion-chat ${data.widgetPosition}`;
      }

      // Add welcome message
      if (data.welcomeMessage) {
        addMessage('bot', data.welcomeMessage);
      } else {
        addMessage('bot', 'Hello! How can I help you today?');
      }

      // Ensure the chat messages container has proper styling for formatted content
      chatMessages.style.whiteSpace = 'normal';
    })
    .catch(error => {
      console.error('BotFusion:', error);
      addMessage('bot', 'Sorry, I\'m having trouble connecting. Please try again later.');
    });

  // Event listeners
  button.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);

  chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !isTyping && chatInput.value.trim()) {
      sendMessage();
    }
  });

  chatSubmit.addEventListener('click', function () {
    if (!isTyping && chatInput.value.trim()) {
      sendMessage();
    }
  });

  // Functions
  function toggleChat() {
    isChatOpen = !isChatOpen;
    chat.classList.toggle('open', isChatOpen);
  }

  function addMessage(sender, text) {
    const message = document.createElement('div');
    message.className = `botfusion-message ${sender}`;

    // Format the message to handle line breaks and markdown-style formatting
    const formattedText = formatMessage(text);
    message.innerHTML = formattedText;

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function formatMessage(text) {
    if (!text) return '';

    // Handle double line breaks as paragraph breaks
    let formatted = text.replace(/\n\n+/g, '</p><p>');

    // Replace single line breaks with <br> tags
    formatted = formatted.replace(/\n/g, '<br>');

    // Wrap in paragraph tags if not already wrapped
    if (!formatted.startsWith('<p>')) {
      formatted = '<p>' + formatted + '</p>';
    }

    // Replace markdown-style formatting
    // Bold: **text** -> <strong>text</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text* -> <em>text</em>
    formatted = formatted.replace(/\b\*((?!\*)[^\n]+)\*\b/g, '<em>$1</em>');

    // Underline: __text__ -> <u>text</u>
    formatted = formatted.replace(/__(.*?)__/g, '<u>$1</u>');

    // Process bullet points
    formatted = formatted.split('<br>').map(line => {
      // Convert bullet points at the beginning of lines
      // Only convert if it's not already part of a bold/italic formatting
      if (line.match(/^\s*\*\s/) && !line.match(/\*\*/) && !line.match(/\*[^\s].*\*/)) {
        return line.replace(/^\s*\*\s(.+)$/, '• $1');
      }
      return line;
    }).join('<br>');

    return formatted;
  }

  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'botfusion-typing';
    typing.innerHTML = `
      <div class="botfusion-dot"></div>
      <div class="botfusion-dot"></div>
      <div class="botfusion-dot"></div>
    `;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage('user', message);
    chatInput.value = '';

    // Show typing indicator
    isTyping = true;
    chatSubmit.disabled = true;
    const typingIndicator = showTypingIndicator();

    // Send message to server
    fetch(`${BOTFUSION_URL}/api/embed/${chatbotId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to get response');
        }
        return response.json();
      })
      .then(data => {
        // Remove typing indicator
        typingIndicator.remove();
        isTyping = false;
        chatSubmit.disabled = false;

        // Add bot response
        addMessage('bot', data.response);
      })
      .catch(error => {
        console.error('BotFusion:', error);

        // Remove typing indicator
        typingIndicator.remove();
        isTyping = false;
        chatSubmit.disabled = false;

        // Add error message
        addMessage('bot', 'Sorry, I\'m having trouble responding right now. Please try again later.');
      });
  }
})();
