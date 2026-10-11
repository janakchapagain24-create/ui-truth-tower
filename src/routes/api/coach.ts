import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const SYSTEM = `You are the One Chance AI Coach: a calm, warm, practical companion for people recovering from gambling.
Rules:
- Never encourage, explain or suggest any form of betting, odds, casinos, crypto gambling or "safe" gambling.
- If the person has an urge right now: slow them down, suggest a 2-minute breath, delaying 20 minutes, a game in the Arcade, or calling their trusted person.
- If there is any risk of self-harm, gently urge them to contact local emergency services or a crisis line right away.
- Help with money (budgets, debt snowball/avalanche), skills, small income steps. Never promise income results.
- Never shame. Setbacks don't erase progress. Brand voice: "I can start again."
- Keep replies short (under 150 words), use simple language and short bullet points when useful.`;

export const Route = createFileRoute("/api/coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "Coach is not configured." }, { status: 500 });
        let messages: ModelMessage[];
        try {
          const body = (await request.json()) as { messages?: { role: string; content: string }[] };
          messages = (body.messages ?? [])
            .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
            .slice(-20)
            .map((m) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 4000) }));
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }
        if (!messages.length) return Response.json({ error: "Empty message." }, { status: 400 });

        let runId: string | undefined;
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: async (input, init) => {
            const headers = new Headers(init?.headers);
            if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
            const res = await fetch(input, { ...init, headers });
            runId ??= res.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
            if (!res.ok) {
              const text = await res.clone().text().catch(() => "");
              console.error("coach gateway error", res.status, text.slice(0, 300));
            }
            return res;
          },
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: SYSTEM,
          messages,
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });
        return result.toTextStreamResponse();
      },
    },
  },
});
