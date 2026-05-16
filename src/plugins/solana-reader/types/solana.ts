export interface GetSolBalanceInput {
  wallet_address: string;
}

export interface GetSolBalanceResponse {
  wallet_address: string;
  balance_sol: number;
  balance_lamports: number;
}

export interface GetTokenAccountsInput {
  wallet_address: string;
}

export interface TokenAccount {
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number | null;
}

export interface GetTokenAccountsResponse {
  wallet_address: string;
  tokens: TokenAccount[];
}

export interface GetAccountInfoInput {
  wallet_address: string;
}

export interface GetAccountInfoResponse {
  wallet_address: string;
  executable: boolean;
  owner: string;
  lamports: number;
  balance_sol: number;
}