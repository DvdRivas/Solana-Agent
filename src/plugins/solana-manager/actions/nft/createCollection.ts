import { z } from "zod";
import { createCollection } from "../../tools/nft/createCollection";

type AgentAction = {
  name: string; description: string; similes: string[];
  examples: any[]; schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const CreateCollectionAction: AgentAction = {
  name: "NFT_CREATE_COLLECTION",
  description: "Crea una colección NFT en Metaplex Core. Los NFTs agregados a esta colección heredan sus plugins (royalties, etc).",
  similes: ["crear coleccion", "nueva coleccion NFT", "crear colección de NFTs"],
  examples: [[{
    input: { name: "Mi Colección", uri: "https://arweave.net/col.json" },
    output: { status: "success", result: { collection_address: "CoRE..." } },
    explanation: "Crea una nueva colección NFT",
  }]],
  schema: z.object({
    name: z.string().describe("Nombre de la colección"),
    uri: z.string().describe("URL del JSON de metadata de la colección"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      return { status: "success", result: await createCollection(agent, input) };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default CreateCollectionAction;