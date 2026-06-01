import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
import { TokenAccount } from "../types/solana";

async function getJupiterPrice(mints: string[]): Promise<Record<string, number>> {
  if (mints.length === 0) return {};
  try {
    const ids = mints.join(",");
    const res = await fetch(`https://price.jup.ag/v6/price?ids=${ids}`);
    if (!res.ok) return {};
    const data = await res.json() as any;
    const prices: Record<string, number> = {};
    for (const [mint, info] of Object.entries(data.data ?? {})) {
      prices[mint] = (info as any).price ?? 0;
    }
    return prices;
  } catch {
    return {};
  }
}

export async function getTokenAccounts(
  agent: SolanaAgentKit,
  input: { wallet_address: string }
) {
  const connection = new Connection(agent.connection.rpcEndpoint, "confirmed");
  const pubkey = new PublicKey(input.wallet_address);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  });

  const rawTokens = tokenAccounts.value
    .map((ta) => {
      const info = ta.account.data.parsed.info;
      return {
        mint: info.mint as string,
        amount: info.tokenAmount.amount as string,
        decimals: info.tokenAmount.decimals as number,
        uiAmount: info.tokenAmount.uiAmount as number | null,
      };
    })
    .filter((t) => (t.uiAmount ?? 0) > 0);

  const mints = rawTokens.map((t) => t.mint);
  const prices = await getJupiterPrice(mints);

  const tokens: TokenAccount[] = rawTokens.map((t) => {
    const price = prices[t.mint] ?? null;
    const value = price !== null && t.uiAmount !== null
      ? parseFloat((price * t.uiAmount).toFixed(4))
      : null;
    return { ...t, price_usd: price, value_usd: value };
  });

  const total_value_usd = tokens.reduce((sum, t) => sum + (t.value_usd ?? 0), 0);

  return {
    wallet_address: input.wallet_address,
    token_count: tokens.length,
    total_value_usd: parseFloat(total_value_usd.toFixed(4)),
    tokens,
  };
}