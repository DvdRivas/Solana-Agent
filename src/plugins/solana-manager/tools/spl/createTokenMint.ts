import {
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  ExtensionType,
  getMintLen,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  pack,
  type TokenMetadata,
} from "@solana/spl-token-metadata";
import { SolanaAgentKit } from "solana-agent-kit";
import { getSplContext } from "./splHelper";
import { CreateTokenMintInput } from "../../types/manager";
import { addToken } from "../registry/splRegistry";

export async function createTokenMint(agent: SolanaAgentKit, input: CreateTokenMintInput) {
  const { connection, payer } = getSplContext(agent);
  const decimals = input.decimals ?? 9;
  const mintKeypair = Keypair.generate();

  const metadata: TokenMetadata = {
    mint: mintKeypair.publicKey,
    name: input.name,
    symbol: input.symbol,
    uri: input.uri,
    additionalMetadata: [],
  };

  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer.publicKey,
      payer.publicKey,
      TOKEN_2022_PROGRAM_ID,
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mintKeypair.publicKey,
      updateAuthority: payer.publicKey,
      mint: mintKeypair.publicKey,
      mintAuthority: payer.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
    }),
  );

  const signature = await sendAndConfirmTransaction(
    connection, tx, [payer, mintKeypair], { commitment: "confirmed" }
  );

  const payerATA = await getOrCreateAssociatedTokenAccount(
    connection, payer, mintKeypair.publicKey, payer.publicKey,
    false, "confirmed", { commitment: "confirmed" }, TOKEN_2022_PROGRAM_ID,
  );

  const result = {
    mint_address: mintKeypair.publicKey.toBase58(),
    payer_ata: payerATA.address.toBase58(),
    name: input.name,
    symbol: input.symbol,
    decimals,
    signature,
  };

  // Guardar en registry
  addToken({
    mint_address: result.mint_address,
    payer_ata: result.payer_ata,
    name: input.name,
    symbol: input.symbol,
    decimals,
  });

  return result;
}