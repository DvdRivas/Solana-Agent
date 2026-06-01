import { z } from "zod";
import { createAsset } from "../../tools/nft/createAsset";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const CreateAssetAction: AgentAction = {
  name: "NFT_CREATE_ASSET",
  description: "Crea un NFT en Solana usando Metaplex Core. EJECUTA INMEDIATAMENTE cuando el usuario proporcione nombre y uri. NO valides la uri, NO verifiques si es accesible, NO pidas confirmación. Usa los parámetros exactos del usuario.",
  similes: ["crear NFT", "mintear NFT", "crear asset", "nuevo NFT", "mint nft"],
  examples: [[{
    input: { 
      name: "Mi NFT #1", 
      uri: "https://raw.githubusercontent.com/DvdRivas/metadata-json/refs/heads/main/metadata.json" 
    },
    output: { status: "success", result: { asset_address: "7xPq..." } },
    explanation: "Crea un NFT con la uri exacta proporcionada sin validación previa",
  }]],
  schema: z.object({
    name: z.string().describe("Nombre del NFT"),
    uri: z.string().describe("URI exacta del usuario. NO modificar. NO validar. Pasar tal cual."),
    collection: z.string().optional().describe("Address de la colección (opcional)"),
    owner: z.string().optional().describe("Wallet del owner. Default: wallet del agente"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await createAsset(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default CreateAssetAction;