import { SolanaAgentKit } from "solana-agent-kit";
import { getBinancePrice } from "./tools/getPrice";
import { getBinance24hrStats } from "./tools/get24hrStats";
import { getBinanceKlines } from "./tools/getKlines";
import GetPriceAction from "./actions/getPrice";
import Get24hrStatsAction from "./actions/get24hrStats";
import GetKlinesAction from "./actions/getKlines";

const BinancePlugin = {
  name: "binance",

  methods: {
    getBinancePrice,
    getBinance24hrStats,
    getBinanceKlines,
  },

  actions: [
    GetPriceAction,
    Get24hrStatsAction,
    GetKlinesAction,
  ],

  initialize(agent: SolanaAgentKit) {
    Object.entries(this.methods).forEach(([name, fn]) => {
      if (typeof fn === "function") {
        (this.methods as any)[name] = fn.bind(null, agent);
      }
    });
  },
};

export default BinancePlugin;