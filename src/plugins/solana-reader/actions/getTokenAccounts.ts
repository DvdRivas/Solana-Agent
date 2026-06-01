import { z } from "zod";
import { getTokenAccounts } from "../tools/getTokenAccounts";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetTokenAccountsAction: AgentAction = {
  name: "SOLANA_GET_TOKEN_ACCOUNTS",
  description: "Obtiene todos los tokens SPL de una wallet con cantidades y precio en USD desde Jupiter.",
  similes: ["tokens de la wallet", "mis tokens", "portafolio", "que tokens tengo", "SPL tokens"],
  examples: [[{
    input: { wallet_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM" },
    output: { status: "success", result: { token_count: 3, total_value_usd: 150.5 } },
    explanation: "Tokens SPL con precios de la wallet",
  }]],
  schema: z.object({
    wallet_address: z.string().describe("Dirección pública de la wallet de Solana"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await getTokenAccounts(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetTokenAccountsAction;