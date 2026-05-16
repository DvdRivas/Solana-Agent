import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
import { GetSolBalanceInput, GetSolBalanceResponse } from "../types/solana";

export async function getSolBalance(
  agent: SolanaAgentKit,
  input: GetSolBalanceInput
): Promise<GetSolBalanceResponse> {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");
  const pubkey = new PublicKey(input.wallet_address);
  const lamports = await connection.getBalance(pubkey);
  return {
    wallet_address: input.wallet_address,
    balance_lamports: lamports,
    balance_sol: lamports / 1e9,
  };
}