import { z } from "zod";
import { closeTokenAccount } from "../../tools/spl/closeTokenAccount";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const CloseTokenAccountAction: AgentAction = {
  name: "SPL_CLOSE_TOKEN_ACCOUNT",
  description: "Cierra una token account SPL y recupera el SOL del rent. Requiere que el balance sea 0.",
  similes: ["cerrar token account", "close token account", "recuperar rent tokens"],
  examples: [[{
    input: { token_account: "7Xh5..." },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Cierra la token account y devuelve el SOL al agente",
  }]],
  schema: z.object({
    token_account: z.string().describe("ATA a cerrar (debe tener balance 0)"),
    sol_destination: z.string().optional().describe("Wallet que recibe el SOL del rent. Default: wallet del agente"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await closeTokenAccount(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default CloseTokenAccountAction;