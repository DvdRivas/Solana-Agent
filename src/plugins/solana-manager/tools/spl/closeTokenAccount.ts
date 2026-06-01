import { PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, closeAccount } from "@solana/spl-token";
import { SolanaAgentKit } from "solana-agent-kit";
import { getSplContext } from "./splHelper";
import { CloseTokenAccountInput } from "../../types/manager";

export async function closeTokenAccount(agent: SolanaAgentKit, input: CloseTokenAccountInput) {
  const { connection, payer } = getSplContext(agent);

  const destination = input.sol_destination
    ? new PublicKey(input.sol_destination)
    : payer.publicKey;

  const sig = await closeAccount(
    connection,
    payer,
    new PublicKey(input.token_account),
    destination,
    payer,
    [],
    { commitment: "confirmed" },
    TOKEN_2022_PROGRAM_ID,
  );

  return {
    token_account: input.token_account,
    sol_returned_to: destination.toBase58(),
    signature: sig,
  };
}