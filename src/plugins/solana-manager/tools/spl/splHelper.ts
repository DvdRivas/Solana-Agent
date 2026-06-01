import { Connection, Keypair } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";

export function getSplContext(agent: SolanaAgentKit): { connection: Connection; payer: Keypair } {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");

  const secretKey: Uint8Array =
    (agent.wallet as any).secretKey ??
    (agent.wallet as any)._keypair?.secretKey ??
    (agent.wallet as any).payer?.secretKey;

  if (!secretKey) throw new Error("No se pudo obtener el secretKey del wallet");

  const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));

  return { connection, payer };
}

export const toBase = (amount: number, decimals: number) =>
  BigInt(Math.round(amount * 10 ** decimals));