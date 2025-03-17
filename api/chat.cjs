async function handler(req, res) {
    console.log("🔹 API-Route wurde aufgerufen:", req.method);

    if (req.method !== "POST") {
        console.error("🔴 Fehler: Ungültige HTTP-Methode:", req.method);
        return res.status(405).json({ error: "Nur POST-Anfragen erlaubt" });
    }

    try {
        const body = req.body;  // ✅ `req.body` statt `req.json()`
        console.log("🔹 Eingehender Body:", body);

        if (!body || !body.messages || !Array.isArray(body.messages)) {
            console.error("🔴 Fehler: `messages` fehlt oder ist kein Array:", body);
            return res.status(400).json({ error: "Ungültige Anfrage: `messages` fehlt oder ist kein Array." });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error("🔴 Fehler: Kein API-Key in den Umgebungsvariablen gefunden!");
            return res.status(500).json({ error: "Fehlender API-Key." });
        }

        console.log("🔹 Anfrage an OpenAI wird gesendet...");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: body.messages,
                max_tokens: 200
            })
        });

        console.log("🔹 Antwort von OpenAI erhalten:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("🔴 Fehler bei OpenAI-Anfrage:", response.status, response.statusText, errorText);
            return res.status(response.status).json({ error: `OpenAI Fehler: ${response.statusText}`, details: errorText });
        }

        const data = await response.json();
        console.log("🔹 OpenAI Antwort:", data);

        if (!data.choices) {
            console.error("🔴 Fehler: OpenAI hat keine `choices` zurückgegeben!");
            return res.status(500).json({ error: "Ungültige API-Antwort von OpenAI." });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("🔴 Unerwarteter Fehler:", error);
        res.status(500).json({ error: "Interner Serverfehler", details: error.message });
    }
}
console.log("🔹 API-Key geladen:", process.env.OPENAI_API_KEY ? "✅ Gefunden" : "❌ Nicht gefunden");

module.exports = handler;  // ✅ CommonJS-Export
