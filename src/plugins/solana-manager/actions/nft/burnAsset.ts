import { z } from "zod";
import { burnAsset } from "../../tools/nft/burnAsset";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const BurnAssetAction: AgentAction = {
  name: "NFT_BURN_ASSET",
  description: "Destruye permanentemente un NFT (Metaplex Core) y recupera el SOL de renta. La colección se detecta automáticamente.",
  similes: ["quemar NFT", "destruir NFT", "burn NFT", "eliminar NFT"],
  examples: [[{
    input: { asset_address: "7xPq..." },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Quema el NFT especificado",
  }]],
  schema: z.object({
    asset_address: z.string().describe("Address del NFT a destruir"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await burnAsset(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default BurnAssetAction;