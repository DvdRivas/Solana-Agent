import { z } from "zod";
import { manageDelegate } from "../../tools/spl/delegate";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const DelegateAction: AgentAction = {
  name: "SPL_MANAGE_DELEGATE",
  description: "Aprueba o revoca un delegado para una token account SPL. El delegado puede mover hasta amount tokens sin ser el owner.",
  similes: ["aprobar delegado", "revocar delegado", "approve delegate", "revoke delegate"],
  examples: [[{
    input: { token_account: "7Xh5...", delegate_address: "8xKp...", amount: 100, action: "approve" },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Aprueba al delegado para mover hasta 100 tokens",
  }]],
  schema: z.object({
    token_account: z.string().describe("ATA sobre la que se gestiona el delegado"),
    delegate_address: z.string().describe("Wallet del delegado"),
    action: z.enum(["approve", "revoke"]).describe("approve para autorizar, revoke para cancelar"),
    amount: z.number().optional().describe("Máximo de tokens que puede mover el delegado (solo para approve)"),
    decimals: z.number().optional().describe("Decimales del token, default 9"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await manageDelegate(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default DelegateAction;