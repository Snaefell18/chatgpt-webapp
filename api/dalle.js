export default async function handler(req, res) {
  // Nur POST-Anfragen zulassen
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Destrukturiere den Request-Body
    const { prompt, size } = req.body;

    // Sende eine POST-Anfrage an die OpenAI DALL‑E API
    const apiResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: size
      })
    });

    // Falls die Antwort nicht erfolgreich war, gib den Fehlertext zurück
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({ error: errorText });
    }

    const data = await apiResponse.json();

    // Falls die API ein Bild generiert hat, sende die URL zurück
    if (data.data && data.data.length > 0) {
      return res.status(200).json({ url: data.data[0].url });
    } else {
      return res.status(500).json({ error: "Keine Bildantwort von der DALL‑E API erhalten." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
