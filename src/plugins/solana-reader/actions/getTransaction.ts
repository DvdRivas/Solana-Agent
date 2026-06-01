import { z } from "zod";
import { getTransaction } from "../tools/getTransaction";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetTransactionAction: AgentAction = {
  name: "SOLANA_GET_TRANSACTION",
  description: "Detalles completos de una transacción: estado, fee, cuentas, cambios de balance SOL y tokens, instrucciones y logs.",
  similes: ["detalles de transaccion", "info del tx", "que paso en esta firma", "ver transaccion"],
  examples: [[{
    input: { signature: "5UfgJ...abc" },
    output: { status: "success", result: { status: "success", fee_sol: 0.000005 } },
    explanation: "Detalles completos de la transacción",
  }]],
  schema: z.object({
    signature: z.string().describe("Firma (signature) de la transacción de Solana"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await getTransaction(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetTransactionAction;