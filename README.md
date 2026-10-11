# 🛡️ ONE CHANCE

> **The personal firewall and on-chain commitment protocol against gambling urges.**  
> Built for the Solana ecosystem & the Colosseum Hackathon.

[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-14F195?logo=solana&logoColor=black)](https://solana.com)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start%20v1-FF4154?logo=react)](https://tanstack.com/start)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Live](https://img.shields.io/badge/Status-Live%20Preview-brightgreen)](https://one-chance.lovable.app)

---

## 💡 The Problem

Online gambling is no longer confined to physical casinos or desktop sportsbooks. It lives inside our pockets, accessible in 3 clicks at 2 a.m.

- **$700B+** in projected worldwide gambling losses annually by 2028 (*The Lancet Public Health Commission, 2024*).
- **80M+** adults worldwide suffer from gambling disorders (*JAMA / Lancet*).
- **16%** of online casino users meet clinical disorder criteria.
- In moments of acute urge, standard willpower fails and traditional self-exclusion lists are easily bypassed with new crypto casinos or VPNs.

**One Chance** creates a cryptographic and behavioral speed bump between an urge and financial catastrophe.

---

## ⚡ What is One Chance?

One Chance combines a **device-level personal firewall**, a **Solana Commitment Vault**, and an **evidence-based recovery system**:

1. **The Solana Commitment Vault (Devnet Live):**  
   Pledge 7, 30, 90, or 180 days clean. Commit stake and designate a trusted partner’s wallet as guardian. Transactions record cryptographic memos to the Solana blockchain.
2. **Device Shield & 48-Hour Cooldown:**  
   DNS filtering profiles that block 35+ major gambling gateways, with native companion app architecture and a mandatory 48-hour cooldown before protection can be modified.
3. **Emergency Pause & 24/7 AI Coach:**  
   A 20-minute scientifically grounded urge-surfing workflow (Box Breathing → Trigger Identification → Diversion Games → Reflection) backed by an AI recovery companion.
4. **Scheduled Debt Amortization Engine:**  
   Interactive Snowball vs. Avalanche calculator generating real installment schedules (1st, 15th, 28th due dates) to help rebuild solvency.
5. **Dignity-First Work Marketplace:**  
   Members complete productive micro-tasks, submit proof of work, and earn verified platform credits to rebuild confidence and focus.
6. **Instagram-Style Community Feed:**  
   Peer cheers, daily wins, and streak milestones with privacy-first architecture.

---

## ⛓️ Solana Web3 Architecture

```text
[ User Wallet ] (Phantom / Solflare)
      │
      ├──> Signs Commitment Memo (MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr)
      ├──> Locks Stake to Vault PDA / Guardian
      └──> (Phase 4) Receives Soulbound cNFT Milestone Badge at Day 30 / 90 / 180
```

### Phase 4 Roadmap (Colosseum Sprint)
- **Anchor Escrow Program:** Multi-signature time-lock PDA program on Solana. Early unlock strictly requires co-signature from the designated guardian wallet.
- **Soulbound cNFT Badges:** Non-transferable compressed NFTs (Metaplex) awarded at recovery milestones (30, 90, 180 days). Verifiable proof of clean time without exposing identity.
- **Solana Blinks & Actions:** Shareable X / Discord links that allow friends and family to cheer milestones or deposit emergency grants directly into the vault without opening the app.

---

## 🛠️ Tech Stack

- **Framework:** [TanStack Start v1](https://tanstack.com/start) (Full-stack React 19 + SSR on Edge)
- **Styling:** Tailwind CSS v4, custom glassmorphism design tokens (Sora / Manrope typography)
- **Blockchain:** Solana Devnet via `@solana/web3.js` & Solana SPL Memo Program
- **Backend & Auth:** Lovable Cloud (PostgreSQL, Realtime, Row Level Security, Google & Email Auth)
- **AI Engine:** Lovable AI Gateway (Streaming GPT-4o-mini coach & documentation copilot)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 20+ or [Bun](https://bun.sh/)
- A Solana wallet browser extension ([Phantom](https://phantom.app/) or [Solflare](https://solflare.com/)) set to **Devnet**

### Installation

```bash
Clone the repository
git clone https://github.com/<YOUR_USERNAME>/one-chance.git
cd one-chance

Install dependencies
bun install

Start the dev server
bun dev
```

Open [http://localhost:8080](http://localhost:8080) to view the app.

---

## 🔒 Privacy & Safety Principles

1. **Zero Exploitative Mechanics:** No loot boxes, spin wheels, random reward drops, or casino sound effects.
2. **On-Chain Pseudonymity:** Clean milestones and pledges are recorded by public key only. Zero medical or addiction records are ever written on-chain.
3. **Emergency Disclaimers:** One Chance is a peer and behavioral aid, not clinical psychiatric treatment. Immediate crisis hotline shortcuts (e.g., 988, GamCare) are accessible on every page.

---

## 📄 Documentation

Read the full interactive whitepaper and architecture guide at [`/docs`](https://one-chance.lovable.app/docs), including:
- Interactive **Ask AI Docs Copilot**
- Screen-by-screen product breakdown
- Sourced gambling statistics & personal debt case studies
- Colosseum submission rubric checklist

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
```

---

Recommended Next Steps
1. Push your project to GitHub (using Project Menu → GitHub → Connect).
2. Create or replace the `README.md` file in your repository with this markdown text (just replace `<YOUR_USERNAME>` with your GitHub handle).
3. If you want, I can also generate a matching `LICENSE` file (MIT) or a script draft for your 3-minute pitch video.
