import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
import { getTokenAccounts } from "./getTokenAccounts";

export async function getAccountOverview(
  agent: SolanaAgentKit,
  input: { wallet_address: string }
) {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");
  const pubkey = new PublicKey(input.wallet_address);

  const [accountInfo, balance, signatures, tokenData] = await Promise.all([
    connection.getAccountInfo(pubkey),
    connection.getBalance(pubkey),
    connection.getSignaturesForAddress(pubkey, { limit: 5 }),
    getTokenAccounts(agent, { wallet_address: input.wallet_address }),
  ]);

  const recentTxs = signatures.map((sig) => ({
    signature: sig.signature,
    timestamp: sig.blockTime
      ? new Date(sig.blockTime * 1000).toISOString()
      : null,
    status: sig.err ? "failed" : "success",
  }));

  return {
    wallet_address: input.wallet_address,
    balance_sol: balance / 1e9,
    balance_lamports: balance,
    executable: accountInfo?.executable ?? false,
    owner: accountInfo?.owner.toBase58() ?? null,
    data_size_bytes: accountInfo?.data.length ?? 0,
    tokens: tokenData.tokens,
    token_count: tokenData.token_count,
    total_token_value_usd: tokenData.total_value_usd,
    recent_transactions: recentTxs,
  };
}