import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Leere Nachricht" });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: message }],
            max_tokens: 100
        });

        return res.status(200).json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Fehler bei OpenAI-Anfrage:", error);
        return res.status(500).json({ error: "API-Fehler" });
    }
}
