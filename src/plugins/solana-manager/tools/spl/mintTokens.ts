import { PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, mintTo } from "@solana/spl-token";
import { SolanaAgentKit } from "solana-agent-kit";
import { getSplContext, toBase } from "./splHelper";
import { MintTokensInput } from "../../types/manager";

export async function mintTokens(agent: SolanaAgentKit, input: MintTokensInput) {
  const { connection, payer } = getSplContext(agent);
  const decimals = input.decimals ?? 9;

  const sig = await mintTo(
    connection,
    payer,
    new PublicKey(input.mint_address),
    new PublicKey(input.destination_ata),
    payer,
    toBase(input.amount, decimals),
    [],
    { commitment: "confirmed" },
    TOKEN_2022_PROGRAM_ID,
  );

  return {
    mint_address: input.mint_address,
    destination_ata: input.destination_ata,
    amount: input.amount,
    signature: sig,
  };
}