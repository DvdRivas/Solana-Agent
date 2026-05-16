import { z } from "zod";
import { getSolBalance } from "../tools/getSolBalance";

type AgentAction = {
  name: string;
  description: string;
  similes: string[];
  examples: any[];
  schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetSolBalanceAction: AgentAction = {
  name: "SOLANA_GET_SOL_BALANCE",
  description: `Obtiene el balance de SOL de CUALQUIER wallet de Solana dado su address público.
IMPORTANTE: Este tool requiere un wallet_address explícito. Siempre extrae la dirección de wallet 
del mensaje del usuario y pásala como wallet_address. Nunca uses el wallet propio del agente.`,
  similes: [
    "saldo de la cuenta",
    "balance de wallet",
    "cuanto SOL tiene esta dirección",
    "balance de la dirección",
    "saldo de esta wallet",
    "cuanto tiene esta cuenta",
  ],
  examples: [[{
    input: { wallet_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM" },
    output: { status: "success", result: { balance_sol: 1.5, balance_lamports: 1500000000 } },
    explanation: "Obtiene el balance SOL de la wallet especificada",
  }]],
  schema: z.object({
    wallet_address: z.string().describe(
      "Dirección pública de la wallet de Solana a consultar. REQUERIDO: extrae este valor del mensaje del usuario."
    ),
  }),
  handler: async (agent: any, input: any) => {
    try {
      const result = await getSolBalance(agent, input);
      return { status: "success", result };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetSolBalanceAction;