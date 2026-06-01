export interface CreateAssetInput {
  name: string;
  uri: string;
  collection?: string;
  owner?: string;
}

export interface CreateCollectionInput {
  name: string;
  uri: string;
}

export interface TransferAssetInput {
  asset_address: string;
  new_owner: string;
  collection?: string;
}

export interface BurnAssetInput {
  asset_address: string;
}

export interface UpdateAssetInput {
  asset_address: string;
  name?: string;
  uri?: string;
}

export interface AddRoyaltiesInput {
  asset_address: string;
  basis_points: number;
  creator?: string;
}

export interface AddAttributesInput {
  asset_address: string;
  attributes: { key: string; value: string }[];
}

export interface CreateTokenMintInput {
  name: string;
  symbol: string;
  uri: string;
  decimals?: number;
}

export interface MintTokensInput {
  mint_address: string;
  destination_ata: string;
  amount: number;
  decimals?: number;
}

export interface TransferTokensInput {
  mint_address: string;
  destination_wallet: string;
  amount: number;
  decimals?: number;
}

export interface BurnTokensInput {
  token_account: string;
  mint_address: string;
  amount: number;
  decimals?: number;
}

export interface FreezeThawInput {
  token_account: string;
  mint_address: string;
  action: "freeze" | "thaw";
}

export interface SetAuthorityInput {
  address: string;
  authority_type: "MintTokens" | "FreezeAccount" | "AccountOwner" | "CloseAccount";
  new_authority: string | null;
}

export interface DelegateInput {
  token_account: string;
  delegate_address: string;
  amount?: number;
  action: "approve" | "revoke";
  decimals?: number;
}

export interface CloseTokenAccountInput {
  token_account: string;
  sol_destination?: string;
}