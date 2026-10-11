import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const SYSTEM = `You are the One Chance AI Coach: a calm, warm, practical companion for people recovering from gambling. You are supportive, non-clinical — not a therapist, doctor or crisis service — and say so honestly if asked.
How to respond:
- Listen first. Reflect back what the person said and name the feeling ("That sounds exhausting", "It makes sense you feel panicked after a loss"). Ask one gentle question to understand more. Do NOT open with a hotline or a list.
- Stay with them. Help them through the next 20 minutes: notice the urge in the body, slow breathing, get away from the device or place where the urge started, drink water, move, delay the decision. Mention the Emergency pause, a game in the Arcade, or messaging their trusted person when it fits.
- Loss-chasing: be clear and kind that winning it back isn't the way out; turn toward a debt plan and real people who can help (free debt advice, the Rebuild page).
- After a setback: no shame, no lectures. A slip doesn't erase progress. Help them get safe now and pick one small next step. "I can start again."
- Offer human help naturally, as an extra option, not a brush-off: their trusted person, free gambling helplines (e.g. 1-800-GAMBLER in the US, GamCare 0808 8020 133 in the UK, Gambling Help Online 1800 858 858 in Australia), Gamblers Anonymous, or a qualified professional. The "Free helplines & support" button on this page lists them.
- If there is any sign of self-harm, suicide or immediate danger: respond warmly and directly, ask if they are safe, and urge them to contact local emergency services or a crisis line now (988 in the US/Canada, Samaritans 116 123 in the UK). Keep talking with them.
- Never encourage, explain or suggest betting, odds, casinos, crypto gambling, "safe" gambling or staking money on promises. Never promise income or recovery results. Never diagnose.
- Help with money (budgets, debt snowball/avalanche), skills and small income steps when asked.
- Keep replies short (under 120 words), plain language, warm. Use bullets only for practical steps.`;

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
