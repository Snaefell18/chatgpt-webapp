export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { model, messages } = req.body;

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

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({ error: errorText });
    }

    const data = await apiResponse.json();

    if (data.choices && data.choices.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.status(500).json({ error: "Keine Antwort von der ChatGPT API erhalten." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
