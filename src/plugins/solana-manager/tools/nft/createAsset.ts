import { generateSigner, publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import { create, fetchCollection } from "@metaplex-foundation/mpl-core";
import { SolanaAgentKit } from "solana-agent-kit";
import { createUmiWithKeypair } from "./umiHelper";
import { CreateAssetInput } from "../../types/manager";

export async function createAsset(agent: SolanaAgentKit, input: CreateAssetInput) {
  const umi = createUmiWithKeypair(agent);
  const assetSigner = generateSigner(umi);

  const params: any = {
    asset: assetSigner,
    name: input.name,
    uri: input.uri,
  };

  if (input.collection) {
    const col = await fetchCollection(umi, umiPublicKey(input.collection));
    params.collection = col;
  }

  if (input.owner) {
    params.owner = umiPublicKey(input.owner);
  }

  const tx = await create(umi, params).sendAndConfirm(umi);

  return {
    asset_address: assetSigner.publicKey.toString(),
    signature: Buffer.from(tx.signature).toString("base64"),
  };
}