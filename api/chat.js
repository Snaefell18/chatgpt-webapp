import fetch from "node-fetch"; // ✅ Jetzt als ES-Modul

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // 🔒 API-Key aus Vercel

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    try {
        const body = req.body;
        if (!body.messages || !Array.isArray(body.messages)) {
            return res.status(400).json({ error: "Ungültige Anfrage: `messages` fehlt oder ist kein Array." });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: body.messages,
                max_tokens: 200
            })
        });

        const data = await response.json();
        if (!data.choices) {
            return res.status(500).json({ error: "Ungültige API-Antwort von OpenAI." });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("🔴 Fehler:", error);
        res.status(500).json({ error: "Interner Serverfehler", details: error.message });
    }
}
