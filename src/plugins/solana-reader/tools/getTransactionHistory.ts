import { Connection, PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";

export async function getTransactionHistory(
  agent: SolanaAgentKit,
  input: { wallet_address: string; limit?: number }
) {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");
  const pubkey = new PublicKey(input.wallet_address);
  const limit = input.limit ?? 10;

  const signatures = await connection.getSignaturesForAddress(pubkey, { limit });

  const history = signatures.map((sig: ConfirmedSignatureInfo) => ({
    signature: sig.signature,
    timestamp: sig.blockTime
      ? new Date(sig.blockTime * 1000).toISOString()
      : null,
    status: sig.err ? "failed" : "success",
    error: sig.err ?? null,
    memo: sig.memo ?? null,
  }));

  return {
    wallet_address: input.wallet_address,
    total: history.length,
    transactions: history,
  };
}