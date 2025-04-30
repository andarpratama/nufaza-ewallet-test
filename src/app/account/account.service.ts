import prisma from '../../prisma';
import { IUser, TransactionRecord } from './account.types';

export async function getDetailUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      balance: true
    }
  });
}

export async function getDetailBalance(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: false,
      name: false,
      email: false,
      balance: true
    }
  });
}

export const updateBalance = async (id: number, newBalance: number): Promise<{ balance: number }> => {
  return await prisma.user.update({
    where: { id },
    data: { balance: newBalance },
    select: { balance: true },
  });
};


export async function createTransaction(data: {
  userId: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  amount: number;
}) {
  return prisma.transaction.create({ data });
}

export async function getTransactions(userId: number): Promise<TransactionRecord[]> {
  // explicitly type the raw rows from Prisma
  const txs: { id: number; type: string; amount: number; createdAt: Date }[] =
    await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, type: true, amount: true, createdAt: true },
    });

  return txs.map(tx => ({
    id: tx.id,
    type: tx.type as 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT',
    amount: tx.amount,
    createdAt: tx.createdAt,
  }));
}



