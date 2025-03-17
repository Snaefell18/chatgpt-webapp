export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    const apiKey = process.env.OPENAI_API_KEY; // Key wird sicher aus Vercel geladen

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: req.body.messages,
                max_tokens: 200
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("API-Fehler:", error);
        res.status(500).json({ error: "Fehler bei der Verarbeitung der Anfrage" });
    }
}
