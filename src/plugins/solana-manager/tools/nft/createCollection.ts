import { generateSigner } from "@metaplex-foundation/umi";
import { createCollection as mplCreateCollection } from "@metaplex-foundation/mpl-core";
import { SolanaAgentKit } from "solana-agent-kit";
import { createUmiWithKeypair } from "./umiHelper";
import { CreateCollectionInput } from "../../types/manager";
import { addCollection } from "../registry/nftRegistry";

export async function createCollection(agent: SolanaAgentKit, input: CreateCollectionInput) {
  const umi = createUmiWithKeypair(agent);
  const collectionSigner = generateSigner(umi);

  const tx = await mplCreateCollection(umi, {
    collection: collectionSigner,
    name: input.name,
    uri: input.uri,
  }).sendAndConfirm(umi);

  const result = {
    collection_address: collectionSigner.publicKey.toString(),
    signature: Buffer.from(tx.signature).toString("base64"),
  };

  // Guardar en registry
  addCollection({
    collection_address: result.collection_address,
    name: input.name,
    uri: input.uri,
  });

  return result;
}