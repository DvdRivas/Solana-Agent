import { z } from "zod";
import { getAccountOverview } from "../tools/getAccountOverview";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetAccountOverviewAction: AgentAction = {
  name: "SOLANA_GET_ACCOUNT_OVERVIEW",
  description: "Resumen completo de cualquier cuenta: balance SOL, tokens SPL con precios, transacciones recientes. Equivalente a Solscan.",
  similes: ["resumen de cuenta", "overview de wallet", "todo sobre esta cuenta", "ver cuenta completa"],
  examples: [[{
    input: { wallet_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM" },
    output: { status: "success", result: { balance_sol: 1.5, token_count: 3 } },
    explanation: "Overview completo de la cuenta",
  }]],
  schema: z.object({
    wallet_address: z.string().describe("Dirección pública de la wallet de Solana"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await getAccountOverview(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetAccountOverviewAction;