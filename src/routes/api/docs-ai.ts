import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const SYSTEM = `You are the One Chance Docs Copilot, answering judges, investors and developers reviewing One Chance for the Colosseum (Solana) hackathon/accelerator.
Facts:
- One Chance: a recovery platform for people quitting gambling. Brand voice: "I can start again." Core protection & missions are free forever.
- Built: Instagram-style home feed (stories, cheers, comments, real accounts via cloud), Protect (category shields, trusted person, 48h change cooldown, NextDNS iPhone .mobileconfig, Android Private DNS, hosts blocklist), Emergency pause (breathe, trigger, 20-min timer), Missions & credits (once per day, setbacks never erase progress), AI Coach (10 free msgs/day), Games arcade (+20 credits for 3+ min urge surf, max 3/day), Rebuild (debt snowball/avalanche + monthly installment schedule), Work marketplace (submit proof, admin verifies, claim credits), Solana Devnet Commitment Vault (Phantom/Solflare/Backpack, signed Memo program tx, optional stake to trusted person's wallet).
- Roadmap: Anchor PDA escrow (time-lock + guardian co-sign), soulbound cNFT milestone badges, Solana Blinks for cheers/grants, native iOS (FamilyControls/ManagedSettings) & Android (AccessibilityService, VPNService) blockers, USDC work payouts, weekly AI review.
- Honest limits: Vault runs on Devnet; native blockers not shipped yet; work rewards are credits.
Rules: be concise (under 150 words), use markdown bullets, never invent metrics, never promote gambling.`;

export const Route = createFileRoute("/api/docs-ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "Docs AI is not configured." }, { status: 500 });
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
              console.error("docs-ai gateway error", res.status, text.slice(0, 300));
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
