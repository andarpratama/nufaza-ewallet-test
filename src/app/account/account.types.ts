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
    balance: number | null;
  };
  export type DepositResponse = {
    balance: number | null;
  };
  export type WithdrawResponse = {
    balance: number;
  };

  
export interface TransactionRecord {
    id: number;
    type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT';
    amount: number;
    createdAt: Date;
  }