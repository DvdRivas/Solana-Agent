export interface GetSolBalanceInput {
  wallet_address: string;
}

export interface GetTokenAccountsInput {
  wallet_address: string;
}

export interface GetNFTsInput {
  wallet_address: string;
}

export interface GetAccountOverviewInput {
  wallet_address: string;
}

export interface GetTransactionInput {
  signature: string;
}

export interface GetTransactionHistoryInput {
  wallet_address: string;
  limit?: number;
}

export interface GetTokenInfoInput {
  mint_address: string;
}

export interface TokenAccount {
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number | null;
  price_usd: number | null;
  value_usd: number | null;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  mint: string;
  name: string;
  symbol: string;
  description: string | null;
  image: string | null;
  attributes: NFTAttribute[];
  collection: string | null;
  uri: string;
}