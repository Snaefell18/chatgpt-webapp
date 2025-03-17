export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    const apiKey = process.env.OPENAI_API_KEY; // Sicher gespeicherter API-Key

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${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}`,
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
        console.error("Fehler bei der API-Anfrage:", error);
        res.status(500).json({ error: "Fehler bei der Verarbeitung der Anfrage" });
    }
}
