import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
import { Metaplex } from "@metaplex-foundation/js";
import { NFTMetadata } from "../types/solana";

export async function getNFTs(
  agent: SolanaAgentKit,
  input: { wallet_address: string }
) {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");
  const pubkey = new PublicKey(input.wallet_address);
  const metaplex = Metaplex.make(connection);

  const nfts = await metaplex.nfts().findAllByOwner({ owner: pubkey });

  const results: NFTMetadata[] = [];

  for (const nft of nfts) {
    try {
      const loaded = await metaplex.nfts().load({ metadata: nft as any });
      const json = loaded.json as any;

      results.push({
        mint: loaded.mint.address.toBase58(),
        name: loaded.name,
        symbol: loaded.symbol,
        description: json?.description ?? null,
        image: json?.image ?? null,
        attributes: json?.attributes ?? [],
        collection: loaded.collection?.address.toBase58() ?? null,
        uri: loaded.uri,
      });
    } catch {
      // Si falla la carga del metadata, incluye info básica
      results.push({
        mint: (nft as any).mintAddress?.toBase58() ?? "unknown",
        name: nft.name,
        symbol: nft.symbol,
        description: null,
        image: null,
        attributes: [],
        collection: null,
        uri: nft.uri,
      });
    }
  }

  return {
    wallet_address: input.wallet_address,
    nft_count: results.length,
    nfts: results,
  };
}