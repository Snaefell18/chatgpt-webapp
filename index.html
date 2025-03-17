import React, { useState } from "react";

const models = ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"];

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = { text: inputText, isUser: true };
    setMessages([...messages, userMessage]);
    setInputText("");
    setLoading(true);
    
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "user", content: userMessage.text }],
          max_tokens: 100,
        }),
      });
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const botMessage = { text: data.choices[0].message.content, isUser: false };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Antwort:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">ChatGPT Web App</h1>
      <select
        className="mb-4 p-2 border rounded"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        {models.map((model) => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>
      <div className="w-full border p-4 rounded h-96 overflow-y-auto mb-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 rounded ${msg.isUser ? "bg-blue-500 text-white text-right" : "bg-gray-300"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="w-full flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Nachricht eingeben..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "..." : "Senden"}
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
