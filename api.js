import { OpenAIStream, experimental_StreamData } from "ai";
import { openai } from "@vercel/ai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Leere Nachricht" });
    }

    // ChatGPT-Abfrage über Vercel AI SDK
    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: message }]
    });

    return res.status(200).json({ reply: response.data.choices[0].message.content });
}
