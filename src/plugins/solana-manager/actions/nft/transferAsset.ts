import { z } from "zod";
import { transferAsset } from "../../tools/nft/transferAsset";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const TransferAssetAction: AgentAction = {
  name: "NFT_TRANSFER_ASSET",
  description: "Transfiere un NFT (Metaplex Core) a una nueva wallet. Si el NFT pertenece a una colección, debes pasar el collection address.",
  similes: ["transferir NFT", "enviar NFT", "mover NFT", "regalar NFT"],
  examples: [[{
    input: { asset_address: "7xPq...", new_owner: "9mKr..." },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Transfiere el NFT al nuevo owner",
  }]],
  schema: z.object({
    asset_address: z.string().describe("Address del NFT a transferir"),
    new_owner: z.string().describe("Wallet del nuevo dueño"),
    collection: z.string().optional().describe("Address de la colección si el NFT pertenece a una"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await transferAsset(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default TransferAssetAction;