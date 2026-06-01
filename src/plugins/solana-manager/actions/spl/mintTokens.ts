import { z } from "zod";
import { mintTokens } from "../../tools/spl/mintTokens";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const MintTokensAction: AgentAction = {
  name: "SPL_MINT_TOKENS",
  description: "Acuña nuevos tokens SPL a una ATA destino. El agente debe ser el mint authority.",
  similes: ["mintear tokens", "acuñar tokens", "crear tokens", "emitir tokens"],
  examples: [[{
    input: { mint_address: "52RB...", destination_ata: "7Xh5...", amount: 1000 },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Acuña 1000 tokens a la ATA especificada",
  }]],
  schema: z.object({
    mint_address: z.string().describe("Address del mint del token"),
    destination_ata: z.string().describe("ATA destino donde se acuñan los tokens"),
    amount: z.number().describe("Cantidad de tokens a acuñar"),
    decimals: z.number().optional().describe("Decimales del token, default 9"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await mintTokens(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default MintTokensAction;