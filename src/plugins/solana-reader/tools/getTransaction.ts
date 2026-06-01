import { Connection } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";

export async function getTransaction(
  agent: SolanaAgentKit,
  input: { signature: string }
) {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");
  const tx = await connection.getParsedTransaction(input.signature, {
    maxSupportedTransactionVersion: 0,
  });

  if (!tx) throw new Error(`Transacción no encontrada: ${input.signature}`);

  const meta = tx.meta;
  const message = tx.transaction.message;
  const accounts = message.accountKeys.map((k) => ({
    address: k.pubkey.toBase58(),
    signer: k.signer,
    writable: k.writable,
  }));

  const preBalances = meta?.preBalances ?? [];
  const postBalances = meta?.postBalances ?? [];

  const balanceChanges = accounts.map((acc, i) => ({
    address: acc.address,
    before_sol: preBalances[i] / 1e9,
    after_sol: postBalances[i] / 1e9,
    change_sol: (postBalances[i] - preBalances[i]) / 1e9,
  }));

  const tokenBalanceChanges = (meta?.postTokenBalances ?? []).map((post) => {
    const pre = meta?.preTokenBalances?.find(
      (p) => p.accountIndex === post.accountIndex && p.mint === post.mint
    );
    return {
      account: accounts[post.accountIndex]?.address,
      mint: post.mint,
      before: pre?.uiTokenAmount.uiAmount ?? 0,
      after: post.uiTokenAmount.uiAmount ?? 0,
      change: (post.uiTokenAmount.uiAmount ?? 0) - (pre?.uiTokenAmount.uiAmount ?? 0),
    };
  });

  const instructions = (message as any).instructions?.map((ix: any) => ({
    program: ix.program ?? "unknown",
    type: ix.parsed?.type ?? "unknown",
    info: ix.parsed?.info ?? {},
  }));

  return {
    signature: input.signature,
    status: meta?.err ? "failed" : "success",
    error: meta?.err ?? null,
    timestamp: tx.blockTime
      ? new Date(tx.blockTime * 1000).toISOString()
      : null,
    slot: tx.slot,
    fee_sol: (meta?.fee ?? 0) / 1e9,
    accounts,
    balance_changes: balanceChanges,
    token_balance_changes: tokenBalanceChanges,
    instructions,
    logs: meta?.logMessages ?? [],
  };
}