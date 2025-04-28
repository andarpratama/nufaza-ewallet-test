// src/services/user.service.ts
import { Prisma } from '@prisma/client';
import prisma from '../../prisma';

export const createUser = async (data: { name: string; email: string }) => {
  try {
    const user = await prisma.user.create({
      data,
    });
    return user;
  } catch (error) {
    throw new Error('Failed to create user');
  }
};

// Other user-related DB operations can go here (e.g., get, update, delete)
