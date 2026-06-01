import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import { addPlugin, ruleSet } from "@metaplex-foundation/mpl-core";
import { SolanaAgentKit } from "solana-agent-kit";
import { createUmiWithKeypair } from "./umiHelper";
import { AddRoyaltiesInput, AddAttributesInput } from "../../types/manager";

export async function addRoyalties(agent: SolanaAgentKit, input: AddRoyaltiesInput) {
  const umi = createUmiWithKeypair(agent);
  const creator = input.creator ?? agent.wallet.publicKey.toBase58();

  const tx = await addPlugin(umi, {
    asset: umiPublicKey(input.asset_address),
    plugin: {
      type: "Royalties",
      basisPoints: input.basis_points,
      creators: [{ address: umiPublicKey(creator), percentage: 100 }],
      ruleSet: ruleSet("None"),
    },
  }).sendAndConfirm(umi);

  return {
    asset_address: input.asset_address,
    basis_points: input.basis_points,
    creator,
    signature: Buffer.from(tx.signature).toString("base64"),
  };
}

export async function addAttributes(agent: SolanaAgentKit, input: AddAttributesInput) {
  const umi = createUmiWithKeypair(agent);

  const tx = await addPlugin(umi, {
    asset: umiPublicKey(input.asset_address),
    plugin: {
      type: "Attributes",
      attributeList: input.attributes,
    },
  }).sendAndConfirm(umi);

  return {
    asset_address: input.asset_address,
    attributes: input.attributes,
    signature: Buffer.from(tx.signature).toString("base64"),
  };
}