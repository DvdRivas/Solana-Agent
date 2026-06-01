import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";

export async function getTokenInfo(
  agent: SolanaAgentKit,
  input: { mint_address: string }
) {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");
  const pubkey = new PublicKey(input.mint_address);

  const [accountInfo, supply, largestAccounts] = await Promise.all([
    connection.getParsedAccountInfo(pubkey),
    connection.getTokenSupply(pubkey),
    connection.getTokenLargestAccounts(pubkey),
  ]);

  const parsed = (accountInfo.value?.data as any)?.parsed;
  const mintInfo = parsed?.info;

  // Precio desde Jupiter
  let price_usd: number | null = null;
  try {
    const res = await fetch(`https://price.jup.ag/v6/price?ids=${input.mint_address}`);
    const data = await res.json() as any;
    price_usd = data.data?.[input.mint_address]?.price ?? null;
  } catch {}

  const holders = largestAccounts.value.map((h) => ({
    address: h.address.toBase58(),
    amount: h.uiAmount,
  }));

  return {
    mint_address: input.mint_address,
    decimals: mintInfo?.decimals ?? supply.value.decimals,
    supply: supply.value.uiAmount,
    supply_raw: supply.value.amount,
    price_usd,
    market_cap_usd: price_usd && supply.value.uiAmount
      ? parseFloat((price_usd * supply.value.uiAmount).toFixed(2))
      : null,
    mint_authority: mintInfo?.mintAuthority ?? null,
    freeze_authority: mintInfo?.freezeAuthority ?? null,
    is_initialized: mintInfo?.isInitialized ?? true,
    top_holders: holders,
  };
}