import { z } from "zod";
import { getTokenInfo } from "../tools/getTokenInfo";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetTokenInfoAction: AgentAction = {
  name: "SOLANA_GET_TOKEN_INFO",
  description: "Info de un token SPL por mint address: supply, decimales, precio USD, market cap y top holders.",
  similes: ["info del token", "detalles del mint", "supply del token", "precio del token por mint"],
  examples: [[{
    input: { mint_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
    output: { status: "success", result: { supply: 1000000, price_usd: 1.0 } },
    explanation: "Info del token USDC",
  }]],
  schema: z.object({
    mint_address: z.string().describe("Dirección del mint del token SPL"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await getTokenInfo(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetTokenInfoAction;