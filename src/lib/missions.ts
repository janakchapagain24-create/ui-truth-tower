export type Mission = {
  id: string;
  title: string;
  category: "Protection" | "Recovery" | "Money" | "Skill" | "Work" | "Business" | "Social" | "Healthy Routine";
  minutes: number;
  reward: number;
  why: string;
  steps: string[];
};

// Fixed, sequenced missions. No randomness, no chance mechanics.
export const MISSIONS: Mission[] = [
  { id: "protect-confirm", title: "Confirm your protection is active", category: "Protection", minutes: 2, reward: 10,
    why: "Knowing your shield is on removes one decision from a hard moment.",
    steps: ["Open the Protect page", "Check every category is on", "Note your last sync time"] },
  { id: "trigger", title: "Identify today's strongest trigger", category: "Recovery", minutes: 5, reward: 10,
    why: "Urges feel random. They rarely are. Naming them gives you a head start.",
    steps: ["Think about the last time you felt an urge", "Write down where you were and how you felt", "Pick one thing to do differently next time"] },
  { id: "spending", title: "Log essential spending", category: "Money", minutes: 10, reward: 10,
    why: "Seeing where money actually goes is the first step to steadying it.",
    steps: ["List rent, food, transport and bills", "Add today's spending", "Mark anything that wasn't essential — no judgment"] },
  { id: "skill-20", title: "Practice your strongest skill for 20 minutes", category: "Skill", minutes: 20, reward: 15,
    why: "Twenty focused minutes a day compounds into something people will pay for.",
    steps: ["Pick one skill", "Set a 20 minute timer", "Save one thing you made"] },
  { id: "apply-one", title: "Apply to one legitimate opportunity", category: "Work", minutes: 25, reward: 15,
    why: "One real application beats a hundred plans.",
    steps: ["Open the Work page", "Pick one challenge that fits", "Send a short, honest message"] },
  { id: "offer", title: "Write your first service offer", category: "Business", minutes: 20, reward: 15,
    why: "A clear offer turns a skill into something people can say yes to.",
    steps: ["What do you do?", "Who is it for?", "What does it cost and how long does it take?"] },
  { id: "encourage", title: "Send one encouraging message", category: "Social", minutes: 3, reward: 5,
    why: "Helping someone else is one of the strongest ways to steady yourself.",
    steps: ["Think of someone who is working on something", "Send them one kind line"] },
  { id: "walk", title: "Take a 15 minute walk", category: "Healthy Routine", minutes: 15, reward: 5,
    why: "Movement lowers stress — one of the most common gambling triggers.",
    steps: ["Leave your phone in your pocket", "Walk without a destination"] },
];
