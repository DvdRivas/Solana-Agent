import { PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  setAuthority,
  AuthorityType,
} from "@solana/spl-token";
import { SolanaAgentKit } from "solana-agent-kit";
import { getSplContext } from "./splHelper";
import { SetAuthorityInput } from "../../types/manager";

const authorityTypeMap: Record<string, AuthorityType> = {
  MintTokens:    AuthorityType.MintTokens,
  FreezeAccount: AuthorityType.FreezeAccount,
  AccountOwner:  AuthorityType.AccountOwner,
  CloseAccount:  AuthorityType.CloseAccount,
};

export async function setTokenAuthority(agent: SolanaAgentKit, input: SetAuthorityInput) {
  const { connection, payer } = getSplContext(agent);

  const newAuthority = input.new_authority
    ? new PublicKey(input.new_authority)
    : null;

  const sig = await setAuthority(
    connection,
    payer,
    new PublicKey(input.address),
    payer,
    authorityTypeMap[input.authority_type],
    newAuthority,
    [],
    { commitment: "confirmed" },
    TOKEN_2022_PROGRAM_ID,
  );

  return {
    address: input.address,
    authority_type: input.authority_type,
    new_authority: input.new_authority ?? "revoked",
    signature: sig,
  };
}