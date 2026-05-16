import { SolanaAgentKit } from "solana-agent-kit";
import { GetPriceInput, GetPriceResponse } from "../types/binance";

export async function getBinancePrice(
  _agent: SolanaAgentKit,
  input: GetPriceInput
): Promise<GetPriceResponse> {
  const res = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${input.symbol.toUpperCase()}`
  );
  if (!res.ok) throw new Error(`Binance error: ${res.statusText}`);
  return await res.json() as GetPriceResponse;
}