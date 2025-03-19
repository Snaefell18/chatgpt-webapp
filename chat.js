// Statt den API-Schlüssel direkt zu nutzen, erfolgt der Aufruf über serverseitige Endpunkte,
// welche den bei Vercel hinterlegten Schlüssel verwenden.

// ChatGPT-API-Aufruf über eigenen Endpoint (/api/chat)
async function callChatGPTAPI(message, chatHistory, options = {}) {
  const model = options.model || 'gpt-3.5-turbo';
  // Falls die Nachricht mit "bild von" beginnt, stelle sicher, dass sie als "BILD VON ..." formatiert ist.
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
  if (data.answer) { return data.answer; }
  else { throw new Error('Keine Antwort von der ChatGPT API erhalten.'); }
}

// DALL-E API-Aufruf über eigenen Endpoint (/api/dalle)
async function callDalleAPI(message, chatHistory, options = {}) {
  // Stelle sicher, dass der Prompt korrekt formatiert ist (BILD VON ... in Großbuchstaben)
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
  if (data.url) { return data.url; }
  else { throw new Error('Keine Bildantwort von der DALL-E API erhalten.'); }
}

// Gemeinsame Funktion zur Verarbeitung einer Chatnachricht inklusive Kontextspeicherung
async function processChat(chatInputId, chatBoxId, historyKey, textModel, imageModel) {
  const inputElem = document.getElementById(chatInputId);
  let message = inputElem.value.trim();
  if (!message) return;
  // Immer "BILD VON" groß schreiben, falls zutreffend
  if (message.toLowerCase().startsWith('bild von')) {
    message = message.replace(/^bild von/i, "BILD VON");
  }
  inputElem.value = '';
  const chatBox = document.getElementById(chatBoxId);
  
  // Anzeige der Nutzernachricht mit Avatar (🥼)
  const userMsgDiv = document.createElement('div');
  userMsgDiv.classList.add('message', 'user-message');
  userMsgDiv.innerHTML = '<span class="avatar">🥼</span> ' + message;
  chatBox.appendChild(userMsgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  let chatHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
  chatHistory.push({ role: 'user', content: message });
  
  try {
    if (message.toLowerCase().startsWith("bild von")) {
      // Bildgenerierung auslösen
      const imageUrl = await callDalleAPI(message, chatHistory, { model: imageModel });
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = message;
      chatBox.appendChild(img);
    } else {
      // Textantwort über ChatGPT anfordern
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

// Chatty 2: Event-Listener und Senden-Funktion
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

// "Inspire me!" Funktion mit 50 Kanye West Zitaten
function showInspiration() {
  const kanyeQuotes = [
    "I feel like I'm too busy writing history to read it.",
    "I am Warhol. I am the number one most impactful artist of our generation.",
    "My greatest pain in life is that I will never be able to see myself perform live.",
    "For me, giving up is way harder than trying.",
    "Keep your nose out the sky, and keep your heart to god.",
    "I want the world to feel inspired by me, not intimidated.",
    "I am a proud non-conformist.",
    "If you have the opportunity to play this game of life, you need to appreciate every moment.",
    "I refuse to follow the rules where society tries to control people with low expectations.",
    "I am not a fan of books. I would never want a book's autograph.",
    "I don't even listen to rap. My apartment is too nice to listen to rap in.",
    "You can't look at a glass half full or empty if it's overflowing.",
    "I will be the leader of a company that ends up being worth billions of dolla
