import { SolanaAgentKit } from "solana-agent-kit";
import { getSolBalance } from "./tools/getSolBalance";
import { getTokenAccounts } from "./tools/getTokenAccounts";
import { getAccountInfo } from "./tools/getAccountInfo";
import GetSolBalanceAction from "./actions/getSolBalance";
import GetTokenAccountsAction from "./actions/getTokenAccounts";
import GetAccountInfoAction from "./actions/getAccountInfo";

const SolanaReaderPlugin = {
  name: "solana-reader",

  methods: {
    getSolBalance,
    getTokenAccounts,
    getAccountInfo,
  },

  actions: [
    GetSolBalanceAction,
    GetTokenAccountsAction,
    GetAccountInfoAction,
  ],

  initialize(agent: SolanaAgentKit) {
    Object.entries(this.methods).forEach(([name, fn]) => {
      if (typeof fn === "function") {
        (this.methods as any)[name] = fn.bind(null, agent);
      }
    });
  },
};

export default SolanaReaderPlugin;