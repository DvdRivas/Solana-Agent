export interface GetPriceInput {
  symbol: string;
}

export interface GetPriceResponse {
  symbol: string;
  price: string;
}

export interface Get24hrStatsInput {
  symbol: string;
}

export interface Get24hrStatsResponse {
  symbol: string;
  price: string;
  change: string;
  high: string;
  low: string;
  volume: string;
  quoteVolume: string;
}

export interface GetKlinesInput {
  symbol: string;
  interval: string;
  limit?: number;
}

export interface Candle {
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface GetKlinesResponse {
  symbol: string;
  interval: string;
  candles: Candle[];
}