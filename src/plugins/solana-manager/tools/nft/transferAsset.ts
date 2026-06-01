import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import {
  fetchAsset,
  transfer,
  transferV1,
} from "@metaplex-foundation/mpl-core";
import { SolanaAgentKit } from "solana-agent-kit";
import { createUmiWithKeypair } from "./umiHelper";
import { TransferAssetInput } from "../../types/manager";

export async function transferAsset(agent: SolanaAgentKit, input: TransferAssetInput) {
  const umi = createUmiWithKeypair(agent);
  const newOwner = umiPublicKey(input.new_owner);
  let tx: any;

  if (input.collection) {
    tx = await transferV1(umi, {
      asset: umiPublicKey(input.asset_address),
      collection: umiPublicKey(input.collection),
      newOwner,
    }).sendAndConfirm(umi);
  } else {
    const asset = await fetchAsset(umi, umiPublicKey(input.asset_address));
    tx = await transfer(umi, { asset, newOwner }).sendAndConfirm(umi);
  }

  return {
    asset_address: input.asset_address,
    new_owner: input.new_owner,
    signature: Buffer.from(tx.signature).toString("base64"),
  };
}