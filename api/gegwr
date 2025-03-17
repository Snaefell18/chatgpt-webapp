export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    const apiKey = process.env.OPENAI_API_KEY; // OpenAI API-Key aus Vercel
    console.log("Empfangene Anfrage:", req.body);

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
        console.log("API Antwort:", data);

        if (!data.choices) {
            throw new Error("Ungültige API-Antwort");
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Fehler bei API-Anfrage:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
}
