import { z } from "zod";
import { listSPLRegistry, removeToken } from "../../tools/registry/splRegistry";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

export const ListSPLRegistryAction: AgentAction = {
  name: "REGISTRY_LIST_SPL",
  description: "Lista todos los tokens SPL creados por el agente, guardados en el registro local.",
  similes: ["mis tokens", "tokens creados", "que tokens he creado", "listar tokens spl", "mis spl"],
  examples: [[{
    input: {},
    output: { status: "success", result: { tokens: [] } },
    explanation: "Lista todos los tokens SPL del registro",
  }]],
  schema: z.object({}),
  handler: async (_agent: any, _input: any) => {
    try {
      return { status: "success", result: listSPLRegistry() };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export const RemoveSPLRegistryAction: AgentAction = {
  name: "REGISTRY_REMOVE_SPL",
  description: "Elimina manualmente un token SPL del registro local por su mint address.",
  similes: ["eliminar token del registro", "borrar token del registro", "remover spl"],
  examples: [[{
    input: { mint_address: "52RB..." },
    output: { status: "success" },
    explanation: "Elimina el token del registro local",
  }]],
  schema: z.object({
    mint_address: z.string().describe("Mint address del token a eliminar del registro"),
  }),
  handler: async (_agent: any, input: any) => {
    try {
      removeToken(input.mint_address);
      return { status: "success", message: `Token ${input.mint_address} eliminado del registro` };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};