import "solana-agent-kit";

declare module "solana-agent-kit" {
  interface Config {
    BINANCE_API_KEY?: string;
    BINANCE_SECRET?: string;
  }
}