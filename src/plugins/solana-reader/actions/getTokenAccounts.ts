import { z } from "zod";
import { getTokenAccounts } from "../tools/getTokenAccounts";

type AgentAction = {
  name: string;
  description: string;
  similes: string[];
  examples: any[];
  schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetTokenAccountsAction: AgentAction = {
  name: "SOLANA_GET_TOKEN_ACCOUNTS",
  description: `Obtiene todos los tokens SPL de CUALQUIER wallet de Solana dado su address público.
IMPORTANTE: Siempre extrae el wallet_address del mensaje del usuario. Nunca uses el wallet del agente.`,
  similes: [
    "tokens de esta wallet",
    "que tokens tiene esta cuenta",
    "SPL tokens de esta dirección",
    "lista de tokens",
    "portafolio de tokens",
  ],
  examples: [[{
    input: { wallet_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM" },
    output: { status: "success", result: { tokens: [] } },
    explanation: "Lista todos los tokens SPL de la wallet especificada",
  }]],
  schema: z.object({
    wallet_address: z.string().describe(
      "Dirección pública de la wallet de Solana. REQUERIDO: extrae del mensaje del usuario."
    ),
  }),
  handler: async (agent: any, input: any) => {
    try {
      const result = await getTokenAccounts(agent, input);
      return { status: "success", result };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetTokenAccountsAction;