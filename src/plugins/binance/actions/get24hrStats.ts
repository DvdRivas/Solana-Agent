import { z } from "zod";
import { getBinance24hrStats } from "../tools/get24hrStats";

type AgentAction = {
  name: string;
  description: string;
  similes: string[];
  examples: any[];
  schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const Get24hrStatsAction: AgentAction = {
  name: "BINANCE_24HR_STATS",
  description: "Obtiene estadísticas de 24 horas de un par en Binance: precio, cambio porcentual, máximo, mínimo y volumen.",
  similes: [
    "estadisticas de SOL",
    "volumen de BTC",
    "cambio en 24 horas de ETH",
    "como estuvo SOL hoy",
  ],
  examples: [[{
    input: { symbol: "SOLUSDT" },
    output: { status: "success", result: { price: "185.43", change: "3.2%" } },
    explanation: "Estadísticas 24h de SOL/USDT",
  }]],
  schema: z.object({
    symbol: z.string().describe("Par de trading, ej: SOLUSDT"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      const result = await getBinance24hrStats(agent, input);
      return { status: "success", result };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default Get24hrStatsAction;