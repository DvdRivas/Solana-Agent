import { SolanaAgentKit } from "solana-agent-kit";
import { Get24hrStatsInput, Get24hrStatsResponse } from "../types/binance";

export async function getBinance24hrStats(
  _agent: SolanaAgentKit,
  input: Get24hrStatsInput
): Promise<Get24hrStatsResponse> {
  const res = await fetch(
    `https://api.binance.com/api/v3/ticker/24hr?symbol=${input.symbol.toUpperCase()}`
  );
  if (!res.ok) throw new Error(`Binance error: ${res.statusText}`);
  const d = await res.json() as any;
  return {
    symbol: d.symbol,
    price: d.lastPrice,
    change: d.priceChangePercent,
    high: d.highPrice,
    low: d.lowPrice,
    volume: d.volume,
    quoteVolume: d.quoteVolume,
  };
}