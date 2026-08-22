import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Helper to resolve NVIDIA API key (from request body/header or server env variable)
  const getNvidiaApiKey = (req: express.Request): string | undefined => {
    const key =
      (req.body && req.body.apiKey) ||
      (req.headers["x-nvidia-api-key"] as string) ||
      process.env.NVIDIA_API_KEY ||
      process.env.NVAPI_KEY ||
      process.env.NEMOTRON_API_KEY ||
      process.env.NVIDIA_KEY;

    return key ? key.trim() : undefined;
  };

  // Health check & API status
  app.get("/api/health", (_req, res) => {
    const hasNvidiaKey = Boolean(
      process.env.NVIDIA_API_KEY ||
      process.env.NVAPI_KEY ||
      process.env.NEMOTRON_API_KEY
    );
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

    res.json({
      status: "ok",
      nvidia_configured: hasNvidiaKey,
      gemini_configured: hasGeminiKey,
      model: process.env.NVIDIA_MODEL || "nvidia/llama-3.1-nemotron-70b-instruct",
    });
  });

  // Test NVIDIA API Key endpoint
  app.post("/api/chat/test-key", async (req, res) => {
    const apiKey = getNvidiaApiKey(req);
    const model =
      req.body?.model ||
      process.env.NVIDIA_MODEL ||
      "nvidia/llama-3.1-nemotron-70b-instruct";

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: "No NVIDIA API key provided. Set NVIDIA_API_KEY in environment or enter it in settings.",
      });
    }

    try {
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: "Ping: Respond in 3 words confirming NVIDIA AI connection is active.",
            },
          ],
          temperature: 0.2,
          max_tokens: 30,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          success: false,
          status: response.status,
          error: `NVIDIA API (${response.status}): ${errorText}`,
        });
      }

      const data = await response.json();
      const message =
        data.choices?.[0]?.message?.content || "Connected successfully to NVIDIA API!";
      return res.json({
        success: true,
        message,
        model: data.model || model,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: `Failed to contact NVIDIA API. Details: ${err.message}`,
      });
    }
  });

  // NVIDIA Nemotron Chat Endpoint with live API key support
  app.post("/api/chat/nemotron", async (req, res) => {
    const {
      messages,
      userRole,
      userContext,
      model: requestedModel,
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const nvidiaApiKey = getNvidiaApiKey(req);
    const targetModel =
      requestedModel ||
      process.env.NVIDIA_MODEL ||
      "nvidia/llama-3.1-nemotron-70b-instruct";

    const systemPrompt = `You are MigrantCare AI, an empathetic, highly knowledgeable medical passport & workplace health assistant powered by NVIDIA Nemotron (Llama 3.1 70B Instruct).
Current User Role: ${userRole || "migrant worker"}
Current Context: ${userContext ? JSON.stringify(userContext) : "Standard MigrantCare Session"}

Your Objectives:
1. Provide clear, accessible health, vaccination, and occupational safety advice tailored to migrant workers, clinic providers, and site supervisors.
2. Explain medical terms, prescription instructions, dosage warnings, heat stress prevention, dehydration protocols, ergonomics, and emergency first-aid in plain, reassuring language.
3. Support multi-lingual communication (English, Spanish, Bengali, Hindi, Tagalog, Mandarin, Tamil, etc.). If the user asks in another language, respond in that language.
4. Emphasize patient autonomy: explain the 5-minute time-locked consent model, QR Health Pass privacy, and rights to health records.
5. Provide actionable advice for common workplace risks (heavy lifting, extreme heat, scaffolding, dust, respiratory protection).
6. Safety Disclaimer: Always remind users that you are an AI assistant and that severe or acute symptoms (chest pain, severe breathlessness, heat stroke, head trauma) require immediate emergency room or on-site medic attention.`;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    // If NVIDIA API Key is provided (via request or environment)
    if (nvidiaApiKey) {
      const modelsToTry = [
        targetModel,
        "nvidia/llama-3.1-nemotron-70b-instruct",
        "nvidia/nemotron-4-340b-instruct",
        "meta/llama-3.1-70b-instruct",
      ];
      const uniqueModels = Array.from(new Set(modelsToTry));

      let lastError = "";

      for (const currentModel of uniqueModels) {
        try {
          const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${nvidiaApiKey}`,
            },
            body: JSON.stringify({
              model: currentModel,
              messages: formattedMessages,
              temperature: 0.4,
              top_p: 0.9,
              max_tokens: 1024,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            lastError = `NVIDIA API (${response.status}): ${errorText}`;

            if (response.status === 401 || response.status === 403) {
              return res.status(response.status).json({
                error: `NVIDIA API Key Authentication Failed (${response.status}). Please check that your key from build.nvidia.com is valid and starts with 'nvapi-'.`,
              });
            }

            if (response.status === 404 || errorText.includes("model")) {
              continue;
            }
            continue;
          }

          const data = await response.json();
          const reply =
            data.choices?.[0]?.message?.content ||
            "I received your request but could not generate a response. Please try again.";

          return res.json({
            reply,
            model: data.model || currentModel,
            provider: "nvidia-api",
          });
        } catch (err: any) {
          lastError = err?.message || "Network error connecting to NVIDIA API";
          console.error("NVIDIA API fetch error:", lastError);
        }
      }

      // If NVIDIA call failed with all candidate models
      return res.status(502).json({
        error: `Could not complete request with NVIDIA API: ${lastError}`,
      });
    }

    // Fallback to Gemini if GEMINI_API_KEY is configured in the environment
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const lastUserMessage =
          messages[messages.length - 1]?.content || "Hello";

        const conversationHistory = messages
          .slice(0, -1)
          .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
          .join("\n");

        const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nUser: ${lastUserMessage}\nAssistant:`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
        });

        const reply =
          response.text ||
          "Hello! I am your MigrantCare Health Assistant. How can I help you today?";

        return res.json({
          reply,
          model: "gemini-2.5-flash",
          provider: "gemini-fallback",
        });
      } catch (geminiErr: any) {
        console.error("Gemini fallback failed:", geminiErr?.message);
      }
    }

    // Neither NVIDIA key nor Gemini key available
    return res.status(400).json({
      error:
        "No API Key configured. Please add NVIDIA_API_KEY to your environment variables or enter your NVIDIA API key in the AI Assistant settings (⚙️).",
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MigrantCare Server running on http://localhost:${PORT}`);
  });
}

startServer();
