import { z } from "zod";
import { getNFTs } from "../tools/getNFTs";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetNFTsAction: AgentAction = {
  name: "SOLANA_GET_NFTS",
  description: "Obtiene todos los NFTs de una wallet con metadata completa: nombre, imagen, atributos y colección.",
  similes: ["mis NFTs", "NFTs de la wallet", "que NFTs tengo", "colección de NFTs"],
  examples: [[{
    input: { wallet_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM" },
    output: { status: "success", result: { nft_count: 2, nfts: [] } },
    explanation: "NFTs con metadata completa de la wallet",
  }]],
  schema: z.object({
    wallet_address: z.string().describe("Dirección pública de la wallet de Solana"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await getNFTs(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetNFTsAction;