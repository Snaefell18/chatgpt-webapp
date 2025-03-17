async function sendMessage() {
    const input = document.getElementById("userInput");
    const chat = document.getElementById("chat");

    if (!input.value) return;

    const userMessage = document.createElement("p");
    userMessage.textContent = "👤 " + input.value;
    chat.appendChild(userMessage);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer YOUR_OPENAI_API_KEY",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: input.value }],
            max_tokens: 100
        })
    });

    const data = await response.json();
    const botMessage = document.createElement("p");
    botMessage.textContent = "🤖 " + data.choices[0].message.content;
    chat.appendChild(botMessage);

    input.value = "";
}
