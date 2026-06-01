import { z } from "zod";
import { createTokenMint } from "../../tools/spl/createTokenMint";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const CreateTokenMintAction: AgentAction = {
  name: "SPL_CREATE_TOKEN_MINT",
  description: "Crea un nuevo token SPL usando Token-2022 con metadata embebida (nombre, símbolo, URI). El agente es mint authority y freeze authority.",
  similes: ["crear token", "nuevo token SPL", "crear mint", "lanzar token"],
  examples: [[{
    input: { name: "Mi Token", symbol: "MTK", uri: "https://arweave.net/token.json" },
    output: { status: "success", result: { mint_address: "52RB..." } },
    explanation: "Crea un nuevo token SPL con metadata",
  }]],
  schema: z.object({
    name: z.string().describe("Nombre del token"),
    symbol: z.string().describe("Símbolo del token, ej: MTK, SOL, USDC"),
    uri: z.string().describe("URL del JSON de metadata o imagen del token"),
    decimals: z.number().optional().describe("Decimales del token, default 9"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await createTokenMint(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default CreateTokenMintAction;