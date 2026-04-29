import 'dotenv/config';
import express from "express";
import { openai } from "./config/ai";

const app = express();
app.use(express.json());

// Manejo de errores global
process.on("uncaughtException", (err) => {
  console.error("ERROR GLOBAL:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("PROMISE ERROR:", err);
});

app.post("/api/ai", async (req: any, res: any) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Falta el prompt" });
    }

    // 🔥 INTENTA USAR IA REAL
    try {
      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Eres un experto programador." },
          { role: "user", content: prompt }
        ],
      });

      return res.json({
        result: response.choices[0].message.content,
        source: "deepseek"
      });

    } catch (error: any) {
      console.log("⚠️ Sin saldo o error IA, usando mock...");

      // 🔥 FALLBACK AUTOMÁTICO (NO TE BLOQUEAS)
      return res.json({
        result: `Respuesta simulada para: ${prompt}`,
        source: "mock"
      });
    }

  } catch (error: any) {
    console.error("ERROR GENERAL:", error?.message || error);

    res.status(500).json({
      error: "Error general",
      detalle: error?.message
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Servidor IA en http://localhost:${PORT}`);
});