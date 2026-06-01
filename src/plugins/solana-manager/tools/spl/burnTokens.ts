import { PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, burn } from "@solana/spl-token";
import { SolanaAgentKit } from "solana-agent-kit";
import { getSplContext, toBase } from "./splHelper";
import { BurnTokensInput } from "../../types/manager";

export async function burnTokens(agent: SolanaAgentKit, input: BurnTokensInput) {
  const { connection, payer } = getSplContext(agent);
  const decimals = input.decimals ?? 9;

  const sig = await burn(
    connection,
    payer,
    new PublicKey(input.token_account),
    new PublicKey(input.mint_address),
    payer,
    toBase(input.amount, decimals),
    [],
    { commitment: "confirmed" },
    TOKEN_2022_PROGRAM_ID,
  );

  return {
    token_account: input.token_account,
    amount_burned: input.amount,
    signature: sig,
  };
}