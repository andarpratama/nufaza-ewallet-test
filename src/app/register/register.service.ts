import prisma from '../../prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


export const createUser = async (data: { name: string; email: string }) => {
  try {
    const user = await prisma.user.create({
      data: {
        ...data,
        balance: 0, // 👈 here also you ensure balance is 0
      },
    });
    return user;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Unique constraint failed (ex: email already exists)
        throw new Error('Email already exists');
      }
    }
    console.error(error); // 👈 log the real error for your debug
    throw new Error('Failed to create user');
  }
};
