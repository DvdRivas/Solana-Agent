import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import {
  fetchAsset,
  fetchCollection,
  burn,
  collectionAddress,
} from "@metaplex-foundation/mpl-core";
import { SolanaAgentKit } from "solana-agent-kit";
import { createUmiWithKeypair } from "./umiHelper";
import { BurnAssetInput } from "../../types/manager";

export async function burnAsset(agent: SolanaAgentKit, input: BurnAssetInput) {
  const umi = createUmiWithKeypair(agent);
  const asset = await fetchAsset(umi, umiPublicKey(input.asset_address));
  const colId = collectionAddress(asset);

  const params: any = { asset };

  if (colId) {
    const col = await fetchCollection(umi, colId);
    params.collection = col;
  }

  const tx = await burn(umi, params).sendAndConfirm(umi);

  return {
    asset_address: input.asset_address,
    signature: Buffer.from(tx.signature).toString("base64"),
  };
}