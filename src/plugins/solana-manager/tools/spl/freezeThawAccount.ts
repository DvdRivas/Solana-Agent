import { PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  freezeAccount,
  thawAccount,
} from "@solana/spl-token";
import { SolanaAgentKit } from "solana-agent-kit";
import { getSplContext } from "./splHelper";
import { FreezeThawInput } from "../../types/manager";

export async function freezeThawAccount(agent: SolanaAgentKit, input: FreezeThawInput) {
  const { connection, payer } = getSplContext(agent);
  const tokenAccount = new PublicKey(input.token_account);
  const mint = new PublicKey(input.mint_address);

  const sig = input.action === "freeze"
    ? await freezeAccount(
        connection, payer, tokenAccount, mint, payer, [],
        { commitment: "confirmed" }, TOKEN_2022_PROGRAM_ID,
      )
    : await thawAccount(
        connection, payer, tokenAccount, mint, payer, [],
        { commitment: "confirmed" }, TOKEN_2022_PROGRAM_ID,
      );

  return {
    token_account: input.token_account,
    action: input.action,
    signature: sig,
  };
}