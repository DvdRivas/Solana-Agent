import { z } from "zod";
import { getSolBalance } from "../tools/getSolBalance";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetSolBalanceAction: AgentAction = {
  name: "SOLANA_GET_SOL_BALANCE",
  description: "Obtiene el balance de SOL de cualquier wallet. Cuando el usuario diga 'mi wallet' usa el wallet_address del sistema.",
  similes: ["saldo de SOL", "balance de wallet", "cuanto SOL tiene", "mi saldo"],
  examples: [[{
    input: { wallet_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM" },
    output: { status: "success", result: { balance_sol: 1.5 } },
    explanation: "Balance SOL de la wallet",
  }]],
  schema: z.object({
    wallet_address: z.string().describe("Dirección pública de la wallet de Solana"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await getSolBalance(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetSolBalanceAction;