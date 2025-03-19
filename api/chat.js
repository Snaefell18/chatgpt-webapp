// Statt den API-Schlüssel direkt zu verwenden, erfolgt der API-Aufruf über eigene Endpunkte,
// die den bei Vercel hinterlegten Schlüssel serverseitig nutzen.

// ChatGPT-API-Aufruf über den Endpoint /api/chat
async function callChatGPTAPI(message, chatHistory, options = {}) {
  const model = options.model || 'gpt-3.5-turbo';
  let userMessage = message;
  if (userMessage.toLowerCase().startsWith('bild von')) {
    userMessage = userMessage.replace(/^bild von/i, "BILD VON");
  }
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, message: userMessage, chatHistory })
  });
  const data = await response.json();
  if (data.answer) { 
    return data.answer; 
  } else { 
    throw new Error('Keine Antwort von der ChatGPT API erhalten.'); 
  }
}

// DALL‑E API-Aufruf über den Endpoint /api/dalle
async function callDalleAPI(message, chatHistory, options = {}) {
  let prompt = message;
  if (prompt.toLowerCase().startsWith('bild von')) {
    prompt = prompt.replace(/^bild von/i, "BILD VON");
  }
  const model = options.model || 'dalle2';
  const size = model === 'dalle3_hd' ? '1024x1024' : '512x512';
  const response = await fetch('/api/dalle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, size })
  });
  const data = await response.json();
  if (data.url) { 
    return data.url; 
  } else { 
    throw new Error('Keine Bildantwort von der DALL‑E API erhalten.'); 
  }
}

// Gemeinsame Funktion zur Verarbeitung einer Chatnachricht inkl. Kontextspeicherung
async function processChat(chatInputId, chatBoxId, historyKey, textModel, imageModel) {
  const inputElem = document.getElementById(chatInputId);
  let message = inputElem.value.trim();
  if (!message) return;
  if (message.toLowerCase().startsWith('bild von')) {
    message = message.replace(/^bild von/i, "BILD VON");
  }
  inputElem.value = '';
  const chatBox = document.getElementById(chatBoxId);
  
  // Anzeige der Nutzernachricht mit Avatar
  const userMsgDiv = document.createElement('div');
  userMsgDiv.classList.add('message', 'user-message');
  userMsgDiv.innerHTML = '<span class="avatar">🥼</span> ' + message;
  chatBox.appendChild(userMsgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  let chatHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
  chatHistory.push({ role: 'user', content: message });
  
  try {
    if (message.toLowerCase().startsWith("BILD VON")) {
      // Bildgenerierung auslösen
      const imageUrl = await callDalleAPI(message, chatHistory, { model: imageModel });
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = message;
      chatBox.appendChild(img);
    } else {
      // Textantwort von ChatGPT anfordern
      const botResponse = await callChatGPTAPI(message, chatHistory, { model: textModel });
      const botMsgDiv = document.createElement('div');
      botMsgDiv.classList.add('message', 'bot-message');
      botMsgDiv.innerHTML = '<span class="avatar">☀️</span> ' + botResponse;
      chatBox.appendChild(botMsgDiv);
      chatHistory.push({ role: 'assistant', content: botResponse });
    }
    localStorage.setItem(historyKey, JSON.stringify(chatHistory));
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    console.error(error);
    alert('Fehler bei der API-Anfrage: ' + error.message);
  }
}

// Chatty 1: Event-Listener und Senden-Funktion
document.getElementById('chatInput').addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    await processChat('chatInput', 'chatBox', 'chatHistory', 'gpt-3.5-turbo', 'dalle2');
  }
});
window.sendChatMessage = async function() {
  await processChat('chatInput', 'chatBox', 'chatHistory', 'gpt-3.5-turbo', 'dalle2');
};
window.startSpeechRecognition = function() {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "de-DE";
  recognition.start();
  recognition.onresult = (event) => {
    document.getElementById("chatInput").value = event.results[0][0].transcript;
  };
};

// Chatty Pro: Event-Listener und Senden-Funktion (früher Chatty 2)
document.getElementById('chatInput2').addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    await processChat('chatInput2', 'chatBox2', 'chatHistory2', 'gpt-4', 'dalle3_hd');
  }
});
window.sendChatMessage2 = async function() {
  await processChat('chatInput2', 'chatBox2', 'chatHistory2', 'gpt-4', 'dalle3_hd');
};
window.startSpeechRecognition2 = function() {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "de-DE";
  recognition.start();
  recognition.onresult = (event) => {
    document.getElementById("chatInput2").value = event.results[0][0].transcript;
  };
};
