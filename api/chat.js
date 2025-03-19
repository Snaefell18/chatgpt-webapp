// Verwende den API-Schlüssel, der über Vercel (oder als Umgebungsvariable) hinterlegt ist.
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Ersetze diesen Platzhalter durch deinen Schlüssel

// Ruft die ChatGPT-API auf und liefert die Antwort zurück.
async function callChatGPTAPI(message, chatHistory, options = {}) {
  const model = options.model || 'gpt-3.5-turbo';
  const messages = chatHistory.concat([{ role: 'user', content: message }]);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7
    })
  });
  const data = await response.json();
  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  } else {
    throw new Error('Keine Antwort von der ChatGPT API erhalten.');
  }
}

// Ruft die DALL-E API zur Bildgenerierung auf und liefert die Bild-URL zurück.
async function callDalleAPI(message, chatHistory, options = {}) {
  const prompt = message;
  const size = options.model === 'dalle3_hd' ? '1024x1024' : '512x512';
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      prompt: prompt,
      n: 1,
      size: size
    })
  });
  const data = await response.json();
  if (data.data && data.data.length > 0) {
    return data.data[0].url;
  } else {
    throw new Error('Keine Bildantwort von der DALL-E API erhalten.');
  }
}

// Gemeinsame Funktion zum Verarbeiten der Chatnachricht.
async function processChat(chatInputId, chatBoxId, historyKey, textModel, imageModel) {
  const inputElem = document.getElementById(chatInputId);
  const message = inputElem.value.trim();
  if (!message) return;
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
    if (message.toLowerCase().startsWith('bild von')) {
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

// Chatty 1: Event-Listener für das Eingabefeld und Senden-Funktion
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

// Chatty 2: Event-Listener für das Eingabefeld und Senden-Funktion
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
    "I will be the leader of a company that ends up being worth billions of dollars, because I got the answers.",
    "My music isn’t just music — it’s medicine.",
    "We all self-conscious. I'm just the first to admit it.",
    "Sometimes people write novels and I just speak my mind.",
    "I'm not comfortable with comfort. I'm only comfortable when I'm in a place where I'm constantly learning and growing.",
    "The only luxury is time.",
    "Everything I'm not made me everything I am.",
    "I don't believe in having regrets in life.",
    "We're not always in the position that we want to be at. We're constantly growing. We're constantly making mistakes.",
    "I'm living in that 21st century, doing something mean to it.",
    "I will go down as the voice of this generation.",
    "I always feel like I can do anything.",
    "I don't do things to get applause. I do things because I want to do them.",
    "I'm a creative genius and there's no other way to word it.",
    "I want to create something that inspires people and changes the world.",
    "I don't believe in rules, especially the ones that tell you what you can or cannot do.",
    "I am not a politician, I’m an artist, I’m a creative person.",
    "There is no way to be truly creative without being a little bit rebellious.",
    "I am a human being and nothing human is alien to me.",
    "I believe in destiny. I believe that everything happens for a reason.",
    "My life is my message.",
    "I don't even do drugs. I do what I want.",
    "The beauty of music is that it can make you feel things in ways that words cannot.",
    "I've always been a believer in something more than just the physical world.",
    "I believe in my flyness, and I believe in my ability to succeed.",
    "I have to make a move. I'm not the kind of person to sit still.",
    "My heart is my engine, and I'm unstoppable.",
    "The real power in the world is your ability to control your mind.",
    "I'm on the pursuit of happiness.",
    "I have no interest in competing with anyone. I hope we all make it.",
    "I want to leave a mark on the world that is bigger than myself.",
    "My life is full of imperfections and I embrace them.",
    "I always want to go forward and never look back.",
    "I am Kanye West, and this is my truth.",
    "I am not afraid of dying, I'm afraid of not trying.",
    "I trust my intuition. It always knows what to do.",
    "I am a creative force, a beacon of artistic inspiration.",
    "I make art to express my soul, and my soul is limitless."
  ];
  const randomIndex = Math.floor(Math.random() * kanyeQuotes.length);
  alert(kanyeQuotes[randomIndex]);
}
window.showInspiration = showInspiration;
