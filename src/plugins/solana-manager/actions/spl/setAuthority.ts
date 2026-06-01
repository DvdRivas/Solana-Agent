import { z } from "zod";
import { setTokenAuthority } from "../../tools/spl/setAuthority";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const SetAuthorityAction: AgentAction = {
  name: "SPL_SET_AUTHORITY",
  description: "Cambia o revoca una autoridad del mint o token account. Pasar null como new_authority revoca permanentemente.",
  similes: ["cambiar autoridad", "revocar mint authority", "set authority token", "cambiar freeze authority"],
  examples: [[{
    input: { address: "52RB...", authority_type: "MintTokens", new_authority: null },
    output: { status: "success", result: { signature: "..." } },
    explanation: "Revoca el mint authority permanentemente",
  }]],
  schema: z.object({
    address: z.string().describe("Address del mint o token account"),
    authority_type: z.enum(["MintTokens", "FreezeAccount", "AccountOwner", "CloseAccount"])
      .describe("Tipo de autoridad a cambiar"),
    new_authority: z.string().nullable().describe("Nueva autoridad. null para revocar permanentemente"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await setTokenAuthority(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default SetAuthorityAction;