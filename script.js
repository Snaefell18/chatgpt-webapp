async function sendMessage() {
    const input = document.getElementById("userInput");
    const chat = document.getElementById("chat");

    if (!input.value) return;

    // Nutzer-Nachricht anzeigen
    const userMessage = document.createElement("p");
    userMessage.textContent = "👤 " + input.value;
    chat.appendChild(userMessage);

    // Anfrage an die API senden (über den Vercel AI SDK Endpunkt)
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.value })
    });

    const data = await response.json();

    // Antwort von ChatGPT anzeigen
    const botMessage = document.createElement("p");
    botMessage.textContent = "🤖 " + data.reply;
    chat.appendChild(botMessage);

    input.value = "";
}
