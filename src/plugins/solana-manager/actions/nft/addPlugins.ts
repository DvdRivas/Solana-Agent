import { z } from "zod";
import { addRoyalties, addAttributes } from "../../tools/nft/addPlugins";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

export const AddRoyaltiesAction: AgentAction = {
  name: "NFT_ADD_ROYALTIES",
  description: "Agrega royalties a un NFT. basis_points: 100 = 1%, 500 = 5%, 1000 = 10%.",
  similes: ["agregar royalties", "royalties NFT", "regalias NFT"],
  examples: [[{
    input: { asset_address: "7xPq...", basis_points: 500 },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Agrega 5% de royalties al NFT",
  }]],
  schema: z.object({
    asset_address: z.string().describe("Address del NFT"),
    basis_points: z.number().describe("Royalties en basis points: 100=1%, 500=5%, 1000=10%"),
    creator: z.string().optional().describe("Wallet del creator que recibe royalties. Default: wallet del agente"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await addRoyalties(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export const AddAttributesAction: AgentAction = {
  name: "NFT_ADD_ATTRIBUTES",
  description: "Agrega atributos (traits) on-chain a un NFT.",
  similes: ["agregar atributos NFT", "traits NFT", "agregar traits"],
  examples: [[{
    input: { asset_address: "7xPq...", attributes: [{ key: "Background", value: "Azul" }] },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Agrega traits on-chain al NFT",
  }]],
  schema: z.object({
    asset_address: z.string().describe("Address del NFT"),
    attributes: z.array(z.object({
      key: z.string(),
      value: z.string(),
    })).describe("Lista de atributos a agregar"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await addAttributes(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};