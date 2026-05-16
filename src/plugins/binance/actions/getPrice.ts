import { z } from "zod";
import { getBinancePrice } from "../tools/getPrice";

type AgentAction = {
  name: string;
  description: string;
  similes: string[];
  examples: any[];
  schema: any;
  handler: (agent: any, input: any) => Promise<any>;
};

const GetPriceAction: AgentAction = {
  name: "BINANCE_GET_PRICE",
  description: "Obtiene el precio actual en tiempo real de un par de trading en Binance. Úsalo cuando el usuario pregunte el precio de cualquier criptomoneda.",
  similes: [
    "cuanto vale SOL",
    "precio de bitcoin",
    "precio actual de ETH",
    "dame el precio de BTC",
    "how much is SOL worth",
  ],
  examples: [[{
    input: { symbol: "SOLUSDT" },
    output: { status: "success", result: { symbol: "SOLUSDT", price: "185.43" } },
    explanation: "Precio actual de SOL en USDT desde Binance",
  }]],
  schema: z.object({
    symbol: z.string().describe("Par de trading en Binance, ej: SOLUSDT, BTCUSDT, ETHUSDT"),
  }),
  handler: async (agent: any, input: any) => {
    try {
      const result = await getBinancePrice(agent, input);
      return { status: "success", result };
    } catch (e) {
      return { status: "error", message: (e as Error).message };
    }
  },
};

export default GetPriceAction;