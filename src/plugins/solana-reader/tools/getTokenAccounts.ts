import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
import { GetTokenAccountsInput, GetTokenAccountsResponse } from "../types/solana";

export async function getTokenAccounts(
  agent: SolanaAgentKit,
  input: GetTokenAccountsInput
): Promise<GetTokenAccountsResponse> {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");
  const pubkey = new PublicKey(input.wallet_address);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  });

  const tokens = tokenAccounts.value.map((ta) => {
    const info = ta.account.data.parsed.info;
    return {
      mint: info.mint,
      amount: info.tokenAmount.amount,
      decimals: info.tokenAmount.decimals,
      uiAmount: info.tokenAmount.uiAmount,
    };
  });

  return {
    wallet_address: input.wallet_address,
    tokens,
  };
}