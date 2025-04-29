import prisma from '../../prisma';
import { IUser } from './account.types';

export async function getDetailBalance(id: number) {
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

export const updateBalance = async (id: number, newBalance: number): Promise<IUser> => {
  return await prisma.user.update({
      where: { id },
      data: { balance: newBalance },
  });
};




