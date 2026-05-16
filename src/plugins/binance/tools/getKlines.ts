import { SolanaAgentKit } from "solana-agent-kit";
import { GetKlinesInput, GetKlinesResponse } from "../types/binance";

export async function getBinanceKlines(
  _agent: SolanaAgentKit,
  input: GetKlinesInput
): Promise<GetKlinesResponse> {
  const limit = input.limit || 5;
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${input.symbol.toUpperCase()}&interval=${input.interval}&limit=${limit}`
  );
  if (!res.ok) throw new Error(`Binance error: ${res.statusText}`);
  const raw = await res.json() as any[];
  return {
    symbol: input.symbol,
    interval: input.interval,
    candles: raw.map((c) => ({
      open: c[1], high: c[2], low: c[3], close: c[4], volume: c[5],
    })),
  };
}