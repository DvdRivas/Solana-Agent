import { z } from "zod";
import { getBinanceKlines } from "../tools/getKlines";

type AgentAction = {
  name: string;
  description: string;
  similes: string[];
  examples: any[];
  schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetKlinesAction: AgentAction = {
  name: "BINANCE_GET_KLINES",
  description: "Obtiene velas (candlesticks) históricas de un par en Binance. Útil para análisis técnico.",
  similes: [
    "velas de SOL",
    "historial de precios de BTC",
    "candlesticks de ETH",
    "grafica de 1 hora de SOL",
  ],
  examples: [[{
    input: { symbol: "SOLUSDT", interval: "1h", limit: 5 },
    output: { status: "success", result: { candles: [] } },
    explanation: "Últimas 5 velas de 1h de SOL",
  }]],
  schema: z.object({
    symbol: z.string().describe("Par de trading, ej: SOLUSDT"),
    interval: z.enum(["1m", "5m", "15m", "1h", "4h", "1d"]).describe("Intervalo de tiempo"),
    limit: z.number().optional().describe("Cantidad de velas, default 5"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      const result = await getBinanceKlines(agent, input);
      return { status: "success", result };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetKlinesAction;