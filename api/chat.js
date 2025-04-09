// Systemprompt mit Firmenwissen
const SYSTEM_MESSAGE = {
  role: "system",
  content: `
    Du bist ein freundlicher Firmenassistent der Firma "Chatty".
    Die Mitarbeitenden arbeiten 8 Stunden täglich und haben 30 Urlaubstage pro Jahr.
    Der Geschäftsführer der Firma heißt Kanye West.
    Essensbestellungen für die nächste Woche müssen immer bis Donnerstag 13 Uhr abgegeben werden.
    Diese Informationen sollen bei passenden Fragen immer in deine Antworten einfließen.
    Antworte freundlich und hilfsbereit.
  `
};

// GPT-API-Aufruf
async function callChatGPTAPI(message, chatHistory, options = {}) {
  const model = options.model || 'gpt-3.5-turbo';
  let userMessage = message;

  if (userMessage.toLowerCase().startsWith('bild von')) {
    userMessage = userMessage.replace(/^bild von/i, "BILD VON");
  }

  if (!chatHistory.find(m => m.role === 'system')) {
    chatHistory.unshift(SYSTEM_MESSAGE);
  }

  chatHistory.push({ role: 'user', content: userMessage });

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: chatHistory
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("API request failed: " + errorText);
  }

  const data = await response.json();
  if (data.choices && data.choices[0]) {
    return data.choices[0].message.content;
  } else {
    throw new Error("Keine Antwort von der ChatGPT API erhalten.");
  }
}

// DALL·E-API-Aufruf
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("API request failed: " + errorText);
  }

  const data = await response.json();
  if (data.url) {
    return data.url;
  } else {
    throw new Error('Keine Bildantwort von der DALL·E API erhalten.');
  }
}

// Verarbeite Chatnachricht mit Kontext
async function processChat(chatInputId, chatBoxId, historyKey, textModel, imageModel) {
  const inputElem = document.getElementById(chatInputId);
  let message = inputElem.value.trim();
  if (!message) return;

  if (message.toLowerCase().startsWith('bild von')) {
    message = message.replace(/^bild von/i, "BILD VON");
  }

  inputElem.value = '';
  const chatBox = document.getElementById(chatBoxId);

  const userDiv = document.createElement('div');
  userDiv.className = 'message user-message';
  userDiv.innerHTML = '<span class="avatar">🥼</span> ' + message;
  chatBox.appendChild(userDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  let chatHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');

  try {
    if (message.startsWith("BILD VON")) {
      const imageUrl = await callDalleAPI(message, chatHistory, { model: imageModel });
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = message;
      img.style.maxWidth = '100%';
      chatBox.appendChild(img);
    } else {
      const response = await callChatGPTAPI(message, chatHistory, { model: textModel });
      const botDiv = document.createElement('div');
      botDiv.className = 'message bot-message';
      botDiv.innerHTML = '<span class="avatar">☀️</span> ' + response;
      chatBox.appendChild(botDiv);
      chatHistory.push({ role: 'assistant', content: response });
    }

    localStorage.setItem(historyKey, JSON.stringify(chatHistory));
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message bot-message';
    errorDiv.textContent = "Fehler: " + error.message;
    chatBox.appendChild(errorDiv);
  }
}

// Chatty (GPT-4o + dalle2)
document.getElementById('chatInput').addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    await processChat('chatInput', 'chatBox', 'chatHistory', 'gpt-4o', 'dalle2');
  }
});
window.sendChatMessage = async function () {
  await processChat('chatInput', 'chatBox', 'chatHistory', 'gpt-4o', 'dalle2');
};
window.startSpeechRecognition = function () {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "de-DE";
  recognition.start();
  recognition.onresult = (event) => {
    document.getElementById("chatInput").value = event.results[0][0].transcript;
  };
};

// Chatty Pro (GPT-4 + dalle3_hd)
document.getElementById('chatInput2').addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    await processChat('chatInput2', 'chatBox2', 'chatHistory2', 'gpt-4', 'dalle3_hd');
  }
});
window.sendChatMessage2 = async function () {
  await processChat('chatInput2', 'chatBox2', 'chatHistory2', 'gpt-4', 'dalle3_hd');
};
window.startSpeechRecognition2 = function () {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "de-DE";
  recognition.start();
  recognition.onresult = (event) => {
    document.getElementById("chatInput2").value = event.results[0][0].transcript;
  };
};

// Kanye West Zitate
window.showInspiration = function () {
  const kanyeQuotes = [
    "I feel like I'm too busy writing history to read it.",
    "Everything I'm not made me everything I am.",
    "Keep your nose out the sky, and keep your heart to God.",
    "I am not afraid of dying, I'm afraid of not trying.",
    "The only luxury is time.",
    "I'm on the pursuit of happiness.",
    "I always want to go forward and never look back.",
    "I'm not afraid to be different.",
    "I will go down as the voice of this generation.",
    "I believe in being bold, being brave, and being yourself.",
    "Sometimes people write novels, and I just speak my mind.",
    "The beauty of music is that it can make you feel things in ways that words cannot.",
    "I have to make a move. I'm not the kind of person to sit still.",
    "I'm a creative genius and there's no other way to word it.",
    "I believe in destiny. Everything happens for a reason.",
    "I'm only comfortable when I'm in a place where I'm constantly learning and growing.",
    "I trust my intuition. It always knows what to do.",
    "I believe in something more than just the physical world.",
    "I have no interest in competing with anyone. I hope we all make it.",
    "My life is my message.",
    "I refuse to follow the rules where society tries to control people with low expectations."
  ];
  const randomIndex = Math.floor(Math.random() * kanyeQuotes.length);
  alert(kanyeQuotes[randomIndex]);
};
