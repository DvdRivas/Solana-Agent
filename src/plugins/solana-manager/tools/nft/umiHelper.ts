import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { keypairIdentity, createSignerFromKeypair } from "@metaplex-foundation/umi";
import { SolanaAgentKit } from "solana-agent-kit";

export function createUmiWithKeypair(agent: SolanaAgentKit) {
  const umi = createUmi(agent.connection.rpcEndpoint).use(mplCore());

  // Obtiene los bytes crudos del keypair — igual que el template
  const secretKey: Uint8Array = (agent.wallet as any).secretKey
    ?? (agent.wallet as any)._keypair?.secretKey
    ?? (agent.wallet as any).payer?.secretKey;

  if (!secretKey) throw new Error("No se pudo obtener el secretKey del wallet");

  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(secretKey));
  umi.use(keypairIdentity(createSignerFromKeypair(umi, umiKeypair)));

  return umi;
}