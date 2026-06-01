import { PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
import { SolanaAgentKit } from "solana-agent-kit";
import { getSplContext, toBase } from "./splHelper";
import { TransferTokensInput } from "../../types/manager";

export async function transferTokens(agent: SolanaAgentKit, input: TransferTokensInput) {
  const { connection, payer } = getSplContext(agent);
  const decimals = input.decimals ?? 9;
  const mint = new PublicKey(input.mint_address);
  const dest = new PublicKey(input.destination_wallet);

  const sourceATA = await getOrCreateAssociatedTokenAccount(
    connection, payer, mint, payer.publicKey,
    false, "confirmed", { commitment: "confirmed" }, TOKEN_2022_PROGRAM_ID,
  );

  const destATA = await getOrCreateAssociatedTokenAccount(
    connection, payer, mint, dest,
    false, "confirmed", { commitment: "confirmed" }, TOKEN_2022_PROGRAM_ID,
  );

  const sig = await transfer(
    connection,
    payer,
    sourceATA.address,
    destATA.address,
    payer,
    toBase(input.amount, decimals),
    [],
    { commitment: "confirmed" },
    TOKEN_2022_PROGRAM_ID,
  );

  return {
    mint_address: input.mint_address,
    destination_wallet: input.destination_wallet,
    destination_ata: destATA.address.toBase58(),
    amount: input.amount,
    signature: sig,
  };
}