import { z } from "zod";
import { burnTokens } from "../../tools/spl/burnTokens";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const BurnTokensAction: AgentAction = {
  name: "SPL_BURN_TOKENS",
  description: "Destruye tokens SPL de una ATA, reduciendo el supply total del mint.",
  similes: ["quemar tokens", "destruir tokens SPL", "burn tokens", "eliminar tokens"],
  examples: [[{
    input: { token_account: "7Xh5...", mint_address: "52RB...", amount: 50 },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Quema 50 tokens de la ATA",
  }]],
  schema: z.object({
    token_account: z.string().describe("ATA de donde se queman los tokens"),
    mint_address: z.string().describe("Address del mint del token"),
    amount: z.number().describe("Cantidad de tokens a quemar"),
    decimals: z.number().optional().describe("Decimales del token, default 9"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await burnTokens(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default BurnTokensAction;