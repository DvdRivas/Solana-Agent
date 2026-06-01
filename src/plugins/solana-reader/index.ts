import { SolanaAgentKit } from "solana-agent-kit";
import { getSolBalance } from "./tools/getSolBalance";
import { getTokenAccounts } from "./tools/getTokenAccounts";
import { getNFTs } from "./tools/getNFTs";
import { getAccountOverview } from "./tools/getAccountOverview";
import { getTransaction } from "./tools/getTransaction";
import { getTransactionHistory } from "./tools/getTransactionHistory";
import { getTokenInfo } from "./tools/getTokenInfo";
import GetSolBalanceAction from "./actions/getSolBalance";
import GetTokenAccountsAction from "./actions/getTokenAccounts";
import GetNFTsAction from "./actions/getNFTs";
import GetAccountOverviewAction from "./actions/getAccountOverview";
import GetTransactionAction from "./actions/getTransaction";
import GetTransactionHistoryAction from "./actions/getTransactionHistory";
import GetTokenInfoAction from "./actions/getTokenInfo";

const SolanaReaderPlugin = {
  name: "solana-reader",
  methods: {
    getSolBalance,
    getTokenAccounts,
    getNFTs,
    getAccountOverview,
    getTransaction,
    getTransactionHistory,
    getTokenInfo,
  },
  actions: [
    GetSolBalanceAction,
    GetTokenAccountsAction,
    GetNFTsAction,
    GetAccountOverviewAction,
    GetTransactionAction,
    GetTransactionHistoryAction,
    GetTokenInfoAction,
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