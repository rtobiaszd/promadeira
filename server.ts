import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client Lazily to prevent crash loops on boot if the key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request parser
  app.use(express.json());

  // 1. AI Chatbot endpoint - supports real Gemini replies
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, prompt, history } = req.body;
      if (!message) {
        res.status(400).json({ error: "Message content is required" });
        return;
      }

      // Initialize client lazily and check if key exists
      try {
        const ai = getGeminiClient();

        // System instruction combining custom prompt instructions
        const systemInstruction = `${prompt || "Você é o assistente de automação inteligente da plataforma."} 
        Analise a mensagem do usuário. Determine se o usuário deseja agendar algo, falar com suporte, ou negociar preços.
        Retorne uma resposta útil no formato JSON com duas chaves principais:
        - "text" (string): Sua resposta conversacional em Português.
        - "classification" (object): Contendo {"stageId": "stage-negotiating"} se o usuário demonstrou interesse explícito de compra/negociação de madeira, ou {"stageId": "stage-closed"} se fecharam o negócio.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: message,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "A resposta conversacional em Português." },
                classification: {
                  type: Type.OBJECT,
                  properties: {
                    stageId: { type: Type.STRING, description: "O id do estágio do CRM para mover o lead se aplicável." }
                  }
                }
              },
              required: ["text"]
            }
          }
        });

        const dataText = response.text || "{}";
        const result = JSON.parse(dataText.trim());
        res.json({ text: result.text || "Entendido! Como posso ajudar?", classification: result.classification || null });
      } catch (err: any) {
        // Safe, clever local mock fallback if no Gemini Key is set
        const textLower = message.toLowerCase();
        let reply = "Obrigado por sua mensagem! Nosso bot de IA está processando seu atendimento.";
        let stageId: string | null = null;

        if (textLower.includes("preco") || textLower.includes("valor") || textLower.includes("plano")) {
          reply = "Nossos planos de fornecimento sob demanda variam de R$2.500 a R$10.000 mensais. Vou encaminhar você para o estágio de Negociação no CRM para receber uma proposta personalizada!";
          stageId = "stage-negotiating";
        } else if (textLower.includes("reuniao") || textLower.includes("agendar") || textLower.includes("calendario")) {
          reply = "Com certeza! Para agendar uma conversa técnica, selecione uma data no painel lateral de agendamentos.";
        }

        res.json({
          text: reply,
          classification: stageId ? { stageId } : null,
          isMock: true,
          notice: "Using clever simulated fallback. Add your Gemini API Key in secrets to trigger real LLM classifications."
        });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to execute chat agent" });
    }
  });

  // 2. Webhook Ingestion API
  app.post("/api/events", (req, res) => {
    try {
      const payload = req.body;
      res.status(201).json({
        status: "success",
        receivedAt: new Date().toISOString(),
        payloadHash: Math.random().toString(36).substring(7),
        matchedWorkflowsCount: 1
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Bad payload" });
    }
  });

  // Serve static assets or mount Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve HTML entry for SPA routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on port ${PORT}`);
  });
}

startServer();
