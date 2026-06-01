import { PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  approve,
  revoke,
} from "@solana/spl-token";
import { SolanaAgentKit } from "solana-agent-kit";
import { getSplContext, toBase } from "./splHelper";
import { DelegateInput } from "../../types/manager";

export async function manageDelegate(agent: SolanaAgentKit, input: DelegateInput) {
  const { connection, payer } = getSplContext(agent);
  const tokenAccount = new PublicKey(input.token_account);

  let sig: string;

  if (input.action === "approve") {
    const decimals = input.decimals ?? 9;
    const amount = input.amount ?? 0;
    sig = await approve(
      connection,
      payer,
      tokenAccount,
      new PublicKey(input.delegate_address),
      payer,
      toBase(amount, decimals),
      [],
      { commitment: "confirmed" },
      TOKEN_2022_PROGRAM_ID,
    );
  } else {
    sig = await revoke(
      connection,
      payer,
      tokenAccount,
      payer,
      [],
      { commitment: "confirmed" },
      TOKEN_2022_PROGRAM_ID,
    );
  }

  return {
    token_account: input.token_account,
    action: input.action,
    delegate: input.delegate_address,
    signature: sig,
  };
}