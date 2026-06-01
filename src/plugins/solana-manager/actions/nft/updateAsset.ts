import { z } from "zod";
import { updateAsset } from "../../tools/nft/updateAsset";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const UpdateAssetAction: AgentAction = {
  name: "NFT_UPDATE_ASSET",
  description: "Actualiza el nombre y/o URI de metadata de un NFT. Solo puede hacerlo la update authority.",
  similes: ["actualizar NFT", "cambiar metadata NFT", "update NFT", "modificar NFT"],
  examples: [[{
    input: { asset_address: "7xPq...", name: "Mi NFT v2" },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Actualiza el nombre del NFT",
  }]],
  schema: z.object({
    asset_address: z.string().describe("Address del NFT a actualizar"),
    name: z.string().optional().describe("Nuevo nombre del NFT"),
    uri: z.string().optional().describe("Nueva URI de metadata"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await updateAsset(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default UpdateAssetAction;