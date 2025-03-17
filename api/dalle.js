import fetch from "node-fetch"; // ✅ Jetzt als ES-Modul

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // 🔒 API-Key aus Vercel

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Fehlende Bildbeschreibung!" });
        }

        console.log("🔹 Anfrage an DALL·E 2:", prompt);

        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "dall-e-2",  // ✅ Günstigeres Modell gewählt
                prompt: prompt,
                n: 1,
                size: "512x512" // ✅ Handyfreundliche Bildgröße
            })
        });

        const data = await response.json();
        console.log("🔹 Antwort von DALL·E 2:", data);

        if (!data.data || !data.data.length) {
            return res.status(500).json({ error: "Kein Bild erhalten." });
        }

        res.status(200).json({ imageUrl: data.data[0].url });
    } catch (error) {
        console.error("🔴 Fehler bei DALL·E-Anfrage:", error);
        res.status(500).json({ error: "Interner Serverfehler", details: error.message });
    }
}
