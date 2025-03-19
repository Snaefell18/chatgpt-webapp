export default async function handler(req, res) {
  // Nur POST-Anfragen zulassen
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Destrukturiere den Request-Body
    const { model, message, chatHistory } = req.body;

    // Erstelle den Nachrichtenverlauf: Hänge die neue Nachricht an den bisherigen Verlauf an
    const messages = Array.isArray(chatHistory)
      ? [...chatHistory, { role: "user", content: message }]
      : [{ role: "user", content: message }];

    // Sende eine POST-Anfrage an die OpenAI ChatGPT API
    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7
      })
    });

    // Falls die Antwort nicht erfolgreich war, gib den Fehlertext zurück
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({ error: errorText });
    }

    const data = await apiResponse.json();

    // Falls die API eine Antwort liefert, sende diese zurück
    if (data.choices && data.choices.length > 0) {
      return res.status(200).json({ answer: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: "Keine Antwort von der ChatGPT API erhalten." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
