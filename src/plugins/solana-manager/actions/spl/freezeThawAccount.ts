import { z } from "zod";
import { freezeThawAccount } from "../../tools/spl/freezeThawAccount";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const FreezeThawAction: AgentAction = {
  name: "SPL_FREEZE_THAW_ACCOUNT",
  description: "Congela o descongela una token account SPL. Una cuenta congelada no puede recibir, transferir ni quemar tokens.",
  similes: ["congelar token account", "descongelar token account", "freeze account", "thaw account"],
  examples: [[{
    input: { token_account: "7Xh5...", mint_address: "52RB...", action: "freeze" },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Congela la token account",
  }]],
  schema: z.object({
    token_account: z.string().describe("ATA a congelar o descongelar"),
    mint_address: z.string().describe("Address del mint"),
    action: z.enum(["freeze", "thaw"]).describe("freeze para congelar, thaw para descongelar"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await freezeThawAccount(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default FreezeThawAction;