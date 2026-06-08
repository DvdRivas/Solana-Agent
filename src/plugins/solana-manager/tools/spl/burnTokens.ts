import { PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  burn,
  getMint,
} from "@solana/spl-token";
import { SolanaAgentKit } from "solana-agent-kit";
import { getSplContext, toBase } from "./splHelper";
import { BurnTokensInput } from "../../types/manager";
import { removeToken } from "../registry/splRegistry";

export async function burnTokens(agent: SolanaAgentKit, input: BurnTokensInput) {
  const { connection, payer } = getSplContext(agent);
  const decimals = input.decimals ?? 9;
  const mint = new PublicKey(input.mint_address);

  const sig = await burn(
    connection,
    payer,
    new PublicKey(input.token_account),
    mint,
    payer,
    toBase(input.amount, decimals),
    [],
    { commitment: "confirmed" },
    TOKEN_2022_PROGRAM_ID,
  );

  // Verificar supply restante — si es 0 eliminar del registry
  const mintInfo = await getMint(connection, mint, "confirmed", TOKEN_2022_PROGRAM_ID);
  if (mintInfo.supply === 0n) {
    removeToken(input.mint_address);
  }

  return {
    token_account: input.token_account,
    amount_burned: input.amount,
    supply_remaining: Number(mintInfo.supply) / 10 ** decimals,
    removed_from_registry: mintInfo.supply === 0n,
    signature: sig,
  };
}