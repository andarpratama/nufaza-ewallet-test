export interface IUser {
    id: number;
    name: string;
    email: string;
    balance: number
    createdAt?: string
}

export type TransferResponse = {
    fromBalance: number;
    toBalance: number;
  };

  export type BalanceResponse = {
    balance: number;
  };
  export type DepositResponse = {
    balance: number;
  };
  export type WithdrawResponse = {
    balance: number;
  };