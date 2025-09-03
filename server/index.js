import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const NMVTIS_KEY = process.env.NMVTIS_KEY || "";
function getHFKey(req) {
    return process.env.PRIMARY_HF_KEY || process.env.FALLBACK_HF_KEY || "";
}

app.post("/api/vininfo", async (req, res) => {
    const vin = req.body.vin;
    if (!vin) return res.status(400).json({ error: "VIN required" });
    try {
        // Fetch from NHTSA
        const nhtsaResp = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`);
        const nhtsaData = await nhtsaResp.json();

        // Fetch from NMVTIS (placeholder, requires key)
        let nmvtisData = {};
        if (NMVTIS_KEY) {
            nmvtisData = { titleBrand: "NMVTIS data placeholder" }; // Implement actual call with API key
        }

        res.json({ nhtsa: nhtsaData, nmvtis: nmvtisData });
    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
});

app.post("/api/ai", async (req, res) => {
    const vin = req.body.vin || "";
    const data = req.body.data || {};
    const key = getHFKey(req);
    if (!key) return res.status(500).json({ error: "No HF key configured" });
    try {
        const r = await fetch("https://api-inference.huggingface.co/models/gpt2", {
            method: "POST",
            headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: `Summarize vehicle ${vin} info: ${JSON.stringify(data)}`, parameters: { max_new_tokens: 200 } })
        });
        const text = await r.text();
        res.json({ summary: text });
    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("VinOBuddy server listening on", PORT));
