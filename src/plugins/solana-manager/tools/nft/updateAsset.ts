import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import { fetchAsset, update } from "@metaplex-foundation/mpl-core";
import { SolanaAgentKit } from "solana-agent-kit";
import { createUmiWithKeypair } from "./umiHelper";
import { UpdateAssetInput } from "../../types/manager";
import { updateAssetEntry } from "../registry/nftRegistry";

export async function updateAsset(agent: SolanaAgentKit, input: UpdateAssetInput) {
  const umi = createUmiWithKeypair(agent);
  const asset = await fetchAsset(umi, umiPublicKey(input.asset_address));

  const params: any = { asset };
  if (input.name) params.name = input.name;
  if (input.uri)  params.uri  = input.uri;

  const tx = await update(umi, params).sendAndConfirm(umi);

  // Actualizar en registry
  updateAssetEntry(input.asset_address, {
    ...(input.name && { name: input.name }),
    ...(input.uri  && { uri:  input.uri  }),
  });

  return {
    asset_address: input.asset_address,
    updated: { name: input.name, uri: input.uri },
    signature: Buffer.from(tx.signature).toString("base64"),
  };
}