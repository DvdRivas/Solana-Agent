import { SolanaAgentKit } from "solana-agent-kit";
import { createAsset } from "./tools/nft/createAsset";
import { createCollection } from "./tools/nft/createCollection";
import { transferAsset } from "./tools/nft/transferAsset";
import { burnAsset } from "./tools/nft/burnAsset";
import { updateAsset } from "./tools/nft/updateAsset";
import { addRoyalties, addAttributes } from "./tools/nft/addPlugins";
import { createTokenMint } from "./tools/spl/createTokenMint";
import { mintTokens } from "./tools/spl/mintTokens";
import { transferTokens } from "./tools/spl/transferTokens";
import { burnTokens } from "./tools/spl/burnTokens";
import { freezeThawAccount } from "./tools/spl/freezeThawAccount";
import { setTokenAuthority } from "./tools/spl/setAuthority";
import { manageDelegate } from "./tools/spl/delegate";
import { closeTokenAccount } from "./tools/spl/closeTokenAccount";

import CreateAssetAction from "./actions/nft/createAsset";
import CreateCollectionAction from "./actions/nft/createCollection";
import TransferAssetAction from "./actions/nft/transferAsset";
import BurnAssetAction from "./actions/nft/burnAsset";
import UpdateAssetAction from "./actions/nft/updateAsset";
import { AddRoyaltiesAction, AddAttributesAction } from "./actions/nft/addPlugins";
import CreateTokenMintAction from "./actions/spl/createTokenMint";
import MintTokensAction from "./actions/spl/mintTokens";
import TransferTokensAction from "./actions/spl/transferTokens";
import BurnTokensAction from "./actions/spl/burnTokens";
import FreezeThawAction from "./actions/spl/freezeThawAccount";
import SetAuthorityAction from "./actions/spl/setAuthority";
import DelegateAction from "./actions/spl/delegate";
import CloseTokenAccountAction from "./actions/spl/closeTokenAccount";

const SolanaManagerPlugin = {
  name: "solana-manager",

  methods: {
    createAsset,
    createCollection,
    transferAsset,
    burnAsset,
    updateAsset,
    addRoyalties,
    addAttributes,
    createTokenMint,
    mintTokens,
    transferTokens,
    burnTokens,
    freezeThawAccount,
    setTokenAuthority,
    manageDelegate,
    closeTokenAccount,
  },

  actions: [
    CreateAssetAction,
    CreateCollectionAction,
    TransferAssetAction,
    BurnAssetAction,
    UpdateAssetAction,
    AddRoyaltiesAction,
    AddAttributesAction,
    CreateTokenMintAction,
    MintTokensAction,
    TransferTokensAction,
    BurnTokensAction,
    FreezeThawAction,
    SetAuthorityAction,
    DelegateAction,
    CloseTokenAccountAction,
  ],

  initialize(agent: SolanaAgentKit) {
    Object.entries(this.methods).forEach(([name, fn]) => {
      if (typeof fn === "function") {
        (this.methods as any)[name] = fn.bind(null, agent);
      }
    });
  },
};

export default SolanaManagerPlugin;