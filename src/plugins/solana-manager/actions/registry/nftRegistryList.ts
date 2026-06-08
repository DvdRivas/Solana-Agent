import { z } from "zod";
import { listNFTRegistry, removeAsset, removeCollection } from "../../tools/registry/nftRegistry";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

export const ListNFTRegistryAction: AgentAction = {
  name: "REGISTRY_LIST_NFTS",
  description: "Lista todos los NFTs y colecciones creados por el agente, guardados en el registro local.",
  similes: ["mis nfts", "nfts creados", "mis colecciones", "que nfts tengo creados", "listar nfts"],
  examples: [[{
    input: {},
    output: { status: "success", result: { assets: [], collections: [] } },
    explanation: "Lista todos los NFTs y colecciones del registro",
  }]],
  schema: z.object({}),
  handler: async (_agent: any, _input: any) => {
    try {
      return { status: "success", result: listNFTRegistry() };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export const RemoveNFTRegistryAction: AgentAction = {
  name: "REGISTRY_REMOVE_NFT",
  description: "Elimina manualmente un NFT del registro local por su asset address.",
  similes: ["eliminar nft del registro", "borrar nft del registro", "remover nft"],
  examples: [[{
    input: { asset_address: "7xPq..." },
    output: { status: "success" },
    explanation: "Elimina el NFT del registro local",
  }]],
  schema: z.object({
    asset_address: z.string().describe("Address del NFT a eliminar del registro"),
  }),
  handler: async (_agent: any, input: any) => {
    try {
      removeAsset(input.asset_address);
      return { status: "success", message: `NFT ${input.asset_address} eliminado del registro` };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export const RemoveCollectionRegistryAction: AgentAction = {
  name: "REGISTRY_REMOVE_COLLECTION",
  description: "Elimina manualmente una colección del registro local por su collection address.",
  similes: ["eliminar coleccion del registro", "borrar coleccion del registro"],
  examples: [[{
    input: { collection_address: "CoRE..." },
    output: { status: "success" },
    explanation: "Elimina la colección del registro local",
  }]],
  schema: z.object({
    collection_address: z.string().describe("Address de la colección a eliminar del registro"),
  }),
  handler: async (_agent: any, input: any) => {
    try {
      removeCollection(input.collection_address);
      return { status: "success", message: `Colección ${input.collection_address} eliminada del registro` };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};