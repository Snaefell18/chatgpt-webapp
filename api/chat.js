export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    const apiKey = process.env.OPENAI_API_KEY; // Sicher im Backend gespeichert

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${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}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Fehler bei der API-Anfrage:", error);
        res.status(500).json({ error: "Fehler bei der API-Anfrage" });
    }
}
