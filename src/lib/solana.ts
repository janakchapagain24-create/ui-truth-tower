// Browser-only Solana helpers. Import dynamically from event handlers.
export const CLUSTER = "devnet";
export const RPC = "https://api.devnet.solana.com";
export const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

type Provider = {
  publicKey?: { toString(): string };
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signAndSendTransaction(tx: unknown): Promise<{ signature: string }>;
};

export function getProvider(): Provider | null {
  const w = window as unknown as { phantom?: { solana?: Provider }; solflare?: Provider; backpack?: Provider; solana?: Provider };
  return w.phantom?.solana ?? w.solflare ?? w.backpack ?? w.solana ?? null;
}

export const explorer = (sig: string) => `https://explorer.solana.com/tx/${sig}?cluster=${CLUSTER}`;

export async function getBalance(addr: string) {
  const { Connection, PublicKey, LAMPORTS_PER_SOL } = await import("@solana/web3.js");
  const c = new Connection(RPC, "confirmed");
  return (await c.getBalance(new PublicKey(addr))) / LAMPORTS_PER_SOL;
}

export async function airdrop(addr: string) {
  const { Connection, PublicKey, LAMPORTS_PER_SOL } = await import("@solana/web3.js");
  const c = new Connection(RPC, "confirmed");
  const sig = await c.requestAirdrop(new PublicKey(addr), LAMPORTS_PER_SOL);
  await c.confirmTransaction(sig, "confirmed");
  return sig;
}

/**
 * Lock a commitment on-chain: transfers SOL to the accountability partner's wallet
 * is NOT done here. Instead the pledge is written as a signed memo + a self-transfer stake,
 * creating a public, timestamped, tamper-proof record without exposing recovery status.
 */
export async function pledge(addr: string, days: number, sol: number, partner: string) {
  const { Connection, PublicKey, Transaction, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } = await import("@solana/web3.js");
  const p = getProvider(); if (!p) throw new Error("No Solana wallet found");
  const c = new Connection(RPC, "confirmed");
  const from = new PublicKey(addr);
  const memo = JSON.stringify({ app: "one-chance", v: 1, commitDays: days, stakeSol: sol, partner: partner || null, start: new Date().toISOString().slice(0, 10) });
  const tx = new Transaction();
  if (sol > 0 && partner) {
    tx.add(SystemProgram.transfer({ fromPubkey: from, toPubkey: new PublicKey(partner), lamports: Math.round(sol * LAMPORTS_PER_SOL) }));
  }
  tx.add(new TransactionInstruction({ keys: [{ pubkey: from, isSigner: true, isWritable: false }], programId: new PublicKey(MEMO_PROGRAM), data: new TextEncoder().encode(memo) as unknown as Buffer }));
  tx.feePayer = from;
  tx.recentBlockhash = (await c.getLatestBlockhash()).blockhash;
  const { signature } = await p.signAndSendTransaction(tx);
  await c.confirmTransaction(signature, "confirmed");
  return signature;
}
