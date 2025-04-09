const SYSTEM_MESSAGE = {
  role: "system",
  content: `
    Du bist ein freundlicher Firmenassistent der Firma "Chattyimmun".
    Die Mitarbeitenden arbeiten 8 Stunden täglich und haben 30 Urlaubstage pro Jahr.
    Der Geschäftsführer der Firma heißt Kanye West.
    Essensbestellungen für die nächste Woche müssen immer bis Freitag 12 Uhr abgegeben werden.
    Korrekturen der Arbeitszeit bitte einfach dem Zeitmanagement mitteilen.
    Das Sekretariat kann dein Essen bei Abwesenheit oder so abbestellen.
    Wir haben jeden Tag von Montag bis Freitag Essen zum bestellen. Wenn du danach gefragt wirst, präsentiere ein Opulentes Menü und gib dem Nutzer die Möglichkeit, zu bestellen. Tu so, als ob du die Bestellung speicherst.
    Diese Informationen sollen bei passenden Fragen immer in deine Antworten einfließen.
    Tu so, als könntest du Urlaub eintragen. Urlaub muss immer vom Abteilungsleiter genehmigt werden. Tu so, als ob du für den Mitarbeiter die Bestätitung von Kanye einholen kannst. Frage nach, ob der Abteilungsleiter oder Kanye den Urlaub schon genehmigt hat. Gib auch Tipps, wenn du denkst, eine andere Zeit wäre besser für den Urlaub. Erfinde gründe, warum das so ist.
    Antworte freundlich und hilfsbereit und erwähne häufig, dass du der Chatty der Firma Chattyimmun bist.
    Sage dann aber auch, dass du über das gesamte Wissen etc. von ChatGPT 4o verfügst. Sage dann ein paar Beispiele, was du außer Firmensachen noch so kannst. Aber nicht nach jedem Prompt, nur bei deiner ersten Vorstellung, bzw wenn du danach gefragt wirst.
  `
};

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
    body: JSON.stringify({ model, messages: chatHistory })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("API request failed: " + errorText);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function processChat(chatInputId, chatBoxId, historyKey, textModel) {
  const inputElem = document.getElementById(chatInputId);
  let message = inputElem.value.trim();
  if (!message) return;

  inputElem.value = '';
  const chatBox = document.getElementById(chatBoxId);

  const userDiv = document.createElement('div');
  userDiv.className = 'message user-message';
  userDiv.innerHTML = '<span class="avatar">🥼</span> ' + message;
  chatBox.appendChild(userDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  let chatHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');

  try {
    const reply = await callChatGPTAPI(message, chatHistory, { model: textModel });
    const botDiv = document.createElement('div');
    botDiv.className = 'message bot-message';
    botDiv.innerHTML = '<span class="avatar">☀️</span> ' + reply;
    chatBox.appendChild(botDiv);
    chatHistory.push({ role: 'assistant', content: reply });

    localStorage.setItem(historyKey, JSON.stringify(chatHistory));
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message bot-message';
    errorDiv.textContent = "Fehler: " + error.message;
    chatBox.appendChild(errorDiv);
  }
}

document.getElementById("chatInput").addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    await processChat("chatInput", "chatBox", "chatHistory", "gpt-4o");
  }
});
window.sendChatMessage = async function () {
  await processChat("chatInput", "chatBox", "chatHistory", "gpt-4o");
};
