import { z } from "zod";
import { getTransactionHistory } from "../tools/getTransactionHistory";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetTransactionHistoryAction: AgentAction = {
  name: "SOLANA_GET_TRANSACTION_HISTORY",
  description: "Historial de transacciones de cualquier wallet con estado y timestamp.",
  similes: ["historial de transacciones", "ultimas transacciones", "movimientos de cuenta", "actividad de wallet"],
  examples: [[{
    input: { wallet_address: "9WzDX...WM", limit: 10 },
    output: { status: "success", result: { total: 10, transactions: [] } },
    explanation: "Historial de transacciones",
  }]],
  schema: z.object({
    wallet_address: z.string().describe("Dirección pública de la wallet"),
    limit: z.number().optional().describe("Cantidad de transacciones, default 10"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await getTransactionHistory(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetTransactionHistoryAction;