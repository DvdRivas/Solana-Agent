import { z } from "zod";
import { transferTokens } from "../../tools/spl/transferTokens";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const TransferTokensAction: AgentAction = {
  name: "SPL_TRANSFER_TOKENS",
  description: "Transfiere tokens SPL a otra wallet. Pasa la wallet destino (no la ATA) — la ATA se crea automáticamente si no existe.",
  similes: ["transferir tokens", "enviar tokens SPL", "mandar tokens"],
  examples: [[{
    input: { mint_address: "52RB...", destination_wallet: "9mKr...", amount: 100 },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Transfiere 100 tokens a la wallet destino",
  }]],
  schema: z.object({
    mint_address: z.string().describe("Address del mint del token"),
    destination_wallet: z.string().describe("Wallet destino (NO la ATA, sino la wallet pública)"),
    amount: z.number().describe("Cantidad de tokens a transferir"),
    decimals: z.number().optional().describe("Decimales del token, default 9"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await transferTokens(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default TransferTokensAction;