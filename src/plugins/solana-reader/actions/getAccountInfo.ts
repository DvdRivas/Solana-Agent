import { z } from "zod";
import { getAccountInfo } from "../tools/getAccountInfo";

type AgentAction = {
  name: string;
  description: string;
  similes: string[];
  examples: any[];
  schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetAccountInfoAction: AgentAction = {
  name: "SOLANA_GET_ACCOUNT_INFO",
  description: `Obtiene información detallada de CUALQUIER cuenta de Solana dado su address público.
IMPORTANTE: Siempre extrae el wallet_address del mensaje del usuario. Nunca uses el wallet del agente.`,
  similes: [
    "información de esta cuenta",
    "detalles de esta dirección",
    "info de la wallet",
    "datos de la cuenta",
  ],
  examples: [[{
    input: { wallet_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM" },
    output: { status: "success", result: { balance_sol: 1.5, executable: false } },
    explanation: "Info de la cuenta especificada",
  }]],
  schema: z.object({
    wallet_address: z.string().describe(
      "Dirección pública de la cuenta de Solana. REQUERIDO: extrae del mensaje del usuario."
    ),
  }),
  handler: async (agent: any, input: any) => {
    try {
      const result = await getAccountInfo(agent, input);
      return { status: "success", result };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetAccountInfoAction;