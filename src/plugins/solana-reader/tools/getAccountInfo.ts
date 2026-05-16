import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
import { GetAccountInfoInput, GetAccountInfoResponse } from "../types/solana";

export async function getAccountInfo(
  agent: SolanaAgentKit,
  input: GetAccountInfoInput
): Promise<GetAccountInfoResponse> {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");
  const pubkey = new PublicKey(input.wallet_address);
  const info = await connection.getAccountInfo(pubkey);

  if (!info) throw new Error(`Cuenta no encontrada: ${input.wallet_address}`);

  return {
    wallet_address: input.wallet_address,
    executable: info.executable,
    owner: info.owner.toBase58(),
    lamports: info.lamports,
    balance_sol: info.lamports / 1e9,
  };
}